"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import YouTubeModal from "@/components/YouTubeModal";

const BP25_RECAP_YOUTUBE_ID = "394wb968J68";

function PlayIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="inline-block"
    >
      <path d="M3.5 2.25L13 8L3.5 13.75V2.25Z" fill="currentColor" />
    </svg>
  );
}

export default function GallerySection() {
  const t = useTranslations("breakpoint");
  const [recapOpen, setRecapOpen] = useState(false);

  return (
    <section className="bg-black px-5 pt-20 md:px-8 md:pt-[120px]">
      <div className="mx-auto w-full max-w-[1376px]">
        <div className="relative aspect-[2/1] w-full overflow-hidden">
          <img
            src="/img/bp25/recap-hero.webp"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-y-0 left-5 z-10 flex w-full max-w-[500px] flex-col justify-center gap-6 md:left-[calc(50%-350px)] md:-translate-x-1/2 md:transform">
            <p className="font-mono !text-[16px] !font-normal uppercase !leading-[1.3] !tracking-[0.08em] !text-white">
              {t("gallery.eyebrow")}
            </p>
            <p className="font-sans !text-[32px] !font-normal !leading-[1.15] !tracking-[-0.02em] !text-white md:!text-[48px]">
              {t("gallery.headline")}
            </p>
            <div>
              <Button
                label={t("gallery.cta")}
                variant="primary"
                iconLeft={<PlayIcon />}
                onClick={() => setRecapOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      <YouTubeModal
        open={recapOpen}
        onClose={() => setRecapOpen(false)}
        videoId={BP25_RECAP_YOUTUBE_ID}
        title="Breakpoint 2025 Recap"
      />
    </section>
  );
}
