"use client";

import React from "react";
import { useTranslations } from "@workspace/i18n/client";
import Accordion from "@/components/Accordion";

const faqKeys = ["q1", "q2", "q3", "q4"] as const;

export default function FAQSection() {
  const t = useTranslations("breakpoint");

  return (
    <section className="py-3xl">
      <div className="container flex flex-col gap-m md:flex-row md:items-start md:gap-s">
        <h2 className="font-sans text-[32px] leading-[1.15] tracking-[-0.02em] text-white md:flex-1 md:text-[48px]">
          {t("faq.headline")}
        </h2>

        <div className="flex flex-col gap-s md:flex-1">
          {faqKeys.map((key) => (
            <Accordion key={key} question={t(`faq.items.${key}.question`)}>
              <p className="font-sans text-lg leading-[1.45] text-white md:pr-2xl">
                {key === "q3"
                  ? t.rich(`faq.items.${key}.answer`, {
                      link: (chunks) => (
                        <a
                          href={t(`faq.items.${key}.answerHref`)}
                          className="underline decoration-white/40 underline-offset-4 transition-opacity hover:opacity-80"
                        >
                          {chunks}
                        </a>
                      ),
                    })
                  : t(`faq.items.${key}.answer`)}
              </p>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}
