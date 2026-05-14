import type { CompanyRecord } from "../../types";
import anchorageLogoLight from "../../../assets/companies/anchorage/logo-light.svg";
import anchorageMarkDark from "../../../assets/companies/anchorage/mark-dark.svg";
import anchorageMarkLight from "../../../assets/companies/anchorage/mark-light.svg";

export const anchorage = {
  id: "anchorage",
  slug: "anchorage",
  name: "Anchorage Digital",
  profile: {
    tagline: "Global crypto platform for institutions",
    summary:
      "Anchorage Digital provides institutional trading, staking, custody, governance, settlement, and stablecoin infrastructure, including support for Solana-native assets.",
    description:
      "Anchorage Digital is a global crypto platform serving institutions across trading, staking, custody, governance, settlement, and stablecoin issuance. The company includes Anchorage Digital Bank N.A., the first federally chartered crypto bank in the United States, alongside licensed entities in Singapore and New York. On Solana, Anchorage Digital supports SOL, SPL tokens, and institutional access to assets such as USDG on Solana.",
    sector: "Infrastructure",
    type: "Company",
    links: {
      website: "https://www.anchorage.com/",
    },
    socials: {
      x: "https://x.com/Anchorage",
      linkedin: "https://www.linkedin.com/company/anchorage/",
      youtube: "https://www.youtube.com/@AnchorageDigital",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: anchorageLogoLight,
      kind: "logo",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.svg",
      format: "svg",
      source: anchorageMarkDark,
      theme: "dark",
      kind: "mark",
    },
    {
      id: "mark-light",
      fileName: "mark-light.svg",
      format: "svg",
      source: anchorageMarkLight,
      theme: "light",
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
