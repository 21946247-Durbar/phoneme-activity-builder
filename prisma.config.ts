// Prisma configuration for the Phoneme Activity Builder (Assessment 2).
// Loaded automatically by the Prisma CLI for migrations, seeding, and Studio.
// Reference: https://pris.ly/prisma-config

import "dotenv/config";
import path from "path";
import { defineConfig } from "prisma/config";

// Prefer DATABASE_URL from environment (set in .env for local dev,
// passed as a container env var in Docker). Fall back to an absolute
// path relative to this file's project root so Prisma CLI and the
// Next.js runtime always resolve the same SQLite file.
const databaseUrl =
  process.env.DATABASE_URL ??
  `file:${path.resolve(process.cwd(), "prisma", "dev.db")}`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  engine: "classic",
  datasource: {
    url: databaseUrl,
  },
});