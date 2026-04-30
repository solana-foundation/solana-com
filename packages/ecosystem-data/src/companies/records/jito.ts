import type { CompanyRecord } from "../../types";
import jitoLogo from "../../../assets/companies/jito/logo.svg";

export const jito = {
  id: "jito",
  slug: "jito",
  name: "Jito",
  profile: {
    tagline: "Non-custodial liquid staking on Solana",
    summary:
      "Jito is the largest DeFi protocol on Solana, providing non-custodial liquid staking with MEV rewards and MEV-optimized validator infrastructure.",
    description:
      "Jito operates two core products on Solana: a liquid staking protocol that lets users stake any amount of SOL and receive JitoSOL with auto-compounded rewards amplified by MEV extraction, and a MEV infrastructure suite including an open-source validator client and transaction relayer. The Jito Foundation governs the protocol through JTO token holders who shape its development.",
    sector: "Staking",
    type: "Protocol",
    links: {
      website: "https://www.jito.network/",
    },
    socials: {
      x: "https://x.com/jito_sol",
      linkedin: "https://www.linkedin.com/company/jito-labs",
      discord: "https://discord.gg/jito",
      github: "https://github.com/jito-foundation",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: jitoLogo,
    },
  ],
} satisfies CompanyRecord;
