import type { CompanyRecord } from "../../types";
import zerionLogoLight from "../../../assets/companies/zerion/logo-light.svg";
import zerionLogoMonotone from "../../../assets/companies/zerion/logo-monotone.svg";

export const zerion = {
  id: "zerion",
  slug: "zerion",
  name: "Zerion",
  profile: {
    tagline: "The smart wallet for everyone",
    summary:
      "Zerion is a self-custody multichain wallet that lets users manage tokens, NFTs, DeFi positions, and on-chain activity across networks including Solana.",
    description:
      "Zerion is a self-custody crypto wallet available on web, iOS, Android, and as a browser extension. It aggregates portfolios across more than a dozen networks, including Solana, and gives users a unified view of tokens, NFTs, and DeFi positions alongside in-wallet swaps, bridging, and connections to decentralized applications. Zerion also publishes on-chain analytics and APIs that surface wallet activity across the broader ecosystem.",
    sector: "Wallet",
    type: "Company",
    links: {
      website: "https://zerion.io/",
    },
    socials: {
      x: "https://x.com/zerion",
      linkedin: "https://www.linkedin.com/company/zerion-io/",
      github: "https://github.com/zeriontech",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: zerionLogoLight,
      kind: "logo",
    },
    {
      id: "logo-monotone",
      fileName: "logo-monotone.svg",
      format: "svg",
      source: zerionLogoMonotone,
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
