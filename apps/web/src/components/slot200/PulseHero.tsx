"use client";

import React from "react";
import { ArrowRight as ArrowRightIcon } from "@boxicons/react/ArrowRight";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import { Button } from "@/app/components/ui/button";
import { Container } from "@/component-library/container";
import { SchedulePulse } from "./SchedulePulse";
import { useLeaderSchedule } from "./useLeaderSchedule";
import type { SlotClock, Snapshot } from "./useSlotClock";

const ANALYSIS_HREF = "/news/lowering-slot-time-and-validators-economic";
const UPGRADE_HREF = "/upgrades/reduced-slot-times";

interface PulseHeroProps {
  live: SlotClock | null;
  snap: Snapshot | null;
}

export const PulseHero: React.FC<PulseHeroProps> = ({ live, snap }) => {
  const t = useTranslations("slot200.hero");
  const locale = useLocale();
  const { schedule } = useLeaderSchedule();
  const numberFormatter = React.useMemo(
    () => new Intl.NumberFormat(locale),
    [locale],
  );

  const laneSub = (stats?: { validators: number; stakePct: number }) =>
    stats
      ? t("laneSub", {
          count: numberFormatter.format(stats.validators),
          stake: stats.stakePct,
        })
      : t("laneSubSyncing");

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-nd-inverse text-nd-high-em-text border-b border-nd-border-light"
      aria-labelledby="hero-title"
    >
      {/* ambient glows — muted purple for the old clock, green for the new */}
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 700px 420px at 10% -8%, rgba(153,69,255,0.18), transparent 65%), radial-gradient(ellipse 900px 520px at 88% 75%, rgba(20,241,149,0.10), transparent 65%)",
        }}
      />

      <Container className="relative z-10 flex flex-col items-center text-center pt-10 md:pt-12 pb-8 md:pb-10">
        <p
          className="s2-rise font-brand-mono text-xs md:text-sm uppercase tracking-[0.18em] md:tracking-[0.3em] text-nd-mid-em-text"
          style={{ animationDelay: "0ms" }}
        >
          {t("eyebrow")}
        </p>

        <h1
          className="s2-rise nd-heading-xl mt-4 md:mt-6 max-w-[900px]"
          id="hero-title"
          style={{ animationDelay: "100ms" }}
        >
          {t.rich("title", {
            light: (chunks) => (
              <>
                <br />
                <span className="font-light text-solana-green">{chunks}</span>
              </>
            ),
          })}
        </h1>

        <p
          className="s2-rise text-nd-mid-em-text pt-4 md:pt-5 nd-body-xl max-w-[640px]"
          style={{ animationDelay: "200ms" }}
        >
          {t("subtitle")}
        </p>

        <div
          className="s2-rise pt-5 md:pt-7 flex flex-col sm:flex-row items-center gap-3 sm:gap-5"
          style={{ animationDelay: "300ms" }}
        >
          <Button
            className="group rounded-full md:h-[48px] nd-body-m !px-5 py-3 bg-nd-cta text-nd-inverse hover:!bg-nd-primary/90"
            size="lg"
            asChild
          >
            <a href={ANALYSIS_HREF}>
              {t("ctaAnalysis")}
              <span className="-mr-3 p-1 !size-8 bg-nd-inverse text-nd-cta rounded-full inline-flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowRightIcon aria-hidden className="!size-[16px] block" />
              </span>
            </a>
          </Button>
          <a
            href={UPGRADE_HREF}
            className="nd-body-m text-nd-mid-em-text hover:text-nd-high-em-text transition-colors duration-200 underline underline-offset-4 decoration-nd-border-prominent rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {t("ctaUpgrade")}
          </a>
        </div>
      </Container>

      {/* the monitor: real upcoming blocks from the live leader schedule,
          split by whether their producer already runs the 200 ms release */}
      <div
        className="s2-rise relative z-10 w-full max-w-screen-2xl mx-auto px-0 md:px-8 xl:px-10"
        style={{ animationDelay: "420ms" }}
      >
        <SchedulePulse
          className="w-full"
          snap={snap}
          schedule={schedule}
          lanes={[
            {
              label: t("laneLegacyLabel"),
              sublabel: laneSub(schedule?.legacy),
            },
            {
              label: t("laneUpgradedLabel"),
              sublabel: laneSub(schedule?.upgraded),
            },
          ]}
        />
        <p className="px-5 md:px-0 pt-3 text-center font-brand-mono text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-nd-mid-em-text">
          {t("pulseCaption")}
        </p>
      </div>

      {/* honest numbers live here: measured mainnet pace + current slot */}
      <Container className="relative z-10 pb-7 md:pb-8 pt-4 md:pt-5">
        <div className="mx-auto w-fit rounded-full border border-nd-border-light bg-black/40 px-5 py-2.5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 font-brand-mono text-[11px] md:text-xs text-nd-mid-em-text tabular-nums uppercase tracking-[0.12em]">
          {live ? (
            <>
              <span className="flex items-center gap-2 whitespace-nowrap">
                <span className="s2-live-dot inline-block h-2 w-2 rounded-full bg-solana-green" />
                {t("chipLive")}
              </span>
              <span className="whitespace-nowrap">
                {t("chipMeasured")}{" "}
                <span className="text-nd-high-em-text">
                  {Math.round(live.avgSlotMs)} ms
                </span>
              </span>
              <span className="whitespace-nowrap">
                {t("chipSlot")}{" "}
                <span className="text-nd-high-em-text">
                  {numberFormatter.format(live.absoluteSlot)}
                </span>
              </span>
            </>
          ) : (
            <span className="animate-pulse">{t("chipConnecting")}</span>
          )}
        </div>
      </Container>
    </section>
  );
};
