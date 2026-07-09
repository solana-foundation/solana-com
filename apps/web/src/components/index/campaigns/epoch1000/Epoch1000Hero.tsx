"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Container } from "@/component-library/container";
import "./epoch-hero.css";

export type Epoch1000HeroTranslations = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  cta: string;
  secondaryCta: string;
  statEpoch: string;
  statSlots: string;
  statProgress: string;
  statEta: string;
  liveLabel: string;
  offline: string;
};

interface EpochData {
  epoch: number;
  slotIndex: number;
  slotsInEpoch: number;
  absoluteSlot: number;
  avgSlotMs: number;
  slotsRemaining: number;
  targetEpoch: number;
}

interface Snapshot {
  data: EpochData;
  fetchedAt: number;
}

/** Live epoch snapshot, refetched every minute and interpolated between ticks. */
function useEpochData() {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/epoch1000/epoch");
        if (!res.ok) throw new Error();
        const data = (await res.json()) as EpochData;
        if (alive) setSnap({ data, fetchedAt: Date.now() });
      } catch {
        // keep the last snapshot (or the syncing state) on failure
      }
    }
    load();
    const refetch = setInterval(load, 60_000);
    const tick = setInterval(() => setNow(Date.now()), 250);
    return () => {
      alive = false;
      clearInterval(refetch);
      clearInterval(tick);
    };
  }, []);

  if (!snap) return null;

  const { data, fetchedAt } = snap;
  const slotsElapsed =
    Math.max(0, (now || fetchedAt) - fetchedAt) / data.avgSlotMs;
  const slotsRemaining = Math.max(
    0,
    Math.floor(data.slotsRemaining - slotsElapsed),
  );
  const arrived = slotsRemaining <= 0 || data.epoch >= data.targetEpoch;
  const epoch = arrived ? data.targetEpoch : data.epoch;
  const slotIndex = Math.min(
    data.slotsInEpoch - 1,
    Math.floor(data.slotIndex + slotsElapsed),
  );
  const absoluteSlot = data.absoluteSlot + Math.floor(slotsElapsed);
  const msRemaining = slotsRemaining * data.avgSlotMs;

  return {
    epoch,
    arrived,
    slotIndex,
    slotsInEpoch: data.slotsInEpoch,
    absoluteSlot,
    slotsRemaining,
    eta: new Date(Date.now() + msRemaining),
  };
}

const GRID_TOTAL = 1000;
const GRID_COLS = 50;
/** Recent epochs get a purple→green tint so the grid reads as a living gradient. */
const TINT_SPAN = 120;

function gridCellColor(i: number, currentEpoch: number): string {
  if (i >= currentEpoch) return "rgba(255,255,255,0.04)";
  const age = currentEpoch - i;
  if (age <= TINT_SPAN) {
    // interpolate sol-purple → sol-green as epochs approach the tip
    const t = 1 - age / TINT_SPAN;
    const r = Math.round(153 + (20 - 153) * t);
    const g = Math.round(69 + (241 - 69) * t);
    const b = Math.round(255 + (149 - 255) * t);
    return `rgba(${r},${g},${b},0.55)`;
  }
  return "rgba(255,255,255,0.14)";
}

/** Full-bleed backdrop: one cell per epoch, stagger-swept on load. */
function EpochGridBackdrop({ currentEpoch }: { currentEpoch: number }) {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 bottom-0 z-0 grid gap-[2px] opacity-70"
      style={{
        gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
        maskImage:
          "linear-gradient(to top, black 0%, rgba(0,0,0,0.75) 45%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to top, black 0%, rgba(0,0,0,0.75) 45%, transparent 100%)",
      }}
    >
      {Array.from({ length: GRID_TOTAL }, (_, i) => {
        const isTip = i === currentEpoch;
        return (
          <div
            key={i}
            className={`eh-cell aspect-square rounded-[1px] ${isTip ? "eh-tip" : ""}`}
            style={{
              backgroundColor: isTip
                ? "#14f195"
                : gridCellColor(i, currentEpoch),
              animationDelay: `${i * 1.5}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

const BLOCK_COUNT = 14;

/** Explorer-style strip: one square per confirmed slot, newest lands on the right. */
function BlockStream({ absoluteSlot }: { absoluteSlot: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {Array.from({ length: BLOCK_COUNT }, (_, i) => {
        const slot = absoluteSlot - (BLOCK_COUNT - 1 - i);
        const newest = i === BLOCK_COUNT - 1;
        return (
          <div
            key={slot}
            className={`eh-block h-3 w-3 rounded-[2px] ${newest ? "bg-solana-green" : ""}`}
            style={
              newest
                ? undefined
                : {
                    backgroundColor: `rgba(20,241,149,${0.12 + (0.5 * i) / BLOCK_COUNT})`,
                  }
            }
          />
        );
      })}
    </div>
  );
}

export const Epoch1000Hero: React.FC<{
  translations: Epoch1000HeroTranslations;
}> = ({ translations: t }) => {
  const live = useEpochData();
  // Freeze a sensible epoch for the backdrop before live data lands
  const gridEpoch = live?.epoch ?? 999;
  const progress = live ? live.slotIndex / live.slotsInEpoch : 0;

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-nd-inverse text-nd-high-em-text text-left border-b border-nd-border-light m-0"
      aria-labelledby="hero-title"
    >
      {/* ambient glows */}
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 700px 420px at 12% -6%, rgba(153,69,255,0.20), transparent 65%), radial-gradient(ellipse 800px 500px at 90% 20%, rgba(20,241,149,0.10), transparent 65%)",
        }}
      />
      <EpochGridBackdrop currentEpoch={gridEpoch} />

      <div className="flex min-h-[700px]">
        <Container className="relative z-10 flex flex-col justify-between pt-12 xl:pt-[165px] pb-10 md:pb-14 xl:pb-16 min-h-[calc(100vh-70px)] w-full">
          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-10 xl:gap-16 w-full">
            {/* copy */}
            <div className="max-w-3xl">
              <p
                className="eh-rise font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-nd-mid-em-text"
                style={{ animationDelay: "0ms" }}
              >
                {t.eyebrow}
              </p>
              <h1
                className="eh-rise nd-heading-2xl mt-5"
                id="hero-title"
                style={{ animationDelay: "100ms" }}
              >
                {t.title}
              </h1>
              <p
                className="eh-rise text-nd-mid-em-text font-medium max-md:mt-5 md:mt-6 nd-body-xl max-w-[520px]"
                style={{ animationDelay: "200ms" }}
              >
                {t.subtitle}
              </p>

              <div
                className="eh-rise mt-[52px] flex flex-col sm:flex-row sm:items-center gap-5"
                style={{ animationDelay: "300ms" }}
              >
                <Button
                  className="rounded-full md:h-[48px] nd-body-m !px-5 py-3 bg-nd-cta text-nd-inverse hover:!bg-nd-primary/90 tracking-[-0.16px] md:tracking-[-0.18px]"
                  size="lg"
                  asChild
                >
                  <Link href="/epoch1000" aria-label={t.cta}>
                    {t.cta}
                    <span className="-mr-3 p-1 !size-8 bg-nd-inverse text-nd-cta rounded-full inline-flex items-center justify-center">
                      <ArrowRightIcon
                        aria-hidden={true}
                        className="!size-[16px] block"
                        strokeWidth={3}
                      />
                    </span>
                  </Link>
                </Button>
                <Link
                  href="/epoch1000#checker"
                  className="nd-body-m text-nd-mid-em-text hover:text-nd-high-em-text transition-colors duration-200 underline underline-offset-4 decoration-nd-border-prominent"
                >
                  {t.secondaryCta}
                </Link>
              </div>
            </div>

            {/* live explorer panel */}
            <div
              className="eh-rise w-full sm:max-w-[420px] shrink-0"
              style={{ animationDelay: "400ms" }}
            >
              <div className="rounded-2xl border border-nd-border-prominent bg-white/[0.04] backdrop-blur-md p-6 md:p-7">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-nd-mid-em-text">
                    <span className="eh-live-dot inline-block h-2 w-2 rounded-full bg-solana-green" />
                    {t.liveLabel}
                  </span>
                  <span className="font-mono text-xs text-nd-mid-em-text tabular-nums">
                    {live
                      ? `SLOT ${live.absoluteSlot.toLocaleString("en-US")}`
                      : "—"}
                  </span>
                </div>

                <div className="mt-6">
                  <div className="font-mono text-xs uppercase tracking-[0.25em] text-nd-mid-em-text">
                    {t.statEpoch}
                  </div>
                  <div className="mt-1 font-black tracking-tight text-6xl md:text-7xl leading-none tabular-nums">
                    {live ? (
                      <span className="eh-sol-gradient">{live.epoch}</span>
                    ) : (
                      <span className="text-nd-mid-em-text animate-pulse">
                        ···
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-baseline justify-between font-mono text-xs text-nd-mid-em-text">
                    <span className="uppercase tracking-[0.25em]">
                      {t.statProgress}
                    </span>
                    <span className="tabular-nums">
                      {live ? `${(progress * 100).toFixed(1)}%` : "—"}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-300 ease-linear"
                      style={{
                        width: `${Math.max(1, progress * 100)}%`,
                        backgroundImage:
                          "linear-gradient(90deg, #9945ff 0%, #14f195 100%)",
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-mono text-xs uppercase tracking-[0.2em] text-nd-mid-em-text">
                      {t.statSlots}
                    </div>
                    <div className="mt-1 text-xl md:text-2xl font-bold tabular-nums">
                      {live ? live.slotsRemaining.toLocaleString("en-US") : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-xs uppercase tracking-[0.2em] text-nd-mid-em-text">
                      {t.statEta}
                    </div>
                    <div className="mt-1 text-xl md:text-2xl font-bold">
                      {live
                        ? live.eta.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-nd-border-light">
                  {live ? (
                    <BlockStream absoluteSlot={live.absoluteSlot} />
                  ) : (
                    <p className="font-mono text-xs text-nd-mid-em-text animate-pulse">
                      {t.offline}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
};
