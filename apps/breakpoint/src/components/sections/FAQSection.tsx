"use client";

import { useState } from "react";
import { useTranslations } from "@workspace/i18n/client";
import Accordion from "@/components/Accordion";
import FAQAnswer from "@/components/FAQAnswer";
import { homepageFaqItems } from "@/content/faq-page";

export default function FAQSection() {
  const t = useTranslations("breakpoint");
  const firstItemId = homepageFaqItems[0]?.id ?? null;
  const [openItemId, setOpenItemId] = useState<string | null>(firstItemId);

  return (
    <section id="faq" className="pt-xl md:pt-3xl">
      <div className="container flex flex-col gap-m md:flex-row md:items-start md:gap-s">
        <h2 className="type-h3 text-white md:flex-1">{t("faq.headline")}</h2>

        <div className="flex flex-col gap-s md:flex-1">
          {homepageFaqItems.map((item) => (
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
