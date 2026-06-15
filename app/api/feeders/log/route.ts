import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, SessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionUser = session.user as SessionUser;
    if (!sessionUser.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = sessionUser.id;
    const { animalId, photoUrl, notes, latitude, longitude } = await req.json();

    if (!animalId || !photoUrl) {
      return NextResponse.json(
        { error: "animalId and photoUrl are required" },
        { status: 400 }
      );
    }

    const feederLog = await prisma.feederLog.create({
      data: {
        userId,
        animalId,
        photoUrl,
        notes,
        latitude,
        longitude,
      },
    });

    return NextResponse.json(feederLog, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create feeder log";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}