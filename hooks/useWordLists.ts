"use client";

import { useEffect, useState, useCallback } from "react";
import { getWordLists, type ApiWordList } from "@/lib/apiClient";

export function useWordLists() {
  const [lists, setLists] = useState<ApiWordList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWordLists();
      setLists(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load word lists");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { lists, loading, error, reload };
}