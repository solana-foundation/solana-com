"use client";

import { useCallback, useRef } from "react";
import Button from "@/components/Button";
import CarouselControls from "@/components/CarouselControls";
import SectionHeadline from "@/components/SectionHeadline";
import { publicAssetPath } from "@/config";
import type { BreakpointSpeaker } from "@/content/speakers/types";

type SpeakersCarouselProps = {
  ctaLabel: string;
  eyebrow: string;
  headline: string;
  speakers: BreakpointSpeaker[];
};

function displayName(speaker: BreakpointSpeaker) {
  if (!speaker.company) return speaker.name;

  const sourceSuffix = " - " + speaker.company;
  return speaker.name.endsWith(sourceSuffix)
    ? speaker.name.slice(0, -sourceSuffix.length)
    : speaker.name;
}

function SpeakerCard({ speaker }: { speaker: BreakpointSpeaker }) {
  const name = displayName(speaker);
  const imageSrc = speaker.headshotPng
    ? publicAssetPath(speaker.headshotPng)
    : undefined;

  return (
    <li
      data-speaker-card
      className="w-[calc(100%-20px)] shrink-0 snap-start md:w-[calc((100%-48px)/3)]"
    >
      <article>
        <div className="relative aspect-square overflow-hidden bg-neutral-800">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt=""
              width={460}
              height={460}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <div aria-hidden="true" className="absolute inset-0" />
          )}
        </div>

        <div className="flex h-[106px] flex-col items-start gap-3xs py-xs text-white">
          <h3 className="text-lg font-bold leading-[1.45]">{name}</h3>
          <div className="flex flex-col gap-4xs">
            {speaker.company && (
              <p className="type-eyebrow text-white">{speaker.company}</p>
            )}
            {speaker.role && (
              <p className="type-eyebrow text-white">{speaker.role}</p>
            )}
          </div>
        </div>
      </article>
    </li>
  );
}

export default function SpeakersCarousel({
  ctaLabel,
  eyebrow,
  headline,
  speakers,
}: SpeakersCarouselProps) {
  const scrollRef = useRef<HTMLUListElement>(null);

  const scrollByCard = useCallback((direction: number) => {
    const track = scrollRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>("[data-speaker-card]");
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const distance = card ? card.offsetWidth + gap : track.clientWidth;
    track.scrollBy({
      behavior: "smooth",
      left: direction * distance,
    });
  }, []);

  return (
    <div
      aria-label={headline}
      aria-roledescription="carousel"
      className="flex flex-col items-center gap-l"
      role="region"
    >
      <div className="max-w-[780px]">
        <SectionHeadline
          alignment="center"
          eyebrow={eyebrow}
          headline={headline}
        />
      </div>

      <div className="-mt-s w-full">
        <div className="flex flex-col items-center gap-xs md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
          <Button
            arrow
            className="md:col-start-2"
            href="/speakers"
            label={ctaLabel}
          />
          <CarouselControls
            buttonClassName="!size-10"
            className="md:col-start-3 md:justify-self-end"
            labelPrefix={headline}
            onNext={() => scrollByCard(1)}
            onPrev={() => scrollByCard(-1)}
          />
        </div>
      </div>

      <ul
        ref={scrollRef}
        aria-label={headline}
        className="unstyled-list scrollbar-hidden -mr-[20px] flex w-full touch-pan-x snap-x snap-mandatory gap-s overflow-x-auto overscroll-x-contain p-0 pr-[20px] [-webkit-overflow-scrolling:touch] md:mr-0 md:gap-s md:pr-0"
      >
        {speakers.map((speaker) => (
          <SpeakerCard key={speaker.slug} speaker={speaker} />
        ))}
      </ul>
    </div>
  );
}
