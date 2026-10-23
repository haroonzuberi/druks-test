import "server-only";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/src/generated/prisma/client";

// To prevent too many db connections in development server
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}
const adapter = new PrismaMariaDb(connectionString);

export const prisma = globalForPrisma.prisma ?? 
                new PrismaClient({
                    adapter,
                    log: process.env.NODE_ENV === "development" ? ["error", "warn"]:["error"]
                });

// here we are assigning the old prisma db connection to the global prisma client so that it doe not recreate a new connection
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prisma
