"use client";

import React from "react";
import { ArrowUpRight, ArrowDown, Lock, Check } from "react-feather";
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
    }>;
    workshopsTitle: string;
    workshops: Array<{
      title: string;
      date: string;
      speaker: string;
      speakerTitle: string;
      url: string;
    }>;
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
    <div className="overflow-hidden bg-black">
      {/* Cypherpunk Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Matrix-style background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 65, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 65, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />

        {/* Scanlines effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 65, 0.1) 2px, rgba(0, 255, 65, 0.1) 4px)",
          }}
        />

        <div className="container relative z-10 text-center px-4 py-20">
          {/* Terminal-style badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/5">
            <Lock size={14} className="text-green-400" />
            <span className="text-green-400 text-sm font-mono tracking-wider">
              PRIVACY_HACKATHON_2026
            </span>
          </div>

          {/* Main title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight font-mono">
            <span className="text-white">PRIVACY</span>
            <span className="text-green-400"> HACK</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light">
            {translations.heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-400 text-black font-bold rounded-full hover:bg-green-300 transition-all hover:scale-105"
            >
              {translations.heroRegisterButton}
            </a>
            <a
              href="#resources"
              className="inline-flex items-center gap-2 px-8 py-4 border border-green-400/50 text-green-400 font-semibold rounded-full hover:bg-green-400/10 transition-all"
            >
              {translations.heroResourcesButton}
              <ArrowDown size={18} />
            </a>
          </div>

          {/* Terminal decoration */}
          <div className="mt-16 max-w-md mx-auto text-left font-mono text-xs text-green-500/60">
            <div className="border border-green-500/20 rounded-lg p-4 bg-black/50">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-green-500/60" />
                <span className="ml-2 text-green-500/40">terminal</span>
              </div>
              <div>
                <span className="text-green-400">$</span> cat manifesto.txt
              </div>
              <div className="text-gray-300 mt-1">
                Privacy is necessary for an open society.
              </div>
              <div className="mt-2">
                <span className="text-green-400">$</span> echo &quot;let&apos;s
                build&quot;
              </div>
              <div className="text-green-400 mt-1">let&apos;s build</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 65, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 65, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-sm font-mono uppercase tracking-wider text-green-400 mb-4">
              {translations.ctaEyebrow}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {translations.ctaTitle}
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              {translations.ctaDescription}
            </p>
            <a
              href={translations.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-400 text-black font-bold rounded-full hover:bg-green-300 transition-all hover:scale-105"
            >
              {translations.ctaLabel}
            </a>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-12 md:py-16">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 65, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 65, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
        <div className="container relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-12 text-center">
            {translations.timelineTitle}
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="border border-green-500/20 rounded-xl overflow-hidden bg-black/50">
              <div className="grid grid-cols-2 border-b border-green-500/20">
                <div className="py-3 px-6 text-green-400 font-mono text-sm uppercase tracking-wider">
                  {translations.timelinePhaseHeader}
                </div>
                <div className="py-3 px-6 text-green-400 font-mono text-sm uppercase tracking-wider">
                  {translations.timelineDateHeader}
                </div>
              </div>
              {translations.timelineEvents.map((event, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 border-b border-green-500/10 last:border-b-0 hover:bg-green-500/5 transition-colors"
                >
                  <div className="py-4 px-6 text-white font-semibold">
                    {event.phase}
                  </div>
                  <div className="py-4 px-6 text-gray-400 font-mono">
                    {event.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* View Workshops Button */}
      <div className="py-4 text-center">
        <a
          href="#workshops"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all font-semibold"
        >
          Workshops Timeline
          <ArrowDown size={18} />
        </a>
      </div>

      {/* Submission Requirements */}
      <section className="relative py-12 md:py-16">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="border border-green-500/20 rounded-xl p-8 bg-black/50">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 font-mono">
                <span className="text-green-400">&gt;</span>{" "}
                {translations.requirementsTitle}
              </h2>
              <ul className="space-y-4">
                {translations.requirementsItems.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 rounded border border-green-400 flex items-center justify-center">
                        <Check size={12} className="text-green-400" />
                      </div>
                    </div>
                    <span className="text-gray-300">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section className="relative py-12 md:py-16">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 65, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 65, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {translations.tracksTitle}
            </h2>
            <p className="text-lg text-gray-400">
              {translations.tracksSubtitle}
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {translations.tracks.map((track, index) => (
              <div
                key={index}
                className="bg-black/50 border border-green-500/20 rounded-xl p-6 hover:border-green-400/50 hover:scale-[1.02] transition-all group cursor-pointer"
              >
                <div className="text-green-400 text-xs font-mono uppercase tracking-wider mb-3">
                  Track {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                  {track.title}
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  {track.description}
                </p>
                <div className="pt-4 border-t border-green-500/20">
                  <span className="text-2xl font-bold text-green-400 font-mono">
                    {track.prizeAmount || translations.tracksPrizeAmount}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">prize</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsor Banner Section */}
      {translations.sponsorBannerLogos.length > 0 && (
        <section className="relative py-12 md:py-16">
          <div className="container relative z-10">
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
              fadeColor="rgb(0, 0, 0)"
            />
          </div>
        </section>
      )}

      {/* Sponsor Bounties Section */}
      {translations.sponsorBounties.length > 0 && (
        <section className="relative py-12 md:py-16">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0, 255, 65, 0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 255, 65, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: "30px 30px",
              }}
            />
          </div>
          <div className="container relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {translations.sponsorBountiesTitle}
              </h2>
              <p className="text-lg text-gray-400">
                {translations.sponsorBountiesSubtitle}
              </p>
            </div>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {translations.sponsorBounties.map((bounty, index) => (
                <div
                  key={index}
                  className="bg-black/50 border border-green-500/20 rounded-xl p-6 hover:border-green-400/50 hover:scale-[1.02] transition-all group cursor-pointer"
                >
                  <div className="text-green-400 text-xs font-mono uppercase tracking-wider mb-3">
                    {bounty.sponsor}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                    {bounty.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">
                    {bounty.description}
                  </p>
                  <div className="pt-4 border-t border-green-500/20">
                    <span className="text-2xl font-bold text-green-400 font-mono">
                      {bounty.prizeAmount}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">prize</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Resources Section */}
      <section id="resources" className="relative py-12 md:py-16">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 65, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 65, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {translations.resourcesTitle}
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {translations.resourcesDescription}
            </p>
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {translations.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-black/50 border border-green-500/20 rounded-xl p-6 hover:border-green-400/50 hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <div className="text-green-400 text-xs font-mono uppercase tracking-wider mb-2">
                    {resource.category}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {resource.description}
                  </p>
                  <span className="inline-flex items-center text-green-400 text-sm font-semibold">
                    {translations.resourcesLearnMore}
                    <ArrowUpRight size={14} className="ml-1" />
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Workshops */}
          <div id="workshops" className="pt-8">
            <h3 className="text-2xl font-bold text-white mb-6 font-mono">
              <span className="text-green-400">&gt;</span>{" "}
              {translations.workshopsTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {translations.workshops.map((workshop, index) => (
                <div
                  key={index}
                  className="bg-black/50 rounded-xl p-6 border border-green-500/20 hover:border-green-400/50 hover:scale-[1.02] transition-all flex flex-col cursor-pointer"
                >
                  <div className="text-green-400 text-sm font-mono mb-2">
                    {workshop.date}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">
                    {workshop.title}
                  </h4>
                  <div className="mb-4">
                    <div className="text-white font-medium">
                      {workshop.speaker}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {workshop.speakerTitle}
                    </div>
                  </div>
                  <a
                    href={workshop.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all font-semibold text-sm"
                  >
                    Watch on YouTube
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
