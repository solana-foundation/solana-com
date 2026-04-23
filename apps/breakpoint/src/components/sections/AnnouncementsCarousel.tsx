"use client";

import React, { useCallback, useRef } from "react";
import Card from "@/components/Card";
import CarouselControls from "@/components/CarouselControls";
import type { BreakpointAnnouncementLink } from "@/lib/media-links";

interface AnnouncementsCarouselProps {
  items: BreakpointAnnouncementLink[];
}

export default function AnnouncementsCarousel({
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
    <>
      <div className="mb-xl flex justify-end">
        <CarouselControls
          onPrev={() => scrollBy(-1)}
          onNext={() => scrollBy(1)}
        />
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-hidden flex snap-x snap-mandatory gap-xs overflow-x-auto"
      >
        {items.map((item) => (
          <div
            key={item.id}
            data-announcement-card
            className="min-w-[280px] shrink-0 snap-start md:min-w-[360px] lg:min-w-[420px]"
          >
            <Card
              variant="link"
              eyebrow={item.tags?.[0]}
              linkLabel={item.title}
              href={item.url}
            />
          </div>
        ))}
      </div>
    </>
  );
}
