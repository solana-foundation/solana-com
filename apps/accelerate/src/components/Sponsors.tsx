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
}

interface SponsorTier {
  name: string;
  sponsors: Sponsor[];
  size: "large" | "medium" | "small";
}

function SponsorLogo({
  sponsor,
  size,
}: {
  sponsor: Sponsor;
  size: "large" | "medium" | "small";
}) {
  const sizeClasses = {
    large: "h-20 md:h-24",
    medium: "h-10 md:h-12",
    small: "h-8 md:h-10",
  };

  return (
    <motion.a
      variants={fadeInUp}
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
    >
      <Image
        src={sponsor.logo}
        alt={sponsor.name}
        width={200}
        height={80}
        className={`w-auto object-contain ${sizeClasses[size]}`}
      />
    </motion.a>
  );
}

export function Sponsors() {
  const sponsorTiers: SponsorTier[] = [
    {
      name: "TITLE SPONSORS",
      size: "large",
      sponsors: [
        {
          name: "Sunrise",
          logo: "/images/sponsors/sunrise.svg",
          url: "https://sunrise.io",
        },
      ],
    },
    {
      name: "GOLD SPONSORS",
      size: "medium",
      sponsors: [
        {
          name: "DoubleZero",
          logo: "/images/sponsors/doublezero.svg",
          url: "https://doublezero.io",
        },
        {
          name: "Playsolana",
          logo: "/images/sponsors/playsolana.svg",
          url: "https://playsolana.io",
        },
        {
          name: "Bridge",
          logo: "/images/sponsors/bridge.svg",
          url: "https://bridge.xyz",
        },
        {
          name: "Libeara",
          logo: "/images/sponsors/libeara.svg",
          url: "https://libeara.io",
        },
      ],
    },
    {
      name: "SPONSORS",
      size: "small",
      sponsors: [
        {
          name: "Dabba",
          logo: "/images/sponsors/dabba.svg",
          url: "https://dabba.io",
        },
        {
          name: "Solflare",
          logo: "/images/sponsors/solflare.svg",
          url: "https://solflare.com",
        },
      ],
    },
  ];

  return (
    <section id="sponsors" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeInUp}
            className="mb-16 text-4xl font-bold text-black md:text-5xl"
          >
            Sponsors
          </motion.h2>

          <div className="space-y-16">
            {sponsorTiers.map((tier) => (
              <div key={tier.name}>
                <motion.p
                  variants={fadeInUp}
                  className="mb-8 text-center text-xs font-medium uppercase tracking-[0.2em] text-black/40"
                >
                  {tier.name}
                </motion.p>
                <div
                  className={`flex flex-wrap items-center justify-center ${
                    tier.size === "large"
                      ? "gap-12"
                      : tier.size === "medium"
                        ? "gap-8 md:gap-16"
                        : "gap-6 md:gap-12"
                  }`}
                >
                  {tier.sponsors.map((sponsor) => (
                    <SponsorLogo
                      key={sponsor.name}
                      sponsor={sponsor}
                      size={tier.size}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <motion.div
            variants={fadeInUp}
            className="mt-20 text-center"
          >
            <p className="mb-4 text-black/60">
              Interested in sponsoring?
            </p>
            <a
              href="mailto:sponsors@solana.com"
              className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-transparent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white"
            >
              Become a Sponsor
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M3 11L11 3M11 3H5M11 3V9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
