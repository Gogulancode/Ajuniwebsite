import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { DonationType, PaymentStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { amount, animalId, userId } = await req.json();

    if (!amount || isNaN(Number(amount))) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    let subscriptionId: string;

    if (!keyId || !keySecret) {
      subscriptionId = `mock_subscription_${Date.now()}`;
    } else {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const plan = await razorpay.plans.create({
        period: "monthly",
        interval: 1,
        item: {
          name: `Monthly support${animalId ? ` - ${animalId}` : ""}`,
          amount: Number(amount) * 100,
          currency: "INR",
        },
      });

      const subscription = await razorpay.subscriptions.create({
        plan_id: plan.id,
        customer_notify: 1,
        total_count: 12,
        notes: {
          animalId: animalId || "",
        },
      });

      subscriptionId = subscription.id;
    }

    const donation = await prisma.donation.create({
      data: {
        amount: Number(amount),
        type: DonationType.MONTHLY,
        status: PaymentStatus.SUCCESS,
        razorpayId: subscriptionId,
        userId,
        animalId,
      },
    });

    return NextResponse.json({ subscriptionId, donation });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create subscription";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
