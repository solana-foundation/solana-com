"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const EXPAND_DELAY_MS = 600;
const EXPAND_DURATION_MS = 900;

export default function Navigation() {
  const t = useTranslations("breakpoint");
  const [phase, setPhase] = useState<"closed" | "expanding" | "open">("closed");

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      setPhase("open");
      return;
    }
    const t1 = setTimeout(() => setPhase("expanding"), EXPAND_DELAY_MS);
    const t2 = setTimeout(
      () => setPhase("open"),
      EXPAND_DELAY_MS + EXPAND_DURATION_MS,
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const expanded = phase !== "closed";
  const ctaVisible = phase === "open";

  return (
    <nav
      aria-label="Primary"
      className="absolute left-1/2 top-3 z-30 flex h-12 -translate-x-1/2 items-center gap-3 bg-black px-4"
    >
      <Link
        href="/"
        className="flex h-5 items-center gap-[7px]"
        aria-label="Breakpoint 2026"
      >
        <img
          src="/assets/nav-solana.svg"
          alt=""
          aria-hidden="true"
          className="block h-[19.55px] w-[22.68px]"
        />
        <img
          src="/assets/nav-bp26.svg"
          alt="BP26"
          className="block h-5 w-[104.45px]"
        />
      </Link>

      <div
        aria-hidden={!ctaVisible}
        className={
          expanded ? "bp-nav-expand" : "overflow-hidden whitespace-nowrap"
        }
        style={
          expanded
            ? ({
                "--bp-nav-from": "0px",
                "--bp-nav-to": "140px",
              } as React.CSSProperties)
            : { maxWidth: 0 }
        }
      >
        <a
          href="#tickets"
          className="inline-flex h-[28px] items-center border border-white/40 px-3 font-mono text-[12px] font-bold uppercase leading-none tracking-[0.08em] text-white transition-colors duration-150 hover:bg-white hover:text-black"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transition: "opacity 0ms 0ms",
          }}
          tabIndex={ctaVisible ? 0 : -1}
        >
          {t("tickets.cta")}
        </a>
      </div>
    </nav>
  );
}
