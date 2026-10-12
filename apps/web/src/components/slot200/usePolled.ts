"use client";

import { useEffect, useState } from "react";

/**
 * Small polled-JSON helper for the dashboard's slower panels (series,
 * sampled block). Pauses while the tab is hidden; keeps the last good
 * payload on failure.
 */
export function usePolled<T>(
  url: string,
  intervalMs: number,
  mapResponse?: (data: T, response: Response) => T,
): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let controller: AbortController | null = null;
    let loading = false;

    const schedule = () => {
      if (!alive || document.hidden) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        void load();
      }, intervalMs);
    };

    async function load() {
      if (!alive || document.hidden || loading) return;
      loading = true;
      controller = new AbortController();
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (res.ok) {
          const json = (await res.json()) as T;
          if (alive) setData(mapResponse ? mapResponse(json, res) : json);
        }
      } catch {
        // keep last payload; aborts are expected when a tab is backgrounded
      } finally {
        loading = false;
        controller = null;
        schedule();
      }
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (timer) clearTimeout(timer);
        timer = null;
        controller?.abort();
      } else {
        void load();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    void load();
    return () => {
      alive = false;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (timer) clearTimeout(timer);
      controller?.abort();
    };
  }, [url, intervalMs, mapResponse]);

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
  serverTime: number;
  /** Age derived from HTTP Date and Age headers; null when unavailable. */
  ageAtReceiptMs?: number | null;
  receivedAtMonotonicMs?: number;
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
