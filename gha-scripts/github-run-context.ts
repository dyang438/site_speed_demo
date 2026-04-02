/**
 * Shared GitHub Actions run metadata for all `gha-scripts` runners.
 * Resolved once in `main.ts` and passed to each `run(context)`.
 */

export type GitHubRunContext = {
  inGitHubActions: boolean;
  runNumber: number;
  runId: string;
  workflow: string;
  branch: string;
  commit: string;
  actor: string;
  /** Null when repository/run id are missing (e.g. local test without GITHUB_REPOSITORY). */
  logUrl: string | null;
};

/**
 * Reads `GITHUB_*` env vars. On the Actions runner, missing run metadata is an error.
 * Locally, uses safe defaults so `pnpm run ci -- --run …` works without exporting vars.
 */
export function resolveGitHubRunContext(): GitHubRunContext {
  const inGitHubActions = process.env.GITHUB_ACTIONS === "true";

  const runNumberRaw = process.env.GITHUB_RUN_NUMBER;
  let runNumber = Number(runNumberRaw);
  if (!Number.isFinite(runNumber)) {
    if (inGitHubActions) {
      process.stderr.write(
        "GITHUB_RUN_NUMBER is missing or not a number on the GitHub Actions runner.\n"
      );
      process.exit(1);
    }
    runNumber = 0;
    process.stdout.write(
      "Using local defaults for run metadata (set GITHUB_RUN_NUMBER / GITHUB_RUN_ID to mimic CI).\n"
    );
  }

  let runId = process.env.GITHUB_RUN_ID ?? "";
  if (!runId && !inGitHubActions) {
    runId = `local-${Date.now()}`;
  }

  const workflow =
    process.env.GITHUB_WORKFLOW ?? (inGitHubActions ? "" : "local");
  const branch = process.env.GITHUB_REF_NAME ?? "";
  const commit = process.env.GITHUB_SHA ?? "";
  const actor = process.env.GITHUB_ACTOR ?? "";
  const serverUrl = process.env.GITHUB_SERVER_URL ?? "https://github.com";
  const repository = process.env.GITHUB_REPOSITORY ?? "";

  const logUrl =
    repository && runId
      ? `${serverUrl}/${repository}/actions/runs/${runId}`
      : null;

  return {
    inGitHubActions,
    runNumber,
    runId,
    workflow,
    branch,
    commit,
    actor,
    logUrl,
  };
}
