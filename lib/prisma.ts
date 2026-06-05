import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../app/generated/prisma/client";

function createPrisma() {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  const authToken = process.env.DATABASE_AUTH_TOKEN;
  // authToken is required for Turso (cloud) but not for local SQLite
  const adapter = new PrismaLibSql({ url, ...(authToken ? { authToken } : {}) });
  return new PrismaClient({ adapter, log: ["error"] });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? createPrisma();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
