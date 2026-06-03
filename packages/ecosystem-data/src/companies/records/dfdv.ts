import type { CompanyRecord } from "../../types";
import dfdvBreakpoint2026White from "../../../assets/companies/dfdv/breakpoint-2026-white.png";
import dfdvLogoColor from "../../../assets/companies/dfdv/logo-color.svg";
import dfdvMarkColor from "../../../assets/companies/dfdv/mark-color.png";

export const dfdv = {
  id: "dfdv",
  slug: "dfdv",
  name: "DFDV",
  legalName: "DeFi Development Corp.",
  profile: {
    tagline: "A public company with a Solana treasury strategy.",
    summary:
      "DeFi Development Corp. is a public company focused on building and holding a Solana treasury alongside its operating businesses.",
    description:
      "DeFi Development Corp. is a public company with a Solana treasury strategy and operating businesses connected to digital assets and financial technology. The company communicates with investors and ecosystem participants through its DeFi Development Corp. brand.",
    sector: "DeFi",
    type: "Company",
    links: {
      website: "https://defidevcorp.com/",
    },
    socials: {
      x: "https://x.com/defidevcorp",
      linkedin: "https://www.linkedin.com/company/defi-development-corporation",
    },
  },
  defaultLogoId: "logo-color",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: dfdvBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-color",
      fileName: "logo-color.svg",
      format: "svg",
      source: dfdvLogoColor,
    },
    {
      id: "mark-color",
      fileName: "mark-color.png",
      format: "png",
      source: dfdvMarkColor,
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
