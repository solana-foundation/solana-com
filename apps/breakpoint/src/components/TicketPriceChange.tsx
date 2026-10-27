"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@workspace/i18n/client";
import {
  GENERAL_ADMISSION_PRICE_INCREASE_AT,
  getTicketPriceCountdownParts,
  hasGeneralAdmissionPriceIncreased,
} from "@/content/ticket-pricing";

type GeneralAdmissionPriceProps = {
  currentPrice: string;
  initialNow: number;
  increasedPrice: string;
};

type TicketPriceChangeCountdownProps = {
  className?: string;
  initialNow: number;
  label: string;
};

type LocalizedTicketPriceChangeCountdownProps = Omit<
  TicketPriceChangeCountdownProps,
  "label"
>;

type LocalizedGeneralAdmissionPriceProps = Pick<
  GeneralAdmissionPriceProps,
  "initialNow"
>;

function usePriceChangeClock(initialNow: number) {
  const [now, setNow] = useState(initialNow);

  useEffect(() => {
    let intervalId: number | undefined;

    const tick = () => {
      const currentTime = Date.now();
      setNow(currentTime);

      if (
        hasGeneralAdmissionPriceIncreased(currentTime) &&
        intervalId !== undefined
      ) {
        window.clearInterval(intervalId);
      }
    };

    tick();

    if (Date.now() < GENERAL_ADMISSION_PRICE_INCREASE_AT) {
      intervalId = window.setInterval(tick, 1000);
    }

    return () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  return now;
}

function ClockIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[18px] shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="2"
      />
    </svg>
  );
}

export function GeneralAdmissionPrice({
  currentPrice,
  initialNow,
  increasedPrice,
}: GeneralAdmissionPriceProps) {
  const now = usePriceChangeClock(initialNow);
  const price = hasGeneralAdmissionPriceIncreased(now)
    ? increasedPrice
    : currentPrice;

  return <>{price}</>;
}

export function TicketPriceChangeCountdown({
  className = "",
  initialNow,
  label,
}: TicketPriceChangeCountdownProps) {
  const now = usePriceChangeClock(initialNow);

  if (hasGeneralAdmissionPriceIncreased(now)) {
    return null;
  }

  const { days, hours, minutes, seconds } = getTicketPriceCountdownParts(now);
  const countdown = [
    ...(days > 0 ? [`${days}D`] : []),
    `${hours}H`,
    `${minutes}M`,
    `${seconds}S`,
  ].join(" ");

  return (
    <div
      aria-label={`${label} ${countdown}`}
      className={`type-caption inline-flex max-w-full flex-wrap items-center justify-center gap-2 border border-stroke-secondary bg-neutral-800 px-3 py-3 text-white md:px-4 md:text-[length:var(--text-button)] md:font-normal md:leading-[var(--text-eyebrow--line-height)] md:tracking-[var(--text-eyebrow--letter-spacing)] ${className}`}
      role="timer"
    >
      <ClockIcon />
      <span className="whitespace-nowrap">{label}</span>
      <span aria-hidden="true" className="whitespace-nowrap">
        {countdown}
      </span>
    </div>
  );
}

export function LocalizedTicketPriceChangeCountdown(
  props: LocalizedTicketPriceChangeCountdownProps,
) {
  const t = useTranslations("breakpoint");

  return (
    <TicketPriceChangeCountdown
      {...props}
      label={t("tickets.priceIncreaseCountdown")}
    />
  );
}

export function LocalizedGeneralAdmissionPrice({
  initialNow,
}: LocalizedGeneralAdmissionPriceProps) {
  const t = useTranslations("breakpoint");

  return (
    <GeneralAdmissionPrice
      currentPrice={t("tickets.categories.general.price")}
      initialNow={initialNow}
      increasedPrice={t("tickets.categories.general.priceAfterIncrease")}
    />
  );
}
