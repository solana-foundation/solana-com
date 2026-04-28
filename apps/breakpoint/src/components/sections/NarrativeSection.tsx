"use client";

import React from "react";
import { useTranslations } from "@workspace/i18n/client";
import WordReveal from "@/components/WordReveal";

export default function NarrativeSection() {
  const t = useTranslations("breakpoint");

  const bodyClass = "type-h3 text-white";

  const body1 = t("narrative.body1");
  const body2 = t.raw("narrative.body2") as string;
  const body1WordCount = body1.split(/\s+/).length;

  return (
    <section className="bg-black md:pt-[120px]">
      <div className="container grid grid-cols-1 gap-x-[24px] gap-y-8 md:grid-cols-[repeat(16,minmax(0,1fr))]">
        <WordReveal
          as="h2"
          text={t("narrative.eyebrow")}
          stepMs={60}
          className="type-eyebrow text-white md:col-[1/span_5] md:self-start"
        />

        <div className="md:col-[7/span_10]">
          <WordReveal as="p" text={body1} stepMs={60} className={bodyClass} />
          {body2 && (
            <WordReveal
              as="p"
              text={body2}
              html
              startDelayMs={body1WordCount * 60 + 200}
              className={`mt-[1.15em] ${bodyClass}`}
            />
          )}
        </div>
      </div>
    </section>
  );
}
