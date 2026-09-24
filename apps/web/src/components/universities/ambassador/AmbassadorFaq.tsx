"use client";

import React, { useState } from "react";
import { Plus } from "@boxicons/react/Plus";

interface AmbassadorFaqProps {
  items: Array<{ question: string; answer: string }>;
}

export function AmbassadorFaq({ items }: AmbassadorFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="border-t border-white/[0.14]">
      {items.map(({ question, answer }, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={question} className="border-b border-white/[0.14]">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`ambassador-faq-panel-${index}`}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center gap-4 px-1 py-[30px] text-left"
            >
              <span className="flex-1 text-[17px] text-white md:text-[20px]">
                {question}
              </span>
              <Plus
                pack="filled"
                width={16}
                height={16}
                fill="#848895"
                className={`shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-45" : ""
                }`}
              />
            </button>
            <div
              id={`ambassador-faq-panel-${index}`}
              hidden={!isOpen}
              className="px-1 pb-[30px]"
            >
              <p className="max-w-[640px] text-[16px] leading-[1.5] text-[#ababba] md:text-[17px]">
                {answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
