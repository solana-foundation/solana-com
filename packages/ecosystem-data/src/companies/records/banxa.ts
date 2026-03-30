import type { CompanyRecord } from "../../types";
import banxaLogoDark from "../../../assets/companies/banxa/logo-dark.png";
import banxaLogoLight from "../../../assets/companies/banxa/logo-light.png";
import banxaLogoWhite from "../../../assets/companies/banxa/logo-white.png";
import banxaMark from "../../../assets/companies/banxa/mark.png";

export const banxa = {
  id: "banxa",
  slug: "banxa",
  name: "Banxa",
  profile: {
    tagline: "Seamless crypto and fiat conversions",
    summary:
      "Banxa is a regulated fiat-to-crypto infrastructure provider that enables businesses to embed on-ramp and off-ramp payment solutions with end-to-end compliance.",
    description:
      "Banxa provides plug-and-play fiat-to-crypto on-ramp and off-ramp infrastructure for fintechs, exchanges, and wallets. Founded in 2014 and publicly listed on TSX-V, the company operates across the USA, Europe, and Asia-Pacific with regulatory licenses in multiple jurisdictions. Banxa supports the Solana ecosystem as an on-ramp provider, enabling users to purchase SOL and Solana-based tokens directly with fiat currency through its API-first platform.",
    sector: "Payments",
    type: "Company",
    links: {
      website: "https://banxa.com/",
    },
    socials: {
      x: "https://x.com/BanxaOfficial",
      linkedin: "https://www.linkedin.com/company/banxa-com/",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.png",
      format: "png",
      source: banxaLogoDark,
      theme: "dark",
    },
    {
      id: "logo-light",
      fileName: "logo-light.png",
      format: "png",
      source: banxaLogoLight,
      theme: "light",
    },
    {
      id: "logo-white",
      fileName: "logo-white.png",
      format: "png",
      source: banxaLogoWhite,
      theme: "dark",
    },
    {
      id: "mark",
      fileName: "mark.png",
      format: "png",
      source: banxaMark,
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
