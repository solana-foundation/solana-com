"use client";

import React, { useCallback, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import Button from "@/components/Button";
import EmailSubscribeForm from "@/components/EmailSubscribeForm";
import type { NextEditionAnnouncement } from "@/content/next-edition";
import { formatEventDateRange } from "@/lib/event-dates";
import { useModalDialog } from "@/lib/use-modal-dialog";

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M3.5 2.25L13 8L3.5 13.75V2.25Z" fill="currentColor" />
    </svg>
  );
}

interface Props {
  announcement: NextEditionAnnouncement;
  className?: string;
}

/**
 * Next-edition announcement as one bar. The whole bar is the click target and
 * opens a dialog with the announcement video on top and the updates
 * email signup underneath. Unconfirmed (`null`) facts are left out; with
 * neither a video nor a signup form the bar is plain text.
 */
export default function NextEditionBar({
  announcement,
  className = "",
}: Props) {
  const t = useTranslations("breakpoint.nextEdition");
  const tAccessibility = useTranslations("breakpoint.accessibility");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  useModalDialog(open, close, dialogRef, closeButtonRef);

  const copyValues = {
    year: announcement.year,
    shortName: announcement.shortName,
  };
  const eyebrow = t("eyebrow", copyValues);
  const headline = announcement.city
    ? t("headline", { ...copyValues, city: announcement.city })
    : t("headlineNoCity", copyValues);
  const location = [announcement.city, announcement.region]
    .filter(Boolean)
    .join(", ");
  const details = [
    formatEventDateRange(locale, announcement.startDate, announcement.endDate),
    announcement.venue,
    location,
  ]
    .filter(Boolean)
    .join(" · ");

  const { videoId, signupFormId } = announcement;
  const cta =
    videoId && signupFormId
      ? t("cta.watchAndRegister")
      : videoId
        ? t("cta.watch")
        : signupFormId
          ? t("cta.register")
          : null;

  const summary = (
    <span className="flex min-w-0 flex-col gap-3xs">
      <span className="type-eyebrow text-black/70">{eyebrow}</span>
      <span className="type-h5 normal-case text-black">{headline}</span>
      {details && <span className="type-eyebrow text-black">{details}</span>}
    </span>
  );
  // A full-bleed band; the content lines up with the page container.
  const barClasses = `block w-full bg-core-purple py-xs text-start text-black md:py-s ${className}`;
  const rowClasses = "container flex items-center gap-xs md:gap-s";

  if (!cta) {
    return (
      <div id="bp27" className={barClasses.trim()}>
        <div className={rowClasses}>{summary}</div>
      </div>
    );
  }

  return (
    <>
      <button
        id="bp27"
        type="button"
        aria-haspopup="dialog"
        onClick={(event) => {
          // Safari does not focus a clicked button; focus it so closing the
          // dialog returns focus here.
          event.currentTarget.focus();
          setOpen(true);
        }}
        className={`group transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-black ${barClasses}`.trim()}
      >
        <span className={rowClasses}>
          {videoId && (
            <span
              aria-hidden="true"
              className="hidden size-10 shrink-0 items-center justify-center bg-black text-white sm:inline-flex"
            >
              <PlayIcon />
            </span>
          )}
          <span className="flex min-w-0 flex-1 flex-col gap-2xs sm:flex-row sm:items-center sm:justify-between sm:gap-s">
            {summary}
            <span className="type-button flex shrink-0 items-center gap-3xs underline-offset-4 group-hover:underline">
              {/* Phones drop the icon tile so the copy keeps the full width. */}
              {videoId && <PlayIcon className="size-3 shrink-0 sm:hidden" />}
              {cta}
            </span>
          </span>
        </span>
      </button>

      {open && (
        // z-index sits above the cookie banner (z-9999), which would otherwise
        // cover the signup field for first-time visitors.
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-[10000] flex overflow-y-auto bg-black/85 px-5 py-s backdrop-blur-sm"
          onClick={close}
        >
          <div
            ref={dialogRef}
            className="m-auto w-full max-w-[880px] border border-neutral-700 bg-neutral-800"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-xs py-2xs pl-xs pr-2xs md:pl-s">
              <p className="type-eyebrow text-text-secondary">{eyebrow}</p>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                aria-label={tAccessibility("close")}
                className="inline-flex size-8 items-center justify-center text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-white"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 2L14 14M14 2L2 14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </div>

            {videoId && (
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&playsinline=1`}
                  title={t("videoTitle", copyValues)}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}

            <div className="flex flex-col gap-xs p-xs md:p-s">
              <div className="flex flex-col gap-xs sm:flex-row sm:items-center sm:justify-between sm:gap-s">
                <div className="flex flex-col gap-3xs">
                  <h2 id={titleId} className="type-h5 text-white">
                    {headline}
                  </h2>
                  {details && (
                    <p className="type-eyebrow text-text-secondary">
                      {details}
                    </p>
                  )}
                </div>
                <Button
                  arrow
                  className="shrink-0"
                  href={announcement.registrationHref}
                  label={t("registerCta", copyValues)}
                  variant="primary"
                />
              </div>
              {signupFormId && (
                <>
                  <p className="type-paragraph text-text-secondary">
                    {t("signup.body", copyValues)}
                  </p>
                  <EmailSubscribeForm
                    formId={signupFormId}
                    placement="next_edition_announcement"
                    layout="inline"
                    labels={{
                      emailLabel: t("signup.emailLabel"),
                      emailPlaceholder: t("signup.emailPlaceholder"),
                      submit: t("signup.submit"),
                      submitting: t("signup.submitting"),
                      success: t("signup.success"),
                      error: t("signup.error"),
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
