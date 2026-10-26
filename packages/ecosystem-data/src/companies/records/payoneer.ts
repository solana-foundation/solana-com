import type { CompanyRecord } from "../../types";
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
  defaultLogoId: "breakpoint-2026-white",
  logos: [
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
