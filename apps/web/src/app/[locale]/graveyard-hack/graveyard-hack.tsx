"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowUpRight, ArrowDown, Check } from "react-feather";

interface GraveyardHackPageProps {
  translations: {
    heroTitle: string;
    heroSubtitle: string;
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
    prizes: Array<{
      track: string;
      sponsor: string;
      prize: string;
    }>;
    sponsorBannerTitle: string;
    sponsorLogos: Array<{
      name: string;
      src: string;
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
              Starting February 10, 2026
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
            <p className="text-gray-400">{translations.ctaDescription}</p>
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

      {/* Prizes Section */}
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
          <div className="max-w-4xl mx-auto">
            <div className="border border-purple-500/20 rounded-xl overflow-hidden bg-black/50">
              {/* Table header */}
              <div className="grid grid-cols-3 border-b border-purple-500/20">
                <div className="py-3 px-6 text-purple-400 font-mono text-sm uppercase tracking-wider">
                  Track
                </div>
                <div className="py-3 px-6 text-purple-400 font-mono text-sm uppercase tracking-wider">
                  Sponsor
                </div>
                <div className="py-3 px-6 text-purple-400 font-mono text-sm uppercase tracking-wider text-right">
                  Prize
                </div>
              </div>
              {/* Prize rows */}
              {translations.prizes.map((prize, index) => {
                const isTopPrize = index < 3;
                return (
                  <div
                    key={index}
                    className={`grid grid-cols-3 border-b border-purple-500/10 last:border-b-0 hover:bg-purple-500/5 transition-colors ${
                      isTopPrize ? "bg-purple-500/5" : ""
                    }`}
                  >
                    <div
                      className={`py-4 px-6 font-semibold ${isTopPrize ? "text-white" : "text-gray-300"}`}
                    >
                      {prize.track}
                    </div>
                    <div className="py-4 px-6 text-gray-400">
                      {prize.sponsor}
                    </div>
                    <div
                      className={`py-4 px-6 font-mono font-bold text-right ${isTopPrize ? "text-purple-400 text-lg" : "text-purple-400/80"}`}
                    >
                      {prize.prize}
                    </div>
                  </div>
                );
              })}
            </div>
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
              10–25 FEB
            </div>
            <div className="mb-4">
              <img
                src="/assets/graveyard-hack/title-logo.svg"
                alt="Graveyard Hackathon"
                className="mx-auto w-[260px] md:w-[360px] h-auto"
              />
            </div>
            <div
              className="inline-block px-6 py-3 border rounded-lg text-sm font-mono mb-8"
              style={{
                borderColor: "#a63eff",
                color: "#a63eff",
                textShadow: "-1px -1px 0px #00f68b",
                boxShadow: "-1px -1px 0px 0px #00f68b",
              }}
            >
              solana.com/graveyard-hack
            </div>
          </div>

          {/* Sponsor logo grid — 2 rows of 5 per Figma design */}
          <div className="max-w-5xl mx-auto">
            <div
              className="grid justify-items-center items-center gap-y-10 gap-x-6"
              style={{
                gridTemplateColumns: "repeat(5, 1fr)",
              }}
            >
              {translations.sponsorLogos.map((sponsor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center w-full h-8 opacity-80 hover:opacity-100 transition-opacity"
                >
                  {sponsor.src ? (
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
                  )}
                </div>
              ))}
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

          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap justify-center gap-6">
              {translations.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group bg-black/50 border border-purple-500/20 rounded-xl p-6 hover:border-purple-400/50 hover:scale-[1.02] transition-all cursor-pointer w-full md:w-[calc(50%-0.75rem)] ${
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
