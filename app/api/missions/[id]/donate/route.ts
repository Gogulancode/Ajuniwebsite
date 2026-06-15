import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DonationType, PaymentStatus } from "@prisma/client";
import { isDemoMode } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { amount, userId, animalId } = await req.json();

    if (!amount || isNaN(Number(amount))) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      );
    }

    if (isDemoMode) {
      return NextResponse.json(
        {
          success: true,
          demo: true,
          message: "Donation recorded in demo mode",
          missionId: id,
          amount: Number(amount),
          userId,
          animalId,
        },
        { status: 201 }
      );
    }

    const mission = await prisma.mission.findUnique({
      where: { id },
    });

    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    const donation = await prisma.donation.create({
      data: {
        amount: Number(amount),
        type: DonationType.MISSION,
        status: PaymentStatus.SUCCESS,
        userId,
        animalId,
        missionId: id,
      },
    });

    await prisma.mission.update({
      where: { id },
      data: {
        raised: { increment: Number(amount) },
        donors: { increment: 1 },
      },
    });

    return NextResponse.json(donation, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to record donation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
