import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  awardsPrisma?: PrismaClient;
};

export const awardsPrisma =
  globalForPrisma.awardsPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.awardsPrisma = awardsPrisma;
}
