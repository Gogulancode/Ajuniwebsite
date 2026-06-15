import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, SessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role, MissionStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const missions = await prisma.mission.findMany({
      where: { status: MissionStatus.ACTIVE },
      include: {
        updates: true,
        animal: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(missions);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch missions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as SessionUser).role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { animalId, title, description, image, target, daysLeft } = body;

    const mission = await prisma.mission.create({
      data: {
        animalId,
        title,
        description,
        image,
        target,
        daysLeft,
      },
    });

    return NextResponse.json(mission, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create mission";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}