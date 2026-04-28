"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
      if (event.matches) {
        setInteracting(false);
        setCursorY(50);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (prefersReducedMotion) {
      video.pause();
      return;
    }

    const start = () => {
      if (video.preload !== "auto") video.preload = "auto";
      video.load();
    };

    const idle = (
      window as Window & {
        requestIdleCallback?: (
          _cb: () => void,
          _opts?: { timeout: number },
        ) => number;
      }
    ).requestIdleCallback;

    if (document.readyState === "complete") {
      if (idle) idle(start, { timeout: 1500 });
      else window.setTimeout(start, 200);
      return;
    }

    const onLoad = () => {
      if (idle) idle(start, { timeout: 1500 });
      else window.setTimeout(start, 200);
    };
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, [prefersReducedMotion]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion) return;

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
          ref={videoRef}
          autoPlay={!prefersReducedMotion}
          muted
          loop={!prefersReducedMotion}
          playsInline
          preload="none"
          poster="/assets/hero-architecture-poster.webp"
          className={`absolute inset-0 h-full w-full object-cover ${interacting ? "" : "bp-video-idle-glitch"}`}
        >
          <source src="/assets/hero-architecture.webm" type="video/webm" />
          <source src="/assets/hero-architecture.mp4" type="video/mp4" />
        </video>

        <AnimatePresence>
          {interacting && (
            <motion.div
              key="cursor-overlay"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, transparent calc(var(--cy) - 6%), color-mix(in srgb, var(--color-core-purple) 35%, transparent) calc(var(--cy) - 3%), color-mix(in srgb, var(--color-core-white) 15%, transparent) var(--cy), color-mix(in srgb, var(--color-core-green) 25%, transparent) calc(var(--cy) + 3%), transparent calc(var(--cy) + 6%), transparent 100%)",
                mixBlendMode: "screen",
                filter: "contrast(1.15)",
                ["--cy" as never]: `${cursorY}%`,
              }}
            />
          )}
        </AnimatePresence>

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.98)_0%,rgba(0,0,0,0.92)_20%,rgba(0,0,0,0.35)_40%,transparent_60%)]"
        />
      </div>

      <div className="container relative z-10 h-full">
        <div className="absolute left-5 right-5 top-16 md:inset-x-auto md:left-8 md:right-auto md:top-60 md:h-[326px] md:w-[939px] xl:w-[926px]">
          <TextScramble
            as="h1"
            text={t("hero.headline")}
            durationMs={1000}
            className="type-h1 whitespace-pre-line text-white md:absolute md:left-0 md:top-0 md:w-[763px] xl:w-[926px]"
          />
          <div className="mt-8 md:absolute md:left-0 md:top-[180px] md:mt-0">
            <Button
              label={t("hero.cta")}
              variant="primary"
              arrow
              onClick={() => setSubscribeOpen(true)}
            />
          </div>
          <div className="type-eyebrow mt-10 grid grid-cols-1 gap-x-[24px] gap-y-2 text-white md:absolute md:left-0 md:top-[284px] md:mt-0 md:w-[676px] md:grid-cols-[326px_minmax(0,326px)] xl:w-[609px] xl:grid-cols-[293px_minmax(0,292px)]">
            <WordReveal text={t("hero.date")} stepMs={70} startDelayMs={1100} />
            <span>
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
        width={1440}
        height={146}
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-[146px] w-full object-cover"
      />

      <EmailSubscribeDialog
        open={subscribeOpen}
        onClose={() => setSubscribeOpen(false)}
      />
    </section>
  );
}
