import type { CompanyRecord } from "../../types";
import rockawayxLogoDark from "../../../assets/companies/rockawayx/logo-dark.svg";
import rockawayxLogoLight from "../../../assets/companies/rockawayx/logo-light.svg";
import rockawayxMark from "../../../assets/companies/rockawayx/mark.svg";

export const rockawayx = {
  id: "rockawayx",
  slug: "rockawayx",
  name: "RockawayX",
  profile: {
    tagline: "We run blockchains and provide liquidity to fuel protocols",
    summary:
      "RockawayX is a blockchain infrastructure and investment firm that operates validators across 50+ networks, manages over $2B in assets across 100+ portfolio projects, and provides on-chain liquidity with $500M+ in total value locked.",
    description:
      "RockawayX operates across three verticals: infrastructure, investments, and liquidity. The firm runs validators and develops protocol-ready hardware across more than 50 blockchain networks with over $1B in staked assets. Its venture arm backs early-stage crypto projects, with a portfolio exceeding 100 companies and $2B in managed assets. RockawayX also functions as a DeFi liquidity provider across 50+ protocols, contributing daily on-chain engineering to its portfolio projects.",
    sector: "Infrastructure",
    type: "Company",
    links: {
      website: "https://rockawayx.com/",
    },
    socials: {
      x: "https://x.com/Rockaway_X",
      linkedin: "https://www.linkedin.com/company/rockawayx/",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: rockawayxLogoDark,
      theme: "light",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: rockawayxLogoLight,
      theme: "dark",
    },
    {
      id: "mark",
      fileName: "mark.svg",
      format: "svg",
      source: rockawayxMark,
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
