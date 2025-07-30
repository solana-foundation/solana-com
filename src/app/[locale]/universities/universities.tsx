"use client";

import DevelopersHeroSection from "@/components/developers/sections/DevelopersHeroSection/DevelopersHeroSection";
import universitiesHeroImg from "@@/assets/universities/universities-hero.webp";

interface UniversitiesPageProps {
  translations: {
    heroTitle: string;
    heroSubtitle: string;
    joinProgram: string;
    learnMore: string;
  };
}

export function UniversitiesPage({ translations }: UniversitiesPageProps) {
  return (
    <div className="overflow-hidden">
      <DevelopersHeroSection
        title={translations.heroTitle}
        description={translations.heroSubtitle}
        img={{
          src: universitiesHeroImg,
          alt: translations.heroTitle,
        }}
        buttons={{
          cta: {
            label: translations.joinProgram,
            href: "/universities/join",
          },
          secondary: {
            label: translations.learnMore,
            href: "/universities/about",
          },
        }}
      />

      {/* Additional sections can be added here */}
      <section className="pt-8 md:pt-12 pb-20 md:pb-24">
        <div className="container">
          <p className="text-lg text-gray-600">
            More education content coming soon...
          </p>
        </div>
      </section>
    </div>
  );
}
