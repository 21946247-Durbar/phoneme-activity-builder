"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

// ---------- Types ----------

interface Metrics {
  totals: {
    wordLists: number;
    words: number;
    phonemes: number;
    activities: number;
  };
  generations: {
    successful: number;
    failed: number;
    total: number;
  };
  activityByType: { type: string; count: number }[];
  mostUsedActivityType: string | null;
  pageVisits24h: number;
  avgDwellMs: number;
  avgDwellSamples: number;
  recentEvents: {
    id: number;
    level: string;
    source: string;
    message: string;
    createdAt: string;
  }[];
  topPaths: { path: string; count: number }[];
}

interface Alert {
  level: "info" | "warn" | "error";
  title: string;
  description: string;
}

interface MetricsResponse {
  metrics: Metrics;
  alerts: Alert[];
}

// ---------- Small components ----------

function KpiCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "success" | "danger" | "warn";
}) {
  const toneClasses: Record<string, string> = {
    default: "border-gray-200 dark:border-gray-700",
    success:
      "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20",
    danger:
      "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20",
    warn: "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20",
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border ${toneClasses[tone]}`}
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
        {value}
      </p>
      {hint && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{hint}</p>
      )}
    </div>
  );
}

function AlertCard({ alert }: { alert: Alert }) {
  const styles: Record<string, string> = {
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300",
    warn: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300",
    error:
      "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300",
  };
  const icons: Record<string, string> = { info: "ℹ️", warn: "⚠️", error: "🚨" };

  return (
    <div className={`p-3 rounded-lg border ${styles[alert.level]}`}>
      <p className="font-semibold text-sm">
        {icons[alert.level]} {alert.title}
      </p>
      <p className="text-xs mt-1 opacity-80">{alert.description}</p>
    </div>
  );
}

function formatDuration(ms: number): string {
  if (!ms || ms < 1000) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}m ${rem}s`;
}

// ---------- Main page ----------

export default function DashboardPage() {
  const [data, setData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [healthStatus, setHealthStatus] = useState<"ok" | "down" | "unknown">(
    "unknown"
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [metricsRes, healthRes] = await Promise.all([
        fetch("/api/metrics").then((r) => r.json()),
        fetch("/api/health")
          .then((r) => (r.ok ? { status: "ok" } : { status: "down" }))
          .catch(() => ({ status: "down" })),
      ]);

      if (metricsRes.success) {
        setData(metricsRes.data);
      } else {
        setError(metricsRes.error || "Failed to load metrics");
      }
      setHealthStatus(healthRes.status === "ok" ? "ok" : "down");
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Auto-refresh every 30 seconds
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [load]);

  if (loading && !data) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Loading dashboard…</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-4 rounded-lg">
        <p className="font-semibold">Failed to load dashboard</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={load}
          className="mt-3 px-3 py-1 text-sm bg-red-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { metrics, alerts } = data;
  const successRate =
    metrics.generations.total > 0
      ? Math.round(
          (metrics.generations.successful / metrics.generations.total) * 100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            📊 Operations Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Live metrics, alerts, and activity log for the Phoneme Activity
            Builder.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
              healthStatus === "ok"
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                : healthStatus === "down"
                ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
            aria-live="polite"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                healthStatus === "ok"
                  ? "bg-green-500 animate-pulse"
                  : healthStatus === "down"
                  ? "bg-red-500"
                  : "bg-gray-400"
              }`}
            />
            <span>
              {healthStatus === "ok"
                ? "System healthy"
                : healthStatus === "down"
                ? "System down"
                : "Checking…"}
            </span>
          </div>
          <button
            onClick={load}
            className="px-3 py-1.5 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            aria-label="Refresh dashboard"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {lastUpdated && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Last updated: {lastUpdated.toLocaleTimeString()} · auto-refreshes every
          30s
        </p>
      )}

      {/* Alerts */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          🚨 Alerts
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {alerts.map((alert, i) => (
            <AlertCard key={i} alert={alert} />
          ))}
        </div>
      </section>

      {/* KPI Cards */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📈 System Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard label="Word lists" value={metrics.totals.wordLists} />
          <KpiCard label="Words" value={metrics.totals.words} />
          <KpiCard label="Phonemes" value={metrics.totals.phonemes} />
          <KpiCard label="Activities saved" value={metrics.totals.activities} />
          <KpiCard
            label="Page visits (24h)"
            value={metrics.pageVisits24h}
          />
          <KpiCard
            label="Avg time on page"
            value={formatDuration(metrics.avgDwellMs)}
            hint={
              metrics.avgDwellSamples > 0
                ? `${metrics.avgDwellSamples} samples`
                : "No data yet"
            }
          />
        </div>
      </section>

      {/* Generation stats */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🎯 HTML Generation
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <KpiCard
              label="Successful"
              value={metrics.generations.successful}
              tone="success"
            />
            <KpiCard
              label="Failed"
              value={metrics.generations.failed}
              tone={metrics.generations.failed > 0 ? "danger" : "default"}
            />
            <KpiCard label="Success rate" value={`${successRate}%`} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Total generation attempts: {metrics.generations.total}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🏆 Activity Usage
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Most-used activity type
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {metrics.mostUsedActivityType ?? "No data yet"}
              </p>
            </div>
            {metrics.activityByType.length > 0 && (
              <div className="space-y-1">
                {metrics.activityByType.map((row) => (
                  <div
                    key={row.type}
                    className="flex justify-between text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span>{row.type}</span>
                    <span className="font-mono">{row.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Top paths + recent events */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🔗 Top Pages (7d)
          </h3>
          {metrics.topPaths.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No page visits recorded yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {metrics.topPaths.map((p) => (
                <li
                  key={p.path}
                  className="flex justify-between text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="font-mono">{p.path}</span>
                  <span className="font-mono">{p.count} visits</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📝 Recent Activity
          </h3>
          {metrics.recentEvents.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No events logged yet.
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {metrics.recentEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="text-xs border-l-2 pl-2 border-gray-300 dark:border-gray-600"
                >
                  <p className="font-mono text-gray-500 dark:text-gray-400">
                    {new Date(ev.createdAt).toLocaleTimeString()} · {ev.source}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">{ev.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick links */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          🚀 Quick actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/word-lists"
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium"
          >
            Manage Word Lists
          </Link>
          <Link
            href="/wordle"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium"
          >
            Build Wordle
          </Link>
          <Link
            href="/word-search"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium"
          >
            Build Word Search
          </Link>
          <Link
  href="/activities"
  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium"
>
  Saved Activities
</Link>
          <a
            href="/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium"
          >
            /api/health
          </a>
        </div>
      </section>
    </div>
  );
}