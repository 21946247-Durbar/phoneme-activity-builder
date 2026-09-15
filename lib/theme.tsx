"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "phoneme_theme";
const COOKIE_KEY = "phoneme_theme";

function readStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "system";
  const stored = (localStorage.getItem(STORAGE_KEY) ||
    document.cookie.match(new RegExp(`(?:^|; )${COOKIE_KEY}=([^;]*)`))?.[1]) as ThemeMode | null;
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveMode(mode: ThemeMode): ResolvedTheme {
  if (mode === "system") return getSystemTheme();
  return mode;
}

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

function persistMode(mode: ThemeMode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
  document.cookie = `${COOKIE_KEY}=${mode}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  // Initial mount: read stored preference and apply
  useEffect(() => {
    const initial = readStoredMode();
    const resolved = resolveMode(initial);
    setModeState(initial);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []);

  // Listen for OS theme changes when in "system" mode
  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const resolved = getSystemTheme();
      setResolvedTheme(resolved);
      applyTheme(resolved);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);

  const setMode = (newMode: ThemeMode) => {
    const resolved = resolveMode(newMode);
    setModeState(newMode);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    persistMode(newMode);
  };

  const toggle = () => {
    // Cycle: light → dark → system → light
    const next: ThemeMode = mode === "light" ? "dark" : mode === "dark" ? "system" : "light";
    setMode(next);
  };

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}