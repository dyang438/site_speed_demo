import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  score: number;
  maxScore?: number;
  description?: string;
}

function getScoreColor(score: number, maxScore: number = 100): string {
  const percentage = (score / maxScore) * 100;

  if (percentage >= 90) return "text-green-600 dark:text-green-400";
  if (percentage >= 50) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function getScoreStatus(score: number, maxScore: number = 100): "default" | "secondary" | "destructive" {
  const percentage = (score / maxScore) * 100;

  if (percentage >= 90) return "default";
  if (percentage >= 50) return "secondary";
  return "destructive";
}

export function MetricCard({ title, score, maxScore = 100, description }: MetricCardProps) {
  const scoreColor = getScoreColor(score, maxScore);
  const badgeStatus = getScoreStatus(score, maxScore);

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className={cn("text-3xl font-bold", scoreColor)}>
              {score}
            </span>
            <span className="text-sm text-muted-foreground">/ {maxScore}</span>
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <Badge variant={badgeStatus}>
          {score >= 90 ? "Good" : score >= 50 ? "Needs Improvement" : "Poor"}
        </Badge>
      </div>
    </div>
  );
}
