"use client";

import React from "react";
import Link from "next/link";

interface Tutorial {
  id: number;
  slug: string;
  title: string;
  category: string;
}

interface ChapterNavigationProps {
  currentSlug: string;
  tutorials: Tutorial[];
  translations: {
    chapters: string;
    chapterNavigationAriaLabel: string;
    chapterNumber: string;
  };
}

export default function ChapterNavigation({
  currentSlug,
  tutorials,
  translations,
}: ChapterNavigationProps) {
  return (
    <aside
      className="hidden xl:block sticky top-24 h-fit ml-8 w-64"
      aria-label={translations.chapterNavigationAriaLabel}
    >
      <div className="rounded-lg p-4">
        <h2
          id="chapters-heading"
          className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3"
        >
          {translations.chapters}
        </h2>
        <nav className="space-y-1" aria-labelledby="chapters-heading">
          {tutorials.map((tutorial, index) => {
            const isActive = tutorial.slug === currentSlug;

            return (
              <Link
                key={tutorial.id}
                href={`/learn/${tutorial.slug}`}
                className={`
                  block px-3 py-2 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black
                  ${
                    isActive
                      ? "text-primary font-medium"
                      : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
              >
                <div className="flex items-start">
                  <span
                    className={`text-xs mr-2 mt-0.5 ${isActive ? "text-primary" : "text-zinc-500"}`}
                    aria-hidden="true"
                  >
                    {index + 1}.
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">
                      <span className="sr-only">
                        {translations.chapterNumber.replace(
                          "{{number}}",
                          String(index + 1),
                        )}{" "}
                      </span>
                      {tutorial.title}
                    </div>
                    <div
                      className={`text-xs mt-0.5 truncate ${isActive ? "text-primary" : "text-zinc-400"}`}
                    >
                      {tutorial.category}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
