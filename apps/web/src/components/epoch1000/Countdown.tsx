"use client";

import { useEffect, useRef, useState } from "react";
import ThousandGrid from "./ThousandGrid";

interface EpochData {
  epoch: number;
  slotIndex: number;
  slotsInEpoch: number;
  avgSlotMs: number;
  slotsRemaining: number;
  targetEpoch: number;
}

interface Snapshot {
  data: EpochData;
  fetchedAt: number;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function Countdown() {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/epoch1000/epoch");
        if (!res.ok) throw new Error();
        const data = (await res.json()) as EpochData;
        if (alive) {
          setSnap({ data, fetchedAt: Date.now() });
          setError(false);
        }
      } catch {
        if (alive) setError(true);
      }
    }
    load();
    const refetch = setInterval(load, 60_000);
    timer.current = setInterval(() => setNow(Date.now()), 200);
    return () => {
      alive = false;
      clearInterval(refetch);
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  if (error && !snap) {
    return (
      <div className="text-ep-dust text-sm">
        Couldn&apos;t reach mainnet. Refresh to retry.
      </div>
    );
  }

  if (!snap) {
    return (
      <div className="text-ep-dust text-sm animate-pulse" aria-live="polite">
        syncing with mainnet…
      </div>
    );
  }

  const { data, fetchedAt } = snap;
  const slotsElapsed =
    Math.max(0, (now || fetchedAt) - fetchedAt) / data.avgSlotMs;
  const slotsRemaining = Math.max(
    0,
    Math.floor(data.slotsRemaining - slotsElapsed),
  );
  const arrived = slotsRemaining <= 0 || data.epoch >= data.targetEpoch;

  const estCurrentEpoch = arrived
    ? Math.max(data.epoch, data.targetEpoch)
    : data.epoch;
  const slotIndexNow = Math.min(
    data.slotsInEpoch - 1,
    Math.floor(data.slotIndex + slotsElapsed),
  );

  const msRemaining = slotsRemaining * data.avgSlotMs;
  const days = Math.floor(msRemaining / 86_400_000);
  const hours = Math.floor((msRemaining % 86_400_000) / 3_600_000);
  const mins = Math.floor((msRemaining % 3_600_000) / 60_000);
  const secs = Math.floor((msRemaining % 60_000) / 1000);
  const eta = new Date(Date.now() + msRemaining);

  if (arrived) {
    return (
      <section className="flex flex-col gap-10">
        <ThousandGrid currentEpoch={1000} />
        <div>
          <h2 className="font-black tracking-tight text-4xl sm:text-6xl md:text-7xl leading-tight">
            EPOCH <span className="text-sol-gradient">1000</span> IS HERE.
          </h2>
          <p className="mt-4 text-ep-dim">
            One thousand epochs of mainnet-beta. 432,000,000,000 slots, give or
            take a fork. gm to everyone who was here for any of it.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-10">
      <div className="flex items-baseline justify-between gap-4 font-mono text-xs sm:text-sm text-ep-dust">
        <span>
          LIVE · EPOCH{" "}
          <span className="text-ep-ink font-semibold">{estCurrentEpoch}</span>
          <span className="hidden sm:inline">
            {" "}
            · SLOT {slotIndexNow.toLocaleString("en-US")} /{" "}
            {data.slotsInEpoch.toLocaleString("en-US")}
          </span>
        </span>
        <span>{(estCurrentEpoch / 10).toFixed(1)}% COMPLETE</span>
      </div>

      <ThousandGrid currentEpoch={estCurrentEpoch} />

      <div>
        <div className="font-mono text-xs tracking-[0.35em] text-ep-dust">
          T-MINUS
        </div>
        <div
          className="font-black tracking-tight text-5xl sm:text-7xl leading-tight text-ep-ink tabular-nums"
          aria-live="off"
        >
          {slotsRemaining.toLocaleString("en-US")}
        </div>
        <div className="mt-1 text-sm sm:text-base text-ep-dim">
          slots until epoch 1000 ·{" "}
          <span className="text-ep-ink font-semibold tabular-nums">
            ≈ {days}d {pad(hours)}h {pad(mins)}m {pad(secs)}s
          </span>{" "}
          · arriving ~
          {eta.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>
    </section>
  );
}
