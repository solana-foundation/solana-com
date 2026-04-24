"use client";

import React, { useEffect, useId, useRef, useState } from "react";

interface AccordionProps {
  question: string;
  children: React.ReactNode;
}

export default function Accordion({ question, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const triggerId = useId();
  const panelId = useId();

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children, isOpen]);

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
          <span className="flex-1 font-sans text-[20px] leading-[1.18] tracking-[-0.04em] text-white md:text-[24px]">
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

      <div
        className="overflow-hidden"
        style={
          {
            "--accordion-height": `${contentHeight}px`,
          } as React.CSSProperties
        }
      >
        <div
          id={panelId}
          ref={contentRef}
          aria-hidden={!isOpen}
          aria-labelledby={triggerId}
          inert={!isOpen}
          className={
            isOpen
              ? "animate-accordion-slide-down"
              : "animate-accordion-slide-up"
          }
          role="region"
          style={{
            height: isOpen ? `${contentHeight}px` : "0px",
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div className="pt-s">{children}</div>
        </div>
      </div>
    </div>
  );
}
