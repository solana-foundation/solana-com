"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImagePath } from "@/config";
import { fadeInUp } from "@/lib/animations";
import type { Speaker } from "@/types/speakers";

type MiamiSpeakersCarouselProps = {
  heading: string;
  speakers: Speaker[];
};

function getSpeakerImageSrc(image: string) {
  if (!image) return "";
  return image.startsWith("http") ? image : getImagePath(image);
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  const imageSrc = getSpeakerImageSrc(speaker.image);

  return (
    <motion.article
      variants={fadeInUp}
      className="group flex min-w-[248px] snap-start flex-col rounded-[28px] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm sm:min-w-[280px] sm:p-5"
    >
      <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-[22px] bg-white/5">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={speaker.name}
            fill
            sizes="(max-width: 640px) 248px, 280px"
            className="object-cover grayscale transition duration-300 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-accelerate-purple/20 via-transparent to-accelerate-cyan/20 text-center text-2xl uppercase tracking-[0.2em] text-white/40">
            {speaker.firstName.slice(0, 1)}
            {speaker.lastName.slice(0, 1)}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-[24px] font-light uppercase leading-[0.92] tracking-[0.08em] text-white transition-colors group-hover:text-accelerate-green">
          <span className="block">{speaker.firstName || speaker.name}</span>
          {speaker.lastName ? (
            <span className="block">{speaker.lastName}</span>
          ) : null}
        </h3>
        {speaker.company ? (
          <p className="font-diatype text-[18px] leading-tight text-white">
            {speaker.company}
          </p>
        ) : null}
        {speaker.title ? (
          <p className="font-diatype text-sm leading-snug text-white/70">
            {speaker.title}
          </p>
        ) : null}
      </div>
    </motion.article>
  );
}

export function MiamiSpeakersCarousel({
  heading,
  speakers,
}: MiamiSpeakersCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (direction: "prev" | "next") => {
    const container = containerRef.current;
    if (!container) return;

    const amount = Math.round(container.clientWidth * 0.82);
    container.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  if (!speakers.length) return null;

  return (
    <section id="speakers" className="section-accelerate overflow-hidden">
      <div className="container-accelerate">
        <div className="mb-8 flex items-end justify-between gap-4 lg:mb-10">
          <div>
            <p className="mb-3 font-diatype text-sm uppercase tracking-[0.24em] text-white/45">
              Miami
            </p>
            <h2 className="section-heading !mb-0">{heading}</h2>
          </div>
          <div className="hidden gap-3 sm:flex">
            <button
              type="button"
              onClick={() => scrollByCards("prev")}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white transition hover:border-white/35 hover:bg-white/[0.07]"
              aria-label="Previous speakers"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCards("next")}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white transition hover:border-white/35 hover:bg-white/[0.07]"
              aria-label="Next speakers"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-white/18 to-transparent" />

        <div
          ref={containerRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-5"
        >
          {speakers.map((speaker) => (
            <SpeakerCard key={speaker.slug} speaker={speaker} />
          ))}
        </div>
      </div>
    </section>
  );
}
