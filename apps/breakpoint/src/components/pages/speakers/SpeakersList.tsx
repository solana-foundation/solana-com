"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { accordionButtonClassName } from "@/components/AccordionButton";
import DisclosureIcon from "@/components/DisclosureIcon";
import type { BreakpointSpeaker } from "@/content/speakers/types";

const FILTER_OPTIONS = [
  "All Events",
  "Keynote",
  "Fireside",
  "Debate",
  "Product Demo",
] as const;

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

function GlobeIcon() {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12H21" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 3C14.4 5.45 15.6 8.45 15.6 12C15.6 15.55 14.4 18.55 12 21C9.6 18.55 8.4 15.55 8.4 12C8.4 8.45 9.6 5.45 12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function LinkedInIcon() {
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
      <path d="M6.94 8.98H3.72V20H6.94V8.98Z" />
      <path d="M5.33 4C4.29 4 3.45 4.78 3.45 5.77C3.45 6.76 4.29 7.55 5.33 7.55C6.37 7.55 7.21 6.76 7.21 5.77C7.21 4.78 6.37 4 5.33 4Z" />
      <path d="M20.55 13.95C20.55 10.67 18.8 8.72 15.98 8.72C14.68 8.72 13.75 9.43 13.37 10.11H13.33V8.98H10.24V20H13.46V14.55C13.46 13.11 13.73 11.72 15.51 11.72C17.26 11.72 17.29 13.36 17.29 14.64V20H20.55V13.95Z" />
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
      className="flex w-full min-w-0 flex-col justify-center gap-[13px] min-[376px]:w-auto"
    >
      <span className="type-button text-text-secondary">{label}</span>
      <span className="relative block w-full min-[376px]:w-[240px]">
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

function SpeakerImage({ speaker }: { speaker: BreakpointSpeaker }) {
  if (!speaker.image) {
    return (
      <div
        aria-hidden="true"
        className="size-[120px] shrink-0 bg-neutral-700 md:size-[200px]"
      />
    );
  }

  return (
    <div className="size-[120px] shrink-0 overflow-hidden bg-neutral-700 md:size-[200px]">
      <img
        src={speaker.image}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover object-top grayscale"
      />
    </div>
  );
}

function SpeakerRow({
  designPreview = false,
  open,
  speaker,
  onToggle,
}: {
  designPreview?: boolean;
  onToggle: () => void;
  open: boolean;
  speaker: BreakpointSpeaker;
}) {
  const session = speaker.session;
  const hasSessionDetails = Boolean(session?.day || session?.format);
  const hasOpenContent = Boolean(session?.title || hasSessionDetails);
  const hasSocialLinks = Boolean(
    speaker.socials.website || speaker.socials.x || speaker.socials.linkedin,
  );
  const hasCompany = Boolean(speaker.company);
  const hasDetails = Boolean(speaker.company || speaker.title);
  const designPreviewHeightClass =
    designPreview && open && hasOpenContent
      ? "h-[475px] md:h-auto"
      : designPreview && hasSocialLinks && hasCompany
        ? "h-[324px] md:h-auto"
        : designPreview && hasSocialLinks
          ? "h-[299px] md:h-auto"
          : designPreview && hasDetails
            ? "h-[284px] md:h-auto"
            : "";

  return (
    <article
      className={`relative flex w-full flex-col items-start overflow-hidden p-4 outline outline-1 -outline-offset-1 outline-neutral-700 md:flex-row md:items-center md:justify-between md:gap-0 md:py-6 md:pl-6 md:pr-12 ${designPreviewHeightClass} ${
        open ? "bg-neutral-800" : "bg-black"
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-6 pr-0 md:flex-row md:items-center md:justify-center md:gap-[96px] md:pr-16">
        <SpeakerImage speaker={speaker} />

        <div
          className={`flex min-w-0 flex-1 flex-col items-start justify-end ${
            open && hasOpenContent ? "gap-8" : ""
          }`}
        >
          <div className="flex w-full min-w-0 flex-col gap-m md:flex-row md:items-center md:gap-[120px]">
            <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
              <h2 className="type-h5 w-full text-white">{speaker.name}</h2>
              <div className="flex items-center gap-6">
                <SocialLink
                  href={speaker.socials.website}
                  icon={<GlobeIcon />}
                  label={`${speaker.name} website`}
                />
                <SocialLink
                  href={speaker.socials.x}
                  icon={<XIcon />}
                  label={`${speaker.name} on X`}
                />
                <SocialLink
                  href={speaker.socials.linkedin}
                  icon={<LinkedInIcon />}
                  label={`${speaker.name} on LinkedIn`}
                />
              </div>
            </div>

            <div className="type-eyebrow flex min-w-0 flex-1 flex-col justify-center gap-1">
              {speaker.company && (
                <p className="w-full text-white">{speaker.company}</p>
              )}
              {speaker.title && (
                <p className="w-full text-text-secondary">{speaker.title}</p>
              )}
            </div>
          </div>

          {open && hasOpenContent && (
            <div className="flex w-full max-w-[912px] flex-col items-start gap-2">
              {hasSessionDetails && (
                <div className="type-meta-responsive flex flex-wrap items-center gap-4">
                  {session?.day && <p className="text-blue">{session.day}</p>}
                  {session?.format && (
                    <p className="text-white">{session.format}</p>
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

      <button
        type="button"
        aria-expanded={open}
        aria-label={`${open ? "Collapse" : "Expand"} ${speaker.name}`}
        onClick={onToggle}
        className={`${accordionButtonClassName(open)} absolute right-4 top-4 md:static md:self-center`}
      >
        <DisclosureIcon open={open} />
      </button>
    </article>
  );
}

export default function SpeakersList({
  designPreview = false,
  initialOpenSlug,
  preserveOrder = false,
  speakers,
}: {
  designPreview?: boolean;
  initialOpenSlug?: string;
  preserveOrder?: boolean;
  speakers: BreakpointSpeaker[];
}) {
  const [sort, setSort] = useState<SortOption>("az");
  const [filter, setFilter] = useState<FilterOption>("All Events");
  const [openSlug, setOpenSlug] = useState<string | null>(
    initialOpenSlug ?? null,
  );

  const visibleSpeakers = useMemo(() => {
    const selectedFormat = normalizeForCompare(filter);

    const filtered = [...speakers].filter((speaker) => {
      if (filter === "All Events") return true;
      return normalizeForCompare(speaker.session?.format) === selectedFormat;
    });

    if (preserveOrder) {
      return filtered.sort((a, b) => a.sortOrder - b.sortOrder);
    }

    return filtered.sort((a, b) => {
      const byName = a.name.localeCompare(b.name);
      return sort === "az" ? byName : -byName;
    });
  }, [filter, preserveOrder, sort, speakers]);

  return (
    <>
      <section
        aria-label="Speaker controls"
        className="flex w-full flex-col gap-m border-b border-neutral-700 pb-s pl-xs pr-m pt-m min-[376px]:flex-row min-[376px]:items-center min-[376px]:gap-8 md:px-8 md:pt-12"
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
        className="flex w-full flex-col items-start gap-3 px-xs pt-m md:px-8 md:pt-12"
      >
        {visibleSpeakers.length > 0 ? (
          visibleSpeakers.map((speaker) => (
            <SpeakerRow
              key={speaker.slug}
              speaker={speaker}
              designPreview={designPreview}
              open={openSlug === speaker.slug}
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
