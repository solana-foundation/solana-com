"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";

export default function HeroSection() {
  const t = useTranslations("breakpoint");
  const venueLine = [t("hero.venue"), t("hero.location")].join(" ");

  return (
    <section className="relative min-h-[566px] w-full overflow-hidden bg-[#05030a]">
      <img
        src="/assets/glitch-clean.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(5,3,10,0.28)_44%,#05030a_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className="absolute left-1/2 top-3 z-20 -translate-x-1/2 bg-black/90 px-4 py-[14px]">
        <img
          src="/assets/bp-logo.svg"
          alt="Breakpoint 2026"
          className="h-5 w-auto"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[566px] w-full max-w-[1920px] items-end px-5 pb-8 pt-32 md:px-8 md:pb-0 md:pt-0">
        <div className="mb-0 flex max-w-[939px] flex-col gap-8 md:mb-0 md:translate-y-[-40px]">
          <div className="flex flex-col gap-6">
            <h1 className="max-w-[9ch] whitespace-pre-line font-sans text-[3.75rem] font-normal leading-[0.98] tracking-[-0.08em] text-white md:text-[5rem]">
              {t("hero.headline")}
            </h1>
            <div>
              <Button label={t("hero.cta")} variant="primary" />
            </div>
          </div>

          <div className="grid max-w-[676px] gap-3 text-[0.9375rem] uppercase tracking-[0.1em] text-white/72 md:grid-cols-2 md:gap-x-6">
            <span className="font-mono">{t("hero.date")}</span>
            <span className="font-mono">{venueLine}</span>
          </div>
        </div>
      </div>

      <img
        src="/assets/pixel-edge.svg"
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 z-10 h-[146px] w-full object-cover"
      />
    </section>
  );
}
