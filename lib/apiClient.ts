// Typed client for the Phoneme Activity Builder API.
// All frontend data fetching goes through here.

export interface ApiWordPhoneme {
  id: number;
  wordId: number;
  symbol: string;
  position: number;
}

export interface ApiWord {
  id: number;
  listId: number;
  english: string;
  transcription: string;
  createdAt: string;
  updatedAt: string;
  phonemes: ApiWordPhoneme[];
  list?: { id: number; name: string };
}

export interface ApiWordList {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  words?: ApiWord[];
  _count?: { words: number; activities: number };
}

export interface ApiActivity {
  id: number;
  name: string;
  type: "WORDLE" | "WORDSEARCH";
  difficulty: string;
  rows: number | null;
  cols: number | null;
  maxAttempts: number | null;
  listId: number;
  createdAt: string;
  updatedAt: string;
  list?: { id: number; name: string };
  words?: { word: ApiWord }[];
  _count?: { words: number };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success || json.data === undefined) {
    throw new Error(
      typeof json.error === "string"
        ? json.error
        : `Request failed with status ${res.status}`
    );
  }

  return json.data;
}

// ---------- WordLists ----------

export const getWordLists = () =>
  request<ApiWordList[]>("/api/wordlists");

export const getWordList = (id: number) =>
  request<ApiWordList>(`/api/wordlists/${id}`);

export const createWordList = (data: { name: string; description?: string }) =>
  request<ApiWordList>("/api/wordlists", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateWordList = (
  id: number,
  data: { name?: string; description?: string }
) =>
  request<ApiWordList>(`/api/wordlists/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteWordList = (id: number) =>
  request<{ deleted: boolean; id: number }>(`/api/wordlists/${id}`, {
    method: "DELETE",
  });

// ---------- Words ----------

export const getWords = (listId?: number) =>
  request<ApiWord[]>(
    listId ? `/api/words?listId=${listId}` : "/api/words"
  );

export const getWord = (id: number) =>
  request<ApiWord>(`/api/words/${id}`);

export const createWord = (data: {
  listId: number;
  english: string;
  transcription: string;
  phonemes: string[];
}) =>
  request<ApiWord>("/api/words", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateWord = (
  id: number,
  data: {
    english?: string;
    transcription?: string;
    phonemes?: string[];
    listId?: number;
  }
) =>
  request<ApiWord>(`/api/words/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteWord = (id: number) =>
  request<{ deleted: boolean; id: number }>(`/api/words/${id}`, {
    method: "DELETE",
  });

// ---------- Activities ----------

export const getActivities = () =>
  request<ApiActivity[]>("/api/activities");

export const getActivity = (id: number) =>
  request<ApiActivity>(`/api/activities/${id}`);

export const createActivity = (data: {
  name: string;
  type: "WORDLE" | "WORDSEARCH";
  difficulty?: "easy" | "medium" | "hard";
  rows?: number;
  cols?: number;
  maxAttempts?: number;
  listId: number;
  wordIds?: number[];
}) =>
  request<ApiActivity>("/api/activities", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteActivity = (id: number) =>
  request<{ deleted: boolean; id: number }>(`/api/activities/${id}`, {
    method: "DELETE",
  });

// ---------- Adapters ----------
// Convert API shapes to the PhonemeWord type used by the game engines.

import type { PhonemeWord } from "@/types";

export function toPhonemeWord(apiWord: ApiWord): PhonemeWord {
  const sorted = [...apiWord.phonemes].sort((a, b) => a.position - b.position);
  return {
    word: apiWord.english,
    transcription: apiWord.transcription,
    phonemes: sorted.map((p) => p.symbol),
  };
}