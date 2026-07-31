"use client";

import { useEffect, useState } from "react";

export const TARGET_EPOCH = 1000;

interface EpochResponse {
  epoch: number;
  slotIndex: number;
  slotsInEpoch: number;
  absoluteSlot: number;
  avgSlotMs: number;
  slotsRemaining: number;
  targetEpoch: number;
}

interface Snapshot {
  data: EpochResponse;
  fetchedAt: number;
}

export interface LiveEpoch {
  epoch: number;
  /** True once mainnet has crossed the target epoch. */
  arrived: boolean;
  slotIndex: number;
  slotsInEpoch: number;
  absoluteSlot: number;
  slotsRemaining: number;
  msRemaining: number;
  eta: Date;
  /** 0..1 through the current epoch. */
  progress: number;
  targetEpoch: number;
}

/**
 * Live epoch snapshot shared by the homepage hero and the /epoch1000 page:
 * refetched every minute, interpolated between ticks at the average slot time.
 */
export function useEpochData(): { live: LiveEpoch | null; error: boolean } {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/epoch1000/epoch");
        if (!res.ok) throw new Error();
        const data = (await res.json()) as EpochResponse;
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

  if (!snap) return { live: null, error };

  const { data, fetchedAt } = snap;
  const slotsElapsed =
    Math.max(0, (now || fetchedAt) - fetchedAt) / data.avgSlotMs;
  const slotsRemaining = Math.max(
    0,
    Math.floor(data.slotsRemaining - slotsElapsed),
  );
  const arrived = slotsRemaining <= 0 || data.epoch >= data.targetEpoch;
  const epoch = arrived ? Math.max(data.epoch, data.targetEpoch) : data.epoch;
  const slotIndex = Math.min(
    data.slotsInEpoch - 1,
    Math.floor(data.slotIndex + slotsElapsed),
  );
  const msRemaining = slotsRemaining * data.avgSlotMs;

  return {
    live: {
      epoch,
      arrived,
      slotIndex,
      slotsInEpoch: data.slotsInEpoch,
      absoluteSlot: data.absoluteSlot + Math.floor(slotsElapsed),
      slotsRemaining,
      msRemaining,
      eta: new Date(Date.now() + msRemaining),
      progress: arrived ? 1 : slotIndex / data.slotsInEpoch,
      targetEpoch: data.targetEpoch,
    },
    error,
  };
}
