import type { CompanyRecord } from "../../types";
import agantWordmarkLight from "../../../assets/companies/agant/wordmark-light.svg";
import agantWordmarkDark from "../../../assets/companies/agant/wordmark-dark.svg";
import agantWordmarkColor from "../../../assets/companies/agant/wordmark-color.svg";
import agantMarkLight from "../../../assets/companies/agant/mark-light.svg";
import agantMarkDark from "../../../assets/companies/agant/mark-dark.svg";
import agantMarkColor from "../../../assets/companies/agant/mark-color.svg";
import agantBreakpoint2026White from "../../../assets/companies/agant/breakpoint-2026-white.svg";

export const agant = {
  id: "agant",
  slug: "agant",
  name: "Agant",
  profile: {
    tagline: "Sterling stablecoin infrastructure for businesses.",
    summary:
      "Agant is a UK-based issuer of GBPA, a pound sterling stablecoin available on Solana and other networks.",
    description:
      "Agant issues GBPA, a digital representation of the pound sterling designed for business payments and settlement. Its infrastructure supports conversion between fiat and stablecoins and operates across Solana and several other blockchains.",
    sector: "Payments",
    type: "Company",
    links: { website: "https://www.agant.io/" },
    socials: {
      x: "https://x.com/AgantFinance",
      linkedin: "https://www.linkedin.com/company/agant-finance",
    },
  },
  defaultLogoId: "wordmark-dark",
  logos: [
    {
      id: "wordmark-light",
      fileName: "wordmark-light.svg",
      format: "svg",
      source: agantWordmarkLight,
      theme: "dark",
      kind: "wordmark",
    },
    {
      id: "wordmark-dark",
      fileName: "wordmark-dark.svg",
      format: "svg",
      source: agantWordmarkDark,
      theme: "light",
      kind: "wordmark",
    },
    {
      id: "wordmark-color",
      fileName: "wordmark-color.svg",
      format: "svg",
      source: agantWordmarkColor,
      theme: "light",
      kind: "wordmark",
    },
    {
      id: "mark-light",
      fileName: "mark-light.svg",
      format: "svg",
      source: agantMarkLight,
      theme: "dark",
      kind: "mark",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.svg",
      format: "svg",
      source: agantMarkDark,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-color",
      fileName: "mark-color.svg",
      format: "svg",
      source: agantMarkColor,
      theme: "light",
      kind: "mark",
    },
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: agantBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
