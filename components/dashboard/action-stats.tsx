import { MetricCard } from "@/components/dashboard/metric-card";
import type { GitHubActionRun } from "@/lib/mock-data";

interface ActionStatsProps {
  runs: GitHubActionRun[];
}

export function ActionStats({ runs }: ActionStatsProps) {
  // Calculate latest random number
  const latestRun = runs[0];
  const latestRandomNumber = latestRun?.randomNumber ?? 0;

  // Calculate average random number
  const avgRandomNumber = runs.length > 0
    ? Math.round(runs.reduce((sum, run) => sum + run.randomNumber, 0) / runs.length)
    : 0;

  // Calculate success rate
  const successCount = runs.filter(run => run.status === "success").length;
  const successRate = runs.length > 0
    ? Math.round((successCount / runs.length) * 100)
    : 0;

  // Total runs
  const totalRuns = runs.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Latest Random Number"
        score={latestRandomNumber}
        description="Most recent run"
      />
      <MetricCard
        title="Average Number"
        score={avgRandomNumber}
        description="Across all runs"
      />
      <MetricCard
        title="Success Rate"
        score={successRate}
        description={`${successCount}/${totalRuns} successful`}
      />
      <MetricCard
        title="Total Runs"
        score={totalRuns}
        maxScore={1000}
        description="All time"
      />
    </div>
  );
}
