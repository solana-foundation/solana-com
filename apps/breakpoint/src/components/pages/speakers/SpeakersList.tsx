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
      <path d="M22.2 0H1.8C1.32261 0 0.864773 0.189642 0.527208 0.527208C0.189642 0.864773 0 1.32261 0 1.8V22.2C0 22.6774 0.189642 23.1352 0.527208 23.4728C0.864773 23.8104 1.32261 24 1.8 24H22.2C22.6774 24 23.1352 23.8104 23.4728 23.4728C23.8104 23.1352 24 22.6774 24 22.2V1.8C24 1.32261 23.8104 0.864773 23.4728 0.527208C23.1352 0.189642 22.6774 0 22.2 0ZM7.2 20.4H3.6V9.6H7.2V20.4ZM5.4 7.5C4.98742 7.48821 4.58746 7.35509 4.2501 7.11729C3.91274 6.87949 3.65294 6.54754 3.50315 6.16293C3.35337 5.77832 3.32025 5.35809 3.40793 4.95476C3.49561 4.55144 3.7002 4.18289 3.99614 3.89517C4.29207 3.60745 4.66624 3.41332 5.07188 3.33704C5.47752 3.26075 5.89664 3.30569 6.27688 3.46625C6.65712 3.62681 6.98162 3.89586 7.20983 4.23978C7.43804 4.5837 7.55983 4.98725 7.56 5.4C7.55052 5.96442 7.318 6.50214 6.91326 6.89564C6.50852 7.28914 5.96446 7.50642 5.4 7.5ZM20.4 20.4H16.8V14.712C16.8 13.008 16.08 12.396 15.144 12.396C14.8696 12.4143 14.6015 12.4866 14.3551 12.6088C14.1087 12.731 13.8888 12.9006 13.7082 13.108C13.5275 13.3154 13.3897 13.5565 13.3025 13.8173C13.2152 14.0782 13.1804 14.3537 13.2 14.628C13.194 14.6838 13.194 14.7402 13.2 14.796V20.4H9.6V9.6H13.08V11.16C13.431 10.626 13.9133 10.1911 14.4806 9.89692C15.0479 9.60276 15.6813 9.4592 16.32 9.48C18.18 9.48 20.352 10.512 20.352 13.872L20.4 20.4Z" />
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

            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
              {speaker.company && (
                <p className={`${EYEBROW_TEXT_CLASS} w-full text-white`}>
                  {speaker.company}
                </p>
              )}
              {speaker.title && (
                <p
                  className={`${EYEBROW_TEXT_CLASS} w-full text-text-secondary`}
                >
                  {speaker.title}
                </p>
              )}
            </div>
          </div>

          {open && hasOpenContent && (
            <div className="flex w-full max-w-[912px] flex-col items-start gap-2">
              {hasSessionDetails && (
                <div className="flex flex-wrap items-center gap-4">
                  {session?.day && (
                    <p className={`${EYEBROW_TEXT_CLASS} text-blue`}>
                      {session.day}
                    </p>
                  )}
                  {session?.format && (
                    <p className={`${EYEBROW_TEXT_CLASS} text-white`}>
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
