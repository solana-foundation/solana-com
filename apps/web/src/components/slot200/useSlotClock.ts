"use client";

import { useEffect, useState } from "react";
import { activeStage, StageStep } from "./stages";

interface SlotTimeResponse {
  epoch: number;
  absoluteSlot: number;
  avgSlotMs: number;
  serverTime: number;
}

export interface Snapshot {
  data: SlotTimeResponse;
  fetchedAt: number;
}

export interface SlotClock {
  /** Measured average slot time over the last ~10 minutes of mainnet. */
  avgSlotMs: number;
  /** Current slot, interpolated between refetches at the measured pace. */
  absoluteSlot: number;
  epoch: number;
  /** The SIMD-0525 step the network is measurably running right now. */
  stage: StageStep;
}

/**
 * One live snapshot shared by every section of the /200ms page: refetched
 * every minute, interpolated between ticks at the measured average slot time.
 * Same pattern as `useEpochData` (epoch1000) — the animations themselves run
 * on their own deterministic clocks; this only feeds the honest numbers.
 */
export function useSlotClock(): {
  live: SlotClock | null;
  /** Raw snapshot, referentially stable between refetches (for the canvas). */
  snap: Snapshot | null;
  error: boolean;
} {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/slot-time");
        if (!res.ok) throw new Error();
        const data = (await res.json()) as SlotTimeResponse;
        if (alive) {
          setSnap({ data, fetchedAt: Date.now() });
          setError(false);
        }
      } catch {
        // keep the last snapshot (or the syncing state) on failure
        if (alive) setError(true);
      }
    }
    load();
    const refetch = setInterval(load, 60_000);
    const tick = setInterval(() => setNow(Date.now()), 250);
    return () => {
      alive = false;
      clearInterval(refetch);
      clearInterval(tick);
    };
  }, []);

  if (!snap) return { live: null, snap: null, error };

  const { data, fetchedAt } = snap;
  const slotsElapsed =
    Math.max(0, (now || fetchedAt) - fetchedAt) / data.avgSlotMs;

  return {
    live: {
      avgSlotMs: data.avgSlotMs,
      absoluteSlot: data.absoluteSlot + Math.floor(slotsElapsed),
      epoch: data.epoch,
      stage: activeStage(data.avgSlotMs),
    },
    snap,
    error,
  };
}
