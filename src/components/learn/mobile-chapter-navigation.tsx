"use client";

import React from "react";
import Link from "next/link";

interface Tutorial {
  id: number;
  slug: string;
  title: string;
}

interface MobileChapterNavigationProps {
  currentSlug: string;
  tutorials: Tutorial[];
  translations: {
    toggleChapterNavigation: string;
    chapters: string;
    chapterNavigationAriaLabel: string;
    chapterNumber: string;
  };
}

export default function MobileChapterNavigation({
  currentSlug,
  tutorials,
  translations,
}: MobileChapterNavigationProps) {
  return (
    <div className="xl:hidden sticky top-16 z-10 -mx-4 px-4 pb-6">
      <details className="rounded-lg">
        <summary
          className="px-4 py-3 cursor-pointer flex items-center justify-between text-white hover:bg-zinc-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
          aria-label={translations.toggleChapterNavigation}
        >
          <span className="text-sm font-medium">{translations.chapters}</span>
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </summary>
        <nav
          className="px-2 pb-2"
          aria-label={translations.chapterNavigationAriaLabel}
        >
          {tutorials.map((tutorial, index) => {
            const isActive = tutorial.slug === currentSlug;

            return (
              <Link
                key={tutorial.id}
                href={`/learn/${tutorial.slug}`}
                className={`
                  block px-3 py-2 rounded-md transition-all text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black
                  ${
                    isActive
                      ? "text-primary font-medium"
                      : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={`mr-2 ${isActive ? "text-primary" : "text-zinc-500"}`}
                  aria-hidden="true"
                >
                  {index + 1}.
                </span>
                <span className="sr-only">
                  {translations.chapterNumber.replace(
                    "{{number}}",
                    String(index + 1),
                  )}{" "}
                </span>
                {tutorial.title}
              </Link>
            );
          })}
        </nav>
      </details>
    </div>
  );
}
