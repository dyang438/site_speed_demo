export type TestRunStatus = "passed" | "warning" | "failed";
export type ActionRunStatus = "success" | "failure" | "cancelled";

export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

export interface GitHubActionRun {
  id: string;
  runNumber: number;
  runId: string;
  randomNumber: number;
  workflow: string;
  status: ActionRunStatus;
  branch: string | null;
  commit: string | null;
  actor: string | null;
  logUrl: string | null;
  createdAt: string;
}

export interface TestRun {
  id: string;
  date: string;
  branch: string;
  commit: string;
  commitMessage: string;
  scores: LighthouseScores;
  status: TestRunStatus;
  url: string;
}

export const mockLatestScores: LighthouseScores = {
  performance: 85,
  accessibility: 92,
  bestPractices: 78,
  seo: 100,
};

export const mockTestRuns: TestRun[] = [
  {
    id: "1",
    date: "2026-03-31T10:30:00Z",
    branch: "main",
    commit: "abc123f",
    commitMessage: "feat: optimize image loading",
    scores: {
      performance: 85,
      accessibility: 92,
      bestPractices: 78,
      seo: 100,
    },
    status: "passed",
    url: "https://example.com",
  },
  {
    id: "2",
    date: "2026-03-30T15:45:00Z",
    branch: "feat/new-feature",
    commit: "def456a",
    commitMessage: "feat: add new dashboard component",
    scores: {
      performance: 78,
      accessibility: 88,
      bestPractices: 82,
      seo: 95,
    },
    status: "warning",
    url: "https://example.com",
  },
  {
    id: "3",
    date: "2026-03-29T09:15:00Z",
    branch: "main",
    commit: "ghi789b",
    commitMessage: "fix: resolve accessibility issues",
    scores: {
      performance: 92,
      accessibility: 95,
      bestPractices: 85,
      seo: 100,
    },
    status: "passed",
    url: "https://example.com",
  },
  {
    id: "4",
    date: "2026-03-28T14:20:00Z",
    branch: "fix/performance",
    commit: "jkl012c",
    commitMessage: "fix: reduce bundle size",
    scores: {
      performance: 88,
      accessibility: 90,
      bestPractices: 80,
      seo: 98,
    },
    status: "passed",
    url: "https://example.com",
  },
  {
    id: "5",
    date: "2026-03-27T11:00:00Z",
    branch: "main",
    commit: "mno345d",
    commitMessage: "chore: update dependencies",
    scores: {
      performance: 45,
      accessibility: 75,
      bestPractices: 65,
      seo: 88,
    },
    status: "failed",
    url: "https://example.com",
  },
];

export const mockGitHubActionRuns: GitHubActionRun[] = [
  {
    id: "gh-1",
    runNumber: 42,
    runId: "12345678",
    randomNumber: 87,
    workflow: "Hello World",
    status: "success",
    branch: "main",
    commit: "a1b2c3d",
    actor: "johndoe",
    logUrl: "https://github.com/owner/repo/actions/runs/12345678",
    createdAt: "2026-03-31T14:30:00Z",
  },
  {
    id: "gh-2",
    runNumber: 41,
    runId: "12345677",
    randomNumber: 23,
    workflow: "Hello World",
    status: "success",
    branch: "main",
    commit: "b2c3d4e",
    actor: "janedoe",
    logUrl: "https://github.com/owner/repo/actions/runs/12345677",
    createdAt: "2026-03-31T12:15:00Z",
  },
  {
    id: "gh-3",
    runNumber: 40,
    runId: "12345676",
    randomNumber: 56,
    workflow: "Hello World",
    status: "success",
    branch: "feat/new-feature",
    commit: "c3d4e5f",
    actor: "johndoe",
    logUrl: "https://github.com/owner/repo/actions/runs/12345676",
    createdAt: "2026-03-31T10:00:00Z",
  },
  {
    id: "gh-4",
    runNumber: 39,
    runId: "12345675",
    randomNumber: 94,
    workflow: "Hello World",
    status: "success",
    branch: "main",
    commit: "d4e5f6g",
    actor: "janedoe",
    logUrl: "https://github.com/owner/repo/actions/runs/12345675",
    createdAt: "2026-03-30T16:45:00Z",
  },
  {
    id: "gh-5",
    runNumber: 38,
    runId: "12345674",
    randomNumber: 12,
    workflow: "Hello World",
    status: "failure",
    branch: "fix/bug",
    commit: "e5f6g7h",
    actor: "johndoe",
    logUrl: "https://github.com/owner/repo/actions/runs/12345674",
    createdAt: "2026-03-30T14:20:00Z",
  },
  {
    id: "gh-6",
    runNumber: 37,
    runId: "12345673",
    randomNumber: 78,
    workflow: "Hello World",
    status: "success",
    branch: "main",
    commit: "f6g7h8i",
    actor: "janedoe",
    logUrl: "https://github.com/owner/repo/actions/runs/12345673",
    createdAt: "2026-03-30T11:30:00Z",
  },
  {
    id: "gh-7",
    runNumber: 36,
    runId: "12345672",
    randomNumber: 45,
    workflow: "Hello World",
    status: "success",
    branch: "main",
    commit: "g7h8i9j",
    actor: "johndoe",
    logUrl: "https://github.com/owner/repo/actions/runs/12345672",
    createdAt: "2026-03-29T15:10:00Z",
  },
  {
    id: "gh-8",
    runNumber: 35,
    runId: "12345671",
    randomNumber: 67,
    workflow: "Hello World",
    status: "cancelled",
    branch: "test/experimental",
    commit: "h8i9j0k",
    actor: "janedoe",
    logUrl: "https://github.com/owner/repo/actions/runs/12345671",
    createdAt: "2026-03-29T09:25:00Z",
  },
];
