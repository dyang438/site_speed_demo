import { NextResponse } from "next/server";
import { z } from "zod";
import { createGitHubActionRun, getRecentActionRuns } from "@/lib/db/queries";

const ActionRunSchema = z.object({
  runNumber: z.number(),
  runId: z.string(),
  randomNumber: z.number().min(1).max(100),
  workflow: z.string(),
  status: z.enum(["success", "failure", "cancelled"]),
  branch: z.string().optional().nullable(),
  commit: z.string().optional().nullable(),
  actor: z.string().optional().nullable(),
  logUrl: z.string().url().optional().nullable(),
});

function isAuthorized(request: Request) {
  const expectedSecret = process.env.API_SECRET;

  if (!expectedSecret) {
    return true;
  }

  const authorizationHeader = request.headers.get("authorization");

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return false;
  }

  const providedSecret = authorizationHeader.slice("Bearer ".length);

  return providedSecret === expectedSecret;
}

// POST: Create a new action run
export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const validatedData = ActionRunSchema.parse(json);

    const actionRun = await createGitHubActionRun(validatedData);

    return NextResponse.json(actionRun, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating action run:", error);
    return NextResponse.json(
      { error: "Failed to create action run" },
      { status: 500 }
    );
  }
}

// GET: Retrieve recent action runs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

    const runs = await getRecentActionRuns(limit);

    return NextResponse.json(runs);
  } catch (error) {
    console.error("Error fetching action runs:", error);
    return NextResponse.json(
      { error: "Failed to fetch action runs" },
      { status: 500 }
    );
  }
}
