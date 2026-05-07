"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "@workspace/i18n/client";
import Button from "@/components/Button";
import YouTubeModal from "@/components/YouTubeModal";
import WordReveal from "@/components/WordReveal";
import ImageTreatment from "@/components/ImageTreatment";
import { BP25_RECAP_YOUTUBE_ID } from "@/content/links";

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
    <section className="bg-black md:pt-[120px]">
      <div className="w-full md:container md:px-8">
        <motion.div
          className="relative aspect-[375/667] w-full overflow-hidden md:aspect-[2/1]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <ImageTreatment
            src="/img/bp25/recap-hero.webp"
            alt=""
            aria-hidden="true"
            glitchPattern="p1"
            intensity={10}
            color="purple"
            lighting="even"
            mouseReactive
            mouseRadius={72}
            overrides={{
              iframes: 5,
              pframes: 1,
              shift: 4,
              block: 18,
            }}
            className="absolute inset-0 h-full w-full"
          />
          <div className="absolute inset-y-0 left-4 z-10 flex w-[343px] flex-col justify-center gap-6 md:w-full md:left-[320px] md:max-w-[500px] md:-translate-x-1/2">
            <WordReveal
              as="p"
              text={t("gallery.eyebrow")}
              stepMs={55}
              startDelayMs={400}
              className="type-eyebrow text-white"
            />
            <WordReveal
              as="h2"
              text={t("gallery.headline")}
              stepMs={85}
              startDelayMs={500}
              className="type-h3 text-white"
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
        </motion.div>
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
