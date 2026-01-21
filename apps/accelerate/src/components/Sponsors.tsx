"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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

interface Sponsor {
  name: string;
  logo: string;
  url: string;
  width?: number;
  height?: number;
}

interface SponsorTier {
  name: string;
  sponsors: Sponsor[];
  color: string;
}

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  return (
    // <motion.a
    //   variants={fadeInUp}
    //   href={sponsor.url}
    //   target="_blank"
    //   rel="noopener noreferrer"
    //   className="relative z-10 flex items-center justify-center"
    // >
    <motion.div
      variants={fadeInUp}
      className="relative z-10 flex items-center justify-center"
    >
      <img
        src={sponsor.logo}
        alt={sponsor.name}
        className="h-auto w-full max-w-full object-contain"
        style={{
          filter:
            "brightness(0) saturate(100%) invert(73%) sepia(6%) saturate(354%) hue-rotate(210deg) brightness(93%) contrast(88%)",
        }}
      />
    </motion.div>
    // </motion.a>
  );
}

export function Sponsors() {
  const sponsorTiers: SponsorTier[] = [
    {
      name: "HEADLINE SPONSORS",
      color: "#19FB9B", // light green
      sponsors: [
        {
          name: "Sunrise",
          logo: "/images/sponsors/sunrise.svg",
          url: "#",
          width: 400,
          height: 168,
        },
      ],
    },
    {
      name: "SIGNATURE SPONSORS",
      color: "#9945FF", // purple
      sponsors: [
        // First row
        {
          name: "DoubleZero",
          logo: "/images/sponsors/doublezero.svg",
          url: "#",
          width: 253,
          height: 40,
        },
        {
          name: "Playsolana",
          logo: "/images/sponsors/playsolana.svg",
          url: "#",
          width: 320,
          height: 134,
        },
        {
          name: "Bridge",
          logo: "/images/sponsors/bridge.svg",
          url: "#",
          width: 186,
          height: 86,
        },
        {
          name: "Libeara",
          logo: "/images/sponsors/libeara.svg",
          url: "#",
          width: 204,
          height: 46,
        },
        // Second row
        {
          name: "Ant Group",
          logo: "/images/sponsors/ant-group.svg",
          url: "#",
          width: 234,
          height: 74,
        },
        {
          name: "Dabba",
          logo: "/images/sponsors/dabba.svg",
          url: "#",
          width: 240,
          height: 38,
        },
        {
          name: "Solflare",
          logo: "/images/sponsors/solflare.svg",
          url: "#",
          width: 320,
          height: 134,
        },
      ],
    },
    {
      name: "PREMIUM SPONSORS",
      color: "#2A88DE", // light blue
      sponsors: [
        {
          name: "DoubleZero",
          logo: "/images/sponsors/doublezero.svg",
          url: "#",
          width: 253,
          height: 40,
        },
        {
          name: "Playsolana",
          logo: "/images/sponsors/playsolana.svg",
          url: "#",
          width: 320,
          height: 134,
        },
        {
          name: "Bridge",
          logo: "/images/sponsors/bridge.svg",
          url: "#",
          width: 186,
          height: 86,
        },
        {
          name: "Libeara",
          logo: "/images/sponsors/libeara.svg",
          url: "#",
          width: 204,
          height: 46,
        },
      ],
    },
  ];

  return (
    <section id="sponsors" className="relative bg-black py-20 lg:py-28">
      {/* Pattern background */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-50">
        <Image
          src="/images/pattern-bgr.svg"
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
            className="mb-12 flex flex-col items-start justify-between gap-6 lg:mb-20 lg:flex-row lg:items-center"
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
              href="mailto:sponsors@solana.com"
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
          <div className="mb-12 border-t border-white/10 lg:mb-20" />

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
                    tier.name === "TITLE SPONSORS"
                      ? "gap-12"
                      : tier.name === "GOLD SPONSORS"
                        ? "gap-8 lg:gap-[40px]"
                        : "gap-8 lg:gap-[40px]"
                  }`}
                >
                  {tier.sponsors.map((sponsor) => (
                    <div
                      key={sponsor.name}
                      className={`flex items-center justify-center ${
                        tier.name === "TITLE SPONSORS"
                          ? "h-[168px] w-[400px]"
                          : tier.name === "GOLD SPONSORS"
                            ? "h-[134px] w-[320px]"
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
