"use client";

import React from "react";
import { useTranslations } from "next-intl";

export default function NarrativeSection() {
  const t = useTranslations("breakpoint");

  const bodyClass =
    "font-sans !text-[32px] !leading-[1.15] !tracking-[-0.02em] !text-white md:!text-[48px]";

  return (
    <section className="bg-black px-5 pt-20 md:px-8 md:pt-[120px]">
      <div className="grid grid-cols-1 gap-x-[24px] gap-y-8 md:grid-cols-[repeat(16,minmax(0,1fr))]">
        <p className="font-mono !text-[16px] uppercase !leading-[1.3] !tracking-[0.08em] !text-white md:col-[1/span_5] md:self-start">
          {t("narrative.eyebrow")}
        </p>

        <div className="md:col-[7/span_10]">
          <p className={bodyClass}>{t("narrative.body1")}</p>
          <p
            className={`mt-[1.15em] ${bodyClass}`}
            dangerouslySetInnerHTML={{ __html: t.raw("narrative.body2") }}
          />
        </div>
      </div>
    </section>
  );
}
