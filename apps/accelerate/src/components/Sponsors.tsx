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
  logoHeight: number;
}

function SponsorLogo({
  sponsor,
  logoHeight,
}: {
  sponsor: Sponsor;
  logoHeight: number;
}) {
  return (
    <motion.a
      variants={fadeInUp}
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center"
    >
      <Image
        src={sponsor.logo}
        alt={sponsor.name}
        width={sponsor.width || 200}
        height={sponsor.height || logoHeight}
        className="h-auto w-auto object-contain"
        style={{ maxHeight: `${logoHeight}px` }}
      />
    </motion.a>
  );
}

export function Sponsors() {
  const sponsorTiers: SponsorTier[] = [
    {
      name: "TITLE SPONSORS",
      logoHeight: 98,
      sponsors: [
        {
          name: "Sunrise",
          logo: "/images/sponsors/sunrise.svg",
          url: "#",
          width: 358,
          height: 98,
        },
      ],
    },
    {
      name: "GOLD SPONSORS",
      logoHeight: 86,
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
    {
      name: "SPONSORS",
      logoHeight: 74,
      sponsors: [
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
  ];

  // Third row sponsors (duplicated from design for additional visibility)
  const additionalSponsors: SponsorTier = {
    name: "",
    logoHeight: 50,
    sponsors: [
      {
        name: "DoubleZero",
        logo: "/images/sponsors/doublezero.svg",
        url: "#",
        width: 180,
        height: 30,
      },
      {
        name: "Playsolana",
        logo: "/images/sponsors/playsolana.svg",
        url: "#",
        width: 200,
        height: 80,
      },
      {
        name: "Bridge",
        logo: "/images/sponsors/bridge.svg",
        url: "#",
        width: 130,
        height: 60,
      },
      {
        name: "Libeara",
        logo: "/images/sponsors/libeara.svg",
        url: "#",
        width: 145,
        height: 33,
      },
    ],
  };

  return (
    <section id="sponsors" className="bg-black py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Section heading */}
          <motion.h2
            variants={fadeInUp}
            className="text-h1 mb-12 text-accelerate-gray-100 lg:mb-20"
            style={{
              fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            }}
          >
            Sponsors
          </motion.h2>

          {/* Divider line */}
          <div className="mb-12 border-t border-white/10 lg:mb-20" />

          <div className="space-y-16 lg:space-y-20">
            {sponsorTiers.map((tier) => (
              <div key={tier.name}>
                <motion.p
                  variants={fadeInUp}
                  className="text-button mb-8 text-center uppercase tracking-[0.2em] text-white/60"
                  style={{
                    fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                  }}
                >
                  {tier.name}
                </motion.p>
                <div
                  className={`flex flex-wrap items-center justify-center ${
                    tier.name === "TITLE SPONSORS"
                      ? "gap-12"
                      : "gap-8 lg:gap-[40px]"
                  }`}
                >
                  {tier.sponsors.map((sponsor) => (
                    <div
                      key={sponsor.name}
                      className={`flex h-[134px] items-center justify-center ${
                        tier.name === "TITLE SPONSORS"
                          ? "w-[358px]"
                          : "w-[320px]"
                      }`}
                    >
                      <SponsorLogo sponsor={sponsor} logoHeight={tier.logoHeight} />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Additional sponsor row */}
            <div>
              <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-[40px]">
                {additionalSponsors.sponsors.map((sponsor, index) => (
                  <div
                    key={`additional-${sponsor.name}-${index}`}
                    className="flex h-[80px] w-[200px] items-center justify-center"
                  >
                    <SponsorLogo
                      sponsor={sponsor}
                      logoHeight={additionalSponsors.logoHeight}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Become a Sponsor CTA */}
            <motion.div variants={fadeInUp} className="flex justify-center pt-8">
              <a
                href="mailto:sponsors@solana.com"
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:bg-white/5"
                style={{
                  fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                  fontSize: "16px",
                  background: "linear-gradient(black, black) padding-box, linear-gradient(to right, #9945FF, #19FB9B) border-box",
                  border: "1px solid transparent",
                }}
              >
                <span>Become a Sponsor</span>
                <svg width="8" height="8" viewBox="0 0 11 11" fill="none">
                  <path
                    d="M2 9L9 2M9 2H4M9 2V7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
