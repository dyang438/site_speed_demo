import { MetricCard } from "@/components/dashboard/metric-card";
import { TestRunTable } from "@/components/dashboard/test-run-table";
import { mockLatestScores, mockTestRuns } from "@/lib/mock-data";

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

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Latest Scores Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Latest Scores</h2>
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

        {/* Test Runs Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Test Runs</h2>
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
