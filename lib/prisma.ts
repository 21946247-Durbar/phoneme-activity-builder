import { PrismaClient } from "./generated/prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Resolve the SQLite DB path to an absolute location.
 *
 * The .env file uses `file:./dev.db` for Prisma CLI (which resolves
 * relative to schema.prisma). At Next.js runtime, the working directory
 * is .next/dev/server/chunks — so we must convert any relative path into
 * an absolute one based on the project root.
 */
function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;

  // No env var → default to project/prisma/dev.db
  if (!envUrl) {
    return `file:${path.resolve(process.cwd(), "prisma", "dev.db")}`;
  }

  // Already absolute? (file:/..., file:C:/..., file:C:\...) → use as-is
  // Prisma accepts `file:` followed by an absolute path or a relative path.
  const pathPart = envUrl.startsWith("file:") ? envUrl.slice(5) : envUrl;

  // Detect absolute: starts with / or (Windows) X:\ or X:/
  const isAbsolute =
    pathPart.startsWith("/") ||
    /^[A-Za-z]:[\\/]/.test(pathPart);

  if (isAbsolute) {
    return envUrl;
  }

  // Relative → strip leading "./" and resolve from project root under prisma/
  const cleaned = pathPart.replace(/^\.\//, "");
  // If the relative path already points into prisma/ keep it there,
  // otherwise place it under prisma/.
  const target = cleaned.startsWith("prisma/")
    ? path.resolve(process.cwd(), cleaned)
    : path.resolve(process.cwd(), "prisma", cleaned);

  return `file:${target}`;
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: { url: resolveDatabaseUrl() },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;