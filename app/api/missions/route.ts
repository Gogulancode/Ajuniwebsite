import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, SessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { isDemoMode } from "@/lib/env";
import { getMissions } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (isDemoMode) {
      return NextResponse.json(getMissions());
    }

    const missions = await prisma.mission.findMany({
      where: { status: "ACTIVE" },
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

    if (isDemoMode) {
      return NextResponse.json(
        {
          success: true,
          demo: true,
          message: "Mission created in demo mode",
          data: body,
        },
        { status: 201 }
      );
    }

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
