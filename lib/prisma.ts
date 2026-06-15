import { PrismaClient } from "@prisma/client";
import { isDemoMode } from "./env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createDemoPrismaClient(): PrismaClient {
  const throwDisabled = () => {
    throw new Error(
      "Database operations are disabled in DEMO_MODE. Set DATABASE_URL and DEMO_MODE=false to persist data."
    );
  };

  const modelProxy = new Proxy(() => throwDisabled(), {
    get: () => throwDisabled,
    apply: () => throwDisabled(),
  });

  return new Proxy({} as PrismaClient, {
    get: (_target, prop) => {
      if (typeof prop === "symbol") return throwDisabled;
      if (prop.startsWith("$")) return throwDisabled;
      return modelProxy;
    },
  });
}

export const prisma =
  globalForPrisma.prisma ??
  (isDemoMode ? createDemoPrismaClient() : new PrismaClient());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
