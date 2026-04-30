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
    tagline: "One Network. Local Everywhere.",
    summary:
      "Banxa, an OSL company, is the leading provider of embedded crypto infrastructure — powering seamless integration of digital assets into existing platforms.",
    description:
      "Over the past decade Banxa has built global and local payment solutions backed by an international licensing network, enabling 400+ businesses to deliver crypto and stablecoin access to millions of users around the world. Headquartered in the United States, Europe, and Asia-Pacific, Banxa supports over 30 fiat currencies, 300+ cryptocurrencies, and has processed $10bn+ in cumulative transactions for 8m+ users globally. Banxa supports the Solana ecosystem as an on-ramp provider, enabling users to purchase SOL and Solana-based tokens directly with fiat currency.",
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
