"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { accordionButtonClassName } from "@/components/AccordionButton";
import DisclosureIcon from "@/components/DisclosureIcon";
import { publicAssetPath } from "@/config";
import type { BreakpointSpeaker } from "@/content/speakers/types";

const FILTER_OPTIONS = [
  "All Events",
  "Keynote",
  "Fireside",
  "Debate",
  "Product Demo",
] as const;
const EYEBROW_TEXT_CLASS = "type-eyebrow uppercase";

type SortOption = "az" | "za";
type FilterOption = (typeof FILTER_OPTIONS)[number];

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
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <path d="M13.93 10.62L21.47 2H19.68L13.14 9.49L7.91 2H1.88L9.79 13.34L1.88 22.39H3.67L10.58 14.47L16.1 22.39H22.13L13.93 10.62ZM11.48 13.42L10.68 12.3L4.3 3.33H7.05L12.19 10.56L12.99 11.69L19.68 21.12H16.93L11.48 13.42Z" />
    </svg>
  );
}

function normalizeForCompare(value: string | undefined) {
  return (value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function SelectControl({
  id,
  label,
  onChange,
  value,
  children,
}: {
  children: ReactNode;
  id: string;
  label: string;
  onChange: (_value: string) => void;
  value: string;
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
          onChange={(event) => onChange(event.target.value)}
          className="type-button h-10 w-full appearance-none overflow-hidden border border-neutral-700 bg-black pb-2 pl-4 pr-10 pt-2 text-white outline-none focus:border-white"
        >
          {children}
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

  const sourceSuffix = " - " + speaker.company;
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

  useEffect(() => {
    if (!webmSrc || shouldPreferStillImage()) return;

    if (priority) {
      setLoadVideo(true);
      return;
    }

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
  }, [priority, webmSrc]);

  const showVideo = loadVideo && !videoFailed && Boolean(webmSrc);

  return (
    <div
      ref={mediaRef}
      className="relative size-[120px] shrink-0 overflow-hidden bg-neutral-700 md:size-[200px]"
    >
      {pngSrc ? (
        <img
          src={pngSrc}
          alt=""
          width={200}
          height={200}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "low"}
          className={[
            "absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 motion-reduce:transition-none",
            videoReady ? "opacity-0" : "opacity-100",
          ].join(" ")}
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 bg-neutral-700" />
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
          className={[
            "absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 motion-reduce:transition-none",
            videoReady ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <source src={webmSrc} type="video/webm" />
        </video>
      )}
    </div>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string | undefined;
  icon: ReactNode;
  label: string;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex size-6 items-center justify-center text-white transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      onClick={(event) => event.stopPropagation()}
    >
      {icon}
    </a>
  );
}

function SpeakerRow({
  onToggle,
  open,
  priority,
  speaker,
}: {
  onToggle: () => void;
  open: boolean;
  priority: boolean;
  speaker: BreakpointSpeaker;
}) {
  const name = displayName(speaker);
  const session = speaker.session;
  const hasSessionDetails = Boolean(session?.day || session?.format);
  const hasOpenContent = Boolean(session?.title || hasSessionDetails);
  const isOpen = open && hasOpenContent;

  return (
    <article
      className={[
        "relative flex w-full flex-col items-start overflow-hidden p-4 outline outline-1 -outline-offset-1 outline-neutral-700 md:flex-row md:items-center md:justify-between md:gap-0 md:py-6 md:pl-6 md:pr-12",
        isOpen ? "bg-neutral-800" : "bg-black",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-6 pr-0 md:flex-row md:items-center md:justify-center md:gap-[96px] md:pr-16">
        <SpeakerMedia priority={priority} speaker={speaker} />

        <div
          className={[
            "flex min-w-0 flex-1 flex-col items-start justify-end",
            isOpen ? "gap-8" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="flex w-full min-w-0 flex-col gap-m md:flex-row md:items-center md:gap-[120px]">
            <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
              <h2 className="type-h5 w-full text-white">{name}</h2>
              <div className="flex items-center gap-6">
                <SocialLink
                  href={speaker.xUrl}
                  icon={<XIcon />}
                  label={name + " on X"}
                />
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
              {speaker.company && (
                <p className={EYEBROW_TEXT_CLASS + " w-full text-white"}>
                  {speaker.company}
                </p>
              )}
              {speaker.role && (
                <p
                  className={EYEBROW_TEXT_CLASS + " w-full text-text-secondary"}
                >
                  {speaker.role}
                </p>
              )}
            </div>
          </div>

          {isOpen && (
            <div className="flex w-full max-w-[912px] flex-col items-start gap-2">
              {hasSessionDetails && (
                <div className="flex flex-wrap items-center gap-4">
                  {session?.day && (
                    <p className={EYEBROW_TEXT_CLASS + " text-blue"}>
                      {session.day}
                    </p>
                  )}
                  {session?.format && (
                    <p className={EYEBROW_TEXT_CLASS + " text-white"}>
                      {session.format}
                    </p>
                  )}
                </div>
              )}
              {session?.title && (
                <p className="type-p-large w-full text-white">
                  {session.title}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {hasOpenContent && (
        <button
          type="button"
          aria-expanded={isOpen}
          aria-label={(isOpen ? "Collapse " : "Expand ") + name}
          onClick={onToggle}
          className={
            accordionButtonClassName(isOpen) +
            " absolute right-4 top-4 md:static md:self-center"
          }
        >
          <DisclosureIcon open={isOpen} />
        </button>
      )}
    </article>
  );
}

export default function SpeakersList({
  speakers,
}: {
  speakers: BreakpointSpeaker[];
}) {
  const [sort, setSort] = useState<SortOption>("az");
  const [filter, setFilter] = useState<FilterOption>("All Events");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const visibleSpeakers = useMemo(() => {
    const selectedFormat = normalizeForCompare(filter);

    const filtered = [...speakers].filter((speaker) => {
      if (filter === "All Events") return true;
      return normalizeForCompare(speaker.session?.format) === selectedFormat;
    });

    return filtered.sort((a, b) => {
      const byName = a.name.localeCompare(b.name);
      return sort === "az" ? byName : -byName;
    });
  }, [filter, sort, speakers]);

  return (
    <>
      <section
        aria-label="Speaker controls"
        className="container mx-auto flex w-full flex-col gap-m border-b border-neutral-700 pb-s pt-10 min-[560px]:flex-row min-[560px]:items-center min-[560px]:gap-8 md:pt-12"
      >
        <SelectControl
          id="speaker-sort"
          label="Sort"
          value={sort}
          onChange={(value) => setSort(value as SortOption)}
        >
          <option value="az">Alphabetical (A→Z)</option>
          <option value="za">Alphabetical (Z→A)</option>
        </SelectControl>

        <SelectControl
          id="speaker-filter"
          label="Filter"
          value={filter}
          onChange={(value) => setFilter(value as FilterOption)}
        >
          {FILTER_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </SelectControl>
      </section>

      <section
        aria-label="Speakers"
        className="container mx-auto flex w-full flex-col items-start gap-3 pt-m md:pt-12"
      >
        {visibleSpeakers.length > 0 ? (
          visibleSpeakers.map((speaker, index) => (
            <SpeakerRow
              key={speaker.slug}
              speaker={speaker}
              open={openSlug === speaker.slug}
              priority={index === 0}
              onToggle={() =>
                setOpenSlug((current) =>
                  current === speaker.slug ? null : speaker.slug,
                )
              }
            />
          ))
        ) : (
          <div className="w-full border border-neutral-700 px-6 py-12 text-center">
            <p className="type-button-relaxed text-text-secondary">
              No speakers match this filter.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
