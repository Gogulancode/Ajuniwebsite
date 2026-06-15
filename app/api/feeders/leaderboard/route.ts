import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const leaderboard = [
  {
    tower: "Tower Cluster A",
    coverage: 92,
    feederCount: 18,
  },
  {
    tower: "Tower Cluster B",
    coverage: 84,
    feederCount: 14,
  },
  {
    tower: "Tower Cluster C",
    coverage: 76,
    feederCount: 11,
  },
  {
    tower: "Tower Cluster D",
    coverage: 88,
    feederCount: 16,
  },
  {
    tower: "Aarey Edge",
    coverage: 65,
    feederCount: 9,
  },
];

export async function GET() {
  return NextResponse.json(leaderboard);
}
