"use client";

import { useEffect, useState } from "react";
import { Link } from "@workspace/i18n/routing";
import { isRelativeHref } from "@/lib/links";

const LONDON_TIME_ZONE = "Europe/London";

const SOCIAL_LINKS: { href: string; icon: string; name: string }[] = [
  {
    href: "https://www.youtube.com/@SolanaFndn",
    icon: "/assets/icon-youtube.svg",
    name: "YouTube",
  },
  { href: "https://x.com/solana", icon: "/assets/icon-x.svg", name: "X" },
  {
    href: "https://solana.com/discord",
    icon: "/assets/icon-discord.svg",
    name: "Discord",
  },
  {
    href: "https://www.reddit.com/r/solana/",
    icon: "/assets/icon-reddit.svg",
    name: "Reddit",
  },
  {
    href: "https://github.com/solana-foundation",
    icon: "/assets/icon-github.svg",
    name: "GitHub",
  },
  {
    href: "https://t.me/solana",
    icon: "/assets/icon-telegram.svg",
    name: "Telegram",
  },
];

type LondonDateTime = {
  day: number;
  hour?: number;
  minute?: number;
  month: number;
  second?: number;
  year: number;
};

type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getZonedDateTimeMs({
  day,
  hour = 0,
  minute = 0,
  month,
  second = 0,
  year,
}: LondonDateTime): number {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    timeZone: LONDON_TIME_ZONE,
    year: "numeric",
  }).formatToParts(new Date(utcGuess));

  const lookup: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") lookup[part.type] = part.value;
  }

  const zonedHour = Number(lookup.hour) % 24;
  const asIfUtc = Date.UTC(
    Number(lookup.year),
    Number(lookup.month) - 1,
    Number(lookup.day),
    zonedHour,
    Number(lookup.minute),
    Number(lookup.second),
  );

  return utcGuess - (asIfUtc - utcGuess);
}

const EVENT_START = getZonedDateTimeMs({
  day: 15,
  hour: 9,
  minute: 30,
  month: 11,
  year: 2026,
});

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

function SecondaryLink({ href, label }: { href: string; label: string }) {
  const classes =
    "inline-flex items-center justify-center gap-3 whitespace-nowrap font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-black transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";
  const content = (
    <>
      {label}
      <span className="inline-flex size-3 items-center justify-center">
        <ArrowUpRight />
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

function CounterCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-2 uppercase text-black md:items-center md:text-center">
      <p className="w-full font-bp26 text-[48px] font-normal leading-[1.18] tracking-[0.04em] text-black md:text-[64px]">
        {value}
      </p>
      <p className="w-full font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-black">
        {label}
      </p>
    </div>
  );
}

function FooterPixelEdge() {
  return (
    <svg
      aria-hidden="true"
      preserveAspectRatio="none"
      viewBox="0 0 1440 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block h-[200px] w-full min-w-[840px]"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1440 23.1202V200H0V14.114H91.5512V1.12952H351.685V14.114H524.223V21.1111H704.724V13.1145H818.864V0.629734L992.729 0.309869L1166.59 0V14.124H1222.34V23.1202H1440Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function SpeakersFooter() {
  const { days, hours, minutes, seconds } = useCountdown(EVENT_START);

  return (
    <footer className="flex w-full flex-col items-stretch pt-20 md:pt-[120px]">
      <div className="h-[50px] w-full overflow-hidden text-green">
        <FooterPixelEdge />
      </div>

      <div className="w-full bg-green px-5 py-12 md:px-8">
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
          <div className="flex items-center gap-6">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${social.name} (opens in a new tab)`}
                className="flex size-6 items-center justify-center transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                <img
                  src={social.icon}
                  alt=""
                  aria-hidden="true"
                  className="block h-auto max-h-6 w-6"
                />
              </a>
            ))}
          </div>

          <p className="whitespace-nowrap font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-black">
            © Solana Foundation | 2026
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <SecondaryLink
              href="mailto:breakpoint@solana.org"
              label="Contact Us"
            />
            <SecondaryLink href="/code-of-conduct" label="Code of Conduct" />
          </div>
        </div>
      </div>

      <div className="w-full bg-green px-4 pt-12 md:px-8 md:py-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 md:flex md:items-center md:justify-between md:gap-0">
          <CounterCell value={pad(days, 3)} label="Days" />
          <CounterCell value={pad(hours)} label="Hours" />
          <CounterCell value={pad(minutes)} label="Minutes" />
          <CounterCell value={pad(seconds)} label="Seconds" />
        </div>
      </div>

      <div className="w-full bg-green px-4 pb-8 pt-12 md:px-8 md:py-12">
        <div className="flex w-full items-center justify-center gap-4 md:gap-[35.974px]">
          <img
            src="/assets/bp26-logo-mark-mobile.svg"
            alt=""
            aria-hidden="true"
            width={56.7055}
            height={48.884}
            className="block h-[43.867px] w-[50.885px] shrink-0 md:hidden"
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
            className="block h-[44.87px] w-[234.333px] shrink-0 md:hidden"
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
