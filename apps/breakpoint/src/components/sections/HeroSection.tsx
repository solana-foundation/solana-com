"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "@workspace/i18n/client";
import Button from "@/components/Button";
import EmailSubscribeDialog from "@/components/EmailSubscribeDialog";
import ImageTreatment from "@/components/ImageTreatment";
import TextScramble from "@/components/TextScramble";
import WordReveal from "@/components/WordReveal";
import { publicAssetPath } from "@/config";
import { useVariant } from "@/lib/use-variant";

export default function HeroSection() {
  const t = useTranslations("breakpoint");
  const variant = useVariant();
  const [interacting, setInteracting] = useState(false);
  const [cursorY, setCursorY] = useState(50);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const mediaRef = useRef<HTMLDivElement>(null);

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
    <section className="relative h-[667px] w-full overflow-hidden bg-black md:h-[566px]">
      <div
        ref={mediaRef}
        aria-hidden="true"
        className="absolute inset-0"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setInteracting(false)}
      >
        <ImageTreatment
          src="/assets/home-hero.webp"
          alt=""
          glitchPattern={prefersReducedMotion ? "none" : "p1"}
          intensity={interacting ? 45 : 35}
          lighting="even"
          color="purple"
          motion={!prefersReducedMotion}
          flicker={!prefersReducedMotion && !interacting}
          mouseReactive={!prefersReducedMotion}
          className="absolute inset-0 h-full w-full"
          overrides={{
            exposure: 1,
            contrast: 0,
            animSpeed: interacting ? 0.32 : 0.24,
          }}
        />

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
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.6)_20%,rgba(0,0,0,0.35)_40%,transparent_60%)]"
        />
      </div>

      <div className="container relative z-10 h-full">
        <div
          className={`absolute left-4 right-4 md:inset-x-auto md:left-8 md:right-auto md:top-60 md:h-[326px] md:w-[939px] xl:w-[926px] ${
            // Variant headlines run to four lines on mobile; start higher so
            // the date/venue block stays inside the fixed-height hero.
            variant ? "top-[224px]" : "top-[283px]"
          }`}
        >
          <TextScramble
            key={variant?.slug ?? "default"}
            as="h1"
            text={variant?.heroHeadline ?? t("hero.headline")}
            durationMs={1000}
            className={
              variant?.compactHeroHeadline
                ? "type-h3 whitespace-pre-line text-white md:absolute md:left-0 md:top-0 md:w-[763px] xl:w-[926px]"
                : "type-h1 whitespace-pre-line text-white md:absolute md:left-0 md:top-0 md:w-[763px] xl:w-[926px]"
            }
          />
          <div
            className={
              variant
                ? "mt-8 flex flex-col items-start gap-2xs md:absolute md:left-0 md:top-[180px] md:mt-0"
                : "mt-8 md:absolute md:left-0 md:top-[180px] md:mt-0"
            }
          >
            {variant ? (
              <>
                <div className="flex flex-wrap items-center gap-xs">
                  <Button
                    label={variant.heroCtaLabel}
                    variant="primary"
                    arrow
                    href={variant.heroCtaHref}
                  />
                  {variant.heroOriginalPrice && (
                    <span
                      className="type-eyebrow text-white/70 line-through"
                      aria-label={`Original price ${variant.heroOriginalPrice}`}
                    >
                      {variant.heroOriginalPrice}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <Button
                label={t("hero.cta")}
                variant="primary"
                arrow
                onClick={() => setSubscribeOpen(true)}
              />
            )}
          </div>
          <div className="type-eyebrow mt-12 grid w-[326px] max-w-full grid-cols-1 gap-x-[24px] gap-y-6 text-white md:absolute md:left-0 md:top-[284px] md:mt-0 md:w-[676px] md:grid-cols-[326px_minmax(0,326px)] md:gap-y-2 xl:w-[609px] xl:grid-cols-[293px_minmax(0,292px)]">
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
        src={publicAssetPath("/assets/pixel-edge.svg")}
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
