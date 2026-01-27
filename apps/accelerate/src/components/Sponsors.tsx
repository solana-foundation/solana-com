"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import sponsorsData from "@/data/sponsors.json";
import { getSponsorsByTier } from "@/lib/sponsors";
import type { Sponsor } from "@/types/sponsors";
import { getImagePath } from "@/config";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="relative z-10 flex h-full w-full items-center justify-center"
    >
      <img
        src={getImagePath(sponsor.logo)}
        alt={sponsor.name}
        className="max-h-full max-w-full object-contain"
        style={{
          filter:
            "brightness(0) saturate(100%) invert(73%) sepia(6%) saturate(354%) hue-rotate(210deg) brightness(93%) contrast(88%)",
        }}
      />
    </motion.div>
  );
}

export function Sponsors() {
  const sponsorTiers = getSponsorsByTier(sponsorsData.sponsors as Sponsor[]);

  if (sponsorTiers.length === 0) {
    return null;
  }

  return (
    <section id="sponsors" className="relative bg-black py-12 lg:py-16">
      {/* Pattern background */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-50">
        <Image
          src={getImagePath("/images/pattern-bgr.svg")}
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Header section with title and button */}
          <motion.div
            variants={fadeInUp}
            className="mb-8 flex flex-col items-start justify-between gap-6 lg:mb-12 lg:flex-row lg:items-center"
          >
            <div className="flex flex-col">
              <h2
                className="text-h1 text-accelerate-gray-100"
                style={{
                  fontFamily:
                    "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                }}
              >
                Sponsors
              </h2>
            </div>
            <a
              href="mailto:events@solana.org"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:bg-white/5"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                fontSize: "16px",
                background:
                  "linear-gradient(black, black) padding-box, linear-gradient(to right, #9945FF, #19FB9B) border-box",
                border: "1px solid transparent",
              }}
            >
              <span>BECOME A SPONSOR</span>
              <svg width="8" height="8" viewBox="0 0 11 11" fill="none">
                <path
                  d="M2 9L9 2M9 2H4M9 2V7"
                  stroke="#19FB9B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </motion.div>

          {/* Divider line */}
          <div className="mb-8 border-t border-white/10 lg:mb-10" />

          <div className="space-y-16 lg:space-y-20">
            {sponsorTiers.map((tier) => (
              <div key={tier.name}>
                <motion.p
                  variants={fadeInUp}
                  className="text-button mb-8 text-center uppercase tracking-[0.2em]"
                  style={{
                    fontFamily:
                      "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                    color: tier.color,
                  }}
                >
                  {tier.name}
                </motion.p>
                <div
                  className={`flex flex-wrap items-center justify-center ${
                    tier.level === "headline"
                      ? "gap-16"
                      : "gap-12 lg:gap-[60px]"
                  }`}
                >
                  {tier.sponsors.map((sponsor) => (
                    <div
                      key={sponsor.name}
                      className={`flex items-center justify-center ${
                        tier.level === "headline"
                          ? "h-[168px] w-[400px]"
                          : "h-[134px] w-[320px]"
                      }`}
                    >
                      <SponsorLogo sponsor={sponsor} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
