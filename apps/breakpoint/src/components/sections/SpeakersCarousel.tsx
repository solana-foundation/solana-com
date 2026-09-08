"use client";

import Button from "@/components/Button";
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
    <li className="min-w-0">
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
  return (
    <div className="flex flex-col items-center gap-l">
      <div className="max-w-[780px]">
        <SectionHeadline
          alignment="center"
          eyebrow={eyebrow}
          headline={headline}
        >
          <Button arrow href="/speakers" label={ctaLabel} />
        </SectionHeadline>
      </div>

      <ul className="unstyled-list grid w-full grid-cols-1 gap-s p-0 md:grid-cols-3">
        {speakers.slice(0, 3).map((speaker) => (
          <SpeakerCard key={speaker.slug} speaker={speaker} />
        ))}
      </ul>
    </div>
  );
}
