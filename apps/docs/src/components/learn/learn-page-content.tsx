"use client";

import React from "react";
import DevelopersResourceItem from "@/components/developers/sections/DevelopersResourcesSection/DevelopersResourceItem";
import DevelopersDocumentItem from "@/components/developers/sections/DevelopersDocumentsSection/DevelopersDocumentItem";
import DevelopersHeroSection from "@/components/developers/sections/DevelopersHeroSection/DevelopersHeroSection";
import learnHeroImg from "@@/assets/learn/learn-hero.webp";

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
    heroImageAlt?: string;
    heroDeveloperDocs?: string;
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
    developersResourcesLearnMore: string;
    developersDocumentsViewAll: string;
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
      href: "https://learn.blueshift.gg/",
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
    <div className="overflow-hidden">
      <DevelopersHeroSection
        title={translations.heroTitle}
        description={translations.heroSubtitle}
        img={{
          src: learnHeroImg,
          alt: translations.heroImageAlt || translations.heroTitle,
        }}
        buttons={{
          cta: {
            label: translations.heroStartLearning || "Start Learning",
            href:
              tutorials.length > 0 ? `/learn/${tutorials[0].slug}` : "/learn",
          },
          secondary: {
            label: translations.heroDeveloperDocs || "Developer Docs",
            href: "/developers",
          },
        }}
      />

      <section
        id="tutorials"
        className="pt-8 pb-20 text-white md:pt-12 md:pb-24"
        aria-label={translations.tutorialsAriaLabel}
      >
        <div className="container">
          <div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {tutorials.map((tutorial, index) => (
              <DevelopersResourceItem
                key={tutorial.id}
                category={`${translations.tutorialPartLabel} ${index + 1}`}
                title={tutorial.title}
                description={tutorial.description}
                url={`/learn/${tutorial.slug}`}
                isExternal={false}
                ctaLabel={translations.readMoreLabel}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        className="pb-20 md:pb-24"
        aria-labelledby="resources-heading"
        aria-label={translations.resourcesAriaLabel}
        style={{
          background:
            "linear-gradient(180deg, #19161C 0%, rgba(25, 22, 28, 0) 100%)",
        }}
      >
        <div className="container">
          <div className="pt-10 mb-8">
            <h2
              id="resources-heading"
              className="mb-4 text-2xl font-bold text-white md:text-3xl"
            >
              {translations.continueJourneyTitle}
            </h2>
            <p className="subdued">{translations.continueJourneySubtitle}</p>
          </div>
          <div className="row">
            <div className="col-12 col-lg-6">
              <DevelopersDocumentItem
                title={resources[0].label}
                description={resources[0].description}
                url={resources[0].href}
                newTab={false}
                ctaLabel={translations.developersDocumentsViewAll}
              />
            </div>
            <div className="mt-10 col-12 col-lg-6 mt-lg-0">
              <DevelopersDocumentItem
                title={resources[1].label}
                description={resources[1].description}
                url={resources[1].href}
                newTab={false}
                ctaLabel={translations.developersDocumentsViewAll}
              />
            </div>
          </div>
          <div className="mt-8 row mt-lg-12">
            <div className="col-12 col-lg-6">
              <DevelopersDocumentItem
                title={resources[2].label}
                description={resources[2].description}
                url={resources[2].href}
                newTab={true}
                ctaLabel={translations.developersDocumentsViewAll}
              />
            </div>
            <div className="mt-10 col-12 col-lg-6 mt-lg-0">
              <DevelopersDocumentItem
                title={resources[3].label}
                description={resources[3].description}
                url={resources[3].href}
                newTab={false}
                ctaLabel={translations.developersDocumentsViewAll}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
