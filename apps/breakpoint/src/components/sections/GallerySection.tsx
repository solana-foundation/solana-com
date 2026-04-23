"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import YouTubeModal from "@/components/YouTubeModal";
import WordReveal from "@/components/WordReveal";
import ImageTreatment from "@/components/ImageTreatment";
import { useInView } from "@/hooks/useInView";

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
  const [mediaRef, mediaInView] = useInView<HTMLDivElement>(0.2);

  return (
    <section className="bg-black pt-20 md:pt-[120px]">
      <div className="container md:px-8">
        <div
          ref={mediaRef}
          className="relative aspect-[2/1] w-full overflow-hidden transition-opacity duration-700 ease-out"
          style={{ opacity: mediaInView ? 1 : 0 }}
        >
          <ImageTreatment
            src="/img/bp25/recap-hero.webp"
            alt=""
            aria-hidden="true"
            glitchPattern="p1"
            intensity={20}
            color="purple"
            lighting="even"
            motion
            mouseReactive
            className="absolute inset-0 h-full w-full"
          />
          <div className="absolute inset-y-0 left-5 z-10 flex w-full max-w-[500px] flex-col justify-center gap-6 md:left-[calc(50%-350px)] md:-translate-x-1/2">
            <WordReveal
              as="p"
              text={t("gallery.eyebrow")}
              stepMs={55}
              startDelayMs={400}
              className="font-mono !text-[16px] !font-normal uppercase !leading-[1.3] !tracking-[0.08em] !text-white"
            />
            <WordReveal
              as="p"
              text={t("gallery.headline")}
              stepMs={85}
              startDelayMs={500}
              className="font-sans !text-[32px] !font-normal !leading-[1.15] !tracking-[-0.02em] !text-white md:!text-[48px]"
            />
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
