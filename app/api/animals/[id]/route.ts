import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, SessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { isDemoMode } from "@/lib/env";
import { getAnimalById } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (isDemoMode) {
      const animal = getAnimalById(id);
      if (!animal) {
        return NextResponse.json({ error: "Animal not found" }, { status: 404 });
      }
      return NextResponse.json(animal);
    }

    const animal = await prisma.animal.findUnique({
      where: { id },
      include: {
        healthRecords: {
          orderBy: { date: "desc" },
        },
        feederLogs: {
          orderBy: { date: "desc" },
          include: { user: true },
        },
        missions: true,
        donations: true,
      },
    });

    if (!animal) {
      return NextResponse.json({ error: "Animal not found" }, { status: 404 });
    }

    return NextResponse.json(animal);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch animal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as SessionUser).role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { status, tags, nickname, adoptable } = body;

    if (isDemoMode) {
      return NextResponse.json({
        success: true,
        demo: true,
        message: "Animal updated in demo mode",
        id,
        data: { status, tags, nickname, adoptable },
      });
    }

    const animal = await prisma.animal.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(tags !== undefined && { tags }),
        ...(nickname !== undefined && { nickname }),
        ...(adoptable !== undefined && { adoptable }),
      },
    });

    return NextResponse.json(animal);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update animal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as SessionUser).role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    if (isDemoMode) {
      return NextResponse.json({
        success: true,
        demo: true,
        message: "Animal deleted in demo mode",
        id,
      });
    }

    await prisma.animal.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete animal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
