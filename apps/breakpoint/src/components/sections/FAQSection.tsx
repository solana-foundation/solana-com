"use client";

import { useState } from "react";
import { useTranslations } from "@workspace/i18n/client";
import Accordion from "@/components/Accordion";
import FAQAnswer from "@/components/FAQAnswer";
import { SPONSOR_FORM_HREF } from "@/content/links";

export default function FAQSection() {
  const t = useTranslations("breakpoint");
  const items = [
    {
      id: "q1",
      question: t("faq.items.q1.question"),
      answer: t("faq.items.q1.answer"),
    },
    {
      id: "q2",
      question: t("faq.items.q2.question"),
      answer: t("faq.items.q2.answer"),
    },
    {
      id: "q3",
      question: t("faq.items.q3.question"),
      answer: t("faq.items.q3.answer"),
    },
    {
      id: "q4",
      question: t("faq.items.q4.question"),
      answer: t("faq.items.q4.answer"),
    },
    {
      id: "q5",
      question: t("faq.items.q5.question"),
      answer: t("faq.items.q5.answerPrefix"),
      answerHref: SPONSOR_FORM_HREF,
      answerLinkLabel: t("faq.items.q5.answerLinkLabel"),
    },
  ];
  const firstItemId = items[0]?.id ?? null;
  const [openItemId, setOpenItemId] = useState<string | null>(firstItemId);

  return (
    <section id="faq" className="pt-xl md:pt-3xl">
      <div className="container flex flex-col gap-m md:flex-row md:items-start md:gap-s">
        <h2 className="type-h3 text-white md:flex-1">{t("faq.headline")}</h2>

        <div className="flex flex-col gap-s md:flex-1">
          {items.map((item) => (
            <Accordion
              key={item.id}
              question={item.question}
              open={openItemId === item.id}
              onOpenChange={(isOpen) => setOpenItemId(isOpen ? item.id : null)}
            >
              <FAQAnswer item={item} />
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}
