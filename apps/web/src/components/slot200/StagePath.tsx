"use client";

import React from "react";
import { useTranslations } from "@workspace/i18n/client";
import { Container } from "@/component-library/container";
import { STAGE_STEPS } from "./stages";
import type { SlotClock } from "./useSlotClock";

interface StagePathProps {
  live: SlotClock | null;
}

/**
 * The staged path: 400 → 350 → 300 → 250 → 200. "You are here" is derived
 * from the measured average slot time, so the section is correct before and
 * after every feature-gate activation with no edits.
 */
export const StagePath: React.FC<StagePathProps> = ({ live }) => {
  const t = useTranslations("slot200.stages");
  const stage = live?.stage ?? 400;
  const activeIndex = STAGE_STEPS.indexOf(stage);

  return (
    <section aria-labelledby="stages-title">
      <Container className="py-14 md:py-20">
        <h2 id="stages-title" className="nd-heading-l max-w-[720px]">
          {t.rich("title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
          })}
        </h2>
        <p className="nd-body-l text-nd-mid-em-text mt-4 max-w-[640px]">
          {t("subtitle")}
        </p>

        <div className="mt-10 md:mt-14">
          {/* the descent: each step is a landing on the way down to 200 */}
          <div className="grid grid-cols-5 gap-2 md:gap-4 items-end">
            {STAGE_STEPS.map((step, i) => {
              const reached = i <= activeIndex;
              const isActive = i === activeIndex;
              // bar height tracks the slot time itself: 400 tall, 200 half
              const heightPct = (step / 400) * 100;
              return (
                <div key={step} className="flex flex-col items-center gap-3">
                  <div className="font-brand-mono text-[10px] md:text-xs uppercase tracking-[0.14em] text-nd-mid-em-text text-center h-9 md:h-7 flex items-end justify-center">
                    {t(`steps.${i}`)}
                  </div>
                  <div
                    className="w-full flex items-end"
                    style={{ height: "clamp(90px, 16vw, 220px)" }}
                  >
                    <div
                      className={`w-full rounded-t-lg border transition-colors ${
                        isActive
                          ? "border-solana-green/60"
                          : reached
                            ? "border-nd-border-prominent"
                            : "border-nd-border-prominent border-dashed"
                      }`}
                      style={{
                        height: `${heightPct}%`,
                        background: isActive
                          ? "linear-gradient(180deg, rgba(20,241,149,0.22), rgba(20,241,149,0.04))"
                          : reached
                            ? "linear-gradient(180deg, rgba(153,69,255,0.18), rgba(153,69,255,0.03))"
                            : "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015))",
                      }}
                    />
                  </div>
                  <div
                    className={`nd-heading-s tabular-nums ${
                      isActive
                        ? "text-solana-green"
                        : reached
                          ? "text-nd-high-em-text"
                          : "text-nd-mid-em-text"
                    }`}
                  >
                    {step}
                    <span className="nd-body-xs align-baseline ml-1 text-nd-mid-em-text">
                      ms
                    </span>
                  </div>
                  {isActive && (
                    <div
                      className="h-1.5 w-1.5 rounded-full bg-solana-green s2-live-dot"
                      aria-hidden
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 md:mt-8 flex items-center justify-center gap-2 font-brand-mono text-[11px] md:text-xs uppercase tracking-[0.14em] text-solana-green">
            <span className="s2-live-dot inline-block h-1.5 w-1.5 rounded-full bg-solana-green" />
            {live
              ? t("youAreHere", { ms: Math.round(live.avgSlotMs) })
              : t("youAreHereSyncing")}
          </div>
        </div>

        <p className="nd-body-s text-nd-mid-em-text mt-8 md:mt-10 max-w-[720px]">
          {t("note")}
        </p>
      </Container>
    </section>
  );
};
