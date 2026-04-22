"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const LONDON_TIME_ZONE = "Europe/London";

type LondonDateTime = {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
};

function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
    hour: "2-digit",
  }).formatToParts(date);

  const offsetValue = parts.find((part) => part.type === "timeZoneName")?.value;

  if (!offsetValue || offsetValue === "GMT") {
    return 0;
  }

  const match = offsetValue.match(/^GMT([+-])(\d{1,2})(?::?(\d{2}))?$/);

  if (!match) {
    throw new Error(`Unsupported timezone offset format: ${offsetValue}`);
  }

  const [, sign, hours, minutes = "00"] = match;
  const totalMinutes = Number(hours) * 60 + Number(minutes);
  const direction = sign === "+" ? 1 : -1;

  return direction * totalMinutes * 60 * 1000;
}

function getZonedDateTimeMs({
  year,
  month,
  day,
  hour = 0,
  minute = 0,
  second = 0,
}: LondonDateTime): number {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);
  const offsetMs = getTimeZoneOffsetMs(new Date(utcGuess), LONDON_TIME_ZONE);
  return utcGuess - offsetMs;
}

// Breakpoint starts on November 15 in London. Until a precise venue start time
// is provided, count down to midnight London time at the start of that day.
const EVENT_START = getZonedDateTimeMs({
  year: 2026,
  month: 11,
  day: 15,
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

function ArrowUpRight() {
  return (
    <svg
      aria-hidden="true"
      width="8.02"
      height="8"
      viewBox="0 0 8.01975 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <path
        d="M1.24444 8L0 6.7358L4.95803 1.79753H1.12593V0H8.01975V6.85432H6.20247V3.06173L1.24444 8Z"
        fill="currentColor"
      />
    </svg>
  );
}

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
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
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-[12px] whitespace-nowrap font-mono text-[14px] font-bold uppercase leading-[10px] tracking-[0.08em] text-neutral-900 transition-opacity hover:opacity-70"
    >
      {label}
      <span className="relative inline-flex size-[12px] items-center justify-center">
        <ArrowUpRight />
      </span>
    </a>
  );
}

function CounterCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-[8px] text-center uppercase text-neutral-900">
      <p className="w-full font-bp26 text-[28px] font-normal leading-[1.1875] tracking-[0.04em] md:text-[64px]">
        {value}
      </p>
      <p className="w-full font-mono text-[11px] font-bold leading-[9.9px] tracking-[0.08em] md:text-[14px] md:leading-[10px]">
        {label}
      </p>
    </div>
  );
}

export default function Footer() {
  const t = useTranslations("breakpoint.footer");
  const { days, hours, minutes, seconds } = useCountdown(EVENT_START);

  return (
    <footer className="flex w-full flex-col items-stretch pt-[120px]">
      <div className="h-[50px] w-full overflow-hidden">
        <img
          src="/assets/pixel-edge-footer.svg"
          alt=""
          aria-hidden="true"
          className="block h-[200px] w-full"
        />
      </div>

      <div className="flex w-full flex-col items-center justify-between gap-6 bg-purple px-5 py-l md:flex-row md:px-8">
        <div className="flex items-center gap-s">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.name}
              className="flex size-[24px] items-center justify-center transition-opacity hover:opacity-70"
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

        <p className="whitespace-nowrap font-mono text-[14px] font-bold uppercase leading-[10px] tracking-[0.08em] text-neutral-900">
          {t("copyright")}
        </p>

        <div className="flex items-center gap-l">
          <SecondaryLink
            href="mailto:breakpoint@solana.org"
            label={t("contact")}
          />
          <SecondaryLink href="/code-of-conduct" label={t("codeOfConduct")} />
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-2 bg-purple px-5 py-l md:gap-0 md:px-8">
        <CounterCell value={pad(days, 3)} label={t("countdown.days")} />
        <CounterCell value={pad(hours)} label={t("countdown.hours")} />
        <CounterCell value={pad(minutes)} label={t("countdown.minutes")} />
        <CounterCell value={pad(seconds)} label={t("countdown.seconds")} />
      </div>

      <div className="flex w-full items-center justify-center bg-purple px-5 py-l md:px-8">
        <div className="flex w-full items-center gap-[16px] md:w-auto md:shrink-0 md:gap-[35.974px]">
          <img
            src="/assets/bp-logo-mark.svg"
            alt=""
            aria-hidden="true"
            width={114.409}
            height={98.628}
            className="block h-[48px] w-[55.67px] shrink-0 md:h-[98.628px] md:w-[114.409px]"
          />
          <img
            src="/assets/breakpoint-wordmark-footer.svg"
            alt="Breakpoint"
            width={1226.613}
            height={100.876}
            style={{ aspectRatio: "1226.613 / 100.876" }}
            className="block h-auto w-full min-w-0 flex-1 md:h-[100.876px] md:w-[1226.613px] md:flex-none"
          />
        </div>
      </div>
    </footer>
  );
}
