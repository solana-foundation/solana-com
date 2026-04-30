import type { CompanyRecord } from "../../types";
import squadsLogo from "../../../assets/companies/squads/logo.svg";

export const squads = {
  id: "squads",
  slug: "squads",
  name: "Squads",
  profile: {
    tagline: "Finance Without Legacy Constraints",
    summary:
      "Squads is the multisig standard on Solana, providing smart account infrastructure for teams, DAOs, and businesses to securely manage onchain assets with shared ownership and permissions.",
    description:
      "Squads is the industry-standard multisig platform on Solana, built on the formally verified Squads Protocol. Teams can deploy a multisig in a few clicks, configuring time locks, spending limits, roles, sub-accounts, and custom access controls. Major Solana projects including Helium, Jito, Pyth, Drift, and Orca rely on Squads for onchain operations.",
    sector: "Infrastructure",
    type: "Protocol",
    links: {
      website: "https://squads.xyz/",
    },
    socials: {
      x: "https://x.com/SquadsProtocol",
      linkedin: "https://www.linkedin.com/company/squads-labs",
      github: "https://github.com/Squads-Protocol",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: squadsLogo,
    },
  ],
} satisfies CompanyRecord;
