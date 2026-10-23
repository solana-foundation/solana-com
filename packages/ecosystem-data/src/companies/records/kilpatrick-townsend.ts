import type { CompanyRecord } from "../../types";
import kilpatrickTownsendBreakpoint2026White from "../../../assets/companies/kilpatrick-townsend/breakpoint-2026-white.svg";
import kilpatrickTownsendLogoColor from "../../../assets/companies/kilpatrick-townsend/logo-color.svg";

export const kilpatrickTownsend = {
  id: "kilpatrick-townsend",
  slug: "kilpatrick-townsend",
  name: "Kilpatrick Townsend & Stockton LLP",
  legalName: "Kilpatrick Townsend & Stockton LLP",
  profile: {
    tagline: "Legal counsel for businesses and innovators.",
    summary:
      "Kilpatrick Townsend & Stockton LLP is a law firm advising clients on intellectual property, litigation, corporate, and regulatory matters.",
    description:
      "Kilpatrick, the brand name of Kilpatrick Townsend & Stockton LLP, is an international law firm. Its lawyers work across intellectual property, litigation, corporate transactions, and regulatory issues for companies and institutions.",
    sector: "Policy",
    type: "Company",
    links: {
      website: "https://ktslaw.com/",
    },
    socials: {
      x: "https://twitter.com/KTS_Law",
      linkedin:
        "https://www.linkedin.com/company/kilpatrick-townsend-&-stockton-llp/",
    },
  },
  defaultLogoId: "logo-color",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: kilpatrickTownsendBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-color",
      fileName: "logo-color.svg",
      format: "svg",
      source: kilpatrickTownsendLogoColor,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
