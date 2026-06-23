"use client";

import React from "react";
import type { ComponentType } from "react";
import Image from "next/image";
import UnicornScene from "unicornstudio-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/utils";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export type SkylineHeroStat = {
  value: string;
  label: string;
  Icon?:
    | string
    | ComponentType<{
        className?: string;
        size?: string | number;
        "aria-hidden"?: boolean;
      }>;
};

export type SkylineHeroProps = {
  title: string;
  subtitle: string;
  primaryCta?: string;
  primaryCtaHref?: string;
  secondaryCta?: string;
  secondaryCtaHref?: string;
  stats?: SkylineHeroStat[];
  /** Full-bleed cityscape image (webp). */
  imageSrc: string;
  /** Animated WebGL atmosphere layered over the sky. */
  bgJsonFilePath?: string;
};

/**
 * Photographic hero for the Skyline page. A bright daytime cityscape sits
 * full-bleed behind the content, the Unicorn Studio animation is screen-blended
 * over the sky so the motion reads as light moving through the scene, and soft
 * scrims keep the copy legible while letting the section melt into the black
 * page below.
 */
export const SkylineHero: React.FC<SkylineHeroProps> = ({
  title,
  subtitle,
  primaryCta,
  primaryCtaHref,
  secondaryCta,
  secondaryCtaHref,
  stats,
  imageSrc,
  bgJsonFilePath,
}) => {
  const statsCount = stats?.length ?? 0;
  const hasStats = statsCount > 0;

  const { ref: statsRef, isIntersecting } =
    useIntersectionObserver<HTMLDivElement>({
      threshold: 0.2,
      triggerOnce: true,
    });

  const titleNodes = React.useMemo(
    () =>
      title.split(/(\n)/).map((part, idx) =>
        part === "\n" ? (
          <React.Fragment key={idx}>
            <br />
          </React.Fragment>
        ) : (
          part
        ),
      ),
    [title],
  );

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#dcecf7] text-white text-left"
      aria-labelledby="hero-title"
    >
      {/* Cityscape photo — full-bleed, anchored low so the skyline reads at every
          width. Contrast/saturation lifted to sit on-brand against the gradient. */}
      <Image
        src={imageSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover object-[center_78%] md:object-[center_60%] brightness-[1.12] contrast-[1.05] saturate-[0.85]"
      />

      {/* Animated atmosphere, screen-blended into the sky */}
      {bgJsonFilePath && (
        <UnicornScene
          className="!absolute inset-0 z-[1] mix-blend-screen opacity-35"
          jsonFilePath={bgJsonFilePath}
          width="100%"
          height="100%"
          scale={1}
          dpi={typeof window !== "undefined" ? window.devicePixelRatio : 2}
          fps={30}
          lazyLoad={true}
          production={true}
          onError={(error) => console.error("UnicornScene error:", error)}
        />
      )}

      {/* Solana brand gradient (purple → cyan → green), overlay-blended to recolor
          the scene toward the logo palette and deepen contrast. */}
      <div
        aria-hidden={true}
        className="absolute inset-0 z-[2] mix-blend-overlay opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(120deg, #9945FF 0%, #6570ED 26%, #00D4FF 52%, #0AE99F 78%, #14F195 100%)",
        }}
      />
      {/* A softer second pass adds saturation in the highlights without flattening. */}
      <div
        aria-hidden={true}
        className="absolute inset-0 z-[2] mix-blend-soft-light opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(160deg, #9945FF 0%, transparent 50%, #14F195 100%)",
        }}
      />

      {/* Scrims: soft top wash for the headline, strong bottom fade into the page */}
      <div
        aria-hidden={true}
        className="absolute inset-0 z-[3] bg-gradient-to-b from-white/10 via-transparent to-black/70 md:from-white/5 md:to-black/75"
      />
      <div
        aria-hidden={true}
        className="absolute inset-0 z-[3] bg-gradient-to-r from-black/40 via-black/5 to-transparent"
      />

      <div className="relative z-10 max-w-[1440px] mx-auto flex flex-col min-h-[680px] md:min-h-[760px] xl:min-h-[840px] justify-between">
        {/* Hero Content */}
        <div className="px-[20px] md:px-[32px] xl:px-[40px] pt-[84px] md:pt-[120px] xl:pt-[136px] pb-12 max-w-5xl">
          <h1
            id="hero-title"
            className="m-0 font-brand font-medium leading-[1.1] md:leading-none text-[40px] md:text-[56px] xl:text-[88px] [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]"
          >
            {titleNodes}
          </h1>
          <p className="text-white/88 text-lg md:text-2xl mt-[12px] xl:mt-[24px] mb-0 max-w-xl leading-[1.33] [text-shadow:0_1px_16px_rgba(0,0,0,0.4)]">
            {subtitle}
          </p>

          {((primaryCta && primaryCtaHref) ||
            (secondaryCta && secondaryCtaHref)) && (
            <div className="mt-[32px] xl:mt-[48px] flex flex-wrap items-center gap-3">
              {primaryCta && primaryCtaHref && (
                <Button
                  className="rounded-full text-base md:text-lg px-5 bg-white text-black hover:!bg-white/90"
                  size="lg"
                  asChild
                >
                  <a
                    href={primaryCtaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={primaryCta}
                  >
                    {primaryCta}
                  </a>
                </Button>
              )}
              {secondaryCta && secondaryCtaHref && (
                <Button
                  className="rounded-full text-base md:text-lg px-5 bg-white/10 border border-white/25 text-white backdrop-blur-md hover:!bg-white/20"
                  size="lg"
                  asChild
                >
                  <a
                    href={secondaryCtaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={secondaryCta}
                  >
                    {secondaryCta}
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        {hasStats && (
          <div ref={statsRef} className="w-full xl:pb-10">
            <div
              className={cn(
                "grid grid-cols-2 xl:grid-cols-4 w-full xl:min-h-44",
                {
                  "xl:grid-cols-2": statsCount === 2,
                  "xl:grid-cols-3": statsCount === 3,
                  "xl:grid-cols-4": statsCount > 3,
                },
              )}
            >
              {stats?.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    "p-[16px] xl:p-[16px_24px] flex flex-col justify-between gap-4 max-xl:border-t border-white/20",
                    {
                      "border-l": index % 2,
                      "xl:border-l": index,
                      "animate-fade-in-up": isIntersecting,
                    },
                  )}
                  style={
                    isIntersecting
                      ? { animationDelay: `${0.1 + index * 0.1}s` }
                      : { opacity: 0 }
                  }
                >
                  <div className="max-md:hidden">
                    {stat.Icon && typeof stat.Icon === "string" ? (
                      <Image
                        src={stat.Icon}
                        alt=""
                        width={32}
                        height={32}
                        className="xl:size-8 md:size-5"
                      />
                    ) : stat.Icon ? (
                      <stat.Icon className="xl:size-8 md:size-5" />
                    ) : null}
                  </div>
                  <div>
                    <div className="text-[20px] xl:text-[40px] leading-none uppercase font-light">
                      {stat.value}
                    </div>
                    <div className="mt-[6px] md:mt-[8px] text-[14px] md:text-[18px] font-medium leading-[1.42] md:leading-[1.44] xl:leading-[1.33]">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
              {statsCount % 2 !== 0 && (
                <div
                  className={cn(
                    "p-[16px] xl:p-[16px_24px] flex flex-col justify-between gap-4 max-xl:border-t border-white/20 xl:hidden border-l",
                    {
                      "animate-fade-in-up": isIntersecting,
                    },
                  )}
                  style={
                    isIntersecting
                      ? { animationDelay: `${0.1 + statsCount * 0.1}s` }
                      : { opacity: 0 }
                  }
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
