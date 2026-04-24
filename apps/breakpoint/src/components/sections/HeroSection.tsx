"use client";

import React, { useRef, useState } from "react";
import { useTranslations } from "@workspace/i18n/client";
import Button from "@/components/Button";
import TextScramble from "@/components/TextScramble";
import WordReveal from "@/components/WordReveal";
import EmailSubscribeDialog from "@/components/EmailSubscribeDialog";

export default function HeroSection() {
  const t = useTranslations("breakpoint");
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [cursorY, setCursorY] = useState(50);
  const mediaRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = mediaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCursorY(Math.max(0, Math.min(100, y)));
    if (!interacting) setInteracting(true);
  };

  return (
    <section className="relative h-[566px] w-full overflow-hidden bg-black">
      <div
        ref={mediaRef}
        aria-hidden="true"
        className="absolute inset-0"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setInteracting(false)}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/assets/hero-architecture-poster.webp"
          className={`absolute inset-0 h-full w-full object-cover ${interacting ? "" : "bp-video-idle-glitch"}`}
        >
          <source src="/assets/hero-architecture.webm" type="video/webm" />
          <source src="/assets/hero-architecture.mp4" type="video/mp4" />
        </video>

        {interacting && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, transparent calc(var(--cy) - 6%), rgba(171,102,253,0.35) calc(var(--cy) - 3%), rgba(255,255,255,0.15) var(--cy), rgba(20,241,149,0.25) calc(var(--cy) + 3%), transparent calc(var(--cy) + 6%), transparent 100%)",
              mixBlendMode: "screen",
              filter: "contrast(1.15)",
              ["--cy" as never]: `${cursorY}%`,
            }}
          />
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.98)_0%,rgba(0,0,0,0.92)_20%,rgba(0,0,0,0.35)_40%,transparent_60%)]"
        />
      </div>

      <div className="container relative z-10 h-full">
        <div className="absolute left-5 right-5 top-16 md:inset-x-auto md:left-8 md:right-auto md:top-60 md:h-[326px] md:w-[939px] min-[108rem]:w-[926px]">
          <TextScramble
            as="h1"
            text={t("hero.headline")}
            durationMs={1000}
            className="whitespace-pre-line font-sans text-[3.25rem] font-normal leading-[0.98] tracking-[-0.06em] text-white md:absolute md:left-0 md:top-0 md:w-[763px] md:text-[5rem] min-[108rem]:w-[926px]"
          />
          <div className="mt-8 md:absolute md:left-0 md:top-[180px] md:mt-0">
            <Button
              label={t("hero.cta")}
              variant="primary"
              arrow
              onClick={() => setSubscribeOpen(true)}
            />
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-[24px] gap-y-2 font-mono text-[0.875rem] uppercase tracking-[0.08em] text-white md:absolute md:left-0 md:top-[284px] md:mt-0 md:w-[676px] md:grid-cols-[326px_minmax(0,326px)] md:text-[1rem] min-[108rem]:w-[609px] min-[108rem]:grid-cols-[293px_minmax(0,292px)]">
            <WordReveal
              text={t("hero.date")}
              stepMs={70}
              startDelayMs={1100}
              className="leading-[1.3]"
            />
            <span className="leading-[1.3]">
              <WordReveal
                text={t("hero.venue")}
                stepMs={70}
                startDelayMs={1100}
              />
              <br />
              <WordReveal
                text={t("hero.location")}
                stepMs={70}
                startDelayMs={1250}
              />
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
