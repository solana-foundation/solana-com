"use client";

import React from "react";
import { useTranslations } from "@workspace/i18n/client";
import ImageTreatment, {
  type TreatmentColor,
} from "@/components/ImageTreatment";
import SectionHeadline from "@/components/SectionHeadline";
import WordReveal from "@/components/WordReveal";

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

const stripColors: TreatmentColor[] = ["green", "purple", "blue"];

export default function StatsSection() {
  const t = useTranslations("breakpoint");

  return (
    <section className="pt-20 md:pt-[120px]">
      <div className="container">
        <SectionHeadline headline={t("stats.headline")} alignment="center">
          {/* <Button label={t("stats.cta")} variant="primary" arrow /> */}
        </SectionHeadline>

        <div className="mt-xl flex flex-col gap-s md:mt-16 md:grid md:grid-cols-3 md:gap-6">
          {statItems.map((item, idx) => (
            <div
              key={item.key}
              className="flex flex-col items-center gap-xs text-center md:gap-3 md:pb-4"
            >
              <WordReveal
                as="span"
                text={`${t(item.valueKey)}${t(item.suffixKey)}`}
                stepMs={120}
                startDelayMs={idx * 140}
                className="block font-display text-[3rem] uppercase leading-[1.15] tracking-[0.04em] text-white md:leading-none lg:text-[4.75rem]"
              />
              <WordReveal
                as="p"
                text={t(item.labelKey)}
                stepMs={55}
                startDelayMs={idx * 140 + 180}
                className="font-mono text-base uppercase leading-[1.3] tracking-[0.08em] text-white md:max-w-[22ch] md:font-sans md:normal-case md:tracking-normal md:text-white/72"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-xl w-full overflow-hidden md:mt-16" aria-hidden="true">
        <div className="photo-strip-track flex w-max gap-4 md:gap-0">
          {[...stripImages, ...stripImages].map((src, index) => {
            const position = index % stripImages.length;
            const color = stripColors[position % stripColors.length]!;
            return (
              <ImageTreatment
                key={index}
                src={src}
                alt=""
                motion={true}
                flicker={true}
                glitchPattern="p1"
                intensity={60}
                lighting="even"
                color={color}
                className={`relative h-[240px] w-[200px] shrink-0 overflow-hidden bg-[#1e1e1e] md:h-[320px] md:w-[280px] ${widths[position]}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
