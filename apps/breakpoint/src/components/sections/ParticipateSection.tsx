"use client";

import React, { useRef, useCallback } from "react";
import { useTranslations } from "@workspace/i18n/client";
import SectionHeadline from "@/components/SectionHeadline";
import CarouselControls from "@/components/CarouselControls";

export default function ParticipateSection() {
  const t = useTranslations("breakpoint");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = useCallback((direction: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction * 400,
      behavior: "smooth",
    });
  }, []);

  return (
    <section className="border-t border-neutral-700 px-[20px] py-2xl md:px-m md:py-3xl">
      {/* Header row */}
      <div className="flex items-end justify-between">
        <SectionHeadline
          eyebrow={t("participate.eyebrow")}
          headline={t("participate.headline")}
          alignment="left"
        />
        <CarouselControls
          onPrev={() => scrollBy(-1)}
          onNext={() => scrollBy(1)}
        />
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="scrollbar-hidden mt-xl flex snap-x snap-mandatory gap-xs overflow-x-auto"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[400px] min-w-[400px] shrink-0 snap-start border border-stroke-card bg-neutral-800 md:min-w-[600px]"
          />
        ))}
      </div>
    </section>
  );
}
