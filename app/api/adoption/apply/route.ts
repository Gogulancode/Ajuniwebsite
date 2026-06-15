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
    const { animalId } = await req.json();

    if (!animalId) {
      return NextResponse.json(
        { error: "animalId is required" },
        { status: 400 }
      );
    }

    const animal = await prisma.animal.findUnique({
      where: { id: animalId },
    });

    if (!animal || !animal.adoptable) {
      return NextResponse.json(
        { error: "Animal is not available for adoption" },
        { status: 400 }
      );
    }

    const existing = await prisma.adoption.findFirst({
      where: { userId, animalId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already applied for this animal" },
        { status: 409 }
      );
    }

    const adoption = await prisma.adoption.create({
      data: {
        userId,
        animalId,
      },
    });

    return NextResponse.json(adoption, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to submit adoption application";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}