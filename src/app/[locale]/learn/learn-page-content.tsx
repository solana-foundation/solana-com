"use client";

import React from "react";
import { LearnCard } from "@/component-library/learn-card";
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
    tutorialsTitle: string;
    tutorialsSubtitle: string;
    tutorialsAriaLabel: string;
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
              <LearnCard
                key={tutorial.id}
                index={tutorial.id}
                title={tutorial.title}
                description={tutorial.description}
                href={`/learn/${tutorial.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-24 text-white">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Continue Your Journey
            </h2>
            <p className="text-gray-300 mb-8">
              Ready to dive deeper? Explore these essential resources for Solana
              developers
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://solana.com/docs"
                  className="inline-flex items-center gap-2 text-white hover:underline transition-all duration-200 group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="font-medium">Documentation</span>
                  <span className="text-gray-400">
                    - Official Solana documentation and API references
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://solana.com/developers/cookbook"
                  className="inline-flex items-center gap-2 text-white hover:underline transition-all duration-200 group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="font-medium">Cookbook</span>
                  <span className="text-gray-400">
                    - Code snippets and recipes for common tasks
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://solana.com/developers/courses"
                  className="inline-flex items-center gap-2 text-white hover:underline transition-all duration-200 group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="font-medium">Courses</span>
                  <span className="text-gray-400">
                    - Structured learning paths for Solana development
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://solana.com/wallets"
                  className="inline-flex items-center gap-2 text-white hover:underline transition-all duration-200 group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="font-medium">Wallets</span>
                  <span className="text-gray-400">
                    - Explore Solana wallets to manage your assets
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
