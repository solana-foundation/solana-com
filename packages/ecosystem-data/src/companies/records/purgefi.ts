import type { CompanyRecord } from "../../types";
import purgefiLogo from "../../../assets/companies/purgefi/logo.svg";

export const purgefi = {
  id: "purgefi",
  slug: "purgefi",
  name: "PurgeFi",
  legalName: "PurgeFi",
  profile: {
    tagline: "Reclaim locked rent SOL from empty token accounts",
    summary:
      "PurgeFi is a non-custodial Solana utility tool that scans and closes empty or inactive token accounts to reclaim locked rent SOL directly to your wallet.",
    description:
      "PurgeFi enables Solana users to safely recover locked rent SOL by identifying and burning zero-balance, spam, or abandoned token accounts. Built with user security as a top priority, PurgeFi is non-custodial, open-source, and requires zero sensitive wallet permissions. Users can batch-close accounts with transparent transaction simulation before signing.",
    sector: "Infrastructure",
    type: "Platform",
    links: {
      website: "https://purgefi.com",
    },
    socials: {
      x: "https://x.com/PurgeFi_App",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: purgefiLogo,
    },
  ],
} satisfies CompanyRecord;
