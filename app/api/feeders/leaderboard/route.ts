import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/env";
import { getLeaderboard } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Leaderboard is currently static; real version could aggregate feeder logs by tower.
    return NextResponse.json(getLeaderboard());
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch leaderboard";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
