import { prisma } from "./prisma";

/**
 * Observability helpers for Assessment 3.
 *
 * These functions record events into the database so that the dashboard
 * can show live usage, success/failure counts, and alerts.
 */

// ---------- Page visits ----------

/**
 * Start a page-visit record. Returns the row id so the client can
 * later update it with the dwell time.
 */
export async function recordPageVisit(input: {
  path: string;
  sessionId: string;
}) {
  return prisma.pageVisit.create({
    data: {
      path: input.path,
      sessionId: input.sessionId,
    },
  });
}

/**
 * Update a page visit with the time the user spent on the page.
 */
export async function recordDwellTime(input: {
  visitId: number;
  dwellMs: number;
}) {
  return prisma.pageVisit.update({
    where: { id: input.visitId },
    data: { dwellMs: Math.max(0, Math.floor(input.dwellMs)) },
  });
}

// ---------- Generation events ----------

/**
 * Record a successful or failed HTML generation attempt.
 */
export async function recordGeneration(input: {
  activityType: "WORDLE" | "WORDSEARCH";
  success: boolean;
  wordCount: number;
  difficulty: string;
  errorMessage?: string;
}) {
  return prisma.generationEvent.create({
    data: {
      activityType: input.activityType,
      success: input.success,
      wordCount: input.wordCount,
      difficulty: input.difficulty,
      errorMessage: input.errorMessage ?? null,
    },
  });
}

// ---------- General activity log ----------

/**
 * Write an entry to the general event log (used for alerts and warnings).
 */
export async function logActivity(input: {
  level: "info" | "warn" | "error";
  source: string;
  message: string;
  metadata?: Record<string, unknown>;
}) {
  return prisma.activityLog.create({
    data: {
      level: input.level,
      source: input.source,
      message: input.message,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    },
  });
}

// ---------- Metrics aggregation ----------

/**
 * Aggregate all dashboard metrics in one call.
 */
export async function getMetrics() {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Counts
  const [
    totalWordLists,
    totalWords,
    totalPhonemes,
    totalActivities,
    activityBreakdown,
    generationBreakdown,
    pageVisits24h,
    avgDwell,
    recentEvents,
    topPaths,
  ] = await Promise.all([
    prisma.wordList.count(),
    prisma.word.count(),
    prisma.wordPhoneme.count(),
    prisma.activity.count(),

    // Most-used activity type (from saved Activity rows)
    prisma.activity.groupBy({
      by: ["type"],
      _count: { _all: true },
    }),

    // Successful vs failed generations
    prisma.generationEvent.groupBy({
      by: ["success"],
      _count: { _all: true },
    }),

    // Page visits in last 24h
    prisma.pageVisit.count({
      where: { createdAt: { gte: last24h } },
    }),

    // Average dwell time (all time)
    prisma.pageVisit.aggregate({
      _avg: { dwellMs: true },
      _count: { dwellMs: true },
    }),

    // Recent activity log entries (last 20)
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),

    // Top 5 paths by visit count (last 7 days)
    prisma.pageVisit.groupBy({
      by: ["path"],
      where: { createdAt: { gte: last7d } },
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
      take: 5,
    }),
  ]);

  const successCount =
    generationBreakdown.find((g) => g.success === true)?._count._all ?? 0;
  const failedCount =
    generationBreakdown.find((g) => g.success === false)?._count._all ?? 0;

  // Determine most-used activity type
  const mostUsedActivityType =
    activityBreakdown.sort((a, b) => b._count._all - a._count._all)[0]?.type ??
    null;

  return {
    totals: {
      wordLists: totalWordLists,
      words: totalWords,
      phonemes: totalPhonemes,
      activities: totalActivities,
    },
    generations: {
      successful: successCount,
      failed: failedCount,
      total: successCount + failedCount,
    },
    activityByType: activityBreakdown.map((row) => ({
      type: row.type,
      count: row._count._all,
    })),
    mostUsedActivityType,
    pageVisits24h,
    avgDwellMs: avgDwell._avg.dwellMs ?? 0,
    avgDwellSamples: avgDwell._count.dwellMs,
    recentEvents,
    topPaths: topPaths.map((row) => ({
      path: row.path,
      count: row._count._all,
    })),
  };
}

/**
 * Collect active alerts based on current data state.
 */
export async function getAlerts() {
  const alerts: {
    level: "info" | "warn" | "error";
    title: string;
    description: string;
  }[] = [];

  // Empty word lists
  const emptyLists = await prisma.wordList.findMany({
    where: { words: { none: {} } },
    select: { id: true, name: true },
  });
  if (emptyLists.length > 0) {
    alerts.push({
      level: "warn",
      title: `${emptyLists.length} empty word list${emptyLists.length > 1 ? "s" : ""}`,
      description: `Lists with no words: ${emptyLists.map((l) => l.name).join(", ")}`,
    });
  }

  // Failed generations in the last 24h
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const failed24h = await prisma.generationEvent.count({
    where: { success: false, createdAt: { gte: last24h } },
  });
  if (failed24h > 0) {
    alerts.push({
      level: failed24h > 5 ? "error" : "warn",
      title: `${failed24h} failed generation${failed24h > 1 ? "s" : ""} in last 24h`,
      description: "Investigate recent HTML export failures.",
    });
  }

  // Recent error-level logs
  const recentErrors = await prisma.activityLog.count({
    where: { level: "error", createdAt: { gte: last24h } },
  });
  if (recentErrors > 0) {
    alerts.push({
      level: "error",
      title: `${recentErrors} error log${recentErrors > 1 ? "s" : ""} in last 24h`,
      description: "Check the activity log for details.",
    });
  }

  // Healthy state if no issues
  if (alerts.length === 0) {
    alerts.push({
      level: "info",
      title: "All systems healthy",
      description: "No warnings or errors detected in the last 24 hours.",
    });
  }

  return alerts;
}