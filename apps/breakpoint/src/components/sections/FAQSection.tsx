"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Accordion from "@/components/Accordion";

const faqKeys = ["q1", "q2", "q3", "q4"] as const;

export default function FAQSection() {
  const t = useTranslations("breakpoint");

  return (
    <section className="border-t border-neutral-700 px-m py-3xl">
      <h2 className="mb-xl font-sans text-[32px] leading-[1.15] tracking-[-0.96px] text-white md:text-[48px]">
        {t("faq.headline")}
      </h2>

      <div className="flex max-w-[676px] flex-col">
        {faqKeys.map((key) => (
          <Accordion key={key} question={t(`faq.items.${key}.question`)}>
            <p className="font-sans text-lg leading-[1.45] text-text-secondary">
              {t(`faq.items.${key}.answer`)}
            </p>
          </Accordion>
        ))}
      </div>
    </section>
  );
}
