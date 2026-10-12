import type { CompanyRecord } from "../../types";
import circleBreakpoint2026White from "../../../assets/companies/circle/breakpoint-2026-white.svg";
import circleLogoColor from "../../../assets/companies/circle/logo-color.svg";
import circleLogoCompactDark from "../../../assets/companies/circle/logo-compact-dark.svg";
import circleLogoDark from "../../../assets/companies/circle/logo-dark.svg";
import circleLogoLight from "../../../assets/companies/circle/logo-light.svg";
import circleLogoOnDark from "../../../assets/companies/circle/logo-on-dark.svg";
import circleLogoStacked from "../../../assets/companies/circle/logo-stacked.svg";
import circleMarkColor from "../../../assets/companies/circle/mark-color.svg";
import circleMarkDark from "../../../assets/companies/circle/mark-dark.svg";
import circleMarkInsetDark from "../../../assets/companies/circle/mark-inset-dark.svg";
import circleMarkInsetLight from "../../../assets/companies/circle/mark-inset-light.svg";
import circleMarkInset from "../../../assets/companies/circle/mark-inset.svg";
import circleMarkLight from "../../../assets/companies/circle/mark-light.svg";

export const circle = {
  id: "circle",
  slug: "circle",
  name: "Circle",
  profile: {
    tagline: "Stablecoin infrastructure for global payments.",
    summary:
      "Circle issues USDC and builds infrastructure for digital dollar payments and financial applications.",
    description:
      "Circle provides stablecoins and payment infrastructure for businesses and developers. Its products include USDC, APIs, and the Circle Payments Network for moving value across supported blockchains and payment providers.",
    sector: "Payments",
    type: "Company",
    links: {
      website: "https://www.circle.com/",
    },
    socials: {
      x: "https://twitter.com/circle",
      linkedin: "https://www.linkedin.com/company/circle-internet-financial/",
    },
  },
  defaultLogoId: "logo-on-dark",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: circleBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-color",
      fileName: "logo-color.svg",
      format: "svg",
      source: circleLogoColor,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-compact-dark",
      fileName: "logo-compact-dark.svg",
      format: "svg",
      source: circleLogoCompactDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: circleLogoDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: circleLogoLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-on-dark",
      fileName: "logo-on-dark.svg",
      format: "svg",
      source: circleLogoOnDark,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-stacked",
      fileName: "logo-stacked.svg",
      format: "svg",
      source: circleLogoStacked,
      theme: "light",
      kind: "logo",
    },
    {
      id: "mark-color",
      fileName: "mark-color.svg",
      format: "svg",
      source: circleMarkColor,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.svg",
      format: "svg",
      source: circleMarkDark,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-inset-dark",
      fileName: "mark-inset-dark.svg",
      format: "svg",
      source: circleMarkInsetDark,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-inset-light",
      fileName: "mark-inset-light.svg",
      format: "svg",
      source: circleMarkInsetLight,
      theme: "dark",
      kind: "mark",
    },
    {
      id: "mark-inset",
      fileName: "mark-inset.svg",
      format: "svg",
      source: circleMarkInset,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-light",
      fileName: "mark-light.svg",
      format: "svg",
      source: circleMarkLight,
      theme: "dark",
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
