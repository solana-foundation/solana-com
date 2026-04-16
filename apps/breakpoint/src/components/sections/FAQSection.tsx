"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Accordion from "@/components/Accordion";

const faqKeys = ["q1", "q2", "q3", "q4"] as const;

export default function FAQSection() {
  const t = useTranslations("breakpoint");

  return (
    <section className="border-t border-neutral-700 px-5 py-[120px] md:px-8">
      <div className="grid gap-10 md:grid-cols-[1fr_676px] md:items-start md:justify-between">
        <h2 className="font-sans text-[2rem] leading-[1.05] tracking-[-0.04em] text-white md:text-[3rem]">
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
      </div>
    </section>
  );
}
