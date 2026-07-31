import type { CompanyRecord } from "../../types";
import raydiumLogoDark from "../../../assets/companies/raydium/logo-dark.svg";

export const raydium = {
  id: "raydium",
  slug: "raydium",
  name: "Raydium",
  profile: {
    tagline: "Solana liquidity and AMM infrastructure",
    summary:
      "Raydium is a Solana DeFi protocol providing AMM, CLMM, CPMM, and LaunchLab liquidity infrastructure.",
    description:
      "Raydium is a decentralized Solana protocol for automated market making, concentrated liquidity, constant-product pools, and launch tools. Its official brand kit describes the protocol as a singular collection of blockchain-enabled smart contracts with vector logo assets for integrations. Raydium supplies secondary liquidity for tokenized equities, ETFs, commodities, and other external assets that trade on Solana.",
    sector: "DeFi",
    type: "Protocol",
    links: {
      website: "https://raydium.io/",
      docs: "https://docs.raydium.io/",
    },
    socials: {
      x: "https://x.com/RaydiumProtocol",
      discord: "https://discord.gg/raydium",
      github: "https://github.com/raydium-io",
      medium: "https://medium.com/@raydium",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: raydiumLogoDark,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
