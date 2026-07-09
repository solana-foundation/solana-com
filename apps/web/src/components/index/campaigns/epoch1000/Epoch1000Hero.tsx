"use client";

import React, { useMemo } from "react";
import { ArrowRightIcon } from "lucide-react";
import { useLocale } from "@workspace/i18n/client";
import { Link } from "@workspace/i18n/routing";
import { Button } from "@/app/components/ui/button";
import { Container } from "@/component-library/container";
import Odometer from "@/components/epoch1000/Odometer";
import { useEpochData } from "@/components/epoch1000/useEpochData";
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
  slotLabel: string;
  liveLabel: string;
  offline: string;
};

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
      className="absolute inset-x-0 bottom-0 z-0 grid gap-[2px] opacity-60"
      style={{
        gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
        maskImage:
          "linear-gradient(to top, black 0%, rgba(0,0,0,0.7) 40%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to top, black 0%, rgba(0,0,0,0.7) 40%, transparent 100%)",
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

const BLOCK_COUNT = 10;

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
            className={`eh-block h-2.5 w-2.5 rounded-[2px] ${newest ? "bg-[#14f195]" : ""}`}
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
  const locale = useLocale();
  const { live } = useEpochData();
  // Freeze a sensible epoch for the backdrop before live data lands
  const gridEpoch = live?.epoch ?? 999;
  const progress = live?.progress ?? 0;
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale),
    [locale],
  );
  const etaFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
      }),
    [locale],
  );

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-nd-inverse text-nd-high-em-text border-b border-nd-border-light m-0"
      aria-labelledby="hero-title"
    >
      {/* ambient glows — purple past on the left, green now on the right */}
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 700px 420px at 12% -6%, rgba(153,69,255,0.20), transparent 65%), radial-gradient(ellipse 800px 500px at 90% 20%, rgba(20,241,149,0.10), transparent 65%)",
        }}
      />
      <div aria-hidden className="eh-grain absolute inset-0 z-0" />
      <EpochGridBackdrop currentEpoch={gridEpoch} />

      <Container className="relative z-10 flex w-full flex-col items-center text-center pt-6 md:pt-9 pb-4 md:pb-6 min-h-[calc(100svh-72px)]">
        <p
          className="eh-rise font-brand-mono text-xs md:text-sm uppercase tracking-[0.18em] md:tracking-[0.3em] text-nd-mid-em-text"
          style={{ animationDelay: "0ms" }}
        >
          {t.eyebrow}
        </p>

        <div
          className="eh-rise mt-4 md:mt-6"
          style={{ animationDelay: "100ms" }}
        >
          <Odometer
            value={live?.epoch ?? null}
            arrived={live?.arrived ?? false}
            label={`${t.statEpoch}: ${live ? live.epoch : "—"}`}
            className="ep-odo--hero"
          />
        </div>

        <h1
          className="eh-rise nd-heading-l mt-4 md:mt-6 max-w-[720px]"
          id="hero-title"
          style={{ animationDelay: "200ms" }}
        >
          {t.title}
        </h1>
        <p
          className="eh-rise text-nd-mid-em-text font-medium mt-3 nd-body-xl max-w-[560px]"
          style={{ animationDelay: "300ms" }}
        >
          {t.subtitle}
        </p>

        <div
          className="eh-rise mt-4 md:mt-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-5"
          style={{ animationDelay: "400ms" }}
        >
          <Button
            className="group rounded-full md:h-[48px] nd-body-m !px-5 py-3 bg-nd-cta text-nd-inverse hover:!bg-nd-primary/90 tracking-[-0.16px] md:tracking-[-0.18px]"
            size="lg"
            asChild
          >
            <Link href="/epoch1000" aria-label={t.cta}>
              {t.cta}
              <span className="-mr-3 p-1 !size-8 bg-nd-inverse text-nd-cta rounded-full inline-flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5">
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
            className="nd-body-m text-nd-mid-em-text hover:text-nd-high-em-text transition-colors duration-200 underline underline-offset-4 decoration-nd-border-prominent rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {t.secondaryCta}
          </Link>
        </div>

        {/* live console — the chain ticking underneath the monument */}
        <div
          className="eh-rise mt-auto pt-4 md:pt-6 w-full max-w-4xl"
          style={{ animationDelay: "500ms" }}
        >
          <div className="rounded-xl bg-black/[0.3] px-4 py-2 md:px-6 md:py-4">
            <div className="flex items-baseline justify-between font-brand-mono text-[11px] md:text-xs uppercase tracking-[0.2em] text-nd-mid-em-text">
              <span>{t.statProgress}</span>
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
            <div className="mt-2 md:mt-3 flex flex-wrap items-center justify-center sm:justify-between gap-x-6 gap-y-1.5 md:gap-y-2 font-brand-mono text-[11px] md:text-xs text-nd-mid-em-text tabular-nums">
              {live ? (
                <>
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <span className="eh-live-dot inline-block h-2 w-2 rounded-full bg-[#14f195]" />
                    <span className="uppercase tracking-[0.1em]">
                      {t.liveLabel}
                    </span>
                    <span className="hidden sm:block">
                      <BlockStream absoluteSlot={live.absoluteSlot} />
                    </span>
                    <span>
                      {t.slotLabel} {numberFormatter.format(live.absoluteSlot)}
                    </span>
                  </span>
                  <span className="flex flex-wrap justify-center gap-x-4 gap-y-1 uppercase tracking-[0.1em]">
                    <span className="whitespace-nowrap">
                      {t.statSlots}{" "}
                      <span className="text-nd-high-em-text">
                        {numberFormatter.format(live.slotsRemaining)}
                      </span>
                    </span>
                    <span className="whitespace-nowrap">
                      {t.statEta}{" "}
                      <span className="text-nd-high-em-text">
                        {etaFormatter.format(live.eta)}
                      </span>
                    </span>
                  </span>
                </>
              ) : (
                <span className="animate-pulse">{t.offline}</span>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
