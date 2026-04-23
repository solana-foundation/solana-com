"use client";

import React, { useState, useRef, useEffect } from "react";

interface AccordionProps {
  question: string;
  children: React.ReactNode;
}

export default function Accordion({ question, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  return (
    <div className="border-b border-neutral-700 pb-s">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-l text-left"
        aria-expanded={isOpen}
      >
        <span className="flex-1 font-sans text-[20px] leading-[1.18] tracking-[-0.04em] text-white md:text-[24px]">
          {question}
        </span>
        <span
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
              aria-hidden="true"
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
              aria-hidden="true"
            >
              <path d="M6 0V12" stroke="white" strokeWidth="1.5" />
              <path d="M0 6H12" stroke="white" strokeWidth="1.5" />
            </svg>
          )}
        </span>
      </button>

      <div
        className="overflow-hidden"
        style={
          {
            "--accordion-height": `${contentHeight}px`,
          } as React.CSSProperties
        }
      >
        <div
          ref={contentRef}
          className={
            isOpen
              ? "animate-accordion-slide-down"
              : "animate-accordion-slide-up"
          }
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
