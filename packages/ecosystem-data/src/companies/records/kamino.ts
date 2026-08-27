import type { CompanyRecord } from "../../types";
import kaminoLogoDark from "../../../assets/companies/kamino/logo-dark.svg";

export const kamino = {
  id: "kamino",
  slug: "kamino",
  name: "Kamino",
  profile: {
    tagline: "Solana lending, liquidity, and leverage",
    summary:
      "Kamino is a Solana DeFi protocol that unifies lending, liquidity, and leverage in one product suite.",
    description:
      "Kamino is a Solana DeFi protocol for borrowing, lending, leveraged liquidity, and automated yield strategies. The product suite supports transparent analytics, position data, and markets for assets including SOL, stablecoins, JUP, JLP, and other Solana assets. Kamino has become a core venue for RWA lending markets and collateral flows on Solana.",
    sector: "DeFi",
    type: "Protocol",
    links: {
      website: "https://kamino.com/",
    },
    socials: {
      x: "https://x.com/KaminoFinance",
      linkedin: "https://www.linkedin.com/company/kaminofinance",
      github: "https://github.com/Kamino-Finance",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: kaminoLogoDark,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
