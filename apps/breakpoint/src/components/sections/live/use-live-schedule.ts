"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AgendaItem } from "@/content/agenda/types";
import type { LiveSessionsPayload } from "@/content/live/agenda";
import {
  LIVE_POLL_INTERVAL_MS,
  LIVE_SESSIONS_API,
} from "@/content/live/streams";
import { calculateLiveSchedule } from "@/lib/live-sessions";

/**
 * In development, `?now=2026-11-16T10:05` freezes the clock so the live
 * layout can be checked on any date. Production ignores the parameter.
 */
function readPreviewNow(): number | null {
  if (process.env.NODE_ENV === "production") return null;
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("now");
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function useLiveSchedule(
  initialItems: AgendaItem[],
  initialNow: number,
) {
  const [items, setItems] = useState(initialItems);
  // Server minus client clock, so a wrong device clock does not move sessions.
  const offsetRef = useRef(0);
  const [previewNow, setPreviewNow] = useState<number | null>(null);
  const [now, setNow] = useState(initialNow);

  const tick = useCallback(() => {
    setNow(previewNow ?? Date.now() + offsetRef.current);
  }, [previewNow]);

  useEffect(() => {
    const preview = readPreviewNow();
    if (preview !== null) {
      setPreviewNow(preview);
      setNow(preview);
      return;
    }
    offsetRef.current = initialNow - Date.now();
    setNow(Date.now() + offsetRef.current);
  }, [initialNow]);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(LIVE_SESSIONS_API, { cache: "no-store" });
      if (!response.ok) return;
      const payload = (await response.json()) as LiveSessionsPayload;
      if (Array.isArray(payload.items)) setItems(payload.items);
      if (typeof payload.now === "number") {
        offsetRef.current = payload.now - Date.now();
      }
    } catch {
      // Keep the schedule already on screen; the next poll retries.
    } finally {
      tick();
    }
  }, [tick]);

  const schedule = useMemo(
    () => calculateLiveSchedule(items, now),
    [items, now],
  );

  useEffect(() => {
    if (previewNow !== null) return;

    let boundaryTimer: number | undefined;
    if (schedule.refreshInMs !== null) {
      boundaryTimer = window.setTimeout(refresh, schedule.refreshInMs);
    }
    const poll = window.setInterval(refresh, LIVE_POLL_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      if (boundaryTimer !== undefined) window.clearTimeout(boundaryTimer);
      window.clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [previewNow, refresh, schedule.refreshInMs, tick]);

  return { schedule, now };
}
