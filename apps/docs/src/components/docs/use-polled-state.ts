"use client";

import { useEffect, useState } from "react";

/**
 * Polls a JSON endpoint, pausing while the tab is hidden and keeping the last
 * good payload on failure. `failed` is true while the latest attempt failed
 * (a non-2xx answer or a network error), so a panel can say the data is
 * unavailable instead of waiting forever.
 */
export function usePolledState<T>(
  url: string,
  intervalMs: number,
  mapResponse?: (data: T, response: Response) => T,
): { data: T | null; failed: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [failed, setFailed] = useState(false);

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
          if (alive) {
            setData(mapResponse ? mapResponse(json, res) : json);
            setFailed(false);
          }
        } else if (alive) setFailed(true);
      } catch {
        // keep last payload; aborts are expected when a tab is backgrounded
        if (alive && !controller?.signal.aborted) setFailed(true);
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

  return { data, failed };
}

/** One block in /api/slot-time/tip. */
export interface TipBlock {
  slot: number;
  /** Transactions in the block, validator votes included. */
  txs: number;
}

/** /api/slot-time/tip: the confirmed tip and the blocks just behind it. */
export interface TipPayload {
  /** The confirmed tip when sampled. */
  tip: number;
  /** Blocks in the last 12 slots that the server has read, oldest first. */
  blocks: TipBlock[];
  /** Slots in that window with no block (skipped by their leader). */
  skipped: number[];
  serverTime: number;
}
