"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import SectionHeadline from "@/components/SectionHeadline";

interface StatItem {
  key: string;
  valueKey: string;
  suffixKey: string;
  labelKey: string;
}

const statItems: StatItem[] = [
  {
    key: "attendees",
    valueKey: "stats.items.attendees.value",
    suffixKey: "stats.items.attendees.suffix",
    labelKey: "stats.items.attendees.label",
  },
  {
    key: "countries",
    valueKey: "stats.items.countries.value",
    suffixKey: "stats.items.countries.suffix",
    labelKey: "stats.items.countries.label",
  },
  {
    key: "settlement",
    valueKey: "stats.items.settlement.value",
    suffixKey: "stats.items.settlement.suffix",
    labelKey: "stats.items.settlement.label",
  },
];

const stripImages = [
  "/img/gallery/photo-1.jpg",
  "/img/gallery/photo-2.jpg",
  "/img/gallery/photo-3.jpg",
  "/img/gallery/photo-4.jpg",
  "/img/gallery/photo-5.jpg",
  "/img/gallery/photo-6.jpg",
];
const widths = [
  "md:w-[569px]",
  "md:w-[320px]",
  "md:w-[256px]",
  "md:w-[400px]",
  "md:w-[320px]",
  "md:w-[400px]",
];

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export default function StatsSection() {
  const t = useTranslations("breakpoint");

  return (
    <section className="border-t border-neutral-700 px-5 py-[120px] md:px-8">
      <SectionHeadline headline={t("stats.headline")} alignment="center">
        <Button label={t("stats.cta")} variant="primary" arrow />
      </SectionHeadline>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
        {statItems.map((item) => (
          <div key={item.key} className="border-b border-white/20 pb-4">
            <span className="font-display text-[3rem] leading-none tracking-[0.04em] text-white md:text-[4.75rem]">
              {t(item.valueKey)}
              {t(item.suffixKey)}
            </span>
            <p className="mt-3 max-w-[22ch] text-[1rem] leading-[1.3] text-white/72">
              {t(item.labelKey)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 w-full overflow-hidden" aria-hidden="true">
        <div className="photo-strip-track flex w-max gap-4 md:gap-0">
          {[...stripImages, ...stripImages].map((src, index) => {
            const position = index % stripImages.length;
            const delay = seededRandom(index + 1) * 11;
            const duration = 9 + seededRandom(index + 100) * 6;
            return (
              <div
                key={index}
                className={`photo-strip-item relative h-[320px] w-[280px] shrink-0 overflow-hidden bg-[#1e1e1e] ${widths[position]}`}
                style={{
                  animationDelay: `-${delay.toFixed(2)}s`,
                  animationDuration: `${duration.toFixed(2)}s`,
                }}
              >
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover grayscale"
                />
                <div
                  className={`absolute inset-0 mix-blend-multiply ${
                    position % 3 === 0
                      ? "bg-[#14f195]"
                      : position % 3 === 1
                        ? "bg-[#aa67fb]"
                        : "bg-[#3c91ff]"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
