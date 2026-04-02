/**
 * Records this GitHub Actions run against the app's `/api/action-runs` API.
 *
 * Required secrets: `API_ENDPOINT`, `API_SECRET`
 * Run metadata comes from `GitHubRunContext` (resolved in `main.ts`).
 */

import type { GitHubRunContext } from "./github-run-context";
import { postActionRunPayload } from "./post-action-run-api";

function randomIntInclusive(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export async function run(context: GitHubRunContext): Promise<void> {
  const randomNumber = randomIntInclusive(1, 100);

  const payload = {
    runNumber: context.runNumber,
    runId: context.runId,
    randomNumber,
    workflow: context.workflow,
    status: "success" as const,
    branch: context.branch || null,
    commit: context.commit || null,
    actor: context.actor || null,
    logUrl: context.logUrl,
  };

  process.stdout.write(`Generated random number: ${randomNumber}\n`);
  await postActionRunPayload(payload);
}
