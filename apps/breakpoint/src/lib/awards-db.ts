import { PrismaClient } from "@prisma/client";
import { awardsRuntimeDatabaseUrl } from "@/lib/awards-database-url";

const globalForPrisma = globalThis as typeof globalThis & {
  awardsPrisma?: PrismaClient;
};

export const awardsPrisma =
  globalForPrisma.awardsPrisma ??
  new PrismaClient({
    datasourceUrl: awardsRuntimeDatabaseUrl(process.env.POSTGRES_URL),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// Vercel Fluid Compute reuses a warm process for concurrent invocations. Keep
// one Prisma client (and therefore one one-connection pool) per warm process.
globalForPrisma.awardsPrisma = awardsPrisma;
