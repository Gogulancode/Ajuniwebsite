import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { isDemoMode } from "@/lib/env";
import { getFeederLogs } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const animalId = searchParams.get("animalId") || undefined;
    const userId = searchParams.get("userId") || undefined;

    if (isDemoMode) {
      return NextResponse.json(getFeederLogs({ animalId, userId }));
    }

    const where: Prisma.FeederLogWhereInput = {};
    if (animalId) where.animalId = animalId;
    if (userId) where.userId = userId;

    const logs = await prisma.feederLog.findMany({
      where,
      include: {
        user: true,
        animal: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(logs);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch feeder logs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
