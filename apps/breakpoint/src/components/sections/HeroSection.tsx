"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import TextScramble from "@/components/TextScramble";
import EmailSubscribeDialog from "@/components/EmailSubscribeDialog";

export default function HeroSection() {
  const t = useTranslations("breakpoint");
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  return (
    <section className="relative h-[566px] w-full overflow-hidden bg-black">
      <div aria-hidden="true" className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/assets/hero-architecture-poster.webp"
          className="absolute inset-0 h-full w-full object-cover brightness-[0.55] saturate-[0.9]"
        >
          <source src="/assets/hero-architecture.webm" type="video/webm" />
          <source src="/assets/hero-architecture.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative z-10 mx-auto h-full w-full max-w-[1440px]">
        <div className="absolute left-5 top-[64px] right-5 md:left-8 md:right-8 md:top-[240px] md:h-[326px] md:w-[939px]">
          <TextScramble
            as="h1"
            text={t("hero.headline")}
            durationMs={1200}
            className="whitespace-pre-line font-sans text-[3.25rem] font-normal leading-[0.98] tracking-[-0.06em] text-white md:absolute md:left-0 md:top-0 md:w-[763px] md:text-[5rem]"
          />
          <div className="mt-8 md:absolute md:left-0 md:top-[180px] md:mt-0">
            <Button
              label={t("hero.cta")}
              variant="primary"
              arrow
              onClick={() => setSubscribeOpen(true)}
            />
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-[24px] gap-y-2 font-mono text-[0.875rem] uppercase tracking-[0.08em] text-white md:absolute md:left-0 md:top-[284px] md:mt-0 md:w-[676px] md:grid-cols-[326px_minmax(0,326px)] md:text-[1rem]">
            <span className="leading-[1.3]">{t("hero.date")}</span>
            <span className="leading-[1.3]">
              {t("hero.venue")}
              <br />
              {t("hero.location")}
            </span>
          </div>
        </div>
      </div>

      <img
        src="/assets/pixel-edge.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-[146px] w-full object-cover"
      />

      <EmailSubscribeDialog
        open={subscribeOpen}
        onClose={() => setSubscribeOpen(false)}
      />
    </section>
  );
}
