"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AgendaItem } from "@/content/agenda/types";
import type { LiveSessionsPayload } from "@/content/live/agenda";
import {
  LIVE_POLL_INTERVAL_MS,
  LIVE_SESSIONS_API,
} from "@/content/live/streams";
import {
  calculateLiveSchedule,
  parseEventInstant,
  REFRESH_LEAD_MS,
} from "@/lib/live-sessions";

/** Re-read the clock this long after a boundary so the labels have crossed it. */
const BOUNDARY_TICK_MARGIN_MS = 250;

/**
 * Outside the production deployment, `?now=2026-11-16T10:05` freezes the
 * clock so the live layout can be checked on any date. The value is London
 * time unless it names a zone (`Z` or `+01:00`). The server decides whether
 * the preview is allowed, because only it knows the deployment environment.
 */
function readPreviewNow(): number | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("now");
  return value ? parseEventInstant(value) : null;
}

export function useLiveSchedule(
  initialItems: AgendaItem[],
  initialNow: number,
  { allowClockPreview = false }: { allowClockPreview?: boolean } = {},
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
    const preview = allowClockPreview ? readPreviewNow() : null;
    if (preview !== null) {
      setPreviewNow(preview);
      setNow(preview);
      return;
    }
    offsetRef.current = initialNow - Date.now();
    setNow(Date.now() + offsetRef.current);
  }, [allowClockPreview, initialNow]);

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

    const timers: number[] = [];
    if (schedule.boundaryInMs !== null) {
      // Flip the labels locally once the boundary has passed, whatever the
      // network does; a fresh fetch shortly before it picks up late edits.
      timers.push(
        window.setTimeout(
          tick,
          schedule.boundaryInMs + BOUNDARY_TICK_MARGIN_MS,
        ),
      );
      const fetchInMs = schedule.boundaryInMs - REFRESH_LEAD_MS;
      if (fetchInMs > 0) timers.push(window.setTimeout(refresh, fetchInMs));
    }
    const poll = window.setInterval(refresh, LIVE_POLL_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      for (const timer of timers) window.clearTimeout(timer);
      window.clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [previewNow, refresh, schedule.boundaryInMs, tick]);

  return { schedule, now };
}

/**
 * The browser's IANA time zone, read after mount so server and first client
 * render agree (the server only knows London time).
 */
export function useViewerTimeZone(): string | null {
  const [timeZone, setTimeZone] = useState<string | null>(null);

  useEffect(() => {
    try {
      setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone ?? null);
    } catch {
      setTimeZone(null);
    }
  }, []);

  return timeZone;
}
