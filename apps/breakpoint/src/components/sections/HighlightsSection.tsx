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
    <section className="border-t border-neutral-700 px-5 py-[120px] md:px-8">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="md:w-[36%]">
          <SectionHeadline
            eyebrow={t("highlights.eyebrow")}
            headline={t("highlights.headline")}
            alignment="left"
          >
            <CarouselControls
              onPrev={handlePrev}
              onNext={handleNext}
              className="pt-2"
            />
          </SectionHeadline>
        </div>

        <div className="relative min-h-[420px] overflow-hidden bg-[#1e1e1e] md:min-h-[600px] md:w-[772px]">
          <img
            src="/img/gallery/photo-6.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-[#aa67fb] mix-blend-multiply" />
          <div className="absolute inset-[10%_8%_10%_18%] flex flex-col justify-between bg-white p-8 text-black md:inset-[17.67%_12.25%_17.57%_20.6%]">
            <p className="font-sans text-[1.75rem] leading-[1.15] tracking-[-0.04em] md:text-[2rem]">
              {t("highlights.quote.text")}
            </p>
            <span className="font-sans text-[1.25rem] leading-none underline underline-offset-4">
              @
              {t("highlights.quote.author")
                .replace(/^@/, "")
                .replace(/\s+/g, "")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
