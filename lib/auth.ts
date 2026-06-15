import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import { prisma } from "./prisma";
import { demoSecret, isDemoMode } from "./env";

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
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.email === "admin@ajunifoundation.in" &&
          credentials?.password === "admin123"
        ) {
          return {
            id: "admin-demo",
            email: "admin@ajunifoundation.in",
            name: "Trust Admin",
            role: "ADMIN",
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop",
          };
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
    signIn: "/",
    error: "/",
  },
  // Fallback secret for demo previews only. Always set NEXTAUTH_SECRET in production.
  secret: process.env.NEXTAUTH_SECRET || demoSecret,
};
