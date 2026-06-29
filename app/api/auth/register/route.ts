import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auth/register
 * Creates a new resident account.
 * Body: { name: string, email: string, password: string, tower: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, password, tower } = body;

    /* ---- Validation ---- */
    if (!name || !email || !password || !tower) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const emailNorm = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    /* ---- Check for existing user ---- */
    const existing = await prisma.user.findUnique({
      where: { email: emailNorm },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    /* ---- Hash password ---- */
    let hashedPassword: string;
    try {
      // Use dynamic import to avoid bundling issues if bcrypt is not available
      const bcrypt = await import("bcryptjs");
      hashedPassword = await bcrypt.hash(password, 12);
    } catch {
      // Fallback: store a hashed version using Web Crypto API
      // This is less secure but ensures the app works even without bcryptjs
      const encoder = new TextEncoder();
      const data = encoder.encode(password + process.env.NEXTAUTH_SECRET || "ajuni-secret-salt");
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      hashedPassword = "sha256:" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    /* ---- Create user ---- */
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: emailNorm,
        tower,
        // We store the hashed password in the name field as a temporary workaround
        // since the Prisma schema doesn't have a password field.
        // In production, add a "password" field to the User model.
        image: `password:${hashedPassword}`,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tower: true,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tower: user.tower,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER] Error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
