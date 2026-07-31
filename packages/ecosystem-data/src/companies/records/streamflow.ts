import type { CompanyRecord } from "../../types";
import streamflowBreakpoint2026White from "../../../assets/companies/streamflow/breakpoint-2026-white.svg";
import streamflowBreakpoint2026WhitePng from "../../../assets/companies/streamflow/breakpoint-2026-white.png";
import streamflowLogoColor from "../../../assets/companies/streamflow/logo-color.svg";
import streamflowMarkColorPng from "../../../assets/companies/streamflow/mark-color.png";
import streamflowMarkWhite from "../../../assets/companies/streamflow/mark-white.svg";

export const streamflow = {
  id: "streamflow",
  slug: "streamflow",
  name: "Streamflow",
  profile: {
    tagline: "Token distribution infrastructure for Solana.",
    summary:
      "Streamflow provides token vesting, airdrops, staking, and on-chain payroll tooling for Solana and web3 teams.",
    description:
      "Streamflow is a token distribution platform for teams that need automated vesting, airdrops, staking, and on-chain payroll. Its tooling helps projects schedule token releases, run batch payouts, and keep distributions auditable.",
    sector: "Developer Tools",
    type: "Platform",
    links: {
      website: "https://streamflow.finance/",
    },
    socials: {
      x: "https://x.com/streamflow_fi",
      linkedin: "https://www.linkedin.com/company/streamflow-finance",
      github: "https://github.com/streamflow-finance",
      youtube: "https://www.youtube.com/@streamflow_finance",
    },
  },
  defaultLogoId: "logo-color",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: streamflowBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "breakpoint-2026-white-png",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: streamflowBreakpoint2026WhitePng,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-color",
      fileName: "logo-color.svg",
      format: "svg",
      source: streamflowLogoColor,
    },
    {
      id: "mark-color-png",
      fileName: "mark-color.png",
      format: "png",
      source: streamflowMarkColorPng,
      kind: "mark",
    },
    {
      id: "mark-white",
      fileName: "mark-white.svg",
      format: "svg",
      source: streamflowMarkWhite,
      theme: "dark",
      kind: "mark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
