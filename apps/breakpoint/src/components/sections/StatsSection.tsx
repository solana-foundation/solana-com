"use client";

import React from "react";
import { useTranslations } from "@workspace/i18n/client";
import ImageTreatment, {
  type TreatmentColor,
} from "@/components/ImageTreatment";
import Button from "@/components/Button";
import SectionHeadline from "@/components/SectionHeadline";
import WordReveal from "@/components/WordReveal";
import { BREAKPOINT_2025_ARCHIVES_URL } from "@/content/links";

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
        <div className="mx-auto max-w-[560px]">
          <SectionHeadline headline={t("stats.headline")} alignment="center">
            <Button
              arrow
              href={BREAKPOINT_2025_ARCHIVES_URL}
              label={t("stats.cta")}
              rel="noreferrer"
              target="_blank"
              variant="primary"
            />
          </SectionHeadline>
        </div>

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
                className="type-h2 block text-white"
              />
              <WordReveal
                as="p"
                text={t(item.labelKey)}
                stepMs={55}
                startDelayMs={idx * 140 + 180}
                className="type-eyebrow text-white md:max-w-[40ch]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-xl w-full overflow-hidden md:mt-16" aria-hidden="true">
        <div className="photo-strip-track flex w-max">
          {[0, 1].map((loopIndex) => (
            <div
              key={loopIndex}
              className="flex shrink-0 gap-4 pr-4 md:gap-6 md:pr-6"
            >
              {stripImages.map((src, index) => {
                const color = stripColors[index % stripColors.length]!;
                return (
                  <ImageTreatment
                    key={`${loopIndex}-${src}`}
                    src={src}
                    alt=""
                    motion={true}
                    flicker={true}
                    glitchPattern="p1"
                    intensity={60}
                    lighting="even"
                    color={color}
                    className={`relative h-[240px] w-[200px] shrink-0 overflow-hidden bg-neutral-800 md:h-[320px] md:w-[280px] ${widths[index]}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
