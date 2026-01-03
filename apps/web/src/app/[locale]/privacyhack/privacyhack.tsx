"use client";

import React from "react";
import DevelopersHeroSection from "@/components/developers/sections/DevelopersHeroSection/DevelopersHeroSection";
import HackathonTimeline from "@/components/universities/HackathonTimeline";
import HackathonRequirements from "@/components/universities/HackathonRequirements";
import HackathonTracks from "@/components/universities/HackathonTracks";
import HackathonCTASection from "@/components/universities/HackathonCTASection";
import DevelopersResourceItem from "@/components/developers/sections/DevelopersResourcesSection/DevelopersResourceItem";
import DevelopersDocumentItem from "@/components/developers/sections/DevelopersDocumentsSection/DevelopersDocumentItem";
import hackathonHeroImg from "@@/assets/universities/hackathon-hero.webp";
import { Book } from "react-feather";
import { Logos } from "@/components/solutions/logos.v2";

interface PrivacyHackPageProps {
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
    privacyIntroTitle: string;
    privacyIntroDescription: string;
    privacyIntroCta: string;
    solanaTitle: string;
    solanaDescription: string;
    solanaCta: string;
    zkTitle: string;
    zkDescription: string;
    zkCta: string;
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
      prizeAmount?: string;
      sponsor?: string;
      logo?: string;
    }>;
    sponsorBountiesTitle: string;
    sponsorBountiesSubtitle: string;
    sponsorBounties: Array<{
      sponsor: string;
      logo: string;
      title: string;
      description: string;
      prizeAmount: string;
    }>;
    sponsorBannerTitle: string;
    sponsorBannerLogos: Array<{
      src: string;
      alt: string;
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
    ctaEyebrow: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaLabel: string;
    ctaUrl: string;
  };
}

export function PrivacyHackPage({ translations }: PrivacyHackPageProps) {
  // TODO: Update with actual registration URL
  const REGISTRATION_URL = "https://solanafoundation.typeform.com/privacyhack";

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
            href: REGISTRATION_URL,
          },
          secondary: {
            label: translations.heroResourcesButton,
            href: "#resources",
            icon: <Book size={20} />,
          },
        }}
      />

      {/* CTA Section */}
      <HackathonCTASection
        translations={{
          eyebrowText: translations.ctaEyebrow,
          title: translations.ctaTitle,
          description: translations.ctaDescription,
          ctaLabel: translations.ctaLabel,
        }}
        ctaUrl={translations.ctaUrl}
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
                title={translations.privacyIntroTitle}
                description={translations.privacyIntroDescription}
                url="https://solana.com/developers/guides"
                newTab={true}
                ctaLabel={translations.privacyIntroCta}
              />
              <DevelopersDocumentItem
                title={translations.solanaTitle}
                description={translations.solanaDescription}
                url="#resources"
                newTab={false}
                ctaLabel={translations.solanaCta}
              />
              <DevelopersDocumentItem
                title={translations.zkTitle}
                description={translations.zkDescription}
                url="https://www.zkcompression.com/"
                newTab={true}
                ctaLabel={translations.zkCta}
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

      {/* Sponsor Banner Section */}
      {translations.sponsorBannerLogos.length > 0 && (
        <section className="py-8 md:py-12 bg-gray-900/30">
          <div className="container">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {translations.sponsorBannerTitle}
              </h2>
            </div>
            <Logos
              logos={translations.sponsorBannerLogos.map((logo) => ({
                ...logo,
                height: "40px",
              }))}
              fadeColor="rgb(17, 24, 39)"
            />
          </div>
        </section>
      )}

      {/* Sponsor Bounties Section */}
      {translations.sponsorBounties.length > 0 && (
        <HackathonTracks
          translations={{
            title: translations.sponsorBountiesTitle,
            subtitle: translations.sponsorBountiesSubtitle,
            prizeAmount: "$10,000",
            tracks: translations.sponsorBounties.map((bounty) => ({
              title: bounty.title,
              description: bounty.description,
              prizeAmount: bounty.prizeAmount,
              sponsor: bounty.sponsor,
              logo: bounty.logo,
            })),
          }}
        />
      )}

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
