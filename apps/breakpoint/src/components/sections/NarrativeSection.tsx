"use client";

import React from "react";
import { useTranslations } from "next-intl";

export default function NarrativeSection() {
  const t = useTranslations("breakpoint");

  return (
    <section className="mx-auto w-full max-w-[1920px] px-5 py-20 md:px-8 md:py-[120px]">
      <div className="grid gap-10 md:grid-cols-[minmax(260px,413px)_minmax(0,851px)] md:justify-between md:gap-12">
        <p className="max-w-[20ch] font-sans text-[1.75rem] leading-[1.18] tracking-[-0.035em] text-white md:text-[2rem]">
          {t("narrative.eyebrow")}
        </p>

        <div className="max-w-[851px] text-[1.75rem] leading-[1.18] tracking-[-0.03em] text-white md:text-[2rem]">
          <p>{t("narrative.body1")}</p>
          <p
            className="mt-4 md:mt-6"
            dangerouslySetInnerHTML={{ __html: t.raw("narrative.body2") }}
          />
        </div>
      </div>
    </section>
  );
}
