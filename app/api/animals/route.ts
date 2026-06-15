import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, SessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Role, AnimalType, Status } from "@prisma/client";
import { isDemoMode } from "@/lib/env";
import { getAnimals } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    if (isDemoMode) {
      const { searchParams } = new URL(req.url);
      const type = searchParams.get("type") || undefined;
      const zone = searchParams.get("zone") || undefined;
      const status = searchParams.get("status") || undefined;
      const adoptableParam = searchParams.get("adoptable");
      return NextResponse.json(
        getAnimals({
          type,
          zone,
          status,
          adoptable: adoptableParam !== null ? adoptableParam === "true" : undefined,
        })
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || undefined;
    const zone = searchParams.get("zone") || undefined;
    const status = searchParams.get("status") || undefined;
    const adoptableParam = searchParams.get("adoptable");

    const where: Prisma.AnimalWhereInput = {};
    if (type) where.type = type as AnimalType;
    if (zone) where.zone = zone;
    if (status) where.status = status as Status;
    if (adoptableParam !== null) where.adoptable = adoptableParam === "true";

    const animals = await prisma.animal.findMany({
      where,
      include: {
        healthRecords: true,
        feederLogs: {
          take: 5,
          orderBy: { date: "desc" },
          include: { user: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(animals);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch animals";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as SessionUser).role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isDemoMode) {
      const body = await req.json();
      return NextResponse.json(
        { success: true, demo: true, message: "Animal created in demo mode", data: body },
        { status: 201 }
      );
    }

    const body = await req.json();
    const animal = await prisma.animal.create({
      data: body,
    });

    return NextResponse.json(animal, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create animal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
