import type { CompanyRecord } from "../../types";
import allnodesLogo from "../../../assets/companies/allnodes/logo.svg";

export const allnodes = {
  id: "allnodes",
  slug: "allnodes",
  name: "Allnodes",
  profile: {
    tagline:
      "Non-custodial platform for node hosting and staking across 120+ protocols",
    summary:
      "Allnodes is a non-custodial infrastructure platform that provides node hosting, validator services, and staking for Solana and 120+ other blockchain protocols.",
    description:
      "Allnodes provides reliable non-custodial node hosting and staking services, allowing users to deploy validators, full nodes, and stake assets across 120+ blockchain protocols. On Solana, Allnodes hosts over 100 nodes including 61 validators with 6.47M SOL staked. The platform also offers bare-metal servers purpose-built for Solana validators, featuring AMD EPYC Turin processors and enterprise-grade hardware.",
    sector: "Infrastructure",
    type: "Platform",
    links: {
      website: "https://www.allnodes.com",
    },
    socials: {
      x: "https://x.com/Allnodes",
      linkedin: "https://www.linkedin.com/company/allnodes",
      discord: "https://discord.com/invite/allnodes",
      telegram: "https://t.me/allnodes",
      github: "https://github.com/allnodes",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: allnodesLogo,
    },
  ],
} satisfies CompanyRecord;
