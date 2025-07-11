"use client";

import React from "react";
import Link from "next/link";

interface ChapterIndicatorProps {
  currentIndex: number;
  nextSlug: string | null;
  nextTitle: string | null;
  translations: {
    currentChapter: string;
    chapter: string;
    chapterCategory: string;
    goToNextChapter: string;
    next: string;
  };
  category: string;
}

export default function ChapterIndicator({
  currentIndex,
  nextSlug,
  nextTitle,
  translations,
  category,
}: ChapterIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-6">
        <div
          className="flex-shrink-0 w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="text-3xl font-bold text-white">
            {currentIndex + 1}
          </span>
        </div>
        <div>
          <p className="text-zinc-400 text-sm uppercase tracking-wider mb-1">
            <span className="sr-only">{translations.currentChapter}: </span>
            {translations.chapter} {currentIndex + 1}
          </p>
          <p
            className="text-2xl font-medium text-white"
            aria-label={translations.chapterCategory.replace(
              "{{category}}",
              category,
            )}
          >
            {category}
          </p>
        </div>
      </div>

      {nextSlug && (
        <Link
          href={`/learn/${nextSlug}`}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-all group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
          aria-label={translations.goToNextChapter.replace(
            "{{title}}",
            nextTitle || "",
          )}
        >
          <span className="text-sm text-zinc-400 group-hover:text-white transition-colors hidden sm:inline">
            {translations.next}
          </span>
          <svg
            className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-all"
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
      )}
    </div>
  );
}
