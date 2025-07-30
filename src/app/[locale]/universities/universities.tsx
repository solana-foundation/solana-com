"use client";

import DevelopersHeroSection from "@/components/developers/sections/DevelopersHeroSection/DevelopersHeroSection";
import UniversitiesCTASection from "@/components/universities/UniversitiesCTASection";
import UniversitiesSubjectsSection from "@/components/universities/UniversitiesSubjectsSection";
import universitiesHeroImg from "@@/assets/universities/universities-hero.webp";

interface UniversitiesPageProps {
  translations: {
    heroTitle: string;
    heroSubtitle: string;
    joinProgram: string;
    learnMore: string;
    ctaEyebrowText: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaLabel: string;
    subjectsTitle: string;
    subjectsDescription: string;
    subjectsEmailButtonLabel: string;
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

      <UniversitiesCTASection
        translations={{
          eyebrowText: translations.ctaEyebrowText,
          title: translations.ctaTitle,
          description: translations.ctaDescription,
          ctaLabel: translations.ctaLabel,
        }}
      />

      <UniversitiesSubjectsSection
        translations={{
          title: translations.subjectsTitle,
          description: translations.subjectsDescription,
          emailButtonLabel: translations.subjectsEmailButtonLabel,
        }}
      />
    </div>
  );
}
