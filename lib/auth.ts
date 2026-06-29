import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import { prisma } from "./prisma";
import { demoSecret, isDemoMode } from "./env";
import { users } from "./mock-data";

export interface SessionUser {
  id?: string;
  role?: string;
}

export const authOptions: NextAuthOptions = {
  // Demo mode does not use the Prisma adapter so the app works without a database.
  adapter: isDemoMode ? undefined : (PrismaAdapter(prisma) as Adapter),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase().trim();

        // Check admin credentials first
        if (
          email === "admin@ajunifoundation.in" &&
          credentials.password === "admin123"
        ) {
          return {
            id: "admin-demo",
            email: "admin@ajunifoundation.in",
            name: "Trust Admin",
            role: "ADMIN",
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop",
          };
        }

        // Check demo residents (mock-data users)
        const demoUser = users.find((u) => u.email === email);
        if (demoUser) {
          // In demo mode, accept "password" for any resident
          if (credentials.password === "password") {
            return {
              id: demoUser.id,
              email: demoUser.email,
              name: demoUser.name,
              role: demoUser.role,
              image: demoUser.image,
            };
          }
        }

        // Check database for registered users
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email },
          });

          if (dbUser && dbUser.image?.startsWith("password:")) {
            const storedHash = dbUser.image.replace("password:", "");
            let passwordValid = false;

            if (storedHash.startsWith("sha256:")) {
              // Web Crypto fallback hash comparison
              const encoder = new TextEncoder();
              const salt = process.env.NEXTAUTH_SECRET || "ajuni-secret-salt";
              const data = encoder.encode(credentials.password + salt);
              const hashBuffer = await crypto.subtle.digest("SHA-256", data);
              const hashArray = Array.from(new Uint8Array(hashBuffer));
              const computedHash =
                "sha256:" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
              passwordValid = computedHash === storedHash;
            } else {
              // bcrypt hash comparison
              try {
                const bcrypt = await import("bcryptjs");
                passwordValid = await bcrypt.compare(
                  credentials.password,
                  storedHash
                );
              } catch {
                passwordValid = false;
              }
            }

            if (passwordValid) {
              return {
                id: dbUser.id,
                email: dbUser.email,
                name: dbUser.name,
                role: dbUser.role,
                image: null,
              };
            }
          }
        } catch (err) {
          console.error("[AUTH] Database lookup error:", err);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        const sessionUser = session.user as SessionUser;
        sessionUser.id = token.sub || user?.id;
        sessionUser.role =
          (token as { role?: string }).role ||
          (user as SessionUser)?.role ||
          "RESIDENT";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as SessionUser).role || "RESIDENT";
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // Fallback secret for demo previews only. Always set NEXTAUTH_SECRET in production.
  secret: process.env.NEXTAUTH_SECRET || demoSecret,
};
