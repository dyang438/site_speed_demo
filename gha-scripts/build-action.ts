/**
 * Runs `pnpm run build`, then records success or failure on `/api/action-runs`.
 *
 * On fork PRs, GitHub does not expose repository secrets; set `SKIP_ACTION_RUN_POST=true`
 * in the workflow so the build still runs against the PR code without posting.
 */

import { spawn } from "node:child_process";

import type { GitHubRunContext } from "./github-run-context";
import { postActionRunPayload } from "./post-action-run-api";

function randomIntInclusive(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function shouldSkipActionRunPost(): boolean {
  const v = process.env.SKIP_ACTION_RUN_POST;
  if (!v) {
    return false;
  }
  return (
    v === "1" || v.toLowerCase() === "true" || v.toLowerCase() === "yes"
  );
}

function runPnpmBuild(): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn("pnpm", ["run", "build"], {
      cwd: process.cwd(),
      env: process.env,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("close", (code, signal) => {
      if (signal) {
        resolve(1);
        return;
      }
      resolve(code ?? 1);
    });
  });
}

export async function run(context: GitHubRunContext): Promise<void> {
  process.stdout.write("Running pnpm run build…\n");

  const exitCode = await runPnpmBuild();

  const buildOk = exitCode === 0;
  const status = buildOk ? ("success" as const) : ("failure" as const);
  const randomNumber = randomIntInclusive(1, 100);

  process.stdout.write(
    `Build finished with exit code ${exitCode} (${status}).\n`
  );
  process.stdout.write(`Generated random number: ${randomNumber}\n`);

  if (shouldSkipActionRunPost()) {
    process.stdout.write(
      "SKIP_ACTION_RUN_POST is set — not posting to /api/action-runs (e.g. fork PR without secrets).\n"
    );
    if (!buildOk) {
      process.exit(1);
    }
    return;
  }

  await postActionRunPayload({
    runNumber: context.runNumber,
    runId: context.runId,
    randomNumber,
    workflow: "build-action",
    status,
    branch: context.branch || null,
    commit: context.commit || null,
    actor: context.actor || null,
    logUrl: context.logUrl,
  });

  if (!buildOk) {
    process.exit(1);
  }
}
