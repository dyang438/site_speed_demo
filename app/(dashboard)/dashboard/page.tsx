import { ActionRunsTable } from "@/components/dashboard/action-runs-table";
import { ActionStats } from "@/components/dashboard/action-stats";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RandomNumberChart } from "@/components/dashboard/random-number-chart";
import { TestRunTable } from "@/components/dashboard/test-run-table";
import { getRecentActionRuns } from "@/lib/db/queries";
import { mockLatestScores, mockTestRuns } from "@/lib/mock-data";
import { Suspense } from "react";

// Async component that fetches and displays GitHub Action data
async function GitHubActionRunsSection() {
  // Fetch real data from database
  const githubActionRuns = await getRecentActionRuns(50);

  // Convert database format to component format
  const formattedRuns = githubActionRuns.map(run => ({
    id: run.id,
    runNumber: run.runNumber,
    runId: run.runId,
    randomNumber: run.randomNumber,
    workflow: run.workflow,
    status: run.status as "success" | "failure" | "cancelled",
    branch: run.branch,
    commit: run.commit,
    actor: run.actor,
    logUrl: run.logUrl,
    createdAt: run.createdAt.toISOString(),
  }));

  if (formattedRuns.length === 0) {
    return (
      <section className="text-center py-12">
        <div className="rounded-lg border border-dashed p-8">
          <h3 className="text-lg font-semibold mb-2">No GitHub Action Runs Yet</h3>
          <p className="text-muted-foreground">
            Run your GitHub Action workflow to see data here
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* GitHub Action Runs Stats */}
      <section>
        <h2 className="text-xl font-semibold mb-4">GitHub Action Stats</h2>
        <ActionStats runs={formattedRuns} />
      </section>

      {/* Random Number Chart */}
      <section>
        <RandomNumberChart runs={formattedRuns} />
      </section>

      {/* GitHub Action Runs Table */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent GitHub Action Runs</h2>
          <p className="text-sm text-muted-foreground">
            {formattedRuns.length} total runs
          </p>
        </div>
        <ActionRunsTable runs={formattedRuns} />
      </section>
    </>
  );
}

// Loading skeleton for GitHub Action data
function GitHubActionRunsLoading() {
  return (
    <section className="text-center py-12">
      <div className="rounded-lg border border-dashed p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3 mx-auto" />
          <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
        </div>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Performance Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your application's performance metrics and test results
          </p>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-12">
        <Suspense fallback={<GitHubActionRunsLoading />}>
          <GitHubActionRunsSection />
        </Suspense>

        {/* Divider */}
        <div className="border-t" />

        {/* Latest Lighthouse Scores Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Latest Lighthouse Scores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Performance"
              score={mockLatestScores.performance}
              description="Overall performance score"
            />
            <MetricCard
              title="Accessibility"
              score={mockLatestScores.accessibility}
              description="A11y compliance score"
            />
            <MetricCard
              title="Best Practices"
              score={mockLatestScores.bestPractices}
              description="Code quality score"
            />
            <MetricCard
              title="SEO"
              score={mockLatestScores.seo}
              description="Search optimization"
            />
          </div>
        </section>

        {/* Lighthouse Test Runs Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Lighthouse Test Runs</h2>
            <p className="text-sm text-muted-foreground">
              {mockTestRuns.length} total runs
            </p>
          </div>
          <TestRunTable testRuns={mockTestRuns} />
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          Performance monitoring powered by Lighthouse
        </div>
      </footer>
    </div>
  );
}
