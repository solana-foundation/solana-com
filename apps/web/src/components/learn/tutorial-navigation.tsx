"use client";

import React from "react";
import Link from "next/link";

interface TutorialNavigationProps {
  prevSlug: string | null;
  nextSlug: string | null;
  prevTitle: string | null;
  nextTitle: string | null;
  prevCategory: string | null;
  nextCategory: string | null;
  currentIndex: number;
  translations: {
    tutorialNavigationAriaLabel: string;
    previousChapterAriaLabel: string;
    nextChapterAriaLabel: string;
    previous: string;
    next: string;
  };
}

export default function TutorialNavigation({
  prevSlug,
  nextSlug,
  prevTitle,
  nextTitle,
  prevCategory,
  nextCategory,
  currentIndex,
  translations,
}: TutorialNavigationProps) {
  return (
    <nav
      className="mt-12 pt-8 border-t border-zinc-800"
      aria-label={translations.tutorialNavigationAriaLabel}
    >
      <div className="flex justify-between items-center">
        {prevSlug ? (
          <Link
            href={`/learn/${prevSlug}`}
            className="group flex items-center text-white hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black rounded-lg p-2 -m-2"
            aria-label={translations.previousChapterAriaLabel.replace(
              "{{title}}",
              prevTitle || "",
            )}
          >
            <svg
              className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <div className="text-left">
              <div className="text-sm text-zinc-400">
                {translations.previous} • Part {currentIndex}: {prevCategory}
              </div>
              <div className="font-medium">{prevTitle}</div>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextSlug ? (
          <Link
            href={`/learn/${nextSlug}`}
            className="group flex items-center text-white hover:text-primary transition-colors text-right focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black rounded-lg p-2 -m-2"
            aria-label={translations.nextChapterAriaLabel.replace(
              "{{title}}",
              nextTitle || "",
            )}
          >
            <div className="text-right">
              <div className="text-sm text-zinc-400">
                {translations.next} • Part {currentIndex + 2}: {nextCategory}
              </div>
              <div className="font-medium">{nextTitle}</div>
            </div>
            <svg
              className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}
