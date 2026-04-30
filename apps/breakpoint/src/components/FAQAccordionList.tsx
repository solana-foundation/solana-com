"use client";

import { useState } from "react";
import Accordion from "@/components/Accordion";
import type { FAQPageSection } from "@/content/faq-page";
import { getAnchorLinkProps } from "@/lib/links";

type FAQAccordionListProps = {
  sections: FAQPageSection[];
};

export default function FAQAccordionList({ sections }: FAQAccordionListProps) {
  const firstItemId = sections[0]?.items[0]?.id ?? null;
  const [openItemId, setOpenItemId] = useState<string | null>(firstItemId);

  return (
    <div className="flex w-full flex-col items-stretch">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-[112px] px-xs pt-xl md:scroll-mt-[120px] md:px-m md:pt-2xl"
        >
          <div className="mx-auto flex w-full max-w-[676px] flex-col items-stretch gap-m md:gap-l">
            <h2 className="type-h3 text-white md:text-center">
              {section.title}
            </h2>

            <div className="flex flex-col gap-s md:gap-m">
              {section.items.map((item, index) => (
                <Accordion
                  key={item.id}
                  question={item.question}
                  open={openItemId === item.id}
                  onOpenChange={(isOpen) =>
                    setOpenItemId(isOpen ? item.id : null)
                  }
                  className={
                    index === section.items.length - 1
                      ? "pb-xs md:pb-s"
                      : "border-b border-neutral-700 pb-xs md:pb-s"
                  }
                  panelClassName="pt-xs md:pt-s"
                >
                  <p className="type-paragraph text-white md:pr-2xl">
                    {item.answer}
                    {item.answerHref && (
                      <>
                        {" "}
                        <a
                          href={item.answerHref}
                          className="underline decoration-white/40 underline-offset-4 transition-opacity hover:opacity-80"
                          {...getAnchorLinkProps({ href: item.answerHref })}
                        >
                          {item.answerLinkLabel ?? item.answerHref}
                        </a>
                        .
                      </>
                    )}
                  </p>
                </Accordion>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
