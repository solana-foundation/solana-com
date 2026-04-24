"use client";

import React, { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface AccordionProps {
  question: string;
  children: React.ReactNode;
}

export default function Accordion({ question, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerId = useId();
  const panelId = useId();

  return (
    <div className="border-b border-neutral-700 pb-s">
      <h3>
        <button
          id={triggerId}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center gap-l text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          aria-controls={panelId}
          aria-expanded={isOpen}
        >
          <span className="flex-1 font-sans text-[20px] font-normal normal-case leading-[1.18] tracking-[-0.04em] text-white md:text-[24px]">
            {question}
          </span>
          <span
            aria-hidden="true"
            className={`flex size-[32px] shrink-0 items-center justify-center border border-neutral-700 transition-colors ${
              isOpen ? "bg-neutral-700" : ""
            }`}
          >
            {isOpen ? (
              <svg
                width="12"
                height="2"
                viewBox="0 0 12 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 1H12" stroke="white" strokeWidth="1.5" />
              </svg>
            ) : (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 0V12" stroke="white" strokeWidth="1.5" />
                <path d="M0 6H12" stroke="white" strokeWidth="1.5" />
              </svg>
            )}
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            aria-labelledby={triggerId}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="pt-s">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
