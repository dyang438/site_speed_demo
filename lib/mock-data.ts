export type TestRunStatus = "passed" | "warning" | "failed";

export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
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
