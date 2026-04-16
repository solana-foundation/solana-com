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

export default function StatsSection() {
  const t = useTranslations("breakpoint");
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

  return (
    <section className="border-t border-neutral-700 px-5 py-[120px] md:px-8">
      <SectionHeadline headline={t("stats.headline")} alignment="center">
        <Button label={t("stats.cta")} variant="primary" />
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

      <div className="scrollbar-hidden mt-16 flex gap-4 overflow-x-auto md:gap-0">
        {stripImages.map((src, index) => (
          <div
            key={src}
            className={`relative h-[320px] w-[280px] shrink-0 overflow-hidden bg-[#1e1e1e] ${widths[index]}`}
          >
            <img
              src={src}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover grayscale"
            />
            <div
              className={`absolute inset-0 mix-blend-multiply ${
                index % 3 === 0
                  ? "bg-[#14f195]"
                  : index % 3 === 1
                    ? "bg-[#aa67fb]"
                    : "bg-[#3c91ff]"
              }`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
