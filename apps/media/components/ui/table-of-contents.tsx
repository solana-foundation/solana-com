"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/extract-headings";

type Section = {
  h2: Heading;
  children: Heading[];
};

function groupIntoSections(headings: Heading[]): Section[] {
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const heading of headings) {
    if (heading.level === 2) {
      current = { h2: heading, children: [] };
      sections.push(current);
    } else if (heading.level === 3 && current) {
      current.children.push(heading);
    }
  }

  return sections;
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sections = useMemo(() => groupIntoSections(headings), [headings]);

  // Map from any heading id to its parent H2 id
  const parentMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const section of sections) {
      map.set(section.h2.id, section.h2.id);
      for (const child of section.children) {
        map.set(child.id, section.h2.id);
      }
    }
    return map;
  }, [sections]);

  const activeSectionId = parentMap.get(activeId) ?? "";

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (sections.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground/60">
        On this page
      </p>

      <ul className="relative space-y-0.5">
        {/* Track line */}
        <div
          aria-hidden
          className="absolute left-0 top-0 bottom-0 w-px bg-border/40"
        />

        {sections.map((section) => {
          const isSectionActive = activeSectionId === section.h2.id;
          const isH2Active = activeId === section.h2.id;

          return (
            <li key={section.h2.id} className="relative">
              {/* H2 active indicator */}
              {isH2Active && (
                <span
                  aria-hidden
                  className="absolute left-0 top-1 bottom-1 w-px bg-primary"
                />
              )}

              <a
                href={`#${section.h2.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(section.h2.id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className={cn(
                  "block py-1 pl-3 text-[13px] leading-snug transition-colors duration-200",
                  isH2Active
                    ? "text-foreground"
                    : isSectionActive
                      ? "text-muted-foreground"
                      : "text-muted-foreground/70 hover:text-foreground",
                )}
              >
                {section.h2.text}
              </a>

              {/* Accordion children */}
              {section.children.length > 0 && (
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-in-out",
                    isSectionActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <ul className="overflow-hidden space-y-0.5">
                    {section.children.map((child) => {
                      const isChildActive = activeId === child.id;

                      return (
                        <li key={child.id} className="relative">
                          {isChildActive && (
                            <span
                              aria-hidden
                              className="absolute left-0 top-1 bottom-1 w-px bg-primary"
                            />
                          )}

                          <a
                            href={`#${child.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              document
                                .getElementById(child.id)
                                ?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "start",
                                });
                            }}
                            className={cn(
                              "block py-1 pl-5 text-[13px] leading-snug transition-colors duration-200",
                              isChildActive
                                ? "text-foreground"
                                : "text-muted-foreground/50 hover:text-muted-foreground",
                            )}
                          >
                            {child.text}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
