"use client";

import { useEffect, useState } from "react";

/**
 * Small polled-JSON helper for the dashboard's slower panels (series,
 * sampled block). Pauses while the tab is hidden; keeps the last good
 * payload on failure.
 */
export function usePolled<T>(url: string, intervalMs: number): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    async function load() {
      if (!document.hidden) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const json = (await res.json()) as T;
            if (alive) setData(json);
          }
        } catch {
          // keep last payload
        }
      }
      if (alive) timer = setTimeout(load, intervalMs);
    }
    void load();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [url, intervalMs]);

  return data;
}

export interface SeriesPoint {
  t: number;
  ms: number;
  tps: number;
}

export interface BlockSample {
  slot: number;
  blockTime: number | null;
  txs: number;
  votes: number;
  nonVotes: number;
  /** Total transaction fees in the block, lamports. */
  feeLamports?: number;
  /** Lamports landing on the known Jito tip accounts. */
  tipLamports?: number;
  /** Compute units consumed across the block. */
  cu?: number;
  /** cu as a percent of the block compute ceiling. */
  cuPct?: number;
  programs: { name: string; count: number }[];
  tape: { sig: string; p: string }[];
}
