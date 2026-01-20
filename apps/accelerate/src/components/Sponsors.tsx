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
}

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  return (
    <motion.a
      variants={fadeInUp}
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      className="sponsor-logo flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10"
    >
      <Image
        src={sponsor.logo}
        alt={sponsor.name}
        width={120}
        height={40}
        className="h-8 w-auto object-contain"
      />
    </motion.a>
  );
}

export function Sponsors() {
  const sponsorTiers: SponsorTier[] = [
    {
      name: "Title Sponsor",
      sponsors: [
        {
          name: "Sunrise",
          logo: "/images/sponsors/sunrise.svg",
          url: "https://sunrise.io",
        },
      ],
    },
    {
      name: "Platinum Sponsors",
      sponsors: [
        {
          name: "DoubleZero",
          logo: "/images/sponsors/doublezero.svg",
          url: "https://doublezero.io",
        },
        {
          name: "Firedancer",
          logo: "/images/sponsors/firedancer.svg",
          url: "https://firedancer.io",
        },
        {
          name: "Bridge",
          logo: "/images/sponsors/bridge.svg",
          url: "https://bridge.xyz",
        },
        {
          name: "Liberata",
          logo: "/images/sponsors/liberata.svg",
          url: "https://liberata.io",
        },
      ],
    },
    {
      name: "Gold Sponsors",
      sponsors: [
        {
          name: "HSBC",
          logo: "/images/sponsors/hsbc.svg",
          url: "https://hsbc.com",
        },
        {
          name: "Dobbs",
          logo: "/images/sponsors/dobbs.svg",
          url: "https://dobbs.io",
        },
        {
          name: "Solflare",
          logo: "/images/sponsors/solflare.svg",
          url: "https://solflare.com",
        },
      ],
    },
    {
      name: "Silver Sponsors",
      sponsors: [
        {
          name: "DoubleZero",
          logo: "/images/sponsors/doublezero.svg",
          url: "https://doublezero.io",
        },
        {
          name: "Firedancer",
          logo: "/images/sponsors/firedancer.svg",
          url: "https://firedancer.io",
        },
        {
          name: "Bridge",
          logo: "/images/sponsors/bridge.svg",
          url: "https://bridge.xyz",
        },
        {
          name: "Liberata",
          logo: "/images/sponsors/liberata.svg",
          url: "https://liberata.io",
        },
      ],
    },
  ];

  return (
    <section id="sponsors" className="section bg-white dark:bg-accelerate-dark">
      <div className="container-accelerate">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeInUp}
            className="heading-lg mb-12 text-black dark:text-white"
          >
            Sponsors
          </motion.h2>

          <div className="space-y-12">
            {sponsorTiers.map((tier) => (
              <div key={tier.name}>
                <motion.p
                  variants={fadeInUp}
                  className="mb-6 text-sm font-medium uppercase tracking-wider text-black/50 dark:text-white/50"
                >
                  {tier.name}
                </motion.p>
                <div
                  className={`grid gap-4 ${
                    tier.name === "Title Sponsor"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-2 md:grid-cols-4 lg:grid-cols-4"
                  }`}
                >
                  {tier.sponsors.map((sponsor) => (
                    <SponsorLogo
                      key={sponsor.name + tier.name}
                      sponsor={sponsor}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <motion.div
            variants={fadeInUp}
            className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-8 text-center"
          >
            <h3 className="mb-2 text-xl font-semibold text-black dark:text-white">
              Become a Sponsor
            </h3>
            <p className="mb-6 text-black/60 dark:text-white/60">
              Partner with Solana Accelerate APAC and connect with the
              blockchain community.
            </p>
            <a
              href="mailto:sponsors@solana.com"
              className="btn-primary inline-flex"
            >
              Contact Us
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
