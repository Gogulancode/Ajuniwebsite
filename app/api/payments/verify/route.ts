import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { DonationType, PaymentStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      type,
      animalId,
      missionId,
      userId,
    } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    let verified = false;

    if (keySecret && razorpay_order_id && razorpay_payment_id) {
      const generated = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      verified = generated === razorpay_signature;
    } else {
      verified = true;
    }

    if (!verified) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    const donationType =
      type === "MISSION"
        ? DonationType.MISSION
        : type === "MONTHLY"
        ? DonationType.MONTHLY
        : DonationType.ONE_TIME;

    const donation = await prisma.donation.create({
      data: {
        amount: Number(amount),
        type: donationType,
        status: PaymentStatus.SUCCESS,
        razorpayId: razorpay_payment_id || razorpay_order_id,
        userId,
        animalId,
        missionId,
      },
    });

    if (missionId) {
      await prisma.mission.update({
        where: { id: missionId },
        data: {
          raised: { increment: Number(amount) },
          donors: { increment: 1 },
        },
      });
    }

    return NextResponse.json({ success: true, donation });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to verify payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
