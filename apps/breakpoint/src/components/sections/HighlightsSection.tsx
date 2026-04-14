"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import SectionHeadline from "@/components/SectionHeadline";
import CarouselControls from "@/components/CarouselControls";

export default function HighlightsSection() {
  const t = useTranslations("breakpoint");
  const [, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => prev + 1);
  };

  return (
    <section className="border-t border-neutral-700 px-m py-3xl">
      <div className="flex flex-col gap-xl md:flex-row">
        {/* Left column */}
        <div className="md:w-1/2">
          <SectionHeadline
            eyebrow={t("highlights.eyebrow")}
            headline={t("highlights.headline")}
            alignment="left"
          >
            <CarouselControls onPrev={handlePrev} onNext={handleNext} />
          </SectionHeadline>
        </div>

        {/* Right column: Quote card */}
        <div className="md:w-1/2">
          <div className="border border-stroke-card p-m md:p-l">
            <p className="font-sans text-[24px] italic leading-[1.25] tracking-[-1.28px] text-white md:text-[32px]">
              {t("highlights.quote.text")}
            </p>
            <span className="mt-s block font-mono text-base uppercase tracking-[1.28px] text-text-secondary">
              {t("highlights.quote.author")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
