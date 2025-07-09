"use client";

import React from "react";
import Link from "next/link";
import { LinkCard } from "@/component-library/link-card";
import LearnHero from "./learn-hero";

interface LearnPageContentProps {
  tutorials: Array<{
    id: number;
    title: string;
    description: string;
    slug: string;
    category: string;
  }>;
  translations: {
    heroTitle: string;
    heroSubtitle: string;
    heroStartLearning: string;
    heroBuild: string;
    tutorialsAriaLabel: string;
    continueJourneyTitle: string;
    continueJourneySubtitle: string;
    resourcesAriaLabel: string;
    documentationLabel: string;
    documentationDescription: string;
    documentationAriaLabel: string;
    cookbookLabel: string;
    cookbookDescription: string;
    cookbookAriaLabel: string;
    coursesLabel: string;
    coursesDescription: string;
    coursesAriaLabel: string;
    walletsLabel: string;
    walletsDescription: string;
    walletsAriaLabel: string;
    opensInNewTabAriaLabel: string;
    tutorialPartLabel: string;
    readMoreLabel: string;
    readMoreAriaLabel: string;
  };
}

export default function LearnPageContent({
  tutorials,
  translations,
}: LearnPageContentProps) {
  return (
    <>
      <LearnHero
        title={translations.heroTitle}
        subtitle={translations.heroSubtitle}
      />

      <section
        id="tutorials"
        className="pt-8 md:pt-12 pb-20 md:pb-24 text-white"
        aria-label={translations.tutorialsAriaLabel}
      >
        <div className="container">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
          >
            {tutorials.map((tutorial) => (
              <LinkCard
                key={tutorial.id}
                index={tutorial.id}
                title={tutorial.title}
                description={tutorial.description}
                href={`/learn/${tutorial.slug}`}
                partLabel={translations.tutorialPartLabel}
                readMoreLabel={translations.readMoreLabel}
                readMoreAriaLabel={translations.readMoreAriaLabel}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        className="pb-20 md:pb-24 text-white"
        aria-labelledby="resources-heading"
        aria-label={translations.resourcesAriaLabel}
      >
        <div className="container">
          <div className="max-w-3xl">
            <h2
              id="resources-heading"
              className="text-2xl md:text-3xl font-bold mb-4"
            >
              {translations.continueJourneyTitle}
            </h2>
            <p className="text-gray-300 mb-8">
              {translations.continueJourneySubtitle}
            </p>
            <ul className="space-y-3" role="list">
              <li>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 text-white hover:underline focus:outline-none focus:ring-2 focus:ring-[#9945FF] focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1 -mx-2 -my-1 transition-all duration-200 group"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={translations.documentationAriaLabel}
                >
                  <span className="font-medium">
                    {translations.documentationLabel}
                  </span>
                  <span className="text-gray-400" aria-hidden="true">
                    - {translations.documentationDescription}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  href="/developers/cookbook"
                  className="inline-flex items-center gap-2 text-white hover:underline focus:outline-none focus:ring-2 focus:ring-[#9945FF] focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1 -mx-2 -my-1 transition-all duration-200 group"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={translations.cookbookAriaLabel}
                >
                  <span className="font-medium">
                    {translations.cookbookLabel}
                  </span>
                  <span className="text-gray-400" aria-hidden="true">
                    - {translations.cookbookDescription}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  href="/developers/courses"
                  className="inline-flex items-center gap-2 text-white hover:underline focus:outline-none focus:ring-2 focus:ring-[#9945FF] focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1 -mx-2 -my-1 transition-all duration-200 group"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={translations.coursesAriaLabel}
                >
                  <span className="font-medium">
                    {translations.coursesLabel}
                  </span>
                  <span className="text-gray-400" aria-hidden="true">
                    - {translations.coursesDescription}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  href="/wallets"
                  className="inline-flex items-center gap-2 text-white hover:underline focus:outline-none focus:ring-2 focus:ring-[#9945FF] focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1 -mx-2 -my-1 transition-all duration-200 group"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={translations.walletsAriaLabel}
                >
                  <span className="font-medium">
                    {translations.walletsLabel}
                  </span>
                  <span className="text-gray-400" aria-hidden="true">
                    - {translations.walletsDescription}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
