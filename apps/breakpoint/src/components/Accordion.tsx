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
        className="flex w-full items-center justify-between gap-s"
      >
        <span className="text-left font-sans text-[20px] leading-[1.18] tracking-[-0.96px] text-white md:text-[24px]">
          {question}
        </span>
        <span
          className={`flex size-[32px] shrink-0 items-center justify-center border border-neutral-700 ${
            isOpen ? "bg-neutral-700" : ""
          }`}
        >
          {isOpen ? (
            <svg
              width="14"
              height="2"
              viewBox="0 0 14 2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 1H14" stroke="white" strokeWidth="1.5" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 0V14" stroke="white" strokeWidth="1.5" />
              <path d="M0 7H14" stroke="white" strokeWidth="1.5" />
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
