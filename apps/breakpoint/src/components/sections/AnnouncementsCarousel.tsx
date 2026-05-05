"use client";

import React, { useCallback, useId, useRef } from "react";
import { Link } from "@workspace/i18n/routing";
import CarouselControls from "@/components/CarouselControls";
import type { BreakpointAnnouncementLink } from "@/lib/media-links";
import { getAnchorLinkProps, isRelativeHref } from "@/lib/links";

interface AnnouncementsCarouselProps {
  headline: string;
  items: BreakpointAnnouncementLink[];
}

export default function AnnouncementsCarousel({
  headline,
  items,
}: AnnouncementsCarouselProps) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const headingId = useId();

  const scrollBy = useCallback((direction: number) => {
    if (!scrollRef.current) return;

    const firstCard = scrollRef.current.querySelector<HTMLElement>(
      "[data-announcement-card]",
    );
    const scrollAmount = firstCard
      ? firstCard.offsetWidth + 12
      : Math.min(scrollRef.current.clientWidth, 420);
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
      className="flex flex-col gap-6 md:gap-12"
      role="region"
    >
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
        <h2 id={headingId} className="type-h3 text-white">
          {headline}
        </h2>
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
        className="unstyled-list scrollbar-hidden -mr-[20px] flex touch-pan-x snap-x snap-mandatory gap-s overflow-x-auto overscroll-x-contain p-0 pr-[20px] [-webkit-overflow-scrolling:touch] md:mr-0 md:pr-0"
        role="list"
      >
        {items.map((item) => {
          const content = (
            <>
              <span className="type-eyebrow text-white opacity-80">
                {item.tags?.[0] ?? "Article"}
              </span>
              <span className="type-h5 text-white">{item.title}</span>
              {!isRelativeHref(item.url) && (
                <span className="sr-only">(opens in a new tab)</span>
              )}
            </>
          );
          const className =
            "relative flex h-full w-full flex-col justify-between border border-neutral-700 p-s transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

          return (
            <li
              key={item.id}
              data-announcement-card
              className="block h-[332px] w-[300px] shrink-0 snap-start md:w-[calc((100%-48px)/3)] md:min-w-[300px]"
            >
              {isRelativeHref(item.url) ? (
                <Link href={item.url} className={className}>
                  {content}
                </Link>
              ) : (
                <a
                  href={item.url}
                  className={className}
                  {...getAnchorLinkProps({ href: item.url })}
                >
                  {content}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
