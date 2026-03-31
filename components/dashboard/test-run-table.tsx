import { Badge } from "@/components/ui/badge";
import type { TestRun, TestRunStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface TestRunTableProps {
  testRuns: TestRun[];
}

function getStatusBadge(status: TestRunStatus) {
  switch (status) {
    case "passed":
      return <Badge variant="default">Passed</Badge>;
    case "warning":
      return <Badge variant="secondary">Warning</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
  }
}

function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-600 dark:text-green-400";
  if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function TestRunTable({ testRuns }: TestRunTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Branch
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Commit
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Performance
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                A11y
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Best Practices
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                SEO
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {testRuns.map((run) => (
              <tr
                key={run.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-3 text-sm">
                  {formatDate(run.date)}
                </td>
                <td className="px-4 py-3">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                    {run.branch}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                      {run.commit}
                    </code>
                    <p className="text-xs text-muted-foreground mt-1 truncate max-w-xs">
                      {run.commitMessage}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("font-semibold", getScoreColor(run.scores.performance))}>
                    {run.scores.performance}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("font-semibold", getScoreColor(run.scores.accessibility))}>
                    {run.scores.accessibility}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("font-semibold", getScoreColor(run.scores.bestPractices))}>
                    {run.scores.bestPractices}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("font-semibold", getScoreColor(run.scores.seo))}>
                    {run.scores.seo}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(run.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
