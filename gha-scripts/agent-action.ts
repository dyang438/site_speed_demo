/**
 * Agent-oriented GitHub Actions step (placeholder).
 */

import type { GitHubRunContext } from "./github-run-context";

export async function run(_context: GitHubRunContext): Promise<void> {
  throw new Error(
    "agent-action: implement this runner or remove the ci --run agent-action entry."
  );
}
