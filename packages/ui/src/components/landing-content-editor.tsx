"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  ActionButton,
  Section,
  type ActionButtonProps,
} from "./landing-shared";

interface CallToAction {
  eyebrow?: string;
  headline?: string;
  description?: string;
  button?: ActionButtonProps;
}

export interface ContentEditorProps {
  children: ReactNode;
  tocHeadline?: string;
  callToAction?: CallToAction;
}

export function ContentEditor({
  children,
  tocHeadline,
  callToAction,
}: ContentEditorProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = useState<{ id: string; title: string }[]>([]);
  const [tocOpen, setTocOpen] = useState(true);

  useEffect(() => {
    const elements = [
      ...(contentRef.current?.querySelectorAll("h2[id], h3[id]") || []),
    ];
    setHeadings(
      elements.map((element) => ({
        id: element.id,
        title: element.textContent || "",
      })),
    );
  }, [children]);

  return (
    <Section as="div" className="grid gap-9 lg:grid-cols-12">
      <aside className="self-start lg:sticky lg:top-28 lg:col-span-3">
        {headings.length > 0 && (
          <nav
            aria-label={tocHeadline || "Table of contents"}
            className="mb-8 border-b border-white/20 pb-7"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between text-left text-xl font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA9FF5]"
              aria-expanded={tocOpen}
              onClick={() => setTocOpen(!tocOpen)}
            >
              {tocHeadline || "On this page"}
              <span aria-hidden="true">{tocOpen ? "−" : "+"}</span>
            </button>
            {tocOpen && (
              <ul className="mt-4 space-y-4 pl-0">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      className="font-brand-mono text-sm uppercase text-[#ABABBA] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA9FF5]"
                    >
                      {heading.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </nav>
        )}
        {callToAction && (
          <div className="grid gap-4 rounded-xl border border-white/15 bg-white/5 p-6">
            {callToAction.eyebrow && (
              <span className="font-brand-mono text-xs uppercase tracking-wider text-[#CA9FF5]">
                {callToAction.eyebrow}
              </span>
            )}
            {callToAction.headline && (
              <h2 className="text-xl font-medium">{callToAction.headline}</h2>
            )}
            {callToAction.description && (
              <p className="text-sm text-[#ABABBA]">
                {callToAction.description}
              </p>
            )}
            {callToAction.button && <ActionButton {...callToAction.button} />}
          </div>
        )}
      </aside>
      <div ref={contentRef} className="min-w-0 lg:col-span-9">
        {children}
      </div>
    </Section>
  );
}
