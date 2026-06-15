import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isDemoMode } from "@/lib/env";
import { getMissionById } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (isDemoMode) {
      const mission = getMissionById(id);
      if (!mission) {
        return NextResponse.json({ error: "Mission not found" }, { status: 404 });
      }
      return NextResponse.json(mission);
    }

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: {
        animal: true,
        updates: true,
      },
    });

    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    return NextResponse.json(mission);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch mission";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
