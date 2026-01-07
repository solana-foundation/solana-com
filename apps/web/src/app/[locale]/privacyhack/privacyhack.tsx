"use client";

import React, { useState, useEffect, useRef } from "react";
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
      url?: string;
    }>;
    sponsorBannerTitle: string;
    sponsorBannerLogos: Array<{
      src: string;
      alt: string;
    }>;
    mentorsTitle: string;
    mentorsSubtitle: string;
    mentorsComingSoon: string;
    mentors: Array<{
      name: string;
      role: string;
      image: string;
      twitter: string;
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

// Typing effect hook for badge
function useTypingEffect(
  texts: string[],
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentText.length) {
            setDisplayText(currentText.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setTextIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed,
    );

    return () => clearTimeout(timeout);
  }, [
    displayText,
    isDeleting,
    textIndex,
    texts,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return displayText;
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

// Scroll-triggered scramble text effect
function useScrollScrambleText(text: string, duration = 750) {
  const [displayText, setDisplayText] = useState(text);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const chars = "!@#$%^&*_+-=[]|;:<>?/~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const iterations = 12;
    const intervalTime = duration / iterations;
    let currentIteration = 0;

    // Start with scrambled text
    setDisplayText(
      text
        .split("")
        .map((c) =>
          c === " " ? " " : chars[Math.floor(Math.random() * chars.length)],
        )
        .join(""),
    );

    const interval = setInterval(() => {
      currentIteration++;
      const progress = currentIteration / iterations;

      const newText = text
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          const charProgress = index / text.length;
          if (progress > charProgress + 0.2) {
            return char;
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      setDisplayText(newText);

      if (currentIteration >= iterations) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [hasStarted, text, duration, chars]);

  return { displayText, ref };
}

// Matrix rain component
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let columns = 0;
    let drops: number[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const fontSize = 14;
      columns = Math.floor(canvas.width / fontSize);
      // Initialize drops at random positions so rain is already falling
      drops = Array(columns)
        .fill(0)
        .map(() => Math.floor(Math.random() * (canvas.height / fontSize)));
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
    const fontSize = 14;

    const draw = () => {
      // Fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * fontSize;
        // Fade characters based on vertical position (fade to black at bottom)
        const fadeStart = canvas.height * 0.5;
        const alpha =
          y > fadeStart
            ? Math.max(
                0,
                0.35 * (1 - (y - fadeStart) / (canvas.height - fadeStart)),
              )
            : 0.35;

        ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, y);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
      {/* Gradient fade to black at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, black)",
        }}
      />
    </>
  );
}

export function PrivacyHackPage({ translations }: PrivacyHackPageProps) {
  const REGISTRATION_URL = "https://solanafoundation.typeform.com/privacyhack";

  // Typing effect for badge
  const badgeText = useTypingEffect(
    ["PRIVACY_HACKATHON_2026", "STARTING_01/12/2026"],
    80,
    40,
    2500,
  );

  // Scramble effect for "Privacy is normal"
  const ctaTitleScramble = useScrollScrambleText(translations.ctaTitle, 750);

  // Scroll reveal for sections
  const timelineReveal = useScrollReveal();
  const requirementsReveal = useScrollReveal();
  const tracksReveal = useScrollReveal();
  const resourcesReveal = useScrollReveal();
  const sponsorReveal = useScrollReveal();

  return (
    <div className="overflow-hidden bg-black">
      {/* Animation styles */}
      <style jsx global>{`
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }
      `}</style>

      {/* Cypherpunk Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Matrix rain background */}
        <MatrixRain />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
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

        <div className="container relative z-10 text-center px-4 py-12 md:py-16">
          {/* Terminal-style badge with typing effect */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/5">
            <Lock size={14} className="text-green-400" />
            <span className="text-green-400 text-sm font-mono tracking-wider">
              {badgeText}
              <span
                className="inline-block w-2 h-4 bg-green-400 ml-1 align-middle"
                style={{ animation: "blink 1s step-end infinite" }}
              />
            </span>
          </div>

          {/* Main title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight font-mono mb-6">
            <span className="text-white">PRIVACY </span>
            <span className="text-green-400">HACK</span>
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

          {/* Terminal decoration with hackathon info */}
          <div className="mt-10 max-w-lg mx-auto text-left font-mono text-xs text-green-500/60">
            <div className="border border-green-500/20 rounded-lg p-4 bg-black/50">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-green-500/60" />
                <span className="ml-2 text-green-500/40">terminal</span>
              </div>
              <div className="space-y-1">
                <div>
                  <span className="text-green-400">$</span> whoami
                </div>
                <div className="text-gray-300">privacy_hackathon_2026</div>
                <div className="mt-2">
                  <span className="text-green-400">$</span> cat /etc/hackathon
                </div>
                <div className="text-gray-300">
                  dates: jan_12-30_2026
                  <br />
                  tracks: [private_payments, private_launchpad, privacy_tooling]
                  <br />
                  total prizes: $60,000+
                </div>
                <div className="mt-2">
                  <span className="text-green-400">$</span> cat manifesto.txt
                </div>
                <div className="text-gray-300">
                  Privacy is necessary for an open society.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - integrated content, not a separate hero */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-sm font-mono uppercase tracking-wider text-green-400 mb-4">
              welcome cypherpunk_
            </span>
            <div ref={ctaTitleScramble.ref}>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {ctaTitleScramble.displayText}
              </h2>
            </div>
            <p className="text-gray-400">{translations.ctaDescription}</p>
          </div>
        </div>
      </section>

      {/* Timeline Section with scroll reveal */}
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

      {/* Tracks Section with scroll reveal */}
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
        <div
          ref={tracksReveal.ref}
          className={`container relative z-10 transition-all duration-700 ${
            tracksReveal.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
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
                className={`bg-black/50 border border-green-500/20 rounded-xl p-6 flex flex-col ${
                  tracksReveal.isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150 + 200}ms` }}
              >
                <div className="text-green-400 text-xs font-mono uppercase tracking-wider mb-3">
                  Track {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {track.title}
                </h3>
                <p className="text-gray-400 text-sm mb-6 flex-grow">
                  {track.description.includes("Light Protocol") ? (
                    <>
                      {track.description.split("Light Protocol")[0]}
                      <a
                        href="https://lightprotocol.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 transition-colors"
                      >
                        Light Protocol
                      </a>
                      {track.description.split("Light Protocol")[1]}
                    </>
                  ) : (
                    track.description
                  )}
                </p>
                <div className="pt-4 border-t border-green-500/20 mt-auto">
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

      {/* Sponsor Bounties Section with scroll reveal */}
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
          <div
            ref={sponsorReveal.ref}
            className={`container relative z-10 transition-all duration-700 ${
              sponsorReveal.isVisible
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
            </div>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {translations.sponsorBounties.map((bounty, index) => (
                <div
                  key={index}
                  className={`bg-black/50 border border-green-500/20 rounded-xl p-6 hover:border-green-400/50 hover:scale-[1.02] transition-all group cursor-pointer flex flex-col ${
                    sponsorReveal.isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 150 + 200}ms` }}
                >
                  <div className="text-green-400 text-xs font-mono uppercase tracking-wider mb-3">
                    {bounty.sponsor}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                    {bounty.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 whitespace-pre-line">
                    {bounty.description}
                  </p>
                  {bounty.prizeAmount && (
                    <div className="pt-4 border-t border-green-500/20 mb-4">
                      <span className="text-2xl font-bold text-green-400 font-mono">
                        {bounty.prizeAmount}
                      </span>
                      <span className="text-gray-500 text-sm ml-2">prize</span>
                    </div>
                  )}
                  {bounty.url && (
                    <a
                      href={bounty.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center text-green-400 text-sm font-semibold hover:text-green-300 transition-colors"
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
      )}

      {/* Mentors Section */}
      {translations.mentors && translations.mentors.length > 0 && (
        <section id="mentors" className="relative py-12 md:py-16">
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
                {translations.mentorsTitle}
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                {translations.mentorsSubtitle}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
              {translations.mentors.map((mentor, index) => (
                <div
                  key={index}
                  className="group relative bg-black/60 backdrop-blur-sm border border-green-500/20 rounded-lg p-6 hover:border-green-500/50 transition-all duration-300 text-center w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                >
                  {/* Avatar */}
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 flex items-center justify-center overflow-hidden">
                    {mentor.image ? (
                      <img
                        src={mentor.image}
                        alt={mentor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-green-400 font-mono">
                        {mentor.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  {/* Name & Role */}
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-green-400 transition-colors">
                    {mentor.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">{mentor.role}</p>
                  {/* Twitter Link */}
                  {mentor.twitter && (
                    <a
                      href={mentor.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-green-400 text-sm hover:text-green-300 transition-colors font-mono"
                    >
                      @{mentor.twitter.split("/").pop()}
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
            {/* Coming Soon Notice */}
            <p className="text-center text-gray-500 mt-8 font-mono text-sm">
              {translations.mentorsComingSoon}
            </p>
          </div>
        </section>
      )}

      {/* Resources Section with scroll reveal */}
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

          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {translations.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group bg-black/50 border border-green-500/20 rounded-xl p-6 hover:border-green-400/50 hover:scale-[1.02] transition-all cursor-pointer ${
                    resourcesReveal.isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100 + 200}ms` }}
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
                  className={`bg-black/50 rounded-xl p-6 border border-green-500/20 hover:border-green-400/50 hover:scale-[1.02] transition-all flex flex-col cursor-pointer ${
                    resourcesReveal.isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 100 + 400}ms` }}
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

      {/* Submission Requirements with scroll reveal */}
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
            <div className="border border-green-500/20 rounded-xl p-8 bg-black/50">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 font-mono">
                <span className="text-green-400">&gt;</span>{" "}
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

      {/* Bottom Sign Up Section */}
      <section className="py-16 md:py-24">
        <div className="container text-center">
          <a
            href={REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-400 text-black font-bold rounded-full hover:bg-green-300 transition-all hover:scale-105"
          >
            {translations.heroRegisterButton}
          </a>
        </div>
      </section>
    </div>
  );
}
