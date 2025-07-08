"use client";

import React from "react";
import { Hero } from "@solana-foundation/solana-lib";
import DevelopersResourceItem from "@/components/developers/sections/DevelopersResourcesSection/DevelopersResourceItem";

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
      <div className="bg-black flex justify-center w-full">
        <Hero
          headline={translations.heroTitle}
          body={translations.heroSubtitle}
          headingAs="h1"
          headingSize="lg"
          buttons={[
            {
              label: translations.heroStartLearning,
              // @ts-expect-error href getting passed properly but typings not picking it up
              href: "/learn/what-is-solana",
              variant: "primary",
            },
            {
              label: translations.heroBuild,
              // @ts-expect-error href getting passe properly but typings not picking it up
              href: "/docs",
              variant: "secondary",
            },
          ]}
        />
      </div>

      <section
        id="tutorials"
        className="pt-8 md:pt-12 pb-20 md:pb-24 text-white"
        aria-label={translations.tutorialsAriaLabel}
      >
        <div className="container">
          <h2 className="h3 mb-4 text-white">{translations.tutorialsTitle}</h2>
          <p className="text-white-50 mb-5 col-lg-8">
            {translations.tutorialsSubtitle}
          </p>
          <ol className="row g-4 list-unstyled" role="list">
            {tutorials.map((tutorial) => (
              <li
                key={tutorial.id}
                className="col-12 col-sm-6 col-md-6 col-lg-4"
                role="listitem"
              >
                <DevelopersResourceItem
                  category={`Part ${tutorial.id}: ${tutorial.category}`}
                  title={tutorial.title}
                  description={tutorial.description}
                  url={`/learn/${tutorial.slug}`}
                  isExternal={false}
                />
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
