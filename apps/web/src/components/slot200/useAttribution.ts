"use client";

import { useEffect, useRef, useState } from "react";
import type { LeaderEntry } from "./useLeaderSchedule";
import type { SlotEvent } from "./useSlotFeed";

export interface ClientRow {
  client: string;
  slots: number;
  avg: number;
  median: number;
}

export interface ValidatorRow {
  id: string;
  name: string;
  city: string;
  client: string;
  stakePct: number;
  slots: number;
  avg: number;
  /** total gap time beyond the session median, ms */
  excessMs: number;
}

export interface Attribution {
  clients: ClientRow[];
  validators: ValidatorRow[];
  netMedian: number | null;
  attributed: number;
}

const EMPTY: Attribution = {
  clients: [],
  validators: [],
  netMedian: null,
  attributed: 0,
};

function median(sorted: number[]): number {
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Session-scoped gap attribution: every measured block gap credited to the
 * producing validator (and its client family) via the leader schedule.
 * Unlike the perp200 relay this page has no 29-hour server memory — counting
 * starts when the viewer tunes in, and every label says so.
 */
export function useAttribution(
  subscribe: (_fn: (_ev: SlotEvent) => void) => () => void,
  lookup: (_slot: number) => LeaderEntry | null,
): Attribution {
  const [snap, setSnap] = useState<Attribution>(EMPTY);
  const byClient = useRef(new Map<string, { sum: number; gaps: number[] }>());
  const byLeader = useRef(
    new Map<string, { entry: LeaderEntry; sum: number; count: number }>(),
  );
  const allGaps = useRef<number[]>([]);
  const dirty = useRef(false);

  useEffect(
    () =>
      subscribe((ev) => {
        if (ev.dt === null || !ev.measured) return;
        const leader = lookup(ev.slot);
        if (!leader) return;
        const c = byClient.current.get(leader.client) ?? { sum: 0, gaps: [] };
        c.sum += ev.dt;
        c.gaps.push(ev.dt);
        if (c.gaps.length > 2000) c.gaps.splice(0, 500);
        byClient.current.set(leader.client, c);
        const v = byLeader.current.get(leader.id) ?? {
          entry: leader,
          sum: 0,
          count: 0,
        };
        v.sum += ev.dt;
        v.count++;
        byLeader.current.set(leader.id, v);
        allGaps.current.push(ev.dt);
        if (allGaps.current.length > 6000) allGaps.current.splice(0, 1000);
        dirty.current = true;
      }),
    [subscribe, lookup],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      if (!dirty.current) return;
      dirty.current = false;
      const sortedAll = [...allGaps.current].sort((a, b) => a - b);
      const netMedian = sortedAll.length ? median(sortedAll) : null;

      const clients: ClientRow[] = [...byClient.current.entries()]
        .map(([client, { sum, gaps }]) => ({
          client,
          slots: gaps.length,
          avg: sum / gaps.length,
          median: median([...gaps].sort((a, b) => a - b)),
        }))
        .sort((a, b) => a.avg - b.avg);

      const validators: ValidatorRow[] = [...byLeader.current.values()]
        .filter((v) => v.count >= 6)
        .map((v) => ({
          id: v.entry.id,
          name: v.entry.name,
          city: v.entry.city,
          client: v.entry.client,
          stakePct: v.entry.stakePct,
          slots: v.count,
          avg: v.sum / v.count,
          excessMs: netMedian !== null ? v.sum - v.count * netMedian : 0,
        }))
        .sort((a, b) => b.excessMs - a.excessMs);

      setSnap({
        clients,
        validators,
        netMedian,
        attributed: sortedAll.length,
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return snap;
}
