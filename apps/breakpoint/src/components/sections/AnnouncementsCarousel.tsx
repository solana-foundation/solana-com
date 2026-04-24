"use client";

import React, { useCallback, useId, useRef } from "react";
import CarouselControls from "@/components/CarouselControls";
import type { BreakpointAnnouncementLink } from "@/lib/media-links";

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
      <div className="flex items-end justify-between gap-6">
        <h2
          id={headingId}
          className="font-sans text-[32px] leading-[1.15] tracking-[-0.96px] text-white md:text-[48px]"
        >
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
        {items.map((item) => (
          <li
            key={item.id}
            data-announcement-card
            className="block h-[332px] w-[300px] shrink-0 snap-start md:w-[calc((100%-48px)/3)] md:min-w-[300px]"
          >
            <a
              target="_blank"
              rel="noreferrer"
              href={item.url}
              className="flex h-full w-full flex-col justify-between border border-neutral-700 p-s transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <span className="font-mono text-base uppercase leading-[1.3] tracking-[0.08em] text-white opacity-80">
                {item.tags?.[0] ?? "Article"}
              </span>
              <span className="font-sans text-[32px] leading-[1.25] tracking-[-0.04em] text-white">
                {item.title}
              </span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
