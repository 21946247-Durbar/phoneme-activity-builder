"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getActivities, deleteActivity, type ApiActivity } from "@/lib/apiClient";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<ApiActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "WORDLE" | "WORDSEARCH">("ALL");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getActivities();
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this saved activity?")) return;
    try {
      await deleteActivity(id);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const filtered =
    filter === "ALL"
      ? activities
      : activities.filter((a) => a.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            📁 Saved Activities
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Browse and manage every activity configuration saved to the database.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["ALL", "WORDLE", "WORDSEARCH"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                filter === f
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {f === "ALL" ? "All" : f}
            </button>
          ))}
          <button
            onClick={load}
            className="px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {loading && !activities.length && (
        <p className="text-gray-600 dark:text-gray-400">Loading activities…</p>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            No saved activities yet. Generate a Wordle or Word Search to save one.
          </p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col gap-2"
            >
              <div className="flex justify-between items-start">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    a.type === "WORDLE"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                      : "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                  }`}
                >
                  {a.type}
                </span>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-xs text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 px-2 py-1 rounded"
                  aria-label={`Delete ${a.name}`}
                >
                  🗑️
                </button>
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                {a.name}
              </h3>

              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-0.5">
                <p>Difficulty: <span className="font-medium">{a.difficulty}</span></p>
                {a.rows && a.cols && (
                  <p>Grid: {a.rows} × {a.cols}</p>
                )}
                {a.maxAttempts && <p>Attempts: {a.maxAttempts}</p>}
                {a.list && <p>From list: {a.list.name}</p>}
                {a._count && <p>{a._count.words} word(s)</p>}
              </div>

              <Link
                href={a.type === "WORDLE" ? "/wordle" : "/word-search"}
                className="mt-auto text-center text-sm font-medium px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Open in builder
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}