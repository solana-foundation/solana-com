"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowUpRight, ArrowDown, Check } from "react-feather";

interface GraveyardHackPageProps {
  translations: {
    heroTitle: string;
    heroSubtitle1: string;
    heroSubtitle2: string;
    heroHeading: string;
    heroDescription: string;
    heroRegisterButton: string;
    heroResourcesButton: string;
    timelineTitle: string;
    timelinePhaseHeader: string;
    timelineDateHeader: string;
    timelineEvents: Array<{
      phase: string;
      date: string;
    }>;
    prizesTitle: string;
    prizesSubtitle: string;
    overallPrizesTitle: string;
    overallPrizesSubtitle: string;
    overallPrizes: Array<{
      place: string;
      prize: string;
      sponsor: string;
    }>;
    sponsorBountiesTitle: string;
    sponsorBountiesSubtitle: string;
    sponsorBountiesDisclaimer: string;
    sponsorBounties: Array<{
      sponsor: string;
      title: string;
      description: string;
      prizeAmount: string;
      logo?: string;
      url?: string;
    }>;
    sponsorBannerTitle: string;
    sponsorLogos: Array<{
      name: string;
      src: string;
      url?: string;
    }>;
    resourcesTitle: string;
    resourcesDescription: string;
    resourcesLearnMore: string;
    resources: Array<{
      title: string;
      description: string;
      category: string;
      url: string;
    }>;
    requirementsTitle: string;
    requirementsItems: string[];
    ctaEyebrow: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaLabel: string;
    ctaUrl: string;
    telegram: string;
  };
}

// Scroll reveal hook
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Static graveyard background with fade to black
function GraveyardBackground() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/assets/graveyard-hack/background.png)",
          backgroundSize: "100% auto",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Fade to black at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-64 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, black)",
        }}
      />
    </>
  );
}

export function GraveyardHackPage({ translations }: GraveyardHackPageProps) {
  // TODO: Update with final Typeform URL when ready
  const REGISTRATION_URL =
    "https://solanafoundation.typeform.com/graveyard-hack";

  const timelineReveal = useScrollReveal();
  const requirementsReveal = useScrollReveal();
  const prizesReveal = useScrollReveal();
  const bountiesReveal = useScrollReveal();
  const resourcesReveal = useScrollReveal();
  const sponsorReveal = useScrollReveal();

  return (
    <div className="overflow-hidden bg-black">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-black">
        <GraveyardBackground />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(168, 85, 247, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(168, 85, 247, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px]" />

        {/* Scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(168, 85, 247, 0.1) 2px, rgba(168, 85, 247, 0.1) 4px)",
          }}
        />

        <div className="container relative z-10 text-center px-4 py-12 md:py-16">
          {/* Static badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-purple-500/30 bg-black/30 backdrop-blur-sm">
            <span className="text-purple-400 text-sm tracking-wide">
              Starting February 12, 2026
            </span>
          </div>

          {/* Title logo image */}
          <div className="mb-6">
            <img
              src="/assets/graveyard-hack/title-white.svg"
              alt="Graveyard Hackathon"
              className="mx-auto w-[320px] md:w-[420px] lg:w-[510px] h-auto"
            />
          </div>

          {/* Blurb */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-6 font-light">
            {translations.heroSubtitle1}
            <br className="hidden md:block" /> {translations.heroSubtitle2}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-500 text-white font-bold rounded-full hover:bg-purple-400 transition-all hover:scale-105"
            >
              {translations.heroRegisterButton}
            </a>
            <a
              href="#resources"
              className="inline-flex items-center gap-2 px-8 py-4 border border-gray-500/50 text-gray-300 font-semibold rounded-full hover:bg-gray-500/10 transition-all"
            >
              {translations.heroResourcesButton}
              <ArrowDown size={18} />
            </a>
          </div>

          {/* Telegram link */}
          {/*           <div className="mt-6">
            <a
              href={translations.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm font-mono transition-colors"
            >
              Join the Telegram
              <ArrowUpRight size={14} />
            </a>
          </div> */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-sm font-mono uppercase tracking-wider text-purple-400 mb-4">
              {translations.ctaEyebrow}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {translations.ctaTitle}
            </h2>
            <p className="text-gray-400">{translations.heroDescription}</p>
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
                linear-gradient(rgba(168, 85, 247, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(168, 85, 247, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
        <div
          ref={timelineReveal.ref}
          className={`container relative z-10 transition-all duration-700 ${
            timelineReveal.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-12 text-center">
            {translations.timelineTitle}
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="border border-purple-500/20 rounded-xl overflow-hidden bg-black/50">
              <div className="grid grid-cols-2 border-b border-purple-500/20">
                <div className="py-3 px-6 text-purple-400 font-mono text-sm uppercase tracking-wider">
                  {translations.timelinePhaseHeader}
                </div>
                <div className="py-3 px-6 text-purple-400 font-mono text-sm uppercase tracking-wider">
                  {translations.timelineDateHeader}
                </div>
              </div>
              {translations.timelineEvents.map((event, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 border-b border-purple-500/10 last:border-b-0 hover:bg-purple-500/5 transition-colors"
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
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

      {/* Overall Prizes Section */}
      <section className="relative py-12 md:py-16">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(168, 85, 247, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(168, 85, 247, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
        <div
          ref={prizesReveal.ref}
          className={`container relative z-10 transition-all duration-700 ${
            prizesReveal.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {translations.prizesTitle}
            </h2>
            <p className="text-lg text-gray-400">
              {translations.prizesSubtitle}
            </p>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {translations.overallPrizesTitle}
            </h3>
            <p className="text-gray-400">
              {translations.overallPrizesSubtitle}
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {translations.overallPrizes.map((prize, index) => (
              <div
                key={index}
                className={`bg-black/50 border ${
                  index === 0
                    ? "border-2 border-purple-400/40"
                    : "border-purple-500/20"
                } rounded-xl p-8 flex flex-col items-center text-center transition-all duration-500 ${
                  prizesReveal.isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150 + 200}ms` }}
              >
                <div className="text-purple-400 text-xs font-mono uppercase tracking-wider mb-3">
                  Overall
                </div>
                <h4
                  className={`${index === 0 ? "text-2xl" : "text-xl"} font-bold text-white mb-2`}
                >
                  {prize.place}
                </h4>
                <p className="text-gray-500 text-sm mb-6">{prize.sponsor}</p>
                <div className="pt-4 border-t border-purple-500/20 mt-auto">
                  <span
                    className={`${index === 0 ? "text-3xl" : "text-2xl"} font-bold text-purple-400 font-mono`}
                  >
                    {prize.prize}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsor Bounties Section */}
      <section className="relative py-12 md:py-16">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(168, 85, 247, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(168, 85, 247, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
        <div
          ref={bountiesReveal.ref}
          className={`container relative z-10 transition-all duration-700 ${
            bountiesReveal.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {translations.sponsorBountiesTitle}
            </h2>
            <p className="text-lg text-gray-400">
              {translations.sponsorBountiesSubtitle}
            </p>
            <p className="text-sm text-gray-500 mt-3 italic">
              {translations.sponsorBountiesDisclaimer}
            </p>
          </div>

          {/* Featured bounty */}
          <div className="max-w-xl mx-auto mb-8">
            {translations.sponsorBounties.slice(0, 1).map((bounty, index) => (
              <div
                key={index}
                className={`bg-black/50 border-2 border-purple-400/40 rounded-xl p-8 flex flex-col transition-all duration-500 ${
                  bountiesReveal.isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-purple-400 text-sm font-mono uppercase tracking-wider font-bold">
                    {bounty.sponsor}
                  </span>
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">
                  {bounty.title}
                </h4>
                <p className="text-gray-300 text-base mb-6 whitespace-pre-line flex-grow">
                  {bounty.description}
                </p>
                <div className="pt-4 border-t border-purple-500/30 mb-4 mt-auto">
                  <span className="text-3xl font-bold text-purple-400 font-mono">
                    {bounty.prizeAmount}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">prize</span>
                </div>
                {bounty.url && (
                  <a
                    href={bounty.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center text-purple-400 font-semibold hover:text-purple-300 transition-colors"
                  >
                    Learn more about {bounty.sponsor}
                    <ArrowUpRight size={16} className="ml-1" />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Remaining bounties — 3x3 grid */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {translations.sponsorBounties.slice(1).map((bounty, index) => (
              <div
                key={index + 1}
                className={`bg-black/50 border border-purple-500/20 rounded-xl p-6 flex flex-col transition-all duration-500 ${
                  bountiesReveal.isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${(index + 1) * 150 + 200}ms` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-purple-400 text-xs font-mono uppercase tracking-wider">
                    {bounty.sponsor}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">
                  {bounty.title}
                </h4>
                <p className="text-gray-400 text-sm mb-6 whitespace-pre-line flex-grow">
                  {bounty.description}
                </p>
                <div className="pt-4 border-t border-purple-500/20 mb-4 mt-auto">
                  <span className="text-2xl font-bold text-purple-400 font-mono">
                    {bounty.prizeAmount}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">prize</span>
                </div>
                {bounty.url && (
                  <a
                    href={bounty.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center text-purple-400 text-sm font-semibold hover:text-purple-300 transition-colors"
                  >
                    Learn more about {bounty.sponsor}
                    <ArrowUpRight size={14} className="ml-1" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsor Logos Section */}
      <section className="relative py-12 md:py-16">
        <div
          ref={sponsorReveal.ref}
          className={`container relative z-10 transition-all duration-700 ${
            sponsorReveal.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-4">
            <div
              className="text-lg font-bold tracking-widest mb-3 uppercase"
              style={{
                color: "#a63eff",
                textShadow: "-1px -1px 0px #00f68b",
              }}
            >
              12–27 FEB
            </div>
            <div className="mb-4">
              <img
                src="/assets/graveyard-hack/title-logo.svg"
                alt="Graveyard Hackathon"
                className="mx-auto w-[260px] md:w-[360px] h-auto"
              />
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-block px-6 py-3 border rounded-lg text-sm font-mono mb-8 no-underline"
              style={{
                borderColor: "#a63eff",
                color: "#a63eff",
                textShadow: "-1px -1px 0px #00f68b",
                boxShadow: "-1px -1px 0px 0px #00f68b",
              }}
            >
              solana.com/graveyard-hack
            </a>
          </div>

          {/* Sponsor logo grid — wraps on small screens */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 justify-items-center items-center gap-y-10 gap-x-6">
              {translations.sponsorLogos.map((sponsor, index) => {
                const content = sponsor.src ? (
                  <img
                    src={sponsor.src}
                    alt={sponsor.name}
                    className="max-h-8 max-w-[140px] w-auto object-contain"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                ) : (
                  <span className="text-white text-sm font-semibold tracking-wide whitespace-nowrap">
                    {sponsor.name}
                  </span>
                );

                return sponsor.url ? (
                  <a
                    key={index}
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full h-8 opacity-80 hover:opacity-100 transition-opacity no-underline"
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    key={index}
                    className="flex items-center justify-center w-full h-8 opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="relative py-12 md:py-16">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(168, 85, 247, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(168, 85, 247, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
        <div
          ref={resourcesReveal.ref}
          className={`container relative z-10 transition-all duration-700 ${
            resourcesReveal.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {translations.resourcesTitle}
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {translations.resourcesDescription}
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {translations.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group bg-black/50 border border-purple-500/20 rounded-xl p-6 hover:border-purple-400/50 hover:scale-[1.02] transition-all cursor-pointer ${
                    resourcesReveal.isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100 + 200}ms` }}
                >
                  <div className="text-purple-400 text-xs font-mono uppercase tracking-wider mb-2">
                    {resource.category}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {resource.description}
                  </p>
                  <span className="inline-flex items-center text-purple-400 text-sm font-semibold">
                    {translations.resourcesLearnMore}
                    <ArrowUpRight size={14} className="ml-1" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Submission Requirements */}
      <section className="relative py-12 md:py-16">
        <div
          ref={requirementsReveal.ref}
          className={`container relative z-10 transition-all duration-700 ${
            requirementsReveal.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <div className="border border-purple-500/20 rounded-xl p-8 bg-black/50">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 font-mono">
                <span className="text-purple-400">&gt;</span>{" "}
                {translations.requirementsTitle}
              </h2>
              <ul className="space-y-4">
                {translations.requirementsItems.map((req, index) => (
                  <li
                    key={index}
                    className={`flex items-start gap-3 transition-all duration-500 ${
                      requirementsReveal.isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-4"
                    }`}
                    style={{ transitionDelay: `${index * 100 + 200}ms` }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 rounded border border-purple-400 flex items-center justify-center">
                        <Check size={12} className="text-purple-400" />
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

      {/* Bottom Sign Up */}
      <section className="py-16 md:py-24">
        <div className="container text-center">
          <p className="text-xl md:text-2xl text-gray-400 italic mb-8">
            &ldquo;Death is just a lack of imagination.&rdquo;
          </p>
          <a
            href={REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-500 text-white font-bold rounded-full hover:bg-purple-400 transition-all hover:scale-105"
          >
            {translations.heroRegisterButton}
          </a>
        </div>
      </section>
    </div>
  );
}
