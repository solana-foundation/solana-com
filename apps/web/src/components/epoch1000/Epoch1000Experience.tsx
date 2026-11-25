"use client";

import React, { useState } from "react";
import { ChevronDown as ChevronDownIcon } from "@boxicons/react/ChevronDown";
import Odometer from "./Odometer";
import Reveal from "./Reveal";
import ThousandGrid from "./ThousandGrid";
import WalletChecker from "./WalletChecker";
import { tierFor } from "@/lib/epoch1000/tiers";
import type { CheckResult } from "@/lib/epoch1000/card-params";

interface Props {
  title: React.ReactNode;
  description: string;
  copy: {
    /** Status line above the odometer, e.g. "Reached July 2026". */
    reached: string;
    odometerLabel: string;
    checkerCue: string;
    timelineTitle: string;
    timelineRange: string;
  };
}

/** The final epoch of the countdown; the page is preserved at this milestone. */
const MILESTONE_EPOCH = 1000;

/**
 * The archived /epoch1000 page body. Mainnet passed epoch 1,000 in July 2026,
 * so the odometer and timeline are fixed at the milestone instead of polling
 * mainnet; the wallet checker still paints a wallet's era onto the timeline.
 */
export default function Epoch1000Experience({
  title,
  description,
  copy,
}: Props) {
  const [result, setResult] = useState<CheckResult | null>(null);

  const tier = result ? tierFor(result.epochsSurvived) : null;

  return (
    <div className="flex flex-col gap-16 sm:gap-24">
      {/* ── The odometer - owns the first view pane ──────────────────── */}
      <section className="flex min-h-[calc(100svh-230px)] flex-col items-center text-center">
        <div className="my-auto flex flex-col items-center gap-6 sm:gap-8">
          <p className="font-brand-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-ep-dust tabular-nums">
            {copy.reached}
          </p>

          <Odometer
            value={MILESTONE_EPOCH}
            arrived
            label={copy.odometerLabel}
            className="ep-odo--display"
          />

          <h1 className="font-black tracking-tight text-4xl sm:text-6xl leading-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-ep-dim max-w-xl">
            {description}
          </p>
        </div>

        <a
          href="#checker"
          className="ep-cue mt-6 pb-1 text-ep-dust hover:text-ep-ink transition-colors duration-200"
          aria-label={copy.checkerCue}
        >
          <ChevronDownIcon aria-hidden className="size-5" />
        </a>
      </section>

      <Reveal>
        <WalletChecker onResult={setResult} />
      </Reveal>

      {/* ── The thousand grid ────────────────────────────────────────── */}
      <Reveal>
        <section id="timeline" className="flex flex-col gap-4 scroll-mt-24">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-bold tracking-tight text-3xl sm:text-4xl">
              {copy.timelineTitle}
            </h2>
            <p className="font-brand-mono text-[11px] sm:text-xs text-ep-dust tracking-[0.15em] uppercase whitespace-nowrap pb-1.5">
              {copy.timelineRange}
            </p>
          </div>
          <ThousandGrid
            interactive
            currentEpoch={MILESTONE_EPOCH - 1}
            firstEpoch={result?.firstEpoch}
            accent={tier?.color}
            accentLabel={
              result && tier
                ? `${tier.name} · EPOCH ${result.firstEpoch} TO NOW`
                : undefined
            }
          />
        </section>
      </Reveal>
    </div>
  );
}
