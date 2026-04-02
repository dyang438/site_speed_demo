/**
 * Computer-use agent analysis step (placeholder).
 */

import type { GitHubRunContext } from "./github-run-context";

export async function run(_context: GitHubRunContext): Promise<void> {
  throw new Error(
    "computer-use-agent: implement this runner or remove the ci --run computer-use-agent entry."
  );
}
