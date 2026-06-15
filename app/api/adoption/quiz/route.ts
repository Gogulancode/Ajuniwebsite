import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AnimalType } from "@prisma/client";
import { QuizAnswer } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { answers }: { answers: QuizAnswer } = await req.json();
    const { activity, experience, personality } = answers;

    const animals = await prisma.animal.findMany({
      where: { adoptable: true },
    });

    const scored = animals.map((animal) => {
      let score = 0;

      if (activity === "Couch potato" && animal.type === AnimalType.CAT) {
        score += 3;
      }

      if (experience === "First-time") {
        const tags = animal.tags.map((t) => t.toLowerCase());
        if (tags.includes("calm")) score += 2;
        if (tags.includes("first-time friendly")) score += 3;
      }

      if (personality) {
        const tags = animal.tags.map((t) => t.toLowerCase());
        if (tags.includes(personality.toLowerCase())) score += 3;
      }

      return { animal, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return NextResponse.json(scored.map((item) => item.animal));
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to process quiz";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
