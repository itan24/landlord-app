import { PrismaClient } from "@prisma/client";

/**
 * Global type for Prisma client to prevent multiple instances
 * in development mode due to hot reloading
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Prisma Client Instance
 * 
 * Creates and exports a singleton Prisma client instance.
 * In development, it prevents multiple client instances during hot reloads.
 * In production, it creates a new instance with minimal logging.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Store the client instance globally in development to prevent multiple instances
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;