"use client";

import React from "react";
import DevelopersHeroSection from "@/components/developers/sections/DevelopersHeroSection/DevelopersHeroSection";
import HackathonCTASection from "@/components/universities/HackathonCTASection";
import HackathonTimeline from "@/components/universities/HackathonTimeline";
import HackathonRequirements from "@/components/universities/HackathonRequirements";
import HackathonPrizes from "@/components/universities/HackathonPrizes";
import DevelopersResourceItem from "@/components/developers/sections/DevelopersResourcesSection/DevelopersResourceItem";
import DevelopersDocumentItem from "@/components/developers/sections/DevelopersDocumentsSection/DevelopersDocumentItem";
import hackathonHeroImg from "@@/assets/universities/hackathon-hero.webp";
import { Book } from "react-feather";

interface HackathonFall2025PageProps {
  translations: {
    heroTitle: string;
    heroSubtitle: string;
    heroRegisterButton: string;
    heroResourcesButton: string;
    welcomeEyebrow: string;
    welcomeTitle: string;
    welcomeDescription: string;
    welcomeCta: string;
    timelineTitle: string;
    timelinePhaseHeader: string;
    timelineDateHeader: string;
    timelineDescriptionHeader: string;
    timelineEvents: Array<{
      phase: string;
      date: string;
      description: string;
    }>;
    prerequisitesTitle: string;
    helloWorldTitle: string;
    helloWorldDescription: string;
    helloWorldCta: string;
    tutorialsTitle: string;
    tutorialsDescription: string;
    tutorialsCta: string;
    problemTitle: string;
    problemDescription: string;
    requirementsTitle: string;
    requirementsItems: string[];
    resourcesTitle: string;
    resourcesDescription: string;
    resourcesGettingStarted: string;
    resourcesProjectIdeas: string;
    resourcesLearnMore: string;
    resources: Array<{
      title: string;
      description: string;
      category: string;
      url: string;
    }>;
    prizesTitle: string;
    prizesPlaceHeader: string;
    prizesAmountHeader: string;
    prizesFirstPlace: string;
    prizesSecondPlace: string;
    prizesThirdPlace: string;
    prizesFirstPrize: string;
    prizesSecondPrize: string;
    prizesThirdPrize: string;
    prizesPart2Label: string;
    prizesPart2Description: string;
  };
}

export function HackathonFall2025Page({
  translations,
}: HackathonFall2025PageProps) {
  const TYPEFORM_URL = "https://solanafoundation.typeform.com/to/uZD6crbi";
  const TELEGRAM_URL = "https://t.me/+HfTcPXRI-e1kYmIx";

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <DevelopersHeroSection
        title={translations.heroTitle}
        description={translations.heroSubtitle}
        img={{
          src: hackathonHeroImg,
          alt: translations.heroTitle,
        }}
        buttons={{
          cta: {
            label: translations.heroRegisterButton,
            href: TYPEFORM_URL,
          },
          secondary: {
            label: translations.heroResourcesButton,
            href: "#resources",
            icon: <Book size={20} />,
          },
        }}
      />

      {/* Welcome Section */}
      <HackathonCTASection
        translations={{
          eyebrowText: translations.welcomeEyebrow,
          title: translations.welcomeTitle,
          description: translations.welcomeDescription,
          ctaLabel: translations.welcomeCta,
        }}
        ctaUrl={TELEGRAM_URL}
      />

      {/* Timeline Section */}
      <HackathonTimeline
        translations={{
          title: translations.timelineTitle,
          phaseHeader: translations.timelinePhaseHeader,
          dateHeader: translations.timelineDateHeader,
          descriptionHeader: translations.timelineDescriptionHeader,
          events: translations.timelineEvents,
        }}
      />

      {/* Prerequisites Section */}
      <section className="py-8 md:py-12 bg-gray-900/30">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            {translations.prerequisitesTitle}
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DevelopersDocumentItem
                title={translations.helloWorldTitle}
                description={translations.helloWorldDescription}
                url="https://youtu.be/4UfDM27nWkI?si=I2aVPpt5OrRNu7s6"
                newTab={true}
                ctaLabel={translations.helloWorldCta}
              />
              <DevelopersDocumentItem
                title={translations.tutorialsTitle}
                description={translations.tutorialsDescription}
                url="https://blueshift.gg"
                newTab={true}
                ctaLabel={translations.tutorialsCta}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement & Requirements */}
      <HackathonRequirements
        title={translations.requirementsTitle}
        problemTitle={translations.problemTitle}
        problemDescription={translations.problemDescription}
        requirementsItems={translations.requirementsItems}
      />

      {/* Prizes Section */}
      <HackathonPrizes
        translations={{
          title: translations.prizesTitle,
          placeHeader: translations.prizesPlaceHeader,
          amountHeader: translations.prizesAmountHeader,
          firstPlace: translations.prizesFirstPlace,
          secondPlace: translations.prizesSecondPlace,
          thirdPlace: translations.prizesThirdPlace,
          firstPrize: translations.prizesFirstPrize,
          secondPrize: translations.prizesSecondPrize,
          thirdPrize: translations.prizesThirdPrize,
          part2Label: translations.prizesPart2Label,
          part2Description: translations.prizesPart2Description,
        }}
      />

      {/* Resources Section */}
      <section id="resources" className="py-8 md:py-12 bg-gray-900/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {translations.resourcesTitle}
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {translations.resourcesDescription}
            </p>
          </div>

          {/* Getting Started */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">
              {translations.resourcesGettingStarted}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {translations.resources.slice(0, 4).map((resource, index) => (
                <DevelopersResourceItem
                  key={index}
                  category={resource.category}
                  title={resource.title}
                  description={resource.description}
                  url={resource.url}
                  isExternal={true}
                  ctaLabel={translations.resourcesLearnMore}
                />
              ))}
            </div>
          </div>

          {/* Project Ideas */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">
              {translations.resourcesProjectIdeas}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {translations.resources.slice(4).map((resource, index) => (
                <DevelopersResourceItem
                  key={index + 4}
                  category={resource.category}
                  title={resource.title}
                  description={resource.description}
                  url={resource.url}
                  isExternal={true}
                  ctaLabel={translations.resourcesLearnMore}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
