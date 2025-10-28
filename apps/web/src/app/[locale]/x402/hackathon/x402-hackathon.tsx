"use client";

import React from "react";
import DevelopersHeroSection from "@/components/developers/sections/DevelopersHeroSection/DevelopersHeroSection";
import HackathonTimeline from "@/components/universities/HackathonTimeline";
import HackathonRequirements from "@/components/universities/HackathonRequirements";
import HackathonTracks from "@/components/universities/HackathonTracks";
import DevelopersResourceItem from "@/components/developers/sections/DevelopersResourcesSection/DevelopersResourceItem";
import DevelopersDocumentItem from "@/components/developers/sections/DevelopersDocumentsSection/DevelopersDocumentItem";
import hackathonHeroImg from "@@/assets/universities/hackathon-hero.webp";
import { Book } from "react-feather";

interface X402HackathonPageProps {
  translations: {
    heroTitle: string;
    heroSubtitle: string;
    heroRegisterButton: string;
    heroResourcesButton: string;
    timelineTitle: string;
    timelinePhaseHeader: string;
    timelineDateHeader: string;
    timelineDescriptionHeader?: string;
    timelineEvents: Array<{
      phase: string;
      date: string;
      description?: string;
    }>;
    prerequisitesTitle: string;
    x402IntroTitle: string;
    x402IntroDescription: string;
    x402IntroCta: string;
    solanaTitle: string;
    solanaDescription: string;
    solanaCta: string;
    problemTitle: string;
    problemDescription: string;
    requirementsTitle: string;
    requirementsItems: string[];
    tracksTitle: string;
    tracksSubtitle: string;
    tracksPrizeAmount: string;
    tracks: Array<{
      title: string;
      description: string;
    }>;
    resourcesTitle: string;
    resourcesDescription: string;
    resourcesGettingStarted: string;
    resourcesAdvancedTopics: string;
    resourcesLearnMore: string;
    resources: Array<{
      title: string;
      description: string;
      category: string;
      url: string;
    }>;
  };
}

export function X402HackathonPage({ translations }: X402HackathonPageProps) {
  const TYPEFORM_URL = "https://solanafoundation.typeform.com/to/x402hack";

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

      {/* Timeline Section */}
      <HackathonTimeline
        translations={{
          title: translations.timelineTitle,
          phaseHeader: translations.timelinePhaseHeader,
          dateHeader: translations.timelineDateHeader,
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
                title={translations.x402IntroTitle}
                description={translations.x402IntroDescription}
                url="https://solana.com/x402"
                newTab={true}
                ctaLabel={translations.x402IntroCta}
              />
              <DevelopersDocumentItem
                title={translations.solanaTitle}
                description={translations.solanaDescription}
                url="#resources"
                newTab={false}
                ctaLabel={translations.solanaCta}
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

      {/* Tracks Section */}
      <HackathonTracks
        translations={{
          title: translations.tracksTitle,
          subtitle: translations.tracksSubtitle,
          prizeAmount: translations.tracksPrizeAmount,
          tracks: translations.tracks,
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      </section>
    </div>
  );
}
