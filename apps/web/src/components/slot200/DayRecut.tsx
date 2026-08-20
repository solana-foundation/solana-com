"use client";

import React from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import { Container } from "@/component-library/container";
import { STAGE_STEPS, slotsPerDay } from "./stages";

/**
 * Adapted from perp200's "day recut" bars: the same 24 wall-clock hours hold
 * more blocks at every step. Frequency, not capacity — per-block compute caps
 * scale down with slot time, so total blockspace is unchanged.
 */
export const DayRecut: React.FC = () => {
  const t = useTranslations("slot200.day");
  const locale = useLocale();
  const fmt = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const max = slotsPerDay(200);

  return (
    <section aria-labelledby="day-title">
      <Container className="py-14 md:py-20">
        <h2 id="day-title" className="nd-heading-l max-w-[760px]">
          {t.rich("title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
          })}
        </h2>
        <p className="nd-body-l text-nd-mid-em-text mt-4 max-w-[640px]">
          {t("subtitle")}
        </p>

        <div className="mt-10 md:mt-12 flex flex-col gap-3.5 md:gap-4">
          {STAGE_STEPS.map((step) => {
            const slots = slotsPerDay(step);
            const isBase = step === 400;
            const isTarget = step === 200;
            const baseWidth = (slotsPerDay(400) / max) * 100;
            const extraWidth = (slots / max) * 100 - baseWidth;
            return (
              <div
                key={step}
                className="flex items-center gap-3 md:gap-5 font-brand-mono tabular-nums"
              >
                <span className="w-14 md:w-20 flex-none text-right text-[11px] md:text-sm uppercase tracking-[0.1em] text-nd-mid-em-text">
                  {step} ms
                </span>
                <div className="flex-1 h-6 md:h-8 flex items-center gap-[3px]">
                  <div
                    className="h-full rounded-l-md bg-white/10"
                    style={{ width: `${baseWidth}%` }}
                  />
                  {!isBase && (
                    <div
                      className="h-full rounded-r-md"
                      style={{
                        width: `${extraWidth}%`,
                        background: isTarget
                          ? "linear-gradient(90deg, #9945FF 0%, #14F195 100%)"
                          : "rgba(20,241,149,0.45)",
                      }}
                    />
                  )}
                </div>
                <span
                  className={`w-[104px] md:w-[150px] flex-none text-[11px] md:text-sm ${
                    isTarget ? "text-solana-green" : "text-nd-mid-em-text"
                  }`}
                >
                  {t("rowValue", { count: fmt.format(slots) })}
                </span>
              </div>
            );
          })}
        </div>

        <p className="nd-body-s text-nd-mid-em-text mt-8 max-w-[720px]">
          {t("note")}
        </p>
      </Container>
    </section>
  );
};
