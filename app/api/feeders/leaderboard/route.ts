import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/env";
import { getLeaderboard } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  if (isDemoMode) {
    return NextResponse.json(getLeaderboard());
  }

  // Leaderboard is currently static; real version could aggregate feeder logs by tower.
  return NextResponse.json(getLeaderboard());
}
