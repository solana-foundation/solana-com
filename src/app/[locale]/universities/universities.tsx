"use client";

import DevelopersHeroSection from "@/components/developers/sections/DevelopersHeroSection/DevelopersHeroSection";
import UniversitiesCTASection from "@/components/universities/UniversitiesCTASection";
import UniversitiesSubjectsSection from "@/components/universities/UniversitiesSubjectsSection";
import UniversitiesInquiryForm from "@/components/universities/UniversitiesInquiryForm";
import UniversityEventsGrid from "@/components/universities/UniversityEventsGrid";
import universitiesHeroImg from "@@/assets/universities/universities-hero.webp";
import { GitHub } from "react-feather";

interface UniversitiesPageProps {
  translations: {
    heroTitle: string;
    heroSubtitle: string;
    joinProgram: string;
    viewCurriculum: string;
    ctaEyebrowText: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaLabel: string;
    subjectsTitle: string;
    subjectsDescription: string;
    subjectsContactButtonLabel: string;
    subjectsLearnMore: string;
    subjectsCards: {
      finance: {
        title: string;
        description: string;
      };
      legal: {
        title: string;
        description: string;
      };
      technology: {
        title: string;
        description: string;
      };
      business: {
        title: string;
        description: string;
      };
      economics: {
        title: string;
        description: string;
      };
      engineering: {
        title: string;
        description: string;
      };
    };
    inquiryEyebrowText: string;
    inquiryTitle: string;
    inquiryDescription: string;
    inquiryEmailPlaceholder: string;
    inquirySubmitButton: string;
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
            // TODO: Replace with Airtable/Typeform intake form URL
            href: "/universities/contact",
          },
          secondary: {
            label: translations.viewCurriculum,
            href: "https://github.com/solana-foundation/curriculum",
            icon: <GitHub size={20} />,
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
          contactButtonLabel: translations.subjectsContactButtonLabel,
          learnMore: translations.subjectsLearnMore,
          cards: translations.subjectsCards,
        }}
      />

      <UniversitiesInquiryForm
        translations={{
          eyebrowText: translations.inquiryEyebrowText,
          title: translations.inquiryTitle,
          description: translations.inquiryDescription,
          emailPlaceholder: translations.inquiryEmailPlaceholder,
          submitButton: translations.inquirySubmitButton,
        }}
      />

      <UniversityEventsGrid />

      <UniversitiesInquiryForm
        translations={{
          eyebrowText: translations.inquiryEyebrowText,
          title: translations.inquiryTitle,
          description: translations.inquiryDescription,
          emailPlaceholder: translations.inquiryEmailPlaceholder,
          submitButton: translations.inquirySubmitButton,
        }}
      />
    </div>
  );
}
