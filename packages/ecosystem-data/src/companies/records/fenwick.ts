import type { CompanyRecord } from "../../types";
import fenwickLogoLight from "../../../assets/companies/fenwick/logo-light.svg";
import fenwickLogoDark from "../../../assets/companies/fenwick/logo-dark.svg";
import fenwickLogoColor from "../../../assets/companies/fenwick/logo-color.svg";
import fenwickBreakpoint2026White from "../../../assets/companies/fenwick/breakpoint-2026-white.svg";

export const fenwick = {
  id: "fenwick",
  slug: "fenwick",
  name: "Fenwick",
  profile: {
    tagline: "Legal counsel for technology and life sciences companies.",
    summary:
      "Fenwick is a law firm advising technology and life sciences companies on corporate, intellectual property, litigation, and regulatory matters.",
    description:
      "Fenwick works with companies across technology and life sciences. Its practices include corporate transactions, intellectual property, litigation, tax, and regulatory advice for businesses at different stages of growth.",
    sector: "Policy",
    type: "Company",
    links: { website: "https://www.fenwick.com/" },
    socials: {
      linkedin: "https://www.linkedin.com/company/fenwick-%26-west/",
    },
  },
  defaultLogoId: "logo-color",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: fenwickLogoLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: fenwickLogoDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-color",
      fileName: "logo-color.svg",
      format: "svg",
      source: fenwickLogoColor,
      theme: "light",
      kind: "logo",
    },
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: fenwickBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
