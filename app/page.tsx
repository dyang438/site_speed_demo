export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Performance Monitor</h1>
        <p className="text-muted-foreground">
          CI/CD Performance Testing Tool
        </p>
        <div className="pt-4">
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            View Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
