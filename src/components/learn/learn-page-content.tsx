"use client";

import React from "react";
import { LinkCard } from "@/component-library/link-card";
import LearnHero from "./learn-hero";
import ResourceLink from "./resource-link";

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
  const resources = [
    {
      href: "/docs",
      label: translations.documentationLabel,
      description: translations.documentationDescription,
      ariaLabel: translations.documentationAriaLabel,
    },
    {
      href: "/developers/cookbook",
      label: translations.cookbookLabel,
      description: translations.cookbookDescription,
      ariaLabel: translations.cookbookAriaLabel,
    },
    {
      href: "/developers/courses",
      label: translations.coursesLabel,
      description: translations.coursesDescription,
      ariaLabel: translations.coursesAriaLabel,
    },
    {
      href: "/wallets",
      label: translations.walletsLabel,
      description: translations.walletsDescription,
      ariaLabel: translations.walletsAriaLabel,
    },
  ];

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
              {resources.map((resource, index) => (
                <ResourceLink
                  key={index}
                  href={resource.href}
                  label={resource.label}
                  description={resource.description}
                  ariaLabel={resource.ariaLabel}
                />
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
