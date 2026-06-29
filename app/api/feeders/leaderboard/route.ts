import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/env";
import { getLeaderboard, calculateLeaderboard } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = isDemoMode ? calculateLeaderboard() : getLeaderboard();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch leaderboard";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
