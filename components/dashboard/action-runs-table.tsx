import { Badge } from "@/components/ui/badge";
import type { ActionRunStatus, GitHubActionRun } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ActionRunsTableProps {
  runs: GitHubActionRun[];
}

function getStatusBadge(status: ActionRunStatus) {
  switch (status) {
    case "success":
      return <Badge variant="default">Success</Badge>;
    case "failure":
      return <Badge variant="destructive">Failure</Badge>;
    case "cancelled":
      return <Badge variant="secondary">Cancelled</Badge>;
  }
}

function getNumberColor(num: number): string {
  if (num >= 75) return "text-green-600 dark:text-green-400";
  if (num >= 40) return "text-yellow-600 dark:text-yellow-400";
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

export function ActionRunsTable({ runs }: ActionRunsTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Run #
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Random Number
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Branch
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Commit
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Actor
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Time
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Logs
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {runs.map((run) => (
              <tr
                key={run.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="font-mono text-sm">#{run.runNumber}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("text-2xl font-bold", getNumberColor(run.randomNumber))}>
                    {run.randomNumber}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(run.status)}
                </td>
                <td className="px-4 py-3">
                  {run.branch && (
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                      {run.branch}
                    </code>
                  )}
                </td>
                <td className="px-4 py-3">
                  {run.commit && (
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                      {run.commit}
                    </code>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {run.actor ?? "-"}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {formatDate(run.createdAt)}
                </td>
                <td className="px-4 py-3">
                  {run.logUrl && (
                    <a
                      href={run.logUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
