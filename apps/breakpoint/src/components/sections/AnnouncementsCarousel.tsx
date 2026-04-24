"use client";

import React, { useCallback, useRef } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <div className="flex flex-col gap-6 md:gap-12">
      <div className="flex items-end justify-between gap-6">
        <h2 className="font-sans text-[32px] leading-[1.15] tracking-[-0.96px] text-white md:text-[48px]">
          {headline}
        </h2>
        <CarouselControls
          className="shrink-0"
          onPrev={() => scrollBy(-1)}
          onNext={() => scrollBy(1)}
        />
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-hidden flex snap-x snap-mandatory gap-s overflow-x-auto"
      >
        {items.map((item) => (
          <a
            key={item.id}
            target="_blank"
            data-announcement-card
            href={item.url}
            className="flex h-[332px] w-[300px] shrink-0 snap-start flex-col justify-between border border-[#353535] p-s transition-opacity hover:opacity-80 md:w-[calc((100%-48px)/3)] md:min-w-[300px]"
          >
            <span className="font-mono text-[16px] uppercase leading-[1.3] tracking-[1.28px] text-white opacity-80">
              {item.tags?.[0] ?? "Article"}
            </span>
            <span className="font-sans text-[32px] leading-[1.25] tracking-[-1.28px] text-white">
              {item.title}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
