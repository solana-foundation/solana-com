import type { CompanyRecord } from "../../types";
import reapLogoBlack from "../../../assets/companies/reap/logo-black.svg";
import reapLogoWhiteLegacy from "../../../assets/companies/reap/logo-white-legacy.svg";
import reapLogoWhite from "../../../assets/companies/reap/logo-white.svg";

export const reap = {
  id: "reap",
  slug: "reap",
  name: "REAP",
  profile: {
    tagline: "Stablecoin-powered business payments and card issuing.",
    summary:
      "Reap provides business accounts, card issuing, and payment infrastructure that connects stablecoins with everyday business spending.",
    description:
      "Reap offers business accounts for managing cards, expenses, balances, and payouts. Its embedded finance platform lets companies build branded card programs and payment products through APIs, with support for stablecoin and fiat settlement.",
    sector: "Payments",
    type: "Company",
    links: { website: "https://reap.global/" },
    socials: {
      x: "https://x.com/reapglobal",
      linkedin: "https://www.linkedin.com/company/reapglobal/",
    },
  },
  defaultLogoId: "logo-black",
  logos: [
    {
      id: "logo-white-legacy",
      fileName: "logo-white-legacy.svg",
      format: "svg",
      source: reapLogoWhiteLegacy,
      theme: "dark",
      kind: "logo",
      background: "transparent",
      width: 118.607,
      height: 27,
    },
    {
      id: "breakpoint-2026-white",
      fileName: "logo-white.svg",
      format: "svg",
      source: reapLogoWhite,
      theme: "dark",
      kind: "logo",
      background: "transparent",
      treatment: "monotone",
      width: 612,
      height: 219,
    },
    {
      id: "logo-black",
      fileName: "logo-black.svg",
      format: "svg",
      source: reapLogoBlack,
      theme: "light",
      kind: "logo",
      background: "transparent",
      width: 612,
      height: 219,
    },
    {
      id: "logo-white",
      fileName: "logo-white.svg",
      format: "svg",
      source: reapLogoWhite,
      theme: "dark",
      kind: "logo",
      background: "transparent",
      width: 612,
      height: 219,
    },
  ],
} satisfies CompanyRecord;
