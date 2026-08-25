"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { publicAssetPath } from "@/config";
import type { BreakpointSpeaker } from "@/content/speakers/types";

type SortOption = "az" | "za";

function ArrowDownIcon() {
  return (
    <svg
      aria-hidden="true"
      width="8"
      height="4"
      viewBox="0 0 8 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
    >
      <path d="M0 0L4 4L8 0H0Z" fill="currentColor" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <path d="M13.93 10.62L21.47 2H19.68L13.14 9.49L7.91 2H1.88L9.79 13.34L1.88 22.39H3.67L10.58 14.47L16.1 22.39H22.13L13.93 10.62ZM11.48 13.42L10.68 12.3L4.3 3.33H7.05L12.19 10.56L12.99 11.69L19.68 21.12H16.93L11.48 13.42Z" />
    </svg>
  );
}

function SelectControl({
  id,
  label,
  onChange,
  value,
}: {
  id: string;
  label: string;
  onChange: (_value: SortOption) => void;
  value: SortOption;
}) {
  return (
    <label
      htmlFor={id}
      className="flex w-full min-w-0 flex-col justify-center gap-[13px] min-[560px]:w-auto"
    >
      <span className="type-button text-text-secondary">{label}</span>
      <span className="relative block w-full min-[560px]:w-[240px]">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value as SortOption)}
          className="type-button h-10 w-full appearance-none overflow-hidden border border-neutral-700 bg-black pb-2 pl-4 pr-10 pt-2 text-white outline-none focus:border-white"
        >
          <option value="az">Alphabetical (A→Z)</option>
          <option value="za">Alphabetical (Z→A)</option>
        </select>
        <ArrowDownIcon />
      </span>
    </label>
  );
}

type NetworkInformation = {
  effectiveType?: string;
  saveData?: boolean;
};

function shouldPreferStillImage() {
  const connection = (
    navigator as Navigator & { connection?: NetworkInformation }
  ).connection;

  return (
    connection?.saveData === true ||
    ["slow-2g", "2g"].includes(connection?.effectiveType ?? "") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function displayName(speaker: BreakpointSpeaker) {
  if (!speaker.company) return speaker.name;

  const sourceSuffix = ` - ${speaker.company}`;
  return speaker.name.endsWith(sourceSuffix)
    ? speaker.name.slice(0, -sourceSuffix.length)
    : speaker.name;
}

function SpeakerMedia({
  priority,
  speaker,
}: {
  priority: boolean;
  speaker: BreakpointSpeaker;
}) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const pngSrc = speaker.headshotPng
    ? publicAssetPath(speaker.headshotPng)
    : undefined;
  const webmSrc = speaker.headshotWebm
    ? publicAssetPath(speaker.headshotWebm)
    : undefined;
  const name = displayName(speaker);

  useEffect(() => {
    if (!webmSrc || shouldPreferStillImage()) return;

    const element = mediaRef.current;
    if (!element || !("IntersectionObserver" in window)) {
      setLoadVideo(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setLoadVideo(true);
        observer.disconnect();
      },
      { rootMargin: "160px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [webmSrc]);

  const showVideo = loadVideo && !videoFailed && Boolean(webmSrc);

  return (
    <div
      ref={mediaRef}
      className="relative aspect-[4/5] overflow-hidden bg-neutral-800"
    >
      {pngSrc ? (
        <img
          src={pngSrc}
          alt={`${name} headshot`}
          width={640}
          height={800}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "low"}
          className={`absolute inset-0 h-full w-full object-cover object-top grayscale transition-opacity duration-500 motion-reduce:transition-none ${videoReady ? "opacity-0" : "opacity-100"}`}
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 bg-neutral-800" />
      )}

      {showVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={pngSrc}
          aria-hidden="true"
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover object-top grayscale transition-opacity duration-500 motion-reduce:transition-none ${videoReady ? "opacity-100" : "opacity-0"}`}
        >
          <source src={webmSrc} type="video/webm" />
        </video>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
      />
    </div>
  );
}

function SocialLink({
  href,
  name,
}: {
  href: string | undefined;
  name: string;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${name} on X`}
      className="flex size-8 items-center justify-center border border-neutral-700 text-white transition-colors hover:border-neutral-500 hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <XIcon />
    </a>
  );
}

function SpeakerCard({
  priority,
  speaker,
}: {
  priority: boolean;
  speaker: BreakpointSpeaker;
}) {
  const name = displayName(speaker);

  return (
    <article className="bp-speaker-card group flex min-w-0 flex-col overflow-hidden border border-neutral-700 bg-black transition-colors hover:border-neutral-500">
      <SpeakerMedia priority={priority} speaker={speaker} />

      <div className="flex min-h-[184px] flex-1 flex-col justify-between gap-s p-s md:min-h-[200px]">
        <h2 className="type-h5 max-w-[18ch] text-white">{name}</h2>

        <div className="flex items-end justify-between gap-s">
          <div className="flex min-w-0 flex-col gap-1">
            {speaker.company && (
              <p className="type-eyebrow w-full text-green">
                {speaker.company}
              </p>
            )}
            {speaker.role && (
              <p className="type-eyebrow w-full text-text-secondary">
                {speaker.role}
              </p>
            )}
          </div>
          <SocialLink href={speaker.xUrl} name={name} />
        </div>
      </div>
    </article>
  );
}

export default function SpeakersList({
  speakers,
}: {
  speakers: BreakpointSpeaker[];
}) {
  const [sort, setSort] = useState<SortOption>("az");

  const visibleSpeakers = useMemo(
    () =>
      [...speakers].sort((a, b) => {
        const byName = a.name.localeCompare(b.name);
        return sort === "az" ? byName : -byName;
      }),
    [sort, speakers],
  );

  return (
    <>
      <section
        aria-label="Speaker controls"
        className="container mx-auto flex w-full flex-col gap-m border-b border-neutral-700 pb-s pt-10 min-[560px]:flex-row min-[560px]:items-end min-[560px]:justify-between min-[560px]:gap-8 md:pt-12"
      >
        <div className="flex flex-col gap-2">
          <p className="type-eyebrow text-green">Confirmed speakers</p>
          <p className="type-paragraph text-text-secondary">
            {speakers.length} {speakers.length === 1 ? "speaker" : "speakers"}{" "}
            announced
          </p>
        </div>
        <SelectControl
          id="speaker-sort"
          label="Sort"
          value={sort}
          onChange={setSort}
        />
      </section>

      <section
        aria-label="Speakers"
        className="container mx-auto w-full pt-m md:pt-l"
      >
        {visibleSpeakers.length > 0 ? (
          <div className="grid w-full grid-cols-1 gap-3 min-[560px]:grid-cols-2 xl:grid-cols-3">
            {visibleSpeakers.map((speaker, index) => (
              <SpeakerCard
                key={speaker.slug}
                priority={index < 2}
                speaker={speaker}
              />
            ))}
          </div>
        ) : (
          <div className="w-full border border-neutral-700 px-6 py-12 text-center">
            <p className="type-button-relaxed text-text-secondary">
              Speaker details are coming soon.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
