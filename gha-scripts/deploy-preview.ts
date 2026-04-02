/**
 * Builds with Vercel CLI (`vercel build`) and deploys a **preview** URL
 * (`vercel deploy --prebuilt`) for agent/browser testing against a real URL.
 *
 * Required secrets:
 *   VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
 *
 * Optional:
 *   POSTGRES_URL — for `pnpm run build` during `vercel build`
 *
 * Writes to GITHUB_OUTPUT when set: `deployment_url`
 */

import { spawnSync } from "node:child_process";
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";

import type { GitHubRunContext } from "./github-run-context";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v?.trim()) {
    process.stderr.write(
      `${name} is required. Vercel: Project Settings → General (Project ID, Org ID); Tokens → create.\n`
    );
    process.exit(1);
  }
  return v;
}

function setGitHubOutput(key: string, value: string): void {
  const path = process.env.GITHUB_OUTPUT;
  if (!path) {
    return;
  }
  const safe = value.replace(/\r?\n/g, "");
  appendFileSync(path, `${key}=${safe}\n`, "utf8");
}

const npx = process.platform === "win32" ? "npx.cmd" : "npx";

function vercelArgs(
  token: string,
  subcommand: string,
  rest: string[]
): string[] {
  return ["-y", "vercel@latest", subcommand, ...rest, "--token", token];
}

function execVercel(
  label: string,
  subcommand: string,
  token: string,
  rest: string[],
  inherit: boolean
): void {
  process.stdout.write(`\n── ${label} ──\n`);
  const args = vercelArgs(token, subcommand, rest);
  const result = spawnSync(npx, args, {
    cwd: process.cwd(),
    env: process.env,
    encoding: "utf8",
    stdio: inherit ? "inherit" : "pipe",
  });
  const code = result.status ?? 1;
  if (!inherit && result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (!inherit && result.stderr) {
    process.stderr.write(result.stderr);
  }
  if (code !== 0) {
    process.stderr.write(`\n${label} failed with exit code ${code}\n`);
    process.exit(code);
  }
}

function extractDeploymentUrl(stdout: string): string | null {
  const lines = stdout.split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/https:\/\/[^\s]+\.vercel\.app[^\s]*/i);
    if (m) {
      return m[0].replace(/[\].,;)}>]+$/, "");
    }
  }
  const any = stdout.match(/https:\/\/[^\s]+\.vercel\.app[^\s]*/i);
  return any ? any[0].replace(/[\].,;)}>]+$/, "") : null;
}

export function run(context: GitHubRunContext): Promise<void> {
  const token = requireEnv("VERCEL_TOKEN");
  const orgId = requireEnv("VERCEL_ORG_ID");
  const projectId = requireEnv("VERCEL_PROJECT_ID");

  process.stdout.write(
    `Deploy preview — workflow=${context.workflow} commit=${context.commit || "n/a"} run=${context.runId}\n`
  );

  mkdirSync(".vercel", { recursive: true });
  writeFileSync(
    ".vercel/project.json",
    `${JSON.stringify({ orgId, projectId })}\n`,
    "utf8"
  );

  execVercel(
    "vercel pull (preview environment)",
    "pull",
    token,
    ["--yes", "--environment=preview"],
    true
  );

  execVercel("vercel build", "build", token, [], true);

  process.stdout.write("\n── vercel deploy --prebuilt ──\n");
  const deploy = spawnSync(
    npx,
    vercelArgs(token, "deploy", ["--prebuilt", "--yes"]),
    {
      cwd: process.cwd(),
      env: process.env,
      encoding: "utf8",
    }
  );

  const out = `${deploy.stdout ?? ""}${deploy.stderr ?? ""}`;
  process.stdout.write(out);
  const code = deploy.status ?? 1;
  if (code !== 0) {
    process.stderr.write(`\nvercel deploy failed with exit code ${code}\n`);
    process.exit(code);
  }

  const url = extractDeploymentUrl(out);
  if (!url) {
    process.stderr.write(
      "Could not parse preview URL from vercel deploy output. Check CLI output above.\n"
    );
    process.exit(1);
  }

  process.stdout.write(`\nPreview URL: ${url}\n`);
  setGitHubOutput("deployment_url", url);
  return Promise.resolve();
}
