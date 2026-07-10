"use client";

import React, { useCallback, useId, useRef } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import Button from "@/components/Button";
import CarouselControls from "@/components/CarouselControls";
import type { HighlightedEvent } from "@/content/events/types";
import { SIDE_EVENTS_HREF } from "@/content/links";
import { getAnchorLinkProps } from "@/lib/links";

interface EventsCarouselProps {
  headline: string;
  communityCta: string;
  items: HighlightedEvent[];
}

function getDateParts(date: Date, locale: string, timeZone: string) {
  const parts = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return { day: get("day"), month: get("month"), year: get("year") };
}

function formatEventMeta(
  event: HighlightedEvent,
  locale: string,
): { time: string | null; date: string } {
  const start = new Date(event.startAt);
  const end = event.endAt ? new Date(event.endAt) : null;
  const timeZone = event.timezone ?? "Europe/London";

  const timeFormat = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  });

  const startParts = getDateParts(start, locale, timeZone);
  const endParts = end ? getDateParts(end, locale, timeZone) : null;
  const sameDay =
    !endParts ||
    (startParts.day === endParts.day &&
      startParts.month === endParts.month &&
      startParts.year === endParts.year);

  if (sameDay) {
    return {
      time: end
        ? `${timeFormat.format(start)}–${timeFormat.format(end)}`
        : timeFormat.format(start),
      date: `${startParts.day} ${startParts.month}, ${startParts.year}`.toUpperCase(),
    };
  }

  const dayRange =
    startParts.month === endParts.month && startParts.year === endParts.year
      ? `${startParts.day}–${endParts.day} ${endParts.month}`
      : `${startParts.day} ${startParts.month} – ${endParts.day} ${endParts.month}`;

  return {
    time: end ? `${timeFormat.format(start)}–${timeFormat.format(end)}` : null,
    date: `${dayRange}, ${endParts.year}`.toUpperCase(),
  };
}

export default function EventsCarousel({
  headline,
  communityCta,
  items,
}: EventsCarouselProps) {
  const locale = useLocale();
  const scrollRef = useRef<HTMLUListElement>(null);
  const headingId = useId();

  const scrollBy = useCallback((direction: number) => {
    if (!scrollRef.current) return;

    const firstCard =
      scrollRef.current.querySelector<HTMLElement>("[data-event-card]");
    const scrollAmount = firstCard
      ? firstCard.offsetWidth + 32
      : Math.min(scrollRef.current.clientWidth, 440);
    const maxScroll =
      scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    const nextScroll = scrollRef.current.scrollLeft + direction * scrollAmount;

    if (nextScroll < 0) {
      scrollRef.current.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    if (nextScroll > maxScroll) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    scrollRef.current.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  }, []);

  return (
    <div
      aria-labelledby={headingId}
      aria-roledescription="carousel"
      className="flex flex-col gap-m md:gap-l"
      role="region"
    >
      <div className="flex flex-col gap-s md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col items-start gap-s">
          <h2 id={headingId} className="type-h3 max-w-[560px] text-white">
            {headline}
          </h2>
          <div className="flex w-full flex-col gap-xs sm:w-auto sm:flex-row">
            <Button
              label={communityCta}
              variant="secondary"
              href={SIDE_EVENTS_HREF}
              arrow
              className="w-full sm:w-auto"
            />
          </div>
        </div>
        <CarouselControls
          className="shrink-0"
          labelPrefix={headline}
          onPrev={() => scrollBy(-1)}
          onNext={() => scrollBy(1)}
        />
      </div>

      <ul
        ref={scrollRef}
        aria-label={headline}
        className="unstyled-list scrollbar-hidden -mr-[20px] flex touch-pan-x snap-x snap-mandatory gap-m overflow-x-auto overscroll-x-contain p-0 pr-[20px] [-webkit-overflow-scrolling:touch] md:mr-0 md:pr-0"
        role="list"
      >
        {items.map((event) => {
          const { time, date } = formatEventMeta(event, locale);

          return (
            <li
              key={event.id}
              data-event-card
              className="block w-[280px] shrink-0 snap-start md:w-[calc((100%-64px)/3)] md:min-w-[300px]"
            >
              <a
                href={event.url}
                className="group block h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                {...getAnchorLinkProps({ href: event.url })}
              >
                <span className="relative block aspect-[3/2] overflow-hidden border border-neutral-700 bg-neutral-800">
                  {event.coverUrl && (
                    <Image
                      src={event.coverUrl}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 280px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </span>
                <span className="flex min-h-[128px] flex-col items-start border-x border-b border-neutral-700 p-s">
                  <span className="type-h5-fixed text-white transition-opacity duration-200 group-hover:opacity-70">
                    {event.title}
                  </span>
                  <span className="type-eyebrow mt-2xs flex flex-wrap gap-x-2xs gap-y-3xs text-text-secondary">
                    <span>{date}</span>
                    {time && (
                      <>
                        <span aria-hidden="true">/</span>
                        <span>{time}</span>
                      </>
                    )}
                  </span>
                  <span className="sr-only">(opens in a new tab)</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
