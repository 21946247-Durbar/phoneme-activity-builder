import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/health
 *
 * Returns 200 OK only if the app AND the database are reachable.
 * Returns 503 if the database cannot be reached.
 */
export async function GET() {
  const started = Date.now();

  try {
    // Ping the DB with a lightweight query
    await prisma.$queryRaw`SELECT 1`;
    const dbLatencyMs = Date.now() - started;

    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
          status: "connected",
          latencyMs: dbLatencyMs,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[HEALTH] Database check failed:", message);

    return NextResponse.json(
      {
        status: "degraded",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
          status: "disconnected",
          error: message,
        },
      },
      { status: 503 }
    );
  }
}