/**
 * Builds and serves two commits sequentially, times a single HTTP GET to a
 * stable API path, prints both durations. No Playwright — verifies the
 * build → start → curl loop for agent workflows later.
 *
 * Env:
 *   COMPARE_REPO_ROOT     — absolute path to git repo (default: ../testing_repos/active-class-name-app from cwd)
 *   COMPARE_COMMIT_BASE   — first ref (default: HEAD~1)
 *   COMPARE_COMMIT_TARGET — second ref (default: HEAD)
 *   COMPARE_PORT          — port for next start (default: 3010)
 *   COMPARE_API_PATH      — path only, e.g. /api/health (default: /api/health)
 *   COMPARE_START_TIMEOUT_MS — wait for server (default: 120000)
 */

import {
  type ChildProcess,
  execSync,
  spawn,
  spawnSync,
} from "node:child_process";
import path from "node:path";

import type { GitHubRunContext } from "./github-run-context";

function resolveRepoRoot(): string {
  const env = process.env.COMPARE_REPO_ROOT?.trim();
  if (env) {
    return path.resolve(env);
  }
  return path.resolve(
    process.cwd(),
    "..",
    "testing_repos",
    "active-class-name-app"
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForUrl(
  url: string,
  timeoutMs: number,
  label: string
): Promise<void> {
  const start = Date.now();
  let lastErr = "";
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        return;
      }
      lastErr = `HTTP ${res.status}`;
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e);
    }
    await sleep(300);
  }
  throw new Error(
    `[${label}] Server did not become ready at ${url} within ${timeoutMs}ms (last: ${lastErr})`
  );
}

async function timeGet(url: string): Promise<number> {
  const t0 = performance.now();
  const res = await fetch(url);
  await res.text();
  return performance.now() - t0;
}

function resolveRefToSha(repoRoot: string, ref: string, label: string): string {
  const r = spawnSync("git", ["rev-parse", ref], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (r.status !== 0 || !r.stdout) {
    throw new Error(`${label}: git rev-parse ${ref} failed`);
  }
  return r.stdout.trim();
}

function runSync(
  cmd: string,
  args: string[],
  cwd: string,
  label: string
): void {
  process.stdout.write(`\n── ${label}: ${cmd} ${args.join(" ")} ──\n`);
  const r = spawnSync(cmd, args, { cwd, stdio: "inherit", env: process.env });
  const code = r.status ?? 1;
  if (code !== 0) {
    throw new Error(`${label} failed with exit code ${code}`);
  }
}

function startNextServer(cwd: string, port: number): ChildProcess {
  return spawn(
    "pnpm",
    ["exec", "next", "start", "-H", "127.0.0.1", "-p", String(port)],
    {
      cwd,
      env: { ...process.env, PORT: String(port) },
      stdio: "ignore",
      detached: true,
    }
  );
}

async function stopServer(
  child: ChildProcess | null,
  port: number
): Promise<void> {
  if (child?.pid) {
    try {
      if (process.platform !== "win32") {
        process.kill(-child.pid, "SIGTERM");
      } else {
        child.kill("SIGTERM");
      }
    } catch {
      // ignore
    }
  }
  await sleep(1500);
  if (process.platform !== "win32") {
    try {
      if (process.platform === "darwin") {
        execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`, {
          stdio: "ignore",
        });
      } else {
        execSync(`fuser -k ${port}/tcp 2>/dev/null || true`, {
          stdio: "ignore",
        });
      }
    } catch {
      // ignore
    }
  }
  await sleep(500);
}

async function measureCommit(options: {
  repoRoot: string;
  ref: string;
  label: string;
  port: number;
  apiPath: string;
  startTimeoutMs: number;
}): Promise<{ ms: number; sha: string }> {
  const { repoRoot, ref, label, port, apiPath, startTimeoutMs } = options;

  process.stdout.write(`\n======== ${label} (${ref}) ========\n`);

  runSync(
    "git",
    ["checkout", "--detach", ref],
    repoRoot,
    `${label}: git checkout`
  );
  const rev = spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (rev.status !== 0 || !rev.stdout) {
    throw new Error(`${label}: git rev-parse failed`);
  }
  const sha = rev.stdout.trim();

  runSync(
    "pnpm",
    ["install", "--frozen-lockfile"],
    repoRoot,
    `${label}: pnpm install`
  );
  runSync("pnpm", ["run", "build"], repoRoot, `${label}: pnpm build`);

  const baseUrl = `http://127.0.0.1:${port}`;
  const url = `${baseUrl}${apiPath.startsWith("/") ? apiPath : `/${apiPath}`}`;

  let server: ChildProcess | null = null;
  try {
    server = startNextServer(repoRoot, port);
    await waitForUrl(url, startTimeoutMs, label);
    const ms = await timeGet(url);
    process.stdout.write(
      `\n[${label}] commit=${sha.slice(0, 7)} GET ${apiPath} total time: ${ms.toFixed(2)} ms\n`
    );
    return { ms, sha };
  } finally {
    await stopServer(server, port);
  }
}

export async function run(context: GitHubRunContext): Promise<void> {
  const repoRoot = resolveRepoRoot();
  process.stdout.write(
    `compare-action — repo=${repoRoot} workflow=${context.workflow} run=${context.runId}\n`
  );

  const baseRef = process.env.COMPARE_COMMIT_BASE?.trim() || "HEAD~1";
  const targetRef = process.env.COMPARE_COMMIT_TARGET?.trim() || "HEAD";
  const port = Number.parseInt(process.env.COMPARE_PORT || "3010", 10);
  const apiPath = process.env.COMPARE_API_PATH?.trim() || "/api/health";
  const startTimeoutMs = Number.parseInt(
    process.env.COMPARE_START_TIMEOUT_MS || "120000",
    10
  );

  /** Resolve before any checkout — after a detached checkout, HEAD no longer means branch tip. */
  const baseSha = resolveRefToSha(repoRoot, baseRef, "BASE ref");
  const targetSha = resolveRefToSha(repoRoot, targetRef, "TARGET ref");

  const first = await measureCommit({
    repoRoot,
    ref: baseSha,
    label: "BASE",
    port,
    apiPath,
    startTimeoutMs,
  });

  const second = await measureCommit({
    repoRoot,
    ref: targetSha,
    label: "TARGET",
    port,
    apiPath,
    startTimeoutMs,
  });

  const delta = second.ms - first.ms;
  process.stdout.write("\n======== SUMMARY ========\n");
  process.stdout.write(
    `BASE (${baseRef}) ${first.sha.slice(0, 7)}: ${first.ms.toFixed(2)} ms\n`
  );
  process.stdout.write(
    `TARGET (${targetRef}) ${second.sha.slice(0, 7)}: ${second.ms.toFixed(2)} ms\n`
  );
  process.stdout.write(
    `Delta (TARGET − BASE): ${delta >= 0 ? "+" : ""}${delta.toFixed(2)} ms\n`
  );
}
