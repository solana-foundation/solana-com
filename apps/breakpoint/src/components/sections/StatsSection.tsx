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

  return (
    <section className="border-t border-neutral-700 px-m py-3xl">
      <SectionHeadline headline={t("stats.headline")} alignment="center">
        <Button label={t("stats.cta")} variant="primary" />
      </SectionHeadline>

      <div className="mt-xl grid grid-cols-1 gap-xs md:grid-cols-3">
        {statItems.map((item) => (
          <div
            key={item.key}
            className="flex flex-col gap-xs border border-stroke-card p-m"
          >
            <span className="font-display text-[64px] leading-[1.18] tracking-[2.56px] text-white md:text-8xl">
              {t(item.valueKey)}
              {t(item.suffixKey)}
            </span>
            <span className="font-sans text-lg leading-[1.45] text-text-secondary">
              {t(item.labelKey)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
