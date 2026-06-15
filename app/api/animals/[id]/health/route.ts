import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions, SessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(
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
    const { date, event, status, funded, cost, raised, vetName, receiptUrl } =
      body;

    const healthRecord = await prisma.healthRecord.create({
      data: {
        animalId: id,
        date: date ? new Date(date) : new Date(),
        event,
        status,
        funded: funded ?? false,
        cost,
        raised,
        vetName,
        receiptUrl,
      },
    });

    return NextResponse.json(healthRecord, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to add health record";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}