"use client";

import { useEffect, useState } from "react";

export interface CohortStats {
  validators: number;
  stakePct: number;
}

export interface LeaderSchedule {
  /** Absolute slot the bit string starts at. */
  scheduleStart: number;
  /** One char per upcoming slot: "1" = upgraded leader, "0" = legacy. */
  bits: string;
  upgraded: CohortStats;
  legacy: CohortStats;
}

/**
 * The live cohort schedule for the hero: refetched every 5 minutes (the
 * 4,000-slot window covers ~27 minutes, so there is generous overlap).
 * The returned object is referentially stable between fetches.
 */
export function useLeaderSchedule(): { schedule: LeaderSchedule | null } {
  const [schedule, setSchedule] = useState<LeaderSchedule | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/slot-time/schedule");
        if (!res.ok) throw new Error();
        const data = (await res.json()) as LeaderSchedule;
        if (alive && data.bits) setSchedule(data);
      } catch {
        // keep the last schedule on failure
      }
    }
    load();
    const refetch = setInterval(load, 300_000);
    return () => {
      alive = false;
      clearInterval(refetch);
    };
  }, []);

  return { schedule };
}
