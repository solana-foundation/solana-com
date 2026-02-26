"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowUpRight, ArrowDown, Check } from "react-feather";
import { PredictionMarketsAnimations } from "./animations";

interface PredictionMarketsHackPageProps {
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
    addBountyText: string;
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
  };
}

// Solana green: #14F195
const SOLANA_GREEN = "20, 241, 149";
const SOLANA_GREEN_HEX = "#14F195";

// Submission deadline: Mar 27, 2026
const SUBMISSION_DEADLINE = new Date("2026-03-27T23:59:59");

function getDaysUntilDeadline() {
  const now = new Date();
  const diff = SUBMISSION_DEADLINE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
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

export function PredictionMarketsHackPage({
  translations,
}: PredictionMarketsHackPageProps) {
  const REGISTRATION_URL =
    "https://solanafoundation.typeform.com/predictionhack";

  const [daysLeft, setDaysLeft] = useState(getDaysUntilDeadline());

  useEffect(() => {
    setDaysLeft(getDaysUntilDeadline());
  }, []);

  const timelineReveal = useScrollReveal();
  const prizesReveal = useScrollReveal();
  const requirementsReveal = useScrollReveal();
  const bountiesReveal = useScrollReveal();
  const resourcesReveal = useScrollReveal();

  return (
    <div
      className="pmh-page overflow-hidden"
      style={{ backgroundColor: "#0a0612" }}
    >
      {/* Page-wide ambient effects */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {/* Slow ticker lines in all Solana colors */}
        <div
          className="absolute"
          style={{
            top: "28%",
            left: "0",
            width: "20vw",
            height: "1px",
            background: `linear-gradient(to right, transparent, rgba(${SOLANA_GREEN}, 0.08), transparent)`,
            animation: "sectionTicker 24s linear infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "52%",
            left: "0",
            width: "15vw",
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(153, 69, 255, 0.07), transparent)",
            animation: "sectionTicker 30s linear infinite 8s",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "40%",
            left: "0",
            width: "12vw",
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(249, 63, 220, 0.06), transparent)",
            animation: "sectionTicker 34s linear infinite 4s",
          }}
        />
        {/* Floating sparks */}
        {[
          { left: "12%", top: "38%", delay: "0s", color: SOLANA_GREEN_HEX },
          { left: "74%", top: "56%", delay: "6s", color: "#9945FF" },
          { left: "88%", top: "32%", delay: "12s", color: "#03E1FF" },
          { left: "32%", top: "74%", delay: "18s", color: "#F93FDC" },
          { left: "56%", top: "45%", delay: "9s", color: SOLANA_GREEN_HEX },
          { left: "20%", top: "62%", delay: "3s", color: "#9945FF" },
        ].map((s, i) => (
          <div
            key={`pg-spark-${i}`}
            className="absolute rounded-full"
            style={{
              width: "4px",
              height: "4px",
              left: s.left,
              top: s.top,
              backgroundColor: s.color,
              boxShadow: `0 0 8px ${s.color}`,
              animation: `sectionSpark 18s ease-out infinite ${s.delay}`,
            }}
          />
        ))}
        {/* Subtle floating glows */}
        <div
          className="absolute rounded-full blur-[120px]"
          style={{
            width: "300px",
            height: "300px",
            top: "35%",
            left: "8%",
            backgroundColor: `rgba(${SOLANA_GREEN}, 0.03)`,
            animation: "sectionGlow 14s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full blur-[100px]"
          style={{
            width: "250px",
            height: "250px",
            top: "58%",
            right: "10%",
            backgroundColor: "rgba(153, 69, 255, 0.025)",
            animation: "sectionGlow 18s ease-in-out infinite 5s",
          }}
        />
        <div
          className="absolute rounded-full blur-[90px]"
          style={{
            width: "200px",
            height: "200px",
            top: "78%",
            left: "45%",
            backgroundColor: "rgba(3, 225, 255, 0.02)",
            animation: "sectionGlow 20s ease-in-out infinite 10s",
          }}
        />
        {/* Mini chart accent — faint rising line */}
        <svg
          className="absolute pointer-events-none"
          style={{
            left: "5%",
            top: "50%",
            width: "15vw",
            height: "8vh",
            opacity: 0.06,
          }}
          viewBox="0 0 200 60"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,55 L20,48 L40,52 L60,38 L80,42 L100,28 L120,32 L140,18 L160,22 L180,8 L200,4"
            stroke={SOLANA_GREEN_HEX}
            strokeWidth="1.5"
            strokeDasharray="500"
            style={{ animation: "miniChartDraw 12s ease-in-out infinite" }}
          />
        </svg>
        <svg
          className="absolute pointer-events-none"
          style={{
            right: "8%",
            top: "68%",
            width: "12vw",
            height: "6vh",
            opacity: 0.05,
          }}
          viewBox="0 0 200 60"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,8 L25,15 L50,10 L75,28 L100,22 L125,38 L150,35 L175,48 L200,55"
            stroke="#F93FDC"
            strokeWidth="1.5"
            strokeDasharray="500"
            style={{ animation: "miniChartDraw 15s ease-in-out infinite 5s" }}
          />
        </svg>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <PredictionMarketsAnimations />

        {/* All hero background effects — fades in so animations stagger before appearing */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0,
            animation: "effectsFadeIn 2.5s ease-out forwards",
          }}
        >
          {/* Subtle grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0.06 }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                linear-gradient(rgba(${SOLANA_GREEN}, 0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(${SOLANA_GREEN}, 0.08) 1px, transparent 1px)
              `,
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          {/* Ambient fog — Solana palette: green, purple, blue, pink */}
          <div
            className="absolute rounded-full blur-[180px] pointer-events-none"
            style={{
              width: "700px",
              height: "700px",
              top: "5%",
              left: "0%",
              backgroundColor: "rgba(20, 241, 149, 0.15)",
              animation: "fogDrift1 14s ease-in-out infinite",
            }}
          />
          <div
            className="absolute rounded-full blur-[200px] pointer-events-none"
            style={{
              width: "600px",
              height: "600px",
              bottom: "0%",
              right: "0%",
              backgroundColor: "rgba(153, 69, 255, 0.12)",
              animation: "fogDrift2 18s ease-in-out infinite",
            }}
          />
          <div
            className="absolute rounded-full blur-[160px] pointer-events-none"
            style={{
              width: "500px",
              height: "500px",
              top: "40%",
              right: "5%",
              backgroundColor: "rgba(3, 225, 255, 0.1)",
              animation: "fogDrift1 20s ease-in-out infinite reverse",
            }}
          />
          <div
            className="absolute rounded-full blur-[140px] pointer-events-none"
            style={{
              width: "400px",
              height: "400px",
              bottom: "20%",
              left: "30%",
              backgroundColor: "rgba(249, 63, 220, 0.08)",
              animation: "fogDrift2 16s ease-in-out infinite",
            }}
          />

          {/* === ROCKETS: vertical green streaks shooting upward === */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: "12%",
              bottom: "0",
              width: "4px",
              height: "35vh",
              background: `linear-gradient(to top, transparent, rgba(${SOLANA_GREEN}, 0.8), rgba(${SOLANA_GREEN}, 0.3))`,
              borderRadius: "2px",
              boxShadow: `0 0 20px rgba(${SOLANA_GREEN}, 0.5), 0 0 60px rgba(${SOLANA_GREEN}, 0.2)`,
              animation: "rocketUp1 6s cubic-bezier(0.2, 0.8, 0.3, 1) infinite",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              left: "55%",
              bottom: "0",
              width: "3px",
              height: "28vh",
              background: `linear-gradient(to top, transparent, rgba(${SOLANA_GREEN}, 0.9), rgba(${SOLANA_GREEN}, 0.4))`,
              borderRadius: "2px",
              boxShadow: `0 0 16px rgba(${SOLANA_GREEN}, 0.4), 0 0 50px rgba(${SOLANA_GREEN}, 0.15)`,
              animation: "rocketUp2 8s cubic-bezier(0.2, 0.8, 0.3, 1) infinite",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              left: "82%",
              bottom: "0",
              width: "5px",
              height: "40vh",
              background: `linear-gradient(to top, transparent, rgba(${SOLANA_GREEN}, 0.7), rgba(${SOLANA_GREEN}, 0.5))`,
              borderRadius: "3px",
              boxShadow: `0 0 24px rgba(${SOLANA_GREEN}, 0.6), 0 0 80px rgba(${SOLANA_GREEN}, 0.25)`,
              animation:
                "rocketUp3 7s cubic-bezier(0.15, 0.85, 0.3, 1) infinite",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              left: "35%",
              bottom: "0",
              width: "3px",
              height: "32vh",
              background: `linear-gradient(to top, transparent, rgba(${SOLANA_GREEN}, 0.85))`,
              borderRadius: "2px",
              boxShadow: `0 0 18px rgba(${SOLANA_GREEN}, 0.4)`,
              animation:
                "rocketUp1 9s cubic-bezier(0.2, 0.8, 0.3, 1) infinite 3s",
            }}
          />

          {/* Purple rocket */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: "45%",
              bottom: "0",
              width: "3px",
              height: "30vh",
              background:
                "linear-gradient(to top, transparent, rgba(153, 69, 255, 0.8), rgba(153, 69, 255, 0.3))",
              borderRadius: "2px",
              boxShadow:
                "0 0 18px rgba(153, 69, 255, 0.5), 0 0 50px rgba(153, 69, 255, 0.2)",
              animation:
                "rocketUp2 10s cubic-bezier(0.2, 0.8, 0.3, 1) infinite 1s",
            }}
          />
          {/* Blue rocket */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: "92%",
              bottom: "0",
              width: "3px",
              height: "26vh",
              background:
                "linear-gradient(to top, transparent, rgba(3, 225, 255, 0.7), rgba(3, 225, 255, 0.3))",
              borderRadius: "2px",
              boxShadow:
                "0 0 16px rgba(3, 225, 255, 0.4), 0 0 40px rgba(3, 225, 255, 0.15)",
              animation:
                "rocketUp3 8s cubic-bezier(0.15, 0.85, 0.3, 1) infinite 2s",
            }}
          />

          {/* === CRASHES: pink/purple streaks slamming down === */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: "25%",
              top: "0",
              width: "4px",
              height: "30vh",
              background:
                "linear-gradient(to bottom, transparent, rgba(249, 63, 220, 0.7), rgba(249, 63, 220, 0.2))",
              borderRadius: "2px",
              boxShadow:
                "0 0 20px rgba(249, 63, 220, 0.4), 0 0 50px rgba(249, 63, 220, 0.15)",
              animation:
                "crashDown1 8s cubic-bezier(0.6, 0, 0.9, 0.4) infinite",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              left: "70%",
              top: "0",
              width: "3px",
              height: "25vh",
              background:
                "linear-gradient(to bottom, transparent, rgba(153, 69, 255, 0.6), rgba(153, 69, 255, 0.15))",
              borderRadius: "2px",
              boxShadow: "0 0 16px rgba(153, 69, 255, 0.3)",
              animation:
                "crashDown2 9s cubic-bezier(0.6, 0, 0.9, 0.4) infinite",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              left: "48%",
              top: "0",
              width: "3px",
              height: "22vh",
              background:
                "linear-gradient(to bottom, transparent, rgba(255, 60, 60, 0.6), rgba(255, 60, 60, 0.15))",
              borderRadius: "2px",
              boxShadow: "0 0 14px rgba(255, 60, 60, 0.3)",
              animation:
                "crashDown1 11s cubic-bezier(0.6, 0, 0.9, 0.4) infinite 4s",
            }}
          />

          {/* === IMPACT FLASHES: bright bursts in Solana colors === */}
          <div
            className="absolute rounded-full blur-[60px] pointer-events-none"
            style={{
              width: "200px",
              height: "200px",
              left: "10%",
              bottom: "8%",
              backgroundColor: "rgba(20, 241, 149, 0.6)",
              animation: "impactFlash1 6s ease-out infinite",
            }}
          />
          <div
            className="absolute rounded-full blur-[80px] pointer-events-none"
            style={{
              width: "250px",
              height: "250px",
              left: "68%",
              bottom: "5%",
              backgroundColor: "rgba(249, 63, 220, 0.5)",
              animation: "impactFlash2 8s ease-out infinite",
            }}
          />
          <div
            className="absolute rounded-full blur-[50px] pointer-events-none"
            style={{
              width: "180px",
              height: "180px",
              left: "80%",
              top: "8%",
              backgroundColor: "rgba(3, 225, 255, 0.6)",
              animation: "impactFlash3 7s ease-out infinite",
            }}
          />
          <div
            className="absolute rounded-full blur-[70px] pointer-events-none"
            style={{
              width: "220px",
              height: "220px",
              left: "53%",
              top: "12%",
              backgroundColor: "rgba(153, 69, 255, 0.5)",
              animation: "impactFlash1 9s ease-out infinite 2s",
            }}
          />
          <div
            className="absolute rounded-full blur-[55px] pointer-events-none"
            style={{
              width: "160px",
              height: "160px",
              left: "33%",
              bottom: "15%",
              backgroundColor: "rgba(20, 241, 149, 0.55)",
              animation: "impactFlash2 7s ease-out infinite 1s",
            }}
          />

          {/* === TICKER STREAKS: horizontal price action lines in Solana colors === */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "30%",
              left: "0",
              width: "30vw",
              height: "2px",
              background:
                "linear-gradient(to right, transparent, rgba(20, 241, 149, 0.6), transparent)",
              boxShadow: "0 0 12px rgba(20, 241, 149, 0.3)",
              animation: "tickerStreak1 7s linear infinite",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              top: "55%",
              left: "0",
              width: "25vw",
              height: "2px",
              background:
                "linear-gradient(to right, transparent, rgba(153, 69, 255, 0.5), transparent)",
              boxShadow: "0 0 10px rgba(153, 69, 255, 0.25)",
              animation: "tickerStreak2 9s linear infinite",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              top: "42%",
              left: "0",
              width: "20vw",
              height: "2px",
              background:
                "linear-gradient(to right, transparent, rgba(249, 63, 220, 0.5), transparent)",
              boxShadow: "0 0 10px rgba(249, 63, 220, 0.2)",
              animation: "tickerStreak1 11s linear infinite 3s",
            }}
          />

          {/* === SPARK PARTICLES: tiny bright dots that shoot upward from impacts === */}
          {[
            {
              left: "13%",
              bottom: "12%",
              delay: "0s",
              anim: "spark1",
              dur: "5s",
            },
            {
              left: "14%",
              bottom: "10%",
              delay: "0.2s",
              anim: "spark2",
              dur: "5s",
            },
            {
              left: "56%",
              bottom: "8%",
              delay: "0s",
              anim: "spark3",
              dur: "7s",
            },
            {
              left: "54%",
              bottom: "10%",
              delay: "0.3s",
              anim: "spark1",
              dur: "7s",
            },
            {
              left: "83%",
              bottom: "6%",
              delay: "0s",
              anim: "spark4",
              dur: "6s",
            },
            {
              left: "81%",
              bottom: "8%",
              delay: "0.15s",
              anim: "spark2",
              dur: "6s",
            },
            {
              left: "36%",
              bottom: "10%",
              delay: "3s",
              anim: "spark3",
              dur: "8s",
            },
            {
              left: "34%",
              bottom: "12%",
              delay: "3.2s",
              anim: "spark1",
              dur: "8s",
            },
          ].map((s, i) => (
            <div
              key={`spark-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: "6px",
                height: "6px",
                left: s.left,
                bottom: s.bottom,
                backgroundColor: SOLANA_GREEN_HEX,
                boxShadow: `0 0 8px ${SOLANA_GREEN_HEX}, 0 0 20px rgba(${SOLANA_GREEN}, 0.5)`,
                animation: `${s.anim} ${s.dur} ease-out infinite ${s.delay}`,
              }}
            />
          ))}

          {/* === EXTRA ROCKETS: more pumps across the screen === */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: "5%",
              bottom: "0",
              width: "3px",
              height: "38vh",
              background:
                "linear-gradient(to top, transparent, rgba(20, 241, 149, 0.9))",
              borderRadius: "2px",
              boxShadow: "0 0 22px rgba(20, 241, 149, 0.5)",
              animation: "rocketUp4 5s cubic-bezier(0.2, 0.8, 0.3, 1) infinite",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              left: "22%",
              bottom: "0",
              width: "4px",
              height: "34vh",
              background:
                "linear-gradient(to top, transparent, rgba(3, 225, 255, 0.8))",
              borderRadius: "2px",
              boxShadow: "0 0 20px rgba(3, 225, 255, 0.5)",
              animation: "rocketUp5 7s cubic-bezier(0.2, 0.8, 0.3, 1) infinite",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              left: "65%",
              bottom: "0",
              width: "3px",
              height: "30vh",
              background:
                "linear-gradient(to top, transparent, rgba(249, 63, 220, 0.7))",
              borderRadius: "2px",
              boxShadow: "0 0 16px rgba(249, 63, 220, 0.4)",
              animation:
                "rocketUp4 9s cubic-bezier(0.2, 0.8, 0.3, 1) infinite 2s",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              left: "75%",
              bottom: "0",
              width: "5px",
              height: "42vh",
              background:
                "linear-gradient(to top, transparent, rgba(20, 241, 149, 0.85))",
              borderRadius: "3px",
              boxShadow:
                "0 0 28px rgba(20, 241, 149, 0.6), 0 0 80px rgba(20, 241, 149, 0.2)",
              animation:
                "rocketUp5 6s cubic-bezier(0.15, 0.85, 0.3, 1) infinite 1s",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              left: "98%",
              bottom: "0",
              width: "3px",
              height: "28vh",
              background:
                "linear-gradient(to top, transparent, rgba(153, 69, 255, 0.8))",
              borderRadius: "2px",
              boxShadow: "0 0 18px rgba(153, 69, 255, 0.4)",
              animation:
                "rocketUp4 8s cubic-bezier(0.2, 0.8, 0.3, 1) infinite 4s",
            }}
          />

          {/* === EXTRA CRASHES === */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: "8%",
              top: "0",
              width: "4px",
              height: "28vh",
              background:
                "linear-gradient(to bottom, transparent, rgba(255, 60, 60, 0.7))",
              borderRadius: "2px",
              boxShadow: "0 0 18px rgba(255, 60, 60, 0.4)",
              animation:
                "crashDown3 7s cubic-bezier(0.6, 0, 0.9, 0.4) infinite",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              left: "58%",
              top: "0",
              width: "3px",
              height: "24vh",
              background:
                "linear-gradient(to bottom, transparent, rgba(249, 63, 220, 0.65))",
              borderRadius: "2px",
              boxShadow: "0 0 14px rgba(249, 63, 220, 0.35)",
              animation:
                "crashDown3 10s cubic-bezier(0.6, 0, 0.9, 0.4) infinite 3s",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              left: "88%",
              top: "0",
              width: "4px",
              height: "32vh",
              background:
                "linear-gradient(to bottom, transparent, rgba(153, 69, 255, 0.7))",
              borderRadius: "2px",
              boxShadow: "0 0 20px rgba(153, 69, 255, 0.4)",
              animation:
                "crashDown1 6s cubic-bezier(0.6, 0, 0.9, 0.4) infinite 2s",
            }}
          />

          {/* === MORE IMPACT FLASHES === */}
          <div
            className="absolute rounded-full blur-[65px] pointer-events-none"
            style={{
              width: "200px",
              height: "200px",
              left: "3%",
              bottom: "10%",
              backgroundColor: "rgba(20, 241, 149, 0.55)",
              animation: "impactFlash3 5s ease-out infinite",
            }}
          />
          <div
            className="absolute rounded-full blur-[50px] pointer-events-none"
            style={{
              width: "180px",
              height: "180px",
              left: "86%",
              bottom: "12%",
              backgroundColor: "rgba(153, 69, 255, 0.5)",
              animation: "impactFlash2 6s ease-out infinite 1.5s",
            }}
          />
          <div
            className="absolute rounded-full blur-[45px] pointer-events-none"
            style={{
              width: "150px",
              height: "150px",
              left: "6%",
              top: "15%",
              backgroundColor: "rgba(255, 60, 60, 0.45)",
              animation: "impactFlash1 7s ease-out infinite 3s",
            }}
          />

          {/* === MORE TICKER STREAKS === */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "18%",
              left: "0",
              width: "28vw",
              height: "2px",
              background:
                "linear-gradient(to right, transparent, rgba(20, 241, 149, 0.5), transparent)",
              boxShadow: "0 0 10px rgba(20, 241, 149, 0.2)",
              animation: "tickerStreak3 8s linear infinite 2s",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              top: "85%",
              left: "0",
              width: "22vw",
              height: "2px",
              background:
                "linear-gradient(to right, transparent, rgba(249, 63, 220, 0.6), transparent)",
              boxShadow: "0 0 10px rgba(249, 63, 220, 0.25)",
              animation: "tickerStreak2 7s linear infinite 1s",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              top: "62%",
              left: "0",
              width: "32vw",
              height: "1px",
              background:
                "linear-gradient(to right, transparent, rgba(3, 225, 255, 0.5), transparent)",
              boxShadow: "0 0 8px rgba(3, 225, 255, 0.15)",
              animation: "tickerStreak1 5s linear infinite 4s",
            }}
          />

          {/* === SCREEN FLASH: full-screen white pulse === */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: "rgba(20, 241, 149, 0.15)",
              animation: "screenFlash 12s ease-in-out infinite",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: "rgba(153, 69, 255, 0.1)",
              opacity: 0,
              animation: "screenFlash 15s ease-in-out infinite 6s",
            }}
          />

          {/* === EXTRA SPARKS in Solana colors === */}
          {[
            {
              left: "6%",
              bottom: "14%",
              delay: "0s",
              anim: "spark1",
              dur: "4s",
              color: "#14F195",
            },
            {
              left: "7%",
              bottom: "12%",
              delay: "0.1s",
              anim: "spark3",
              dur: "4s",
              color: "#03E1FF",
            },
            {
              left: "23%",
              bottom: "8%",
              delay: "0s",
              anim: "spark2",
              dur: "6s",
              color: "#9945FF",
            },
            {
              left: "66%",
              bottom: "6%",
              delay: "1s",
              anim: "spark4",
              dur: "5s",
              color: "#F93FDC",
            },
            {
              left: "67%",
              bottom: "8%",
              delay: "1.2s",
              anim: "spark1",
              dur: "5s",
              color: "#14F195",
            },
            {
              left: "76%",
              bottom: "5%",
              delay: "0.5s",
              anim: "spark3",
              dur: "5s",
              color: "#03E1FF",
            },
            {
              left: "89%",
              bottom: "10%",
              delay: "2s",
              anim: "spark2",
              dur: "6s",
              color: "#9945FF",
            },
            {
              left: "46%",
              bottom: "9%",
              delay: "0s",
              anim: "spark4",
              dur: "4.5s",
              color: "#F93FDC",
            },
            {
              left: "47%",
              bottom: "7%",
              delay: "0.15s",
              anim: "spark1",
              dur: "4.5s",
              color: "#14F195",
            },
            {
              left: "58%",
              bottom: "11%",
              delay: "2.5s",
              anim: "spark3",
              dur: "7s",
              color: "#9945FF",
            },
          ].map((s, i) => (
            <div
              key={`xspark-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: "6px",
                height: "6px",
                left: s.left,
                bottom: s.bottom,
                backgroundColor: s.color,
                boxShadow: `0 0 8px ${s.color}, 0 0 20px ${s.color}50`,
                animation: `${s.anim} ${s.dur} ease-out infinite ${s.delay}`,
              }}
            />
          ))}

          {/* === CANDLESTICK CHARTS === */}
          {/* Chart 1: Pump chart — bottom-left, price going up-right */}
          <svg
            className="absolute pointer-events-none"
            style={{ left: "2%", bottom: "5%", width: "40vw", height: "50vh" }}
            viewBox="0 0 400 300"
            fill="none"
            preserveAspectRatio="none"
          >
            {/* Price line going up */}
            <path
              d="M0,280 L30,260 L60,270 L90,240 L120,250 L150,200 L180,210 L210,160 L240,140 L270,100 L300,80 L330,50 L360,30 L400,10"
              stroke={SOLANA_GREEN_HEX}
              strokeWidth="2"
              strokeDasharray="2000"
              style={{
                animation: "chartDraw 6s ease-in-out infinite",
                filter: `drop-shadow(0 0 6px rgba(${SOLANA_GREEN}, 0.5))`,
              }}
            />
            {/* Candle wicks + bodies */}
            {[
              { x: 30, o: 265, c: 255, h: 248, l: 275 },
              { x: 90, o: 260, c: 240, h: 230, l: 268 },
              { x: 150, o: 230, c: 200, h: 190, l: 240 },
              { x: 210, o: 195, c: 160, h: 148, l: 205 },
              { x: 270, o: 150, c: 100, h: 88, l: 160 },
              { x: 330, o: 90, c: 50, h: 38, l: 100 },
            ].map((c, i) => (
              <g
                key={`candle1-${i}`}
                style={{
                  animation: `candlePulse 6s ease-in-out infinite ${i * 0.3}s`,
                }}
              >
                {/* Wick */}
                <line
                  x1={c.x}
                  y1={c.h}
                  x2={c.x}
                  y2={c.l}
                  stroke={SOLANA_GREEN_HEX}
                  strokeWidth="1"
                  opacity="0.4"
                />
                {/* Body */}
                <rect
                  x={c.x - 6}
                  y={Math.min(c.o, c.c)}
                  width="12"
                  height={Math.abs(c.o - c.c) || 2}
                  fill={c.c < c.o ? SOLANA_GREEN_HEX : "#F93FDC"}
                  opacity="0.35"
                  rx="1"
                />
              </g>
            ))}
            {/* Glow area under line */}
            <path
              d="M0,280 L30,260 L60,270 L90,240 L120,250 L150,200 L180,210 L210,160 L240,140 L270,100 L300,80 L330,50 L360,30 L400,10 L400,300 L0,300 Z"
              fill={`url(#greenGrad1)`}
              style={{ animation: "chartDraw 6s ease-in-out infinite" }}
            />
            <defs>
              <linearGradient id="greenGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={SOLANA_GREEN_HEX}
                  stopOpacity="0.15"
                />
                <stop
                  offset="100%"
                  stopColor={SOLANA_GREEN_HEX}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
          </svg>

          {/* Chart 2: Dump chart — top-right, price crashing down */}
          <svg
            className="absolute pointer-events-none"
            style={{ right: "2%", top: "5%", width: "38vw", height: "45vh" }}
            viewBox="0 0 400 300"
            fill="none"
            preserveAspectRatio="none"
          >
            {/* Price line going down */}
            <path
              d="M0,30 L30,40 L60,25 L90,60 L120,55 L150,100 L180,90 L210,140 L240,170 L270,200 L300,230 L330,260 L360,275 L400,290"
              stroke="#F93FDC"
              strokeWidth="2"
              strokeDasharray="2000"
              style={{
                animation: "chartDraw2 7s ease-in-out infinite",
                filter: "drop-shadow(0 0 6px rgba(249, 63, 220, 0.5))",
              }}
            />
            {/* Candle wicks + bodies */}
            {[
              { x: 30, o: 30, c: 45, h: 20, l: 52 },
              { x: 90, o: 40, c: 65, h: 22, l: 72 },
              { x: 150, o: 70, c: 105, h: 60, l: 115 },
              { x: 210, o: 110, c: 145, h: 100, l: 155 },
              { x: 270, o: 155, c: 205, h: 145, l: 215 },
              { x: 330, o: 210, c: 265, h: 200, l: 278 },
            ].map((c, i) => (
              <g
                key={`candle2-${i}`}
                style={{
                  animation: `candlePulse2 7s ease-in-out infinite ${i * 0.35}s`,
                }}
              >
                <line
                  x1={c.x}
                  y1={c.h}
                  x2={c.x}
                  y2={c.l}
                  stroke="#F93FDC"
                  strokeWidth="1"
                  opacity="0.35"
                />
                <rect
                  x={c.x - 6}
                  y={Math.min(c.o, c.c)}
                  width="12"
                  height={Math.abs(c.o - c.c) || 2}
                  fill={c.c > c.o ? "#F93FDC" : SOLANA_GREEN_HEX}
                  opacity="0.3"
                  rx="1"
                />
              </g>
            ))}
            <path
              d="M0,30 L30,40 L60,25 L90,60 L120,55 L150,100 L180,90 L210,140 L240,170 L270,200 L300,230 L330,260 L360,275 L400,290 L400,0 L0,0 Z"
              fill="url(#pinkGrad1)"
              style={{ animation: "chartDraw2 7s ease-in-out infinite" }}
            />
            <defs>
              <linearGradient id="pinkGrad1" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#F93FDC" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#F93FDC" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Chart 3: Volatile chart — center, sharp spikes up and down */}
          <svg
            className="absolute pointer-events-none"
            style={{
              left: "25%",
              top: "15%",
              width: "50vw",
              height: "35vh",
              opacity: 0.6,
            }}
            viewBox="0 0 500 200"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0,100 L25,95 L50,80 L75,110 L100,40 L125,90 L150,85 L175,30 L200,120 L225,60 L250,100 L275,150 L300,70 L325,20 L350,110 L375,90 L400,50 L425,130 L450,80 L475,60 L500,45"
              stroke="#9945FF"
              strokeWidth="1.5"
              strokeDasharray="1500"
              style={{
                animation: "chartDraw3 8s ease-in-out infinite",
                filter: "drop-shadow(0 0 4px rgba(153, 69, 255, 0.4))",
              }}
            />
            {/* Volatile candles */}
            {[
              { x: 100, o: 80, c: 40, h: 30, l: 115 },
              { x: 175, o: 85, c: 30, h: 20, l: 95 },
              { x: 275, o: 100, c: 150, h: 90, l: 160 },
              { x: 325, o: 70, c: 20, h: 10, l: 80 },
              { x: 425, o: 80, c: 130, h: 70, l: 142 },
            ].map((c, i) => (
              <g
                key={`candle3-${i}`}
                style={{
                  animation: `candlePulse3 8s ease-in-out infinite ${i * 0.4}s`,
                }}
              >
                <line
                  x1={c.x}
                  y1={c.h}
                  x2={c.x}
                  y2={c.l}
                  stroke="#9945FF"
                  strokeWidth="1"
                  opacity="0.3"
                />
                <rect
                  x={c.x - 5}
                  y={Math.min(c.o, c.c)}
                  width="10"
                  height={Math.abs(c.o - c.c) || 2}
                  fill={c.c < c.o ? SOLANA_GREEN_HEX : "#F93FDC"}
                  opacity="0.25"
                  rx="1"
                />
              </g>
            ))}
          </svg>

          {/* Chart 4: Small blue chart — bottom-right corner, steady climb */}
          <svg
            className="absolute pointer-events-none"
            style={{
              right: "5%",
              bottom: "8%",
              width: "30vw",
              height: "30vh",
              opacity: 0.5,
            }}
            viewBox="0 0 300 200"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0,180 L30,170 L60,175 L90,155 L120,160 L150,130 L180,120 L210,90 L240,70 L270,40 L300,20"
              stroke="#03E1FF"
              strokeWidth="1.5"
              strokeDasharray="1500"
              style={{
                animation: "chartDraw 7s ease-in-out infinite 1s",
                filter: "drop-shadow(0 0 4px rgba(3, 225, 255, 0.4))",
              }}
            />
            {[
              { x: 60, o: 175, c: 168, h: 162, l: 180 },
              { x: 120, o: 160, c: 148, h: 140, l: 165 },
              { x: 180, o: 130, c: 118, h: 110, l: 135 },
              { x: 240, o: 85, c: 68, h: 58, l: 92 },
            ].map((c, i) => (
              <g
                key={`candle4-${i}`}
                style={{
                  animation: `candlePulse 7s ease-in-out infinite ${1 + i * 0.3}s`,
                }}
              >
                <line
                  x1={c.x}
                  y1={c.h}
                  x2={c.x}
                  y2={c.l}
                  stroke="#03E1FF"
                  strokeWidth="1"
                  opacity="0.35"
                />
                <rect
                  x={c.x - 5}
                  y={Math.min(c.o, c.c)}
                  width="10"
                  height={Math.abs(c.o - c.c) || 2}
                  fill={c.c < c.o ? "#03E1FF" : "#F93FDC"}
                  opacity="0.3"
                  rx="1"
                />
              </g>
            ))}
            <path
              d="M0,180 L30,170 L60,175 L90,155 L120,160 L150,130 L180,120 L210,90 L240,70 L270,40 L300,20 L300,200 L0,200 Z"
              fill="url(#blueGrad1)"
              style={{ animation: "chartDraw 7s ease-in-out infinite 1s" }}
            />
            <defs>
              <linearGradient id="blueGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#03E1FF" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#03E1FF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Scanlines — glitchy */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(${SOLANA_GREEN}, 0.06) 2px, rgba(${SOLANA_GREEN}, 0.06) 4px)`,
              animation: "scanGlitch 4s steps(1) infinite",
            }}
          />
        </div>
        {/* end hero effects wrapper */}

        <div className="container relative z-10 text-center px-4 py-12 md:py-16">
          {/* Title */}
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            style={{ animation: "heroTextGlow 5s ease-in-out infinite" }}
          >
            {translations.heroTitle}
          </h1>

          {/* Blurb */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-6 font-light">
            {translations.heroSubtitle1}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="relative">
              <div
                className="absolute top-1/2 left-1/2 w-40 h-20 rounded-full blur-[40px] pointer-events-none"
                style={{
                  backgroundColor: SOLANA_GREEN_HEX,
                  animation: "orbPulse 3s ease-in-out infinite",
                }}
              />
              <a
                href={REGISTRATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center gap-2 px-8 py-4 text-black font-bold rounded-full transition-all hover:scale-105"
                style={{
                  backgroundColor: SOLANA_GREEN_HEX,
                }}
              >
                {translations.heroRegisterButton}
              </a>
            </div>
            <div className="relative">
              <div
                className="absolute top-1/2 left-1/2 w-32 h-16 rounded-full blur-[35px] pointer-events-none"
                style={{
                  backgroundColor: "#9945FF",
                  animation: "orbPulse2 4s ease-in-out infinite 1s",
                }}
              />
              <a
                href="#resources"
                className="relative z-10 inline-flex items-center gap-2 px-8 py-4 border border-gray-500/50 text-gray-300 font-semibold rounded-full hover:bg-gray-500/10 transition-all"
              >
                {translations.heroResourcesButton}
                <ArrowDown size={18} />
              </a>
            </div>
          </div>

          {/* Submissions countdown */}
          <p
            className="mt-6 text-sm font-mono uppercase tracking-wider"
            style={{
              color: SOLANA_GREEN_HEX,
              animation: "countdownPulse 2s ease-in-out infinite",
            }}
          >
            Submissions due in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
          </p>
        </div>
      </section>

      {/* Overall Prizes Section */}
      <section className="relative py-10 md:py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(${SOLANA_GREEN}, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(${SOLANA_GREEN}, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
        {/* Section effects */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: "6%",
            bottom: "0",
            width: "3px",
            height: "25vh",
            background: `linear-gradient(to top, transparent, rgba(${SOLANA_GREEN}, 0.35))`,
            borderRadius: "2px",
            boxShadow: `0 0 14px rgba(${SOLANA_GREEN}, 0.2)`,
            animation: "rocketUp2 9s cubic-bezier(0.2, 0.8, 0.3, 1) infinite",
          }}
        />
        <div
          className="absolute rounded-full blur-[80px] pointer-events-none"
          style={{
            width: "180px",
            height: "180px",
            right: "8%",
            top: "15%",
            backgroundColor: "rgba(153, 69, 255, 0.06)",
            animation: "fogDrift1 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "4px",
            height: "4px",
            right: "10%",
            bottom: "20%",
            backgroundColor: SOLANA_GREEN_HEX,
            boxShadow: `0 0 6px ${SOLANA_GREEN_HEX}`,
            animation: "spark1 7s ease-out infinite",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "4px",
            height: "4px",
            left: "5%",
            top: "30%",
            backgroundColor: "#03E1FF",
            boxShadow: "0 0 6px #03E1FF",
            animation: "spark3 9s ease-out infinite 2s",
          }}
        />
        <svg
          className="absolute pointer-events-none"
          style={{
            left: "2%",
            bottom: "10%",
            width: "12vw",
            height: "15vh",
            opacity: 0.08,
          }}
          viewBox="0 0 200 80"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,70 L25,60 L50,65 L75,45 L100,50 L125,30 L150,25 L175,12 L200,5"
            stroke={SOLANA_GREEN_HEX}
            strokeWidth="1.5"
            strokeDasharray="500"
            style={{ animation: "miniChartDraw 10s ease-in-out infinite" }}
          />
        </svg>
        {/* Candle chart — green pump, right side */}
        <svg
          className="absolute pointer-events-none"
          style={{
            right: "3%",
            top: "15%",
            width: "14vw",
            height: "60%",
            opacity: 0.07,
          }}
          viewBox="0 0 100 200"
          fill="none"
        >
          {[
            { x: 15, o: 160, c: 130, h: 120, l: 170 },
            { x: 35, o: 140, c: 110, h: 95, l: 150 },
            { x: 55, o: 120, c: 80, h: 65, l: 130 },
            { x: 75, o: 90, c: 50, h: 35, l: 100 },
          ].map((c, i) => (
            <g
              key={`pc-${i}`}
              style={{
                animation: `floatCandle ${6 + i}s ease-in-out infinite ${i * 0.5}s`,
              }}
            >
              <line
                x1={c.x}
                y1={c.h}
                x2={c.x}
                y2={c.l}
                stroke={SOLANA_GREEN_HEX}
                strokeWidth="1"
              />
              <rect
                x={c.x - 5}
                y={Math.min(c.o, c.c)}
                width="10"
                height={Math.abs(c.o - c.c)}
                fill={SOLANA_GREEN_HEX}
                rx="1"
              />
            </g>
          ))}
        </svg>
        {/* Extra chaos */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "15%",
            bottom: "0",
            width: "3px",
            height: "30vh",
            background:
              "linear-gradient(to top, transparent, rgba(153, 69, 255, 0.5))",
            boxShadow: "0 0 16px rgba(153, 69, 255, 0.3)",
            animation:
              "rocketUp1 7s cubic-bezier(0.2, 0.8, 0.3, 1) infinite 1s",
          }}
        />
        <div
          className="absolute rounded-full blur-[50px] pointer-events-none"
          style={{
            width: "140px",
            height: "140px",
            left: "20%",
            bottom: "5%",
            backgroundColor: "rgba(20, 241, 149, 0.15)",
            animation: "impactFlash2 6s ease-out infinite 2s",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: "60%",
            left: "0",
            width: "25vw",
            height: "1px",
            background: `linear-gradient(to right, transparent, rgba(${SOLANA_GREEN}, 0.2), transparent)`,
            boxShadow: `0 0 8px rgba(${SOLANA_GREEN}, 0.1)`,
            animation: "tickerStreak1 8s linear infinite",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "5px",
            height: "5px",
            left: "18%",
            bottom: "12%",
            backgroundColor: "#9945FF",
            boxShadow: "0 0 10px #9945FF",
            animation: "spark1 5s ease-out infinite",
          }}
        />
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
                className={`bg-[#0a0612]/60 rounded-xl p-8 flex flex-col items-center text-center transition-all duration-500 pmh-card ${
                  prizesReveal.isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  border: `1px solid rgba(${SOLANA_GREEN}, 0.2)`,
                  transitionDelay: `${index * 150 + 200}ms`,
                  animationDelay: `${index * 0.7}s`,
                }}
              >
                <div
                  className="text-xs font-mono uppercase tracking-wider mb-3"
                  style={{ color: SOLANA_GREEN_HEX }}
                >
                  Overall
                </div>
                <h4
                  className={`${index === 0 ? "text-2xl" : "text-xl"} font-bold text-white mb-2`}
                >
                  {prize.place}
                </h4>
                <p className="text-gray-500 text-sm mb-6">{prize.sponsor}</p>
                <div
                  className="pt-4 mt-auto"
                  style={{
                    borderTop: `1px solid rgba(${SOLANA_GREEN}, 0.2)`,
                  }}
                >
                  <span
                    className={`${index === 0 ? "text-3xl" : "text-2xl"} font-bold font-mono`}
                    style={{ color: SOLANA_GREEN_HEX }}
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
      <section className="relative py-10 md:py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(${SOLANA_GREEN}, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(${SOLANA_GREEN}, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
        {/* Section effects */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "4%",
            top: "0",
            width: "3px",
            height: "20vh",
            background:
              "linear-gradient(to bottom, transparent, rgba(249, 63, 220, 0.3))",
            borderRadius: "2px",
            boxShadow: "0 0 12px rgba(249, 63, 220, 0.15)",
            animation: "crashDown2 10s cubic-bezier(0.6, 0, 0.9, 0.4) infinite",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: "40%",
            left: "0",
            width: "18vw",
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(3, 225, 255, 0.12), transparent)",
            boxShadow: "0 0 6px rgba(3, 225, 255, 0.06)",
            animation: "tickerStreak1 12s linear infinite 2s",
          }}
        />
        <div
          className="absolute rounded-full blur-[70px] pointer-events-none"
          style={{
            width: "150px",
            height: "150px",
            left: "80%",
            bottom: "10%",
            backgroundColor: "rgba(3, 225, 255, 0.05)",
            animation: "fogDrift2 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "4px",
            height: "4px",
            right: "12%",
            top: "25%",
            backgroundColor: "#9945FF",
            boxShadow: "0 0 6px #9945FF",
            animation: "spark2 8s ease-out infinite 1s",
          }}
        />
        {/* Candle chart — purple volatile, left side */}
        <svg
          className="absolute pointer-events-none"
          style={{
            left: "2%",
            top: "20%",
            width: "12vw",
            height: "55%",
            opacity: 0.06,
          }}
          viewBox="0 0 100 200"
          fill="none"
        >
          {[
            { x: 15, o: 100, c: 60, h: 45, l: 115, up: true },
            { x: 35, o: 70, c: 120, h: 55, l: 135, up: false },
            { x: 55, o: 110, c: 50, h: 35, l: 125, up: true },
            { x: 75, o: 60, c: 100, h: 45, l: 115, up: false },
          ].map((c, i) => (
            <g
              key={`bc-${i}`}
              style={{
                animation: `floatCandle ${7 + i}s ease-in-out infinite ${i * 0.4}s`,
              }}
            >
              <line
                x1={c.x}
                y1={c.h}
                x2={c.x}
                y2={c.l}
                stroke="#9945FF"
                strokeWidth="1"
              />
              <rect
                x={c.x - 5}
                y={Math.min(c.o, c.c)}
                width="10"
                height={Math.abs(c.o - c.c)}
                fill={c.up ? SOLANA_GREEN_HEX : "#F93FDC"}
                rx="1"
              />
            </g>
          ))}
        </svg>
        {/* Extra chaos */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: "8%",
            bottom: "0",
            width: "3px",
            height: "28vh",
            background: `linear-gradient(to top, transparent, rgba(${SOLANA_GREEN}, 0.6))`,
            boxShadow: `0 0 18px rgba(${SOLANA_GREEN}, 0.3)`,
            animation: "rocketUp2 6s cubic-bezier(0.2, 0.8, 0.3, 1) infinite",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            right: "25%",
            top: "0",
            width: "2px",
            height: "22vh",
            background:
              "linear-gradient(to bottom, transparent, rgba(249, 63, 220, 0.45))",
            boxShadow: "0 0 12px rgba(249, 63, 220, 0.2)",
            animation:
              "crashDown1 8s cubic-bezier(0.6, 0, 0.9, 0.4) infinite 3s",
          }}
        />
        <div
          className="absolute rounded-full blur-[45px] pointer-events-none"
          style={{
            width: "120px",
            height: "120px",
            right: "15%",
            bottom: "10%",
            backgroundColor: "rgba(3, 225, 255, 0.15)",
            animation: "impactFlash1 5s ease-out infinite 1s",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: "35%",
            left: "0",
            width: "20vw",
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(153, 69, 255, 0.2), transparent)",
            boxShadow: "0 0 6px rgba(153, 69, 255, 0.1)",
            animation: "tickerStreak2 9s linear infinite 1s",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "5px",
            height: "5px",
            right: "12%",
            bottom: "15%",
            backgroundColor: SOLANA_GREEN_HEX,
            boxShadow: `0 0 10px ${SOLANA_GREEN_HEX}`,
            animation: "spark2 4s ease-out infinite 2s",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "5px",
            height: "5px",
            left: "30%",
            top: "20%",
            backgroundColor: "#03E1FF",
            boxShadow: "0 0 10px #03E1FF",
            animation: "spark4 6s ease-out infinite",
          }}
        />
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

          {/* Bounties — side by side */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {translations.sponsorBounties.map((bounty, index) => (
              <div
                key={index}
                className={`bg-[#0a0612]/60 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-500 pmh-card ${
                  bountiesReveal.isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  border: `1px solid rgba(${SOLANA_GREEN}, 0.2)`,
                  transitionDelay: `${index * 150 + 200}ms`,
                  animationDelay: `${index * 1.2}s`,
                  minHeight: "200px",
                }}
              >
                <h4
                  className="text-2xl font-bold font-mono tracking-wider"
                  style={{ color: SOLANA_GREEN_HEX }}
                >
                  COMING SOON
                </h4>
              </div>
            ))}
          </div>

          {/* Add a bounty CTA */}
          <div className="max-w-3xl mx-auto mt-10 text-center">
            <p className="text-gray-400 text-base">
              {translations.addBountyText.split("submitting a PR")[0]}
              <a
                href="https://github.com/solana-foundation/solana-com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors"
                style={{ color: SOLANA_GREEN_HEX }}
              >
                submitting a PR
              </a>
              {translations.addBountyText.split("submitting a PR")[1]}
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-10 md:py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(${SOLANA_GREEN}, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(${SOLANA_GREEN}, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
        {/* Section effects */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "8%",
            bottom: "0",
            width: "2px",
            height: "22vh",
            background:
              "linear-gradient(to top, transparent, rgba(3, 225, 255, 0.35))",
            borderRadius: "2px",
            boxShadow: "0 0 12px rgba(3, 225, 255, 0.2)",
            animation:
              "rocketUp3 10s cubic-bezier(0.2, 0.8, 0.3, 1) infinite 1s",
          }}
        />
        <div
          className="absolute rounded-full blur-[60px] pointer-events-none"
          style={{
            width: "140px",
            height: "140px",
            right: "5%",
            bottom: "15%",
            backgroundColor: `rgba(${SOLANA_GREEN}, 0.05)`,
            animation: "fogDrift1 22s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "4px",
            height: "4px",
            left: "12%",
            bottom: "18%",
            backgroundColor: "#03E1FF",
            boxShadow: "0 0 6px #03E1FF",
            animation: "spark4 7s ease-out infinite",
          }}
        />
        <svg
          className="absolute pointer-events-none"
          style={{
            right: "3%",
            top: "20%",
            width: "10vw",
            height: "12vh",
            opacity: 0.06,
          }}
          viewBox="0 0 150 60"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 L15,25 L30,35 L45,15 L60,40 L75,10 L90,45 L105,20 L120,35 L135,8 L150,28"
            stroke="#9945FF"
            strokeWidth="1.5"
            strokeDasharray="500"
            style={{ animation: "miniChartDraw 13s ease-in-out infinite 3s" }}
          />
        </svg>
        {/* Candle chart — blue climb, left side */}
        <svg
          className="absolute pointer-events-none"
          style={{
            left: "3%",
            top: "10%",
            width: "10vw",
            height: "70%",
            opacity: 0.06,
          }}
          viewBox="0 0 80 200"
          fill="none"
        >
          {[
            { x: 12, o: 175, c: 155, h: 145, l: 182 },
            { x: 30, o: 155, c: 125, h: 112, l: 162 },
            { x: 48, o: 130, c: 90, h: 78, l: 140 },
            { x: 66, o: 95, c: 55, h: 40, l: 105 },
          ].map((c, i) => (
            <g
              key={`tc-${i}`}
              style={{
                animation: `floatCandle ${8 + i}s ease-in-out infinite ${i * 0.6}s`,
              }}
            >
              <line
                x1={c.x}
                y1={c.h}
                x2={c.x}
                y2={c.l}
                stroke="#03E1FF"
                strokeWidth="1"
              />
              <rect
                x={c.x - 4}
                y={Math.min(c.o, c.c)}
                width="8"
                height={Math.abs(c.o - c.c)}
                fill="#03E1FF"
                rx="1"
              />
            </g>
          ))}
        </svg>
        {/* Extra chaos */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: "5%",
            bottom: "0",
            width: "3px",
            height: "25vh",
            background:
              "linear-gradient(to top, transparent, rgba(249, 63, 220, 0.5))",
            boxShadow: "0 0 14px rgba(249, 63, 220, 0.25)",
            animation:
              "rocketUp3 8s cubic-bezier(0.2, 0.8, 0.3, 1) infinite 2s",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            left: "20%",
            top: "0",
            width: "2px",
            height: "20vh",
            background:
              "linear-gradient(to bottom, transparent, rgba(153, 69, 255, 0.4))",
            boxShadow: "0 0 10px rgba(153, 69, 255, 0.15)",
            animation:
              "crashDown2 9s cubic-bezier(0.6, 0, 0.9, 0.4) infinite 1s",
          }}
        />
        <div
          className="absolute rounded-full blur-[40px] pointer-events-none"
          style={{
            width: "100px",
            height: "100px",
            right: "10%",
            top: "15%",
            backgroundColor: "rgba(249, 63, 220, 0.12)",
            animation: "impactFlash3 7s ease-out infinite",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: "75%",
            left: "0",
            width: "18vw",
            height: "1px",
            background: `linear-gradient(to right, transparent, rgba(${SOLANA_GREEN}, 0.18), transparent)`,
            animation: "tickerStreak1 7s linear infinite 3s",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "5px",
            height: "5px",
            right: "8%",
            bottom: "20%",
            backgroundColor: "#F93FDC",
            boxShadow: "0 0 10px #F93FDC",
            animation: "spark3 5s ease-out infinite 1s",
          }}
        />
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
            <div
              className="rounded-xl overflow-hidden bg-[#0a0612]/60 pmh-card"
              style={{
                border: `1px solid rgba(${SOLANA_GREEN}, 0.2)`,
              }}
            >
              <div
                className="grid grid-cols-2"
                style={{
                  borderBottom: `1px solid rgba(${SOLANA_GREEN}, 0.2)`,
                }}
              >
                <div
                  className="py-3 px-6 font-mono text-sm uppercase tracking-wider"
                  style={{ color: SOLANA_GREEN_HEX }}
                >
                  {translations.timelinePhaseHeader}
                </div>
                <div
                  className="py-3 px-6 font-mono text-sm uppercase tracking-wider"
                  style={{ color: SOLANA_GREEN_HEX }}
                >
                  {translations.timelineDateHeader}
                </div>
              </div>
              {translations.timelineEvents.map((event, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 last:border-b-0 transition-colors"
                  style={{
                    borderBottom: `1px solid rgba(${SOLANA_GREEN}, 0.1)`,
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

      {/* Resources Section */}
      <section
        id="resources"
        className="relative py-10 md:py-12 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(${SOLANA_GREEN}, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(${SOLANA_GREEN}, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
        {/* Section effects */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: "4%",
            bottom: "0",
            width: "3px",
            height: "28vh",
            background:
              "linear-gradient(to top, transparent, rgba(153, 69, 255, 0.35))",
            borderRadius: "2px",
            boxShadow: "0 0 14px rgba(153, 69, 255, 0.2)",
            animation:
              "rocketUp1 8s cubic-bezier(0.2, 0.8, 0.3, 1) infinite 2s",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            left: "3%",
            top: "0",
            width: "2px",
            height: "18vh",
            background:
              "linear-gradient(to bottom, transparent, rgba(249, 63, 220, 0.25))",
            borderRadius: "2px",
            boxShadow: "0 0 10px rgba(249, 63, 220, 0.12)",
            animation:
              "crashDown1 11s cubic-bezier(0.6, 0, 0.9, 0.4) infinite 3s",
          }}
        />
        <div
          className="absolute rounded-full blur-[70px] pointer-events-none"
          style={{
            width: "160px",
            height: "160px",
            left: "15%",
            top: "10%",
            backgroundColor: "rgba(249, 63, 220, 0.05)",
            animation: "fogDrift2 16s ease-in-out infinite",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: "65%",
            left: "0",
            width: "22vw",
            height: "1px",
            background: `linear-gradient(to right, transparent, rgba(${SOLANA_GREEN}, 0.1), transparent)`,
            animation: "tickerStreak3 10s linear infinite",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "4px",
            height: "4px",
            left: "8%",
            bottom: "25%",
            backgroundColor: SOLANA_GREEN_HEX,
            boxShadow: `0 0 6px ${SOLANA_GREEN_HEX}`,
            animation: "spark1 6s ease-out infinite 1s",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "4px",
            height: "4px",
            right: "7%",
            top: "35%",
            backgroundColor: "#F93FDC",
            boxShadow: "0 0 6px #F93FDC",
            animation: "spark3 8s ease-out infinite 3s",
          }}
        />
        {/* Candle chart — pink dump, right side */}
        <svg
          className="absolute pointer-events-none"
          style={{
            right: "2%",
            top: "10%",
            width: "13vw",
            height: "65%",
            opacity: 0.06,
          }}
          viewBox="0 0 100 200"
          fill="none"
        >
          {[
            { x: 15, o: 40, c: 70, h: 30, l: 80 },
            { x: 35, o: 65, c: 100, h: 55, l: 112 },
            { x: 55, o: 95, c: 135, h: 82, l: 148 },
            { x: 75, o: 130, c: 170, h: 118, l: 182 },
          ].map((c, i) => (
            <g
              key={`rc-${i}`}
              style={{
                animation: `floatCandle ${7 + i}s ease-in-out infinite ${i * 0.5}s`,
              }}
            >
              <line
                x1={c.x}
                y1={c.h}
                x2={c.x}
                y2={c.l}
                stroke="#F93FDC"
                strokeWidth="1"
              />
              <rect
                x={c.x - 5}
                y={Math.min(c.o, c.c)}
                width="10"
                height={Math.abs(c.o - c.c)}
                fill="#F93FDC"
                rx="1"
              />
            </g>
          ))}
        </svg>
        {/* Extra chaos */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "6%",
            bottom: "0",
            width: "4px",
            height: "32vh",
            background: `linear-gradient(to top, transparent, rgba(${SOLANA_GREEN}, 0.6))`,
            boxShadow: `0 0 20px rgba(${SOLANA_GREEN}, 0.3)`,
            animation: "rocketUp4 5s cubic-bezier(0.2, 0.8, 0.3, 1) infinite",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            right: "15%",
            bottom: "0",
            width: "3px",
            height: "26vh",
            background:
              "linear-gradient(to top, transparent, rgba(3, 225, 255, 0.5))",
            boxShadow: "0 0 16px rgba(3, 225, 255, 0.25)",
            animation:
              "rocketUp5 7s cubic-bezier(0.2, 0.8, 0.3, 1) infinite 2s",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            left: "40%",
            top: "0",
            width: "3px",
            height: "24vh",
            background:
              "linear-gradient(to bottom, transparent, rgba(249, 63, 220, 0.5))",
            boxShadow: "0 0 14px rgba(249, 63, 220, 0.2)",
            animation:
              "crashDown3 6s cubic-bezier(0.6, 0, 0.9, 0.4) infinite 1s",
          }}
        />
        <div
          className="absolute rounded-full blur-[55px] pointer-events-none"
          style={{
            width: "160px",
            height: "160px",
            left: "10%",
            bottom: "8%",
            backgroundColor: `rgba(${SOLANA_GREEN}, 0.18)`,
            animation: "impactFlash1 5s ease-out infinite",
          }}
        />
        <div
          className="absolute rounded-full blur-[40px] pointer-events-none"
          style={{
            width: "110px",
            height: "110px",
            right: "20%",
            top: "10%",
            backgroundColor: "rgba(153, 69, 255, 0.15)",
            animation: "impactFlash2 7s ease-out infinite 3s",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: "30%",
            left: "0",
            width: "28vw",
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(249, 63, 220, 0.2), transparent)",
            boxShadow: "0 0 6px rgba(249, 63, 220, 0.1)",
            animation: "tickerStreak2 6s linear infinite",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: "70%",
            left: "0",
            width: "22vw",
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(153, 69, 255, 0.18), transparent)",
            animation: "tickerStreak1 10s linear infinite 4s",
          }}
        />
        {[
          {
            left: "9%",
            bottom: "18%",
            color: SOLANA_GREEN_HEX,
            anim: "spark1",
            dur: "4s",
            delay: "0s",
          },
          {
            left: "42%",
            bottom: "8%",
            color: "#03E1FF",
            anim: "spark3",
            dur: "5s",
            delay: "1s",
          },
          {
            left: "85%",
            bottom: "14%",
            color: "#F93FDC",
            anim: "spark2",
            dur: "4.5s",
            delay: "2s",
          },
        ].map((s, i) => (
          <div
            key={`res-spark-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "5px",
              height: "5px",
              left: s.left,
              bottom: s.bottom,
              backgroundColor: s.color,
              boxShadow: `0 0 10px ${s.color}`,
              animation: `${s.anim} ${s.dur} ease-out infinite ${s.delay}`,
            }}
          />
        ))}
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
                  className={`group bg-[#0a0612]/60 rounded-xl p-6 hover:scale-[1.02] transition-all cursor-pointer pmh-card ${
                    resourcesReveal.isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    border: `1px solid rgba(${SOLANA_GREEN}, 0.2)`,
                    transitionDelay: `${index * 100 + 200}ms`,
                    animationDelay: `${index * 0.9}s`,
                  }}
                >
                  <div
                    className="text-xs font-mono uppercase tracking-wider mb-2"
                    style={{ color: SOLANA_GREEN_HEX }}
                  >
                    {resource.category}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 transition-colors group-hover:text-[#14F195]">
                    {resource.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {resource.description}
                  </p>
                  <span
                    className="inline-flex items-center text-sm font-semibold"
                    style={{ color: SOLANA_GREEN_HEX }}
                  >
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
      <section className="relative py-10 md:py-12 overflow-hidden">
        {/* Section effects */}
        <div
          className="absolute rounded-full blur-[80px] pointer-events-none"
          style={{
            width: "160px",
            height: "160px",
            left: "5%",
            top: "20%",
            backgroundColor: `rgba(${SOLANA_GREEN}, 0.04)`,
            animation: "fogDrift1 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "4px",
            height: "4px",
            right: "15%",
            bottom: "30%",
            backgroundColor: "#F93FDC",
            boxShadow: "0 0 6px #F93FDC",
            animation: "spark2 9s ease-out infinite 2s",
          }}
        />
        <svg
          className="absolute pointer-events-none"
          style={{
            right: "5%",
            bottom: "15%",
            width: "8vw",
            height: "10vh",
            opacity: 0.05,
          }}
          viewBox="0 0 120 50"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,10 L15,18 L30,12 L45,28 L60,22 L75,35 L90,30 L105,42 L120,48"
            stroke="#F93FDC"
            strokeWidth="1.5"
            strokeDasharray="400"
            style={{ animation: "miniChartDraw 14s ease-in-out infinite 5s" }}
          />
        </svg>
        <div
          className="absolute pointer-events-none"
          style={{
            right: "8%",
            bottom: "0",
            width: "2px",
            height: "18vh",
            background: `linear-gradient(to top, transparent, rgba(${SOLANA_GREEN}, 0.25))`,
            borderRadius: "2px",
            boxShadow: `0 0 10px rgba(${SOLANA_GREEN}, 0.12)`,
            animation:
              "rocketUp3 11s cubic-bezier(0.2, 0.8, 0.3, 1) infinite 4s",
          }}
        />
        {/* Candle chart — green/pink mixed, left side */}
        <svg
          className="absolute pointer-events-none"
          style={{
            left: "4%",
            top: "15%",
            width: "10vw",
            height: "60%",
            opacity: 0.05,
          }}
          viewBox="0 0 80 180"
          fill="none"
        >
          {[
            { x: 12, o: 140, c: 110, h: 98, l: 150, up: true },
            { x: 30, o: 100, c: 130, h: 90, l: 142, up: false },
            { x: 48, o: 120, c: 80, h: 68, l: 132, up: true },
          ].map((c, i) => (
            <g
              key={`rqc-${i}`}
              style={{
                animation: `floatCandle ${8 + i}s ease-in-out infinite ${i * 0.7}s`,
              }}
            >
              <line
                x1={c.x}
                y1={c.h}
                x2={c.x}
                y2={c.l}
                stroke={c.up ? SOLANA_GREEN_HEX : "#F93FDC"}
                strokeWidth="1"
              />
              <rect
                x={c.x - 4}
                y={Math.min(c.o, c.c)}
                width="8"
                height={Math.abs(c.o - c.c)}
                fill={c.up ? SOLANA_GREEN_HEX : "#F93FDC"}
                rx="1"
              />
            </g>
          ))}
        </svg>
        {/* Extra chaos */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "12%",
            bottom: "0",
            width: "3px",
            height: "24vh",
            background:
              "linear-gradient(to top, transparent, rgba(153, 69, 255, 0.5))",
            boxShadow: "0 0 14px rgba(153, 69, 255, 0.25)",
            animation:
              "rocketUp2 8s cubic-bezier(0.2, 0.8, 0.3, 1) infinite 1s",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            right: "6%",
            top: "0",
            width: "2px",
            height: "18vh",
            background: `linear-gradient(to bottom, transparent, rgba(${SOLANA_GREEN}, 0.4))`,
            boxShadow: `0 0 10px rgba(${SOLANA_GREEN}, 0.15)`,
            animation:
              "crashDown1 7s cubic-bezier(0.6, 0, 0.9, 0.4) infinite 2s",
          }}
        />
        <div
          className="absolute rounded-full blur-[45px] pointer-events-none"
          style={{
            width: "120px",
            height: "120px",
            left: "15%",
            bottom: "10%",
            backgroundColor: "rgba(153, 69, 255, 0.12)",
            animation: "impactFlash3 6s ease-out infinite 1s",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: "45%",
            left: "0",
            width: "16vw",
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(3, 225, 255, 0.15), transparent)",
            animation: "tickerStreak3 8s linear infinite 2s",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "5px",
            height: "5px",
            left: "14%",
            bottom: "18%",
            backgroundColor: "#9945FF",
            boxShadow: "0 0 10px #9945FF",
            animation: "spark4 5s ease-out infinite",
          }}
        />
        <div
          ref={requirementsReveal.ref}
          className={`container relative z-10 transition-all duration-700 ${
            requirementsReveal.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <div
              className="rounded-xl p-8 bg-[#0a0612]/60 pmh-card"
              style={{
                border: `1px solid rgba(${SOLANA_GREEN}, 0.2)`,
              }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 font-mono">
                <span style={{ color: SOLANA_GREEN_HEX }}>&gt;</span>{" "}
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
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center"
                        style={{
                          border: `1px solid ${SOLANA_GREEN_HEX}`,
                        }}
                      >
                        <Check size={12} style={{ color: SOLANA_GREEN_HEX }} />
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
      <section className="relative py-10 md:py-14 overflow-hidden">
        {/* Section effects */}
        <div
          className="absolute rounded-full blur-[100px] pointer-events-none"
          style={{
            width: "200px",
            height: "200px",
            left: "20%",
            top: "10%",
            backgroundColor: `rgba(${SOLANA_GREEN}, 0.06)`,
            animation: "fogDrift1 14s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full blur-[80px] pointer-events-none"
          style={{
            width: "160px",
            height: "160px",
            right: "15%",
            bottom: "10%",
            backgroundColor: "rgba(153, 69, 255, 0.05)",
            animation: "fogDrift2 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            left: "10%",
            bottom: "0",
            width: "2px",
            height: "20vh",
            background: `linear-gradient(to top, transparent, rgba(${SOLANA_GREEN}, 0.3))`,
            borderRadius: "2px",
            boxShadow: `0 0 10px rgba(${SOLANA_GREEN}, 0.15)`,
            animation: "rocketUp1 7s cubic-bezier(0.2, 0.8, 0.3, 1) infinite",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            right: "12%",
            top: "0",
            width: "2px",
            height: "15vh",
            background:
              "linear-gradient(to bottom, transparent, rgba(249, 63, 220, 0.25))",
            borderRadius: "2px",
            animation:
              "crashDown2 9s cubic-bezier(0.6, 0, 0.9, 0.4) infinite 2s",
          }}
        />
        {[
          { left: "25%", top: "30%", delay: "0s", color: SOLANA_GREEN_HEX },
          { left: "75%", top: "40%", delay: "3s", color: "#9945FF" },
          { left: "50%", bottom: "20%", delay: "6s", color: "#03E1FF" },
        ].map((s, i) => (
          <div
            key={`cta-spark-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "4px",
              height: "4px",
              left: s.left,
              top: s.top,
              bottom: (s as { bottom?: string }).bottom,
              backgroundColor: s.color,
              boxShadow: `0 0 6px ${s.color}`,
              animation: `spark${(i % 4) + 1} 8s ease-out infinite ${s.delay}`,
            }}
          />
        ))}
        <div className="container relative z-10 text-center">
          <p className="text-xl md:text-2xl italic mb-8 pmh-hero-title">
            The best way to predict the future is to build it.
          </p>
          <div className="relative inline-block">
            <div
              className="absolute top-1/2 left-1/2 w-40 h-20 rounded-full blur-[40px] pointer-events-none"
              style={{
                backgroundColor: SOLANA_GREEN_HEX,
                animation: "orbPulse 3s ease-in-out infinite",
              }}
            />
            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-2 px-8 py-4 text-black font-bold rounded-full transition-all hover:scale-105"
              style={{
                backgroundColor: SOLANA_GREEN_HEX,
              }}
            >
              {translations.heroRegisterButton}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
