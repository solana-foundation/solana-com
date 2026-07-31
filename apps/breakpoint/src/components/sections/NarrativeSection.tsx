"use client";

import React from "react";
import { useTranslations } from "@workspace/i18n/client";
import WordReveal from "@/components/WordReveal";
import { useVariant } from "@/lib/use-variant";

export default function NarrativeSection() {
  const t = useTranslations("breakpoint");
  const variant = useVariant();

  const bodyClass = "type-h3 text-white";

  const eyebrow = variant?.positioningStatement ?? t("narrative.eyebrow");
  const paragraphs: { text: string; html: boolean }[] = variant
    ? variant.narrativeParagraphs.map((text) => ({ text, html: false }))
    : [
        { text: t("narrative.body1"), html: false },
        { text: t.raw("narrative.body2") as string, html: true },
      ];

  let revealDelayMs = 0;

  return (
    <section
      key={variant?.slug ?? "default"}
      className="bg-black pt-2xl md:pt-[120px]"
    >
      <div className="container grid grid-cols-1 gap-x-[24px] gap-y-8 md:grid-cols-[repeat(16,minmax(0,1fr))]">
        <WordReveal
          as="h2"
          text={eyebrow}
          stepMs={60}
          className="type-eyebrow text-white md:col-[1/span_5] md:self-start"
        />

        <div className="md:col-[7/span_10]">
          {paragraphs.map(({ text, html }, index) => {
            if (!text) return null;
            // Default copy keeps the original word-by-word handoff between its
            // two short paragraphs; variant blurbs are longer, so each
            // paragraph reveals on its own as it scrolls into view.
            const startDelayMs = variant ? 0 : revealDelayMs;
            revealDelayMs += text.split(/\s+/).length * 60 + 200;
            const stepMs = variant && index > 0 ? 20 : 60;
            const paragraphClass =
              variant && index > 0 ? "type-p-large text-white" : bodyClass;
            return (
              <WordReveal
                key={index}
                as="p"
                text={text}
                html={html}
                stepMs={stepMs}
                startDelayMs={startDelayMs}
                className={
                  index === 0 ? paragraphClass : `mt-[1.15em] ${paragraphClass}`
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
