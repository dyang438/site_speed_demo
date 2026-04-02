/**
 * POST a run record to the deployed `/api/action-runs` endpoint.
 * Shared by basic-action, build-action, and similar runners.
 */

export type ActionRunPayload = {
  runNumber: number;
  runId: string;
  randomNumber: number;
  workflow: string;
  status: "success" | "failure" | "cancelled";
  branch: string | null;
  commit: string | null;
  actor: string | null;
  logUrl: string | null;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    process.stderr.write(`Missing required environment variable: ${name}\n`);
    process.exit(1);
  }
  return value;
}

export async function postActionRunPayload(
  payload: ActionRunPayload
): Promise<void> {
  const apiEndpoint = requireEnv("API_ENDPOINT");
  const apiSecret = requireEnv("API_SECRET");

  process.stdout.write(`Sending payload to ${apiEndpoint}\n`);

  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiSecret}`,
    },
    body: JSON.stringify(payload),
  });

  const responseBody = await response.text();
  process.stdout.write(`API status: ${response.status}\n`);
  process.stdout.write(`API response: ${responseBody}\n`);

  if (!response.ok) {
    process.stderr.write(
      "GitHub Action failed to write run data to the API\n"
    );
    process.exit(1);
  }
}
