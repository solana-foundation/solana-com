import type { CompanyRecord } from "../../types";
import streamflowLogoColor from "../../../assets/companies/streamflow/logo-color.svg";

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
      id: "logo-color",
      fileName: "logo-color.svg",
      format: "svg",
      source: streamflowLogoColor,
    },
  ],
} satisfies CompanyRecord;
