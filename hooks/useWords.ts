"use client";

import { useEffect, useState, useCallback } from "react";
import { getWords, type ApiWord } from "@/lib/apiClient";

export function useWords(listId?: number) {
  const [words, setWords] = useState<ApiWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWords(listId);
      setWords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load words");
    } finally {
      setLoading(false);
    }
  }, [listId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { words, loading, error, reload };
}