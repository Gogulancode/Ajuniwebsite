import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, SessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isDemoMode } from "@/lib/env";
import { getAdoptableAnimals } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as SessionUser).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isDemoMode) {
      return NextResponse.json(getAdoptableAnimals());
    }

    const animals = await prisma.animal.findMany({
      where: { adoptable: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(animals);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch matches";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
