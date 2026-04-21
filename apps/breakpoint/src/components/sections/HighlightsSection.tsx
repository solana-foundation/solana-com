"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
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
    <section className="pl-5 pt-[80px] md:pl-8 md:pt-[120px]">
      <div className="flex flex-col items-start justify-between gap-10 pr-5 md:flex-row md:gap-6 md:pr-0">
        <div className="flex flex-col gap-6 md:h-[227px] md:w-[501px] md:justify-center">
          <p className="font-mono text-base uppercase leading-[1.3] tracking-[1.28px] text-white">
            {t("highlights.eyebrow")}
          </p>
          <h2 className="font-sans text-[32px] font-normal leading-[1.15] tracking-[-0.96px] text-white md:text-[48px]">
            {t("highlights.headline")}
          </h2>
          <CarouselControls onPrev={handlePrev} onNext={handleNext} />
        </div>

        <div className="relative aspect-[772/600] w-full overflow-hidden bg-[#1e1e1e] md:h-[600px] md:w-[772px] md:flex-shrink-0">
          <img
            src="/img/gallery/photo-6.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-[#aa67fb] mix-blend-multiply" />
          <div className="absolute inset-[17.67%_12.25%_17.57%_20.6%] flex flex-col items-start justify-between bg-white p-8">
            <p className="font-sans text-[24px] font-normal leading-[1.25] tracking-[-0.04em] text-black [text-indent:-0.45em] md:text-[32px]">
              {t("highlights.quote.text")}
            </p>
            <div className="flex items-center gap-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  fill="black"
                />
              </svg>
              <p className="font-sans text-[20px] font-bold leading-[1.18] tracking-[-0.01em] text-black underline decoration-solid underline-offset-[3px] md:text-[24px]">
                @
                {t("highlights.quote.author")
                  .replace(/^@/, "")
                  .replace(/\s+/g, "")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
