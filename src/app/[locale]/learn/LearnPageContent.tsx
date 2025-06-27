"use client";

import React from "react";
import DevelopersHeroSection from "@/components/developers/sections/DevelopersHeroSection/DevelopersHeroSection";
import DevelopersResourceItem from "@/components/developers/sections/DevelopersResourcesSection/DevelopersResourceItem";

interface LearnPageContentProps {
  heroImg: any;
  featuredPosts: Array<{
    id: number;
    title: string;
    description: string;
    slug: string;
    category: string;
  }>;
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
    featuredTitle: string;
    featuredAriaLabel: string;
    tutorialsTitle: string;
    tutorialsSubtitle: string;
    tutorialsAriaLabel: string;
  };
}

export default function LearnPageContent({
  heroImg,
  featuredPosts,
  tutorials,
  translations,
}: LearnPageContentProps) {
  return (
    <>
      <DevelopersHeroSection
        title={translations.heroTitle}
        description={translations.heroSubtitle}
        img={{
          src: heroImg,
          alt: "Abstract image of a Solana learning Logo",
        }}
        buttons={{
          cta: {
            label: translations.heroStartLearning,
            href: "#tutorials",
          },
          secondary: {
            label: translations.heroBuild,
            href: "/docs",
          },
        }}
      />

      <section
        id="featured"
        className="py-8 md:py-12 bg-white"
        aria-label={translations.featuredAriaLabel}
      >
        <div className="container">
          <h2 className="h3 mb-4 text-dark">{translations.featuredTitle}</h2>
          <div className="row g-4" role="list">
            {featuredPosts.map((post) => (
              <div
                key={post.id}
                className="col-12 col-md-6 col-lg-4"
                role="listitem"
              >
                <DevelopersResourceItem
                  category={post.category}
                  title={post.title}
                  description={post.description}
                  url={`/learn/${post.slug}`}
                  isExternal={false}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="tutorials"
        className="pt-8 md:pt-12 pb-20 md:pb-24 bg-light"
        aria-label={translations.tutorialsAriaLabel}
      >
        <div className="container">
          <h2 className="h3 mb-4 text-dark">{translations.tutorialsTitle}</h2>
          <p className="text-muted mb-5 col-lg-8">
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
