"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Card from "@/components/Card";

const articleKeys = ["article1", "article2", "article3"] as const;

export default function AnnouncementsSection() {
  const t = useTranslations("breakpoint");

  return (
    <section className="border-t border-neutral-700 px-m py-3xl">
      <h2 className="mb-xl font-sans text-[32px] leading-[1.15] tracking-[-0.96px] text-white md:text-[48px]">
        {t("announcements.headline")}
      </h2>

      <div className="grid grid-cols-1 gap-xs md:grid-cols-3">
        {articleKeys.map((key) => (
          <Card
            key={key}
            variant="link"
            eyebrow={t(`announcements.items.${key}.eyebrow`)}
            linkLabel={t(`announcements.items.${key}.title`)}
          />
        ))}
      </div>
    </section>
  );
}
