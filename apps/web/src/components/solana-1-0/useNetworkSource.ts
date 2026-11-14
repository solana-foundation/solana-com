"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLeaderSchedule } from "@/components/slot200/useLeaderSchedule";
import { useSlotFeed } from "@/components/slot200/useSlotFeed";
import { familyOf, type ClientId } from "./config";

/** One block landing, attributed to its builder where known. */
export interface BlockEvent {
  slot: number;
  /** Family whose light this block counts toward; null renders neutral. */
  family: ClientId | null;
  /** Sub-client name from the validator history program, when known. */
  client: string | null;
}

export type SourceStatus = "connecting" | "live" | "estimated" | "simulated";

export interface NetworkSource {
  status: SourceStatus;
  /** Rolling finality estimate in ms; null until enough samples arrive. */
  finalityMs: number | null;
  /** Average slot time in ms, for pacing the block stream. */
  slotMs: number;
  subscribe: (_fn: (_ev: BlockEvent) => void) => () => void;
}

const FINALITY_POLL_MS = 5_000;
const FINALITY_WINDOW = 20;
const FINALITY_STALE_MS = 15_000;
const DEFAULT_SLOT_MS = 200;

type Listener = (_ev: BlockEvent) => void;

function useListeners() {
  const listeners = useRef(new Set<Listener>());
  const api = useMemo(
    () => ({
      subscribe: (fn: Listener) => {
        listeners.current.add(fn);
        return () => {
          listeners.current.delete(fn);
        };
      },
      emit: (ev: BlockEvent) => {
        listeners.current.forEach((fn) => {
          try {
            fn(ev);
          } catch {
            // one broken consumer must not stall the feed
          }
        });
      },
    }),
    [],
  );
  return api;
}

/**
 * Live mainnet source. Slots come from the shared `/api/slot-time/stream`
 * bridge (server-side `slotSubscribe`, polled fallback), builders from the
 * leader schedule joined with the on-chain validator history program, the
 * same lookup `/200ms` uses.
 *
 * Finality is an estimate: the rolling mean gap between the processed and
 * finalized heads, multiplied by the measured slot time.
 */
export function useLiveSource(): NetworkSource {
  const { feed, subscribe: subscribeSlots } = useSlotFeed();
  const { lookup } = useLeaderSchedule();
  const { subscribe, emit } = useListeners();
  const [lagSlots, setLagSlots] = useState<number | null>(null);

  useEffect(
    () =>
      subscribeSlots((ev) => {
        const client = lookup(ev.slot)?.client ?? null;
        emit({ slot: ev.slot, family: familyOf(client), client });
      }),
    [subscribeSlots, lookup, emit],
  );

  useEffect(() => {
    let alive = true;
    let staleTimer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | null = null;
    let requestTimer: ReturnType<typeof setTimeout> | undefined;
    const samples: number[] = [];
    const poll = async () => {
      if (!alive || document.hidden || controller) return;
      const request = new AbortController();
      controller = request;
      requestTimer = setTimeout(() => request.abort(), FINALITY_POLL_MS);
      try {
        const res = await fetch("/api/solana-1-0/finality", {
          signal: request.signal,
        });
        if (!res.ok) return;
        const d = (await res.json()) as {
          processed?: number;
          finalized?: number;
        };
        if (typeof d.processed !== "number" || typeof d.finalized !== "number")
          return;
        const lag = d.processed - d.finalized;
        // a stalled or far-behind RPC node is not a finality reading
        if (lag < 0 || lag > 64) return;
        samples.push(lag);
        if (samples.length > FINALITY_WINDOW) samples.shift();
        if (alive && !request.signal.aborted) {
          setLagSlots(samples.reduce((a, b) => a + b, 0) / samples.length);
          clearTimeout(staleTimer);
          staleTimer = setTimeout(() => {
            samples.length = 0;
            setLagSlots(null);
          }, FINALITY_STALE_MS);
        }
      } catch {
        // The last estimate expires even if requests fail or hang.
      } finally {
        clearTimeout(requestTimer);
        controller = null;
      }
    };
    void poll();
    const timer = setInterval(poll, FINALITY_POLL_MS);
    return () => {
      alive = false;
      clearInterval(timer);
      clearTimeout(staleTimer);
      clearTimeout(requestTimer);
      controller?.abort();
    };
  }, []);

  const slotMs = feed.avg1m ?? feed.avg10m ?? DEFAULT_SLOT_MS;
  const finalityMs =
    lagSlots !== null && (feed.avg1m ?? feed.avg10m) !== null
      ? Math.round(Math.max(lagSlots, 0.5) * slotMs)
      : null;

  return {
    status:
      feed.status === "live"
        ? "live"
        : feed.status === "degraded"
          ? "estimated"
          : "connecting",
    finalityMs,
    slotMs,
    subscribe,
  };
}

const DEMO_START_SLOT = 461_204_117;
const DEMO_CLIENTS: [client: string, weight: number][] = [
  ["Jito", 0.34],
  ["Agave", 0.14],
  ["Agave BAM", 0.1],
  ["Harmonic Agave", 0.06],
  ["Firedancer", 0.2],
  ["Frankendancer", 0.08],
  ["FireBAM", 0.05],
  ["", 0.03],
];

/**
 * Simulated source behind `?demo=1`, for QA and screenshots: mainnet-like
 * cadence and client mix with no network access.
 */
export function useDemoSource(): NetworkSource {
  const { subscribe, emit } = useListeners();
  const [finalityMs, setFinalityMs] = useState<number | null>(204);

  useEffect(() => {
    let slot = DEMO_START_SLOT;
    let timer: ReturnType<typeof setTimeout>;
    let leader = "Jito";
    const tick = () => {
      if (!document.hidden) {
        slot += 1;
        // leaders hold four consecutive slots
        if (slot % 4 === 0) {
          let r = Math.random();
          for (const [client, weight] of DEMO_CLIENTS) {
            r -= weight;
            if (r <= 0) {
              leader = client;
              break;
            }
          }
        }
        emit({ slot, family: familyOf(leader), client: leader || null });
        if (slot % 12 === 0)
          setFinalityMs(Math.round(190 + Math.random() * 30));
      }
      timer = setTimeout(tick, 170 + Math.random() * 70);
    };
    timer = setTimeout(tick, 300);
    return () => clearTimeout(timer);
  }, [emit]);

  return {
    status: "simulated",
    finalityMs,
    slotMs: DEFAULT_SLOT_MS,
    subscribe,
  };
}
