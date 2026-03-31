import type { GitHubActionRun } from "@/lib/mock-data";

interface RandomNumberChartProps {
  runs: GitHubActionRun[];
}

export function RandomNumberChart({ runs }: RandomNumberChartProps) {
  if (runs.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        No data available
      </div>
    );
  }

  // Sort runs by creation date (oldest first for chart)
  const sortedRuns = [...runs].reverse();

  const width = 800;
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate scales
  const maxValue = 100;
  const minValue = 0;
  const stepX = chartWidth / (sortedRuns.length - 1 || 1);

  // Generate points for the line
  const points = sortedRuns.map((run, index) => {
    const x = padding.left + index * stepX;
    const y = padding.top + chartHeight - ((run.randomNumber - minValue) / (maxValue - minValue)) * chartHeight;
    return { x, y, run };
  });

  // Create path for line
  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  // Create area path (fill under line)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Random Number Trend</h3>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          style={{ minWidth: "600px" }}
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value) => {
            const y = padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
            return (
              <g key={value}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="currentColor"
                  opacity="0.5"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path
            d={areaPath}
            fill="hsl(var(--primary))"
            opacity="0.1"
          />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="hsl(var(--primary))"
                stroke="hsl(var(--background))"
                strokeWidth="2"
              />
              {/* Tooltip on hover would go here */}
            </g>
          ))}

          {/* X-axis labels (run numbers) */}
          {points.map((point, index) => {
            // Show every other label to avoid crowding
            if (index % Math.ceil(points.length / 8) === 0 || index === points.length - 1) {
              return (
                <text
                  key={index}
                  x={point.x}
                  y={height - padding.bottom + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="currentColor"
                  opacity="0.5"
                >
                  #{point.run.runNumber}
                </text>
              );
            }
            return null;
          })}

          {/* Axis labels */}
          <text
            x={padding.left - 35}
            y={padding.top + chartHeight / 2}
            textAnchor="middle"
            fontSize="12"
            fill="currentColor"
            opacity="0.5"
            transform={`rotate(-90, ${padding.left - 35}, ${padding.top + chartHeight / 2})`}
          >
            Random Number
          </text>
          <text
            x={padding.left + chartWidth / 2}
            y={height - 5}
            textAnchor="middle"
            fontSize="12"
            fill="currentColor"
            opacity="0.5"
          >
            Run Number
          </text>
        </svg>
      </div>
    </div>
  );
}
