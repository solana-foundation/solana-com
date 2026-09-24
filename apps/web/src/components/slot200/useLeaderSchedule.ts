"use client";

import { useEffect, useRef, useState } from "react";

export interface LeaderEntry {
  id: string;
  name: string;
  city: string;
  ll: [number, number] | null;
  client: string;
  up: boolean;
  stakePct: number;
}

export interface NetworkTotals {
  validators: number;
  stakeM: number;
  upgraded: { validators: number; stakePct: number };
}

interface ScheduleResponse {
  scheduleStart: number;
  slots: number[];
  dict: LeaderEntry[];
  network: NetworkTotals;
}

/**
 * The upcoming leader schedule plus everything attributable to a block's
 * producer. The 4,000-slot window covers ~27 minutes; refetched every 3, so
 * `lookup` almost never misses. Lookup is O(1) from the response arrays.
 */
export function useLeaderSchedule(): {
  network: NetworkTotals | null;
  lookup: (_slot: number) => LeaderEntry | null;
} {
  const [network, setNetwork] = useState<NetworkTotals | null>(null);
  const dataRef = useRef<ScheduleResponse | null>(null);
  const lookupRef = useRef((slot: number): LeaderEntry | null => {
    const d = dataRef.current;
    if (!d) return null;
    const i = slot - d.scheduleStart;
    if (i < 0 || i >= d.slots.length) return null;
    return d.dict[d.slots[i]] ?? null;
  });

  useEffect(() => {
    let alive = true;
    let loading = false;
    let controller: AbortController | null = null;
    async function load() {
      if (!alive || document.hidden || loading) return;
      loading = true;
      controller = new AbortController();
      try {
        const res = await fetch("/api/slot-time/schedule", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as ScheduleResponse;
        if (alive && data.slots?.length) {
          dataRef.current = data;
          setNetwork(data.network ?? null);
        }
      } catch {
        // keep the last schedule on failure
      } finally {
        loading = false;
        controller = null;
      }
    }

    const onVisibilityChange = () => {
      if (document.hidden) controller?.abort();
      else void load();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    void load();
    const refetch = setInterval(() => void load(), 180_000);
    return () => {
      alive = false;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearInterval(refetch);
      controller?.abort();
    };
  }, []);

  return { network, lookup: lookupRef.current };
}
