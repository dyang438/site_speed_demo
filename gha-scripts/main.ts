/**
 * Single entrypoint for GitHub Actions TypeScript runners.
 *
 * Orchestration: loads env, resolves shared {@link GitHubRunContext} once
 * (`github-run-context.ts`), then dispatches to `run(context)` on the selected runner.
 *
 * Usage:
 *   pnpm run ci -- --run basic-action
 *   tsx gha-scripts/main.ts --run agent-action
 *
 * Local runs load `.env.local` (same as Next.js). In GitHub Actions, set secrets
 * on the workflow step instead.
 */

import { config } from "dotenv";

import {
  resolveGitHubRunContext,
  type GitHubRunContext,
} from "./github-run-context";

config({ path: ".env.local" });

type RunnerName =
  | "basic-action"
  | "build-action"
  | "compare-action"
  | "deploy-preview"
  | "agent-action"
  | "full-agent"
  | "computer-use-agent";

const VALID: readonly RunnerName[] = [
  "basic-action",
  "build-action",
  "compare-action",
  "deploy-preview",
  "agent-action",
  "full-agent",
  "computer-use-agent",
];

function parseRunArg(argv: string[]): RunnerName | null {
  const idx = argv.indexOf("--run");
  if (idx === -1 || idx === argv.length - 1) {
    return null;
  }
  const value = argv[idx + 1];
  if (!VALID.includes(value as RunnerName)) {
    return null;
  }
  return value as RunnerName;
}

function printHelp(): void {
  process.stdout.write(`Usage: tsx gha-scripts/main.ts --run <name>

Names:
  basic-action           POST this workflow run to /api/action-runs
  build-action           pnpm run build, then POST success/failure to /api/action-runs
  compare-action         build two commits, time GET to /api/health (see COMPARE_* env)
  deploy-preview         vercel pull/build/deploy — preview URL for agents (needs Vercel secrets)
  agent-action           (placeholder — not implemented)
  full-agent             (placeholder — not implemented)
  computer-use-agent     (placeholder — not implemented)

Example:
  pnpm run ci -- --run basic-action

Local: add API_ENDPOINT and API_SECRET to .env.local (see .env.example).
`);
}

async function loadRunner(
  name: RunnerName
): Promise<{ run: (context: GitHubRunContext) => Promise<void> }> {
  switch (name) {
    case "basic-action":
      return import("./basic-action");
    case "build-action":
      return import("./build-action");
    case "compare-action":
      return import("./compare-action");
    case "deploy-preview":
      return import("./deploy-preview");
    case "agent-action":
      return import("./agent-action");
    case "full-agent":
      return import("./full-agent-analysis");
    case "computer-use-agent":
      return import("./computer-use-agent-analysis");
  }
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);

  if (argv.includes("--help") || argv.includes("-h")) {
    printHelp();
    process.exit(0);
  }

  const runName = parseRunArg(argv);
  if (!runName) {
    process.stderr.write(
      `Missing or invalid --run. Expected one of: ${VALID.join(", ")}\n\n`
    );
    printHelp();
    process.exit(1);
  }

  const context = resolveGitHubRunContext();
  const mod = await loadRunner(runName);
  await mod.run(context);
}

void main().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`
  );
  process.exit(1);
});
