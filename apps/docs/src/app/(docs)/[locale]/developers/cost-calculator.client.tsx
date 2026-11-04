"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  COST_MODEL,
  computeCosts,
  formatInteger,
  formatUsd,
  paymentsFromSliderPosition,
} from "@/data/developers/hub";

type CostCalculatorInitial = {
  payments: string;
  average: string;
  card: string;
  solana: string;
  savings: string;
};

/**
 * Cost calculator. Until a slider moves it shows `initial`, formatted on the
 * server, so hydration cannot disagree about number formatting. The sliders
 * appear after hydration; without JS the page's static table stands in.
 */
export function CostCalculator({
  locale,
  initial,
  note,
}: {
  locale: string;
  initial: CostCalculatorInitial;
  note: ReactNode;
}) {
  const t = useTranslations("developers.landing.calc");
  const [enhanced, setEnhanced] = useState(false);
  const [position, setPosition] = useState<number>(
    COST_MODEL.slider.payments.defaultPosition,
  );
  const [average, setAverage] = useState<number>(
    COST_MODEL.defaults.averagePaymentUsd,
  );
  const [touched, setTouched] = useState(false);

  useEffect(() => setEnhanced(true), []);

  const payments = paymentsFromSliderPosition(position);
  const costs = computeCosts(payments, average);
  const shown: CostCalculatorInitial = touched
    ? {
        payments: formatInteger(payments, locale),
        average: formatUsd(average, locale),
        card: formatUsd(costs.card, locale),
        solana: formatUsd(costs.solana, locale),
        savings: formatUsd(costs.savings, locale),
      }
    : initial;

  const label =
    "mb-6 block text-[15px] leading-snug text-[var(--dl-muted)] last-of-type:mb-5";
  const range =
    "mt-3.5 block h-1 w-full cursor-pointer accent-[var(--dl-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--dl-accent)]";
  const panel =
    "rounded-2xl border border-[var(--dl-line)] bg-[var(--dl-surface)] p-6 shadow-[shadow:var(--dl-shadow)] md:px-7";

  return (
    <div className="grid gap-3.5 lg:grid-cols-2">
      <div className={panel}>
        <label className={label}>
          <span className="flex items-baseline justify-between gap-4">
            <span>{t("paymentsPerMonth")}</span>
            <b
              className="font-medium text-[var(--dl-text)]"
              data-testid="calc-payments"
            >
              {shown.payments}
            </b>
          </span>
          {enhanced && (
            <input
              type="range"
              min={COST_MODEL.slider.payments.min}
              max={COST_MODEL.slider.payments.max}
              value={position}
              aria-valuetext={shown.payments}
              onChange={(event) => {
                setTouched(true);
                setPosition(Number(event.target.value));
              }}
              className={range}
            />
          )}
        </label>
        <label className={label}>
          <span className="flex items-baseline justify-between gap-4">
            <span>{t("averagePayment")}</span>
            <b className="font-medium text-[var(--dl-text)]">{shown.average}</b>
          </span>
          {enhanced && (
            <input
              type="range"
              min={COST_MODEL.slider.average.min}
              max={COST_MODEL.slider.average.max}
              value={average}
              aria-valuetext={shown.average}
              onChange={(event) => {
                setTouched(true);
                setAverage(Number(event.target.value));
              }}
              className={range}
            />
          )}
        </label>
        {enhanced && (
          <p className="mb-4 mt-0 text-sm text-[var(--dl-muted)]">
            {t("interactiveHint")}
          </p>
        )}
        <p className="m-0 text-[13px] leading-relaxed text-[var(--dl-dim)]">
          {note}
        </p>
      </div>
      <div className={`${panel} flex flex-col gap-1.5`} aria-live="polite">
        {(
          [
            ["card", shown.card, "text-[var(--dl-text)]"],
            ["solana", shown.solana, "text-[var(--dl-good)]"],
          ] as const
        ).map(([key, value, color]) => (
          <div
            key={key}
            className="grid grid-cols-[1fr_auto] items-baseline border-b border-[var(--dl-line)] py-3.5"
          >
            <span className="text-[15px] text-[var(--dl-muted)]">{t(key)}</span>
            <b
              className={`text-[32px] font-medium leading-tight tracking-[-0.025em] ${color}`}
              data-testid={`calc-${key}`}
            >
              {value}
            </b>
            <em className="col-start-2 justify-self-end text-xs not-italic text-[var(--dl-dim)]">
              {t("perMonth")}
            </em>
          </div>
        ))}
        <p className="mb-0 mt-auto pt-4 text-[15px] leading-normal text-[var(--dl-muted)]">
          {t.rich("savings", {
            amount: shown.savings,
            b: (chunks) => (
              <b
                className="font-medium text-[var(--dl-text)]"
                data-testid="calc-savings"
              >
                {chunks}
              </b>
            ),
          })}
        </p>
      </div>
    </div>
  );
}
