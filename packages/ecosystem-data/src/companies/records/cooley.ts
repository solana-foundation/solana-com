import type { CompanyRecord } from "../../types";
import cooleyBreakpoint2026White from "../../../assets/companies/cooley/breakpoint-2026-white.webp";
import cooleyLogoRed from "../../../assets/companies/cooley/logo-red.webp";

export const cooley = {
  id: "cooley",
  slug: "cooley",
  name: "Cooley",
  legalName: "Cooley LLP",
  profile: {
    tagline: "Legal counsel for technology and growth companies.",
    summary:
      "Cooley is a law firm advising companies on corporate, regulatory, litigation, and intellectual property matters, including blockchain and tokenization.",
    description:
      "Cooley is a global law firm serving technology companies and investors. Its blockchain and tokenization practice advises on transactions, securities regulation, privacy, intellectual property, disputes, and related legal issues.",
    sector: "Policy",
    type: "Company",
    links: {
      website: "https://www.cooley.com/",
    },
    socials: {
      x: "https://x.com/CooleyLLP",
      linkedin: "https://www.linkedin.com/company/cooleyllp/",
    },
  },
  defaultLogoId: "logo-red",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.webp",
      format: "webp",
      source: cooleyBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-red",
      fileName: "logo-red.webp",
      format: "webp",
      source: cooleyLogoRed,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
