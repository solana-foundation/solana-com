"use client";

import React, { useId, useState } from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import Button from "@/components/Button";
import EmailSubscribeForm from "@/components/EmailSubscribeForm";
import WordReveal from "@/components/WordReveal";
import YouTubeModal from "@/components/YouTubeModal";
import { publicAssetPath } from "@/config";
import type { NextEditionAnnouncement } from "@/content/next-edition";
import { formatEventDateRange } from "@/lib/event-dates";

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`inline-block ${className}`.trim()}
    >
      <path d="M3.5 2.25L13 8L3.5 13.75V2.25Z" fill="currentColor" />
    </svg>
  );
}

interface Props {
  announcement: NextEditionAnnouncement;
}

/**
 * Next-edition promo, following the archived BP26 announcement format:
 * eyebrow + headline + dates/venue, a media card that opens the announcement
 * video, and an updates / early-registration signup block.
 */
export default function NextEditionSection({ announcement }: Props) {
  const t = useTranslations("breakpoint.nextEdition");
  const locale = useLocale();
  const [videoOpen, setVideoOpen] = useState(false);
  const headingId = useId();
  const signupHeadingId = useId();

  const copyValues = {
    year: announcement.year,
    shortName: announcement.shortName,
  };
  const headline = announcement.city
    ? t("headline", { ...copyValues, city: announcement.city })
    : t("headlineNoCity", copyValues);
  const dates = formatEventDateRange(
    locale,
    announcement.startDate,
    announcement.endDate,
  );
  const location = [announcement.city, announcement.region]
    .filter(Boolean)
    .join(", ");
  const hasEventDetails = Boolean(dates || announcement.venue || location);
  const thumbnail = announcement.thumbnail
    ? publicAssetPath(announcement.thumbnail)
    : announcement.videoId
      ? `https://i.ytimg.com/vi/${announcement.videoId}/maxresdefault.jpg`
      : null;
  const mediaTitle = t("media.title", copyValues);
  const videoTitle = t("media.videoTitle", copyValues);

  return (
    <section
      id="bp27"
      aria-labelledby={headingId}
      className="bg-black pt-2xl md:pt-[120px]"
    >
      <div className="container grid grid-cols-1 gap-x-[24px] gap-y-10 md:grid-cols-[repeat(16,minmax(0,1fr))]">
        <div className="flex flex-col gap-s md:col-[1/span_6]">
          <WordReveal
            as="p"
            text={t("eyebrow", copyValues)}
            stepMs={60}
            className="type-eyebrow text-white"
          />
          <h2 id={headingId} className="type-h3 text-white">
            <WordReveal as="span" text={headline} stepMs={90} />
          </h2>
          {hasEventDetails && (
            <dl className="type-eyebrow mt-xs flex flex-col gap-2xs text-white">
              {dates && (
                <div>
                  <dt className="sr-only">{t("datesLabel")}</dt>
                  <dd>
                    <WordReveal
                      as="span"
                      text={dates}
                      stepMs={70}
                      startDelayMs={600}
                    />
                  </dd>
                </div>
              )}
              {(announcement.venue || location) && (
                <div>
                  <dt className="sr-only">{t("venueLabel")}</dt>
                  <dd>
                    {announcement.venue && (
                      <WordReveal
                        as="span"
                        text={announcement.venue}
                        stepMs={70}
                        startDelayMs={700}
                      />
                    )}
                    {announcement.venue && location && <br />}
                    {location && (
                      <WordReveal
                        as="span"
                        text={location}
                        stepMs={70}
                        startDelayMs={800}
                      />
                    )}
                  </dd>
                </div>
              )}
            </dl>
          )}
        </div>

        {announcement.videoId && (
          <article className="flex flex-col gap-s md:col-[8/span_9]">
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              aria-label={`${t("media.cta")}: ${videoTitle}`}
              className="group relative block aspect-video w-full overflow-hidden bg-neutral-800 text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {thumbnail && (
                <img
                  src={thumbnail}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              )}
              <span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/20"
              >
                <span className="inline-flex size-16 items-center justify-center bg-neutral-50 text-neutral-900">
                  <PlayIcon className="size-6" />
                </span>
              </span>
            </button>
            <div className="flex flex-col gap-2xs">
              <p className="type-eyebrow text-text-secondary">
                {t("media.eyebrow")}
              </p>
              <h3 className="type-h5 text-white">{mediaTitle}</h3>
              <p className="type-paragraph text-text-secondary">
                {t("media.body", copyValues)}
              </p>
            </div>
            <div>
              <Button
                label={t("media.cta")}
                variant="primary"
                iconLeft={<PlayIcon />}
                onClick={() => setVideoOpen(true)}
              />
            </div>
            <YouTubeModal
              open={videoOpen}
              onClose={() => setVideoOpen(false)}
              videoId={announcement.videoId}
              title={videoTitle}
            />
          </article>
        )}
      </div>

      {announcement.signupFormId && (
        <div className="container mt-xl md:mt-2xl">
          <div
            aria-labelledby={signupHeadingId}
            role="region"
            className={`grid gap-l bg-core-purple p-xs text-black md:gap-s md:p-m ${
              announcement.signupArtwork
                ? "md:grid-cols-2"
                : "md:grid-cols-[repeat(16,minmax(0,1fr))]"
            }`}
          >
            <div
              className={`flex flex-col justify-between gap-l py-xs md:py-m ${
                announcement.signupArtwork ? "" : "md:col-[1/span_10]"
              }`}
            >
              <div className="flex flex-col gap-s">
                <p className="type-eyebrow text-black/70">
                  {t("signup.eyebrow", copyValues)}
                </p>
                <h2 id={signupHeadingId} className="type-h3 text-black">
                  {t("signup.headline", copyValues)}
                </h2>
                <p className="type-paragraph text-black/80">
                  {t("signup.body", copyValues)}
                </p>
              </div>
              <EmailSubscribeForm
                formId={announcement.signupFormId}
                placement="next_edition_announcement"
                tone="light"
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
            </div>
            {announcement.signupArtwork && (
              <img
                src={publicAssetPath(announcement.signupArtwork)}
                alt=""
                loading="lazy"
                className="aspect-square w-full object-cover md:order-1"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
