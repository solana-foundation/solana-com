import type { CompanyRecord } from "../../types";
import payoneerLogoColor from "../../../assets/companies/payoneer/logo-color.svg";
import payoneerLogoColorDark from "../../../assets/companies/payoneer/logo-color-dark.png";
import payoneerLogoStackedColorDark from "../../../assets/companies/payoneer/logo-stacked-color-dark.svg";
import payoneerLogoStackedColor from "../../../assets/companies/payoneer/logo-stacked-color.png";
import payoneerMarkColor from "../../../assets/companies/payoneer/mark-color.png";
import payoneerBreakpoint2026White from "../../../assets/companies/payoneer/breakpoint-2026-white.png";

export const payoneer = {
  id: "payoneer",
  slug: "payoneer",
  name: "Payoneer",
  profile: {
    tagline: "Cross-border payments for businesses.",
    summary:
      "Payoneer provides businesses with tools to receive international payments, hold multiple currencies, and pay suppliers and contractors.",
    description:
      "Payoneer's business account combines local receiving accounts, multi-currency balances, currency conversion, and outbound payments. Businesses use the platform to collect payments from clients and marketplaces and pay partners across borders.",
    sector: "Payments",
    type: "Company",
    links: { website: "https://www.payoneer.com/" },
    socials: {
      x: "https://x.com/Payoneer",
      linkedin: "https://www.linkedin.com/company/payoneer",
    },
  },
  defaultLogoId: "logo-color",
  logos: [
    {
      id: "logo-color",
      fileName: "logo-color.svg",
      format: "svg",
      source: payoneerLogoColor,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-color-dark",
      fileName: "logo-color-dark.png",
      format: "png",
      source: payoneerLogoColorDark,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-stacked-color-dark",
      fileName: "logo-stacked-color-dark.svg",
      format: "svg",
      source: payoneerLogoStackedColorDark,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-stacked-color",
      fileName: "logo-stacked-color.png",
      format: "png",
      source: payoneerLogoStackedColor,
      theme: "light",
      kind: "logo",
    },
    {
      id: "mark-color",
      fileName: "mark-color.png",
      format: "png",
      source: payoneerMarkColor,
      kind: "mark",
    },
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: payoneerBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
