"use client";

import { useEffect, useRef, useState } from "react";

/** One live block landing (or a paced synthetic beat in degraded mode). */
export interface SlotEvent {
  slot: number;
  /** Measured arrival gap in ms; null when unknown (skips, degraded mode). */
  dt: number | null;
  /** True when this event is real per-slot data from the stream. */
  measured: boolean;
}

export type FeedStatus = "connecting" | "live" | "degraded";

export interface FeedState {
  status: FeedStatus;
  slot: number;
  /** Last measured block gap (150–1500 ms window, like the source page). */
  lastDt: number | null;
  avg1m: number | null;
  avg10m: number | null;
  /** Non-vote transactions per second, last ~2 minutes. */
  tps: number | null;
  epoch: number | null;
  epochEndSlot: number | null;
  /** Slots produced since this page connected. */
  gained: number;
  /** Wall-clock ms when the feed first went live. */
  sinceAt: number | null;
}

const INITIAL: FeedState = {
  status: "connecting",
  slot: 0,
  lastDt: null,
  avg1m: null,
  avg10m: null,
  tps: null,
  epoch: null,
  epochEndSlot: null,
  gained: 0,
  sinceAt: null,
};

type Listener = (_ev: SlotEvent) => void;

/**
 * The one live feed the whole dashboard runs on. Primary path: SSE from
 * /api/slot-time/stream (server-side slotSubscribe bridge). If the stream
 * can't establish, degrade to the polled /api/slot-time snapshot and pace
 * synthetic beats at the measured average — clearly marked unmeasured so the
 * attribution tables never accumulate fake gaps.
 *
 * React state updates once per slot (~2.5 Hz). Imperative consumers (map
 * pulses, audio, tapes, the tick chart) register via `subscribe` and are
 * called synchronously on each event.
 */
export function useSlotFeed(): {
  feed: FeedState;
  subscribe: (_fn: Listener) => () => void;
} {
  const [feed, setFeed] = useState<FeedState>(INITIAL);
  const listeners = useRef<Set<Listener>>(new Set());
  const subscribeRef = useRef((fn: Listener) => {
    listeners.current.add(fn);
    return () => {
      listeners.current.delete(fn);
    };
  });

  useEffect(() => {
    let alive = true;
    let es: EventSource | null = null;
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let beatTimer: ReturnType<typeof setTimeout> | null = null;
    let pollController: AbortController | null = null;
    let degradedRetryAt = 0;

    const state = { ...INITIAL };
    let startSlot = 0;

    const emit = (ev: SlotEvent) => {
      listeners.current.forEach((fn) => {
        try {
          fn(ev);
        } catch {
          // one broken consumer must not stall the feed
        }
      });
    };
    const push = () => {
      if (alive) setFeed({ ...state });
    };

    const onSlot = (slot: number, dt: number | null, measured: boolean) => {
      if (slot <= state.slot) return;
      if (!startSlot) startSlot = slot;
      state.slot = slot;
      state.gained = slot - startSlot;
      if (state.sinceAt === null) state.sinceAt = Date.now();
      const clean = dt !== null && dt >= 150 && dt <= 1500;
      if (measured && clean) state.lastDt = Math.round(dt!);
      emit({ slot, dt: measured && clean ? dt : null, measured });
      push();
    };

    // ── degraded mode: polled snapshot + paced synthetic beats ──
    const degrade = () => {
      if (!alive || document.hidden || pollTimer) return;
      state.status = "degraded";
      push();
      const poll = async () => {
        if (!alive || document.hidden) return;
        const controller = new AbortController();
        pollController = controller;
        try {
          const res = await fetch("/api/slot-time", {
            signal: controller.signal,
          });
          if (!res.ok) throw new Error();
          const d = (await res.json()) as {
            epoch: number;
            absoluteSlot: number;
            avgSlotMs: number;
          };
          state.epoch = d.epoch;
          state.avg1m = d.avgSlotMs;
          state.avg10m = d.avgSlotMs;
          if (d.absoluteSlot > state.slot) onSlot(d.absoluteSlot, null, false);
        } catch {
          // keep pacing on the last known average
        } finally {
          if (pollController === controller) pollController = null;
        }
      };
      void poll();
      pollTimer = setInterval(poll, 30_000);
      const beat = () => {
        if (!alive) return;
        if (state.slot) onSlot(state.slot + 1, null, false);
        beatTimer = setTimeout(beat, state.avg1m ?? 400);
      };
      beatTimer = setTimeout(beat, 400);
      // periodically try to get the real stream back
      degradedRetryAt = Date.now() + 60_000;
    };

    const stopDegraded = () => {
      if (pollTimer) clearInterval(pollTimer);
      pollTimer = null;
      if (beatTimer) clearTimeout(beatTimer);
      beatTimer = null;
      pollController?.abort();
      pollController = null;
    };

    // ── primary: the SSE stream ──
    const connect = () => {
      if (!alive || document.hidden || es) return;
      const next = new EventSource("/api/slot-time/stream");
      es = next;
      next.onmessage = (msg) => {
        if (es !== next) return;
        let d: Record<string, unknown>;
        try {
          d = JSON.parse(msg.data);
        } catch {
          return;
        }
        if (d.type === "err") {
          next.close();
          es = null;
          degrade();
          return;
        }
        if (state.status !== "live") {
          stopDegraded();
          state.status = "live";
        }
        if (d.type === "snap") {
          if (typeof d.epoch === "number") state.epoch = d.epoch;
          if (typeof d.epochEndSlot === "number")
            state.epochEndSlot = d.epochEndSlot;
          if (typeof d.avg1m === "number") state.avg1m = d.avg1m;
          if (typeof d.avg10m === "number") state.avg10m = d.avg10m;
          if (typeof d.tps === "number") state.tps = d.tps;
          if (typeof d.slot === "number" && d.slot > state.slot)
            state.slot = d.slot;
          push();
          return;
        }
        if (typeof d.avg1m === "number") state.avg1m = d.avg1m;
        if (typeof d.s === "number")
          onSlot(d.s, typeof d.dt === "number" ? d.dt : null, true);
      };
      next.onerror = () => {
        if (es !== next) return;
        // EventSource retries by itself; if we were never live, or the
        // degraded fallback is due for a retry window, keep both running
        if (state.status === "connecting" && !document.hidden) degrade();
      };
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        const current = es;
        es = null;
        current?.close();
        stopDegraded();
        state.status = "connecting";
        push();
        return;
      }
      state.status = "connecting";
      push();
      connect();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    connect();

    // if we've been degraded for a while, retry the stream
    const retry = setInterval(() => {
      if (!alive || document.hidden || state.status === "live") return;
      if (degradedRetryAt && Date.now() >= degradedRetryAt) {
        degradedRetryAt = Date.now() + 60_000;
        const current = es;
        es = null;
        current?.close();
        connect();
      }
    }, 10_000);

    return () => {
      alive = false;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearInterval(retry);
      stopDegraded();
      const current = es;
      es = null;
      current?.close();
    };
  }, []);

  return { feed, subscribe: subscribeRef.current };
}
