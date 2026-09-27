"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "phoneme_session_id";

/**
 * Generates (or retrieves) an anonymous session ID for the browser tab.
 */
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        "s-" +
        Math.random().toString(36).slice(2, 10) +
        "-" +
        Date.now().toString(36);
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "s-anon";
  }
}

/**
 * Tracks page visits and dwell time. Mounted once in the root layout.
 *
 * - On route change: POST to /api/track/page-visit
 * - On unmount or route change: PATCH the same visit with the dwell time
 */
export default function PageTracker() {
  const pathname = usePathname();
  const visitIdRef = useRef<number | null>(null);
  const startRef = useRef<number>(Date.now());
  const pathRef = useRef<string>(pathname);

  useEffect(() => {
    // Don't track API routes or Next internals
    if (
      !pathname ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next")
    ) {
      return;
    }

    const startVisit = async () => {
      try {
        const res = await fetch("/api/track/page-visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: getSessionId(),
            path: pathname,
          }),
        });
        const json = await res.json();
        if (json?.success && json?.data?.visitId) {
          visitIdRef.current = json.data.visitId;
          startRef.current = Date.now();
          pathRef.current = pathname;
        }
      } catch {
        // Silent — tracking is best-effort
      }
    };

    const endVisit = () => {
      const visitId = visitIdRef.current;
      if (!visitId) return;
      const dwellMs = Date.now() - startRef.current;

      // Use sendBeacon for reliability on page unload
      const payload = JSON.stringify({ visitId, dwellMs });
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            "/api/track/page-visit",
            new Blob([payload], { type: "application/json" })
          );
        } else {
          fetch("/api/track/page-visit", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
          });
        }
      } catch {
        // ignore
      }
      visitIdRef.current = null;
    };

    startVisit();

    return () => {
      endVisit();
    };
  }, [pathname]);

  // Track tab visibility — end visit when tab hidden, restart when visible
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        const visitId = visitIdRef.current;
        if (visitId) {
          const dwellMs = Date.now() - startRef.current;
          fetch("/api/track/page-visit", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ visitId, dwellMs }),
            keepalive: true,
          }).catch(() => {});
          visitIdRef.current = null;
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Handle page unload via beforeunload
  useEffect(() => {
    const handleUnload = () => {
      const visitId = visitIdRef.current;
      if (!visitId) return;
      const dwellMs = Date.now() - startRef.current;
      const payload = JSON.stringify({ visitId, dwellMs });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/track/page-visit",
          new Blob([payload], { type: "application/json" })
        );
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  return null;
}