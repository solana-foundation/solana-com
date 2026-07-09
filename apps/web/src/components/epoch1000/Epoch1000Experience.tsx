"use client";

import React, { useMemo, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import Odometer from "./Odometer";
import Reveal from "./Reveal";
import ThousandGrid from "./ThousandGrid";
import WalletChecker from "./WalletChecker";
import { useEpochData } from "./useEpochData";
import { tierFor } from "@/lib/epoch1000/tiers";
import type { CheckResult } from "@/lib/epoch1000/card-params";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

interface Props {
  title: React.ReactNode;
  description: string;
}

/**
 * The /epoch1000 page body: live odometer, scrubbable thousand-epoch
 * timeline, and the wallet checker that paints your era onto it.
 */
export default function Epoch1000Experience({ title, description }: Props) {
  const { live, error } = useEpochData();
  const [result, setResult] = useState<CheckResult | null>(null);

  const tier = result ? tierFor(result.epochsSurvived) : null;
  const arrived = live?.arrived ?? false;
  const gridEpoch = live?.epoch ?? 999;

  const numberFormatter = useMemo(() => new Intl.NumberFormat("en-US"), []);

  const msRemaining = live?.msRemaining ?? 0;
  const days = Math.floor(msRemaining / 86_400_000);
  const hours = Math.floor((msRemaining % 86_400_000) / 3_600_000);
  const mins = Math.floor((msRemaining % 3_600_000) / 60_000);
  const secs = Math.floor((msRemaining % 60_000) / 1000);

  return (
    <div className="flex flex-col gap-16 sm:gap-24">
      {/* ── The odometer — owns the first view pane ──────────────────── */}
      <section className="flex min-h-[calc(100svh-230px)] flex-col items-center text-center">
        <div className="my-auto flex flex-col items-center gap-6 sm:gap-8">
          <p
            className="font-brand-mono text-xs sm:text-sm tracking-[0.2em] text-ep-dust tabular-nums"
            aria-live="polite"
          >
            {live ? (
              <>
                <span className="ep-live-dot mr-2 inline-block h-2 w-2 rounded-full bg-[#14f195] align-middle" />
                LIVE FROM MAINNET · SLOT{" "}
                {numberFormatter.format(live.absoluteSlot)}
              </>
            ) : error ? (
              "COULDN'T REACH MAINNET — REFRESH TO RETRY"
            ) : (
              <span className="animate-pulse">SYNCING WITH MAINNET…</span>
            )}
          </p>

          <Odometer
            value={live?.epoch ?? null}
            arrived={arrived}
            label={
              live
                ? `Current epoch: ${live.epoch} of 1000`
                : "Current epoch: syncing"
            }
            className="ep-odo--display"
          />

          <h1 className="font-black tracking-tight text-4xl sm:text-6xl leading-tight">
            {arrived ? (
              <>
                EPOCH <span className="text-sol-gradient">1000</span> IS HERE.
              </>
            ) : (
              title
            )}
          </h1>

          <p className="text-sm sm:text-base text-ep-dim max-w-xl">
            {arrived
              ? "One thousand epochs of mainnet-beta. 432,000,000,000 slots, give or take a fork. gm to everyone who was here for any of it."
              : description}
          </p>

          {live && !arrived && (
            <div className="w-full max-w-2xl flex flex-col gap-3">
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-[width] duration-300 ease-linear"
                  style={{
                    width: `${Math.max(0.4, (live.epoch + live.progress) / 10)}%`,
                    backgroundImage:
                      "linear-gradient(90deg, #9945ff 0%, #14f195 100%)",
                  }}
                />
              </div>
              <p className="font-brand-mono text-xs sm:text-sm text-ep-dust tabular-nums">
                T-MINUS{" "}
                <span className="text-ep-ink">
                  {numberFormatter.format(live.slotsRemaining)}
                </span>{" "}
                SLOTS · ≈{" "}
                <span className="text-ep-ink">
                  {days}d {pad(hours)}h {pad(mins)}m {pad(secs)}s
                </span>{" "}
                · ARRIVING ~
                {live.eta
                  .toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                  .toUpperCase()}
              </p>
            </div>
          )}
        </div>

        <a
          href="#timeline"
          className="ep-cue mt-6 pb-1 text-ep-dust hover:text-ep-ink transition-colors duration-200"
          aria-label="Scroll to the timeline"
        >
          <ChevronDownIcon aria-hidden className="size-5" strokeWidth={2} />
        </a>
      </section>

      {/* ── The thousand grid ────────────────────────────────────────── */}
      <Reveal>
        <section id="timeline" className="flex flex-col gap-5 scroll-mt-24">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-bold tracking-tight text-3xl sm:text-4xl">
              Six years, <span className="text-sol-gradient">one grid.</span>
            </h2>
            <p className="font-brand-mono text-[11px] sm:text-xs text-ep-dust tracking-[0.15em] whitespace-nowrap pb-1.5">
              EPOCH 0 → 999
            </p>
          </div>
          <ThousandGrid
            interactive
            currentEpoch={gridEpoch}
            firstEpoch={result?.firstEpoch}
            accent={tier?.color}
            accentLabel={
              result && tier
                ? `${tier.name} · EPOCH ${result.firstEpoch} → NOW`
                : undefined
            }
          />
          <p className="font-brand-mono text-[11px] sm:text-xs text-ep-dust">
            one cell per epoch · bright cells mark moments · check a wallet
            below to paint your era
          </p>
        </section>
      </Reveal>

      <Reveal>
        <WalletChecker onResult={setResult} />
      </Reveal>

      <footer className="border-t border-ep-edge pt-6 pb-2">
        <p className="font-brand-mono text-[11px] sm:text-xs text-ep-dust text-center tracking-[0.15em]">
          432,000 SLOTS PER EPOCH · ~2 DAYS EACH · MAINNET-BETA SINCE MARCH 2020
        </p>
      </footer>
    </div>
  );
}
