"use client";

import React from "react";
import { useTranslations } from "next-intl";

const countdownItems = [
  { key: "days", value: "243" },
  { key: "hours", value: "40" },
  { key: "minutes", value: "36" },
  { key: "seconds", value: "55" },
] as const;

export default function FooterSection() {
  const t = useTranslations("breakpoint");
  const socials = ["X", "IG", "YT", "IN", "TG", "DC"];

  return (
    <section className="relative overflow-hidden border-t border-white/10">
      <div className="absolute inset-x-0 bottom-0 top-[92px] bg-[linear-gradient(180deg,rgba(171,102,253,0.14)_0%,rgba(0,0,0,0)_32%)]" />
      <img
        src="/assets/glitch-texture.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[320px] w-full object-cover opacity-30"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1920px] flex-col px-5 pb-10 pt-[120px] md:px-8">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-6 text-[0.6875rem] uppercase tracking-[0.09em] text-white/72 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            {socials.map((label) => (
              <a
                key={label}
                href="https://solana.com"
                className="transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>
          <p className="font-mono">© Solana Foundation | 2026</p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="mailto:breakpoint@solana.org"
              className="transition-colors hover:text-white"
            >
              Contact Us ↗
            </a>
            <a
              href="https://solana.com/legal"
              className="transition-colors hover:text-white"
            >
              Code of Conduct ↗
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-10 md:grid-cols-4 md:py-20">
          {countdownItems.map((item) => (
            <div key={item.key} className="flex flex-col">
              <span className="font-display text-[3rem] leading-none tracking-[0.04em] text-white md:text-[4.75rem]">
                {item.value}
              </span>
              <span className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-white/64">
                {t(`footer.countdown.${item.key}`)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <img
            src="/assets/breakpoint-wordmark.svg"
            alt="Breakpoint"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
