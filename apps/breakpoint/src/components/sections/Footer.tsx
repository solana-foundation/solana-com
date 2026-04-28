"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "@workspace/i18n/client";
import { Link } from "@workspace/i18n/routing";
import ArrowUpRightIcon from "@/components/ArrowUpRightIcon";
import { isRelativeHref } from "@/lib/links";

const LONDON_TIME_ZONE = "Europe/London";

type LondonDateTime = {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
};

// Returns the UTC ms for a given wall-clock time in the target zone.
// Works across DST by measuring how the naive UTC guess is rendered in
// the target zone, then correcting by the observed delta.
function getZonedDateTimeMs({
  year,
  month,
  day,
  hour = 0,
  minute = 0,
  second = 0,
}: LondonDateTime): number {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: LONDON_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date(utcGuess));

  const lookup: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") lookup[part.type] = part.value;
  }

  // `hour` can come back as "24" at midnight in some ICU versions.
  const zonedHour = Number(lookup.hour) % 24;

  const asIfUtc = Date.UTC(
    Number(lookup.year),
    Number(lookup.month) - 1,
    Number(lookup.day),
    zonedHour,
    Number(lookup.minute),
    Number(lookup.second),
  );

  const offsetMs = asIfUtc - utcGuess;
  return utcGuess - offsetMs;
}

// Breakpoint starts on November 15 in London. Until a precise venue start time
// is provided, count down to midnight London time at the start of that day.
// Breakpoint doors open at 10:00 London time on November 15, 2026.
const EVENT_START = getZonedDateTimeMs({
  year: 2026,
  month: 11,
  day: 15,
  hour: 9,
  minute: 30,
});
const SOCIAL_LINKS: { name: string; href: string; icon: string }[] = [
  {
    name: "YouTube",
    href: "https://www.youtube.com/@SolanaFndn",
    icon: "/assets/icon-youtube.svg",
  },
  { name: "X", href: "https://x.com/solana", icon: "/assets/icon-x.svg" },
  {
    name: "Discord",
    href: "https://solana.com/discord",
    icon: "/assets/icon-discord.svg",
  },
  {
    name: "Reddit",
    href: "https://www.reddit.com/r/solana/",
    icon: "/assets/icon-reddit.svg",
  },
  {
    name: "GitHub",
    href: "https://github.com/solana-foundation",
    icon: "/assets/icon-github.svg",
  },
  {
    name: "Telegram",
    href: "https://t.me/solana",
    icon: "/assets/icon-telegram.svg",
  },
];

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type FooterProps = {
  accentClassName?: string;
  accentTextClassName?: string;
};

function diffParts(target: number, now: number): CountdownParts {
  const delta = Math.max(0, target - now);
  const totalSeconds = Math.floor(delta / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function useCountdown(target: number): CountdownParts {
  const [parts, setParts] = useState<CountdownParts>(() =>
    diffParts(target, target),
  );

  useEffect(() => {
    const tick = () => setParts(diffParts(target, Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return parts;
}

function pad(value: number, width = 2): string {
  return value.toString().padStart(width, "0");
}

function SecondaryLink({ href, label }: { href: string; label: string }) {
  const classes =
    "type-button inline-flex items-center justify-center gap-[12px] whitespace-nowrap text-neutral-900 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

  const content = (
    <>
      {label}
      <span className="relative inline-flex size-[12px] items-center justify-center">
        <ArrowUpRightIcon />
      </span>
    </>
  );

  if (isRelativeHref(href)) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={classes}>
      {content}
    </a>
  );
}

function CounterCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[8px] text-left uppercase text-neutral-900 md:items-center md:text-center">
      <p className="type-h2 w-full">{value}</p>
      <p className="type-button w-full">{label}</p>
    </div>
  );
}

function FooterPixelEdge({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      className={`block h-[200px] w-full min-w-[840px] ${className}`}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1440 23.1202V200H0V14.114H91.5512V1.12952H351.685V14.114H524.223V21.1111H704.724V13.1145H818.864V0.629734L992.729 0.309869L1166.59 0V14.124H1222.34V23.1202H1440Z"
      />
    </svg>
  );
}

export default function Footer({
  accentClassName = "bg-purple",
  accentTextClassName = "text-purple",
}: FooterProps = {}) {
  const t = useTranslations("breakpoint.footer");
  const { days, hours, minutes, seconds } = useCountdown(EVENT_START);

  return (
    <footer className="flex w-full flex-col items-stretch pt-20 md:pt-[120px]">
      <div className="h-[50px] w-full overflow-hidden">
        <FooterPixelEdge className={accentTextClassName} />
      </div>

      <div className={`w-full ${accentClassName}`}>
        <div className="flex flex-col items-start justify-between gap-xl px-[16px] pt-l md:flex-row md:items-center md:gap-6 md:px-[32px] md:py-l">
          <div className="flex items-center gap-s">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${social.name} (opens in a new tab)`}
                className="flex size-[24px] items-center justify-center transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                <img
                  src={social.icon}
                  alt=""
                  aria-hidden="true"
                  className="block h-auto max-h-[24px] w-[24px]"
                />
              </a>
            ))}
          </div>

          <p className="type-button whitespace-nowrap text-neutral-900">
            {t("copyright")}
          </p>

          <div className="flex flex-col items-start gap-l md:flex-row md:items-center md:gap-l">
            <SecondaryLink
              href="mailto:breakpoint@solana.org"
              label={t("contact")}
            />
            <SecondaryLink href="/code-of-conduct" label={t("codeOfConduct")} />
          </div>
        </div>
      </div>

      <div
        className={`w-full px-[16px] pt-l md:px-[32px] md:py-l ${accentClassName}`}
      >
        <div className="grid grid-cols-2 gap-x-[24px] gap-y-[24px] md:flex md:items-center md:justify-between md:gap-0">
          <CounterCell value={pad(days, 3)} label={t("countdown.days")} />
          <CounterCell value={pad(hours)} label={t("countdown.hours")} />
          <CounterCell value={pad(minutes)} label={t("countdown.minutes")} />
          <CounterCell value={pad(seconds)} label={t("countdown.seconds")} />
        </div>
      </div>

      <div
        className={`w-full px-[16px] pb-[32px] pt-l md:px-[32px] md:py-l ${accentClassName}`}
      >
        <div className="flex w-full items-center justify-start gap-[17.83px] md:justify-center md:gap-[35.974px]">
          <img
            src="/assets/bp26-logo-mark-mobile.svg"
            alt=""
            aria-hidden="true"
            width={56.7055}
            height={48.884}
            className="block h-[48.884px] w-[56.705px] shrink-0 md:hidden"
          />
          <img
            src="/assets/bp-logo-mark.svg"
            alt=""
            aria-hidden="true"
            width={114.409}
            height={98.628}
            className="hidden h-[98.628px] w-[114.409px] shrink-0 md:block"
          />
          <img
            src="/assets/bp26-wordmark-mobile.svg"
            alt="BP26"
            width={261.136}
            height={50.0022}
            className="block h-[50.002px] w-[261.136px] shrink-0 md:hidden"
          />
          <img
            src="/assets/breakpoint-wordmark-footer.svg"
            alt="Breakpoint"
            width={1226.613}
            height={100.876}
            className="hidden h-auto w-full min-w-0 flex-1 md:block"
            style={{ aspectRatio: "1226.613 / 100.876" }}
          />
        </div>
      </div>
    </footer>
  );
}
