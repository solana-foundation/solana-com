import type { CompanyRecord } from "../../types";
import matchaLogoLight from "../../../assets/companies/matcha/logo-light.svg";
import matchaLogoDark from "../../../assets/companies/matcha/logo-dark.svg";
import matchaLogoMonotone from "../../../assets/companies/matcha/logo-monotone.svg";

export const matcha = {
  id: "matcha",
  slug: "matcha",
  name: "Matcha",
  profile: {
    tagline: "Search, trade, done",
    summary:
      "Matcha is a DEX aggregator built by 0x Labs that enables users to swap tokens across multiple blockchains with zero fees, aggregating liquidity from 180+ decentralized exchanges.",
    description:
      "Matcha is a decentralized exchange aggregator powered by the 0x protocol that provides users with the best swap prices by aggregating liquidity from over 180 DEXes across 15+ blockchain networks. The platform supports trading of over 27 million tokens with features including gasless trading, cross-chain swaps, limit orders, and TradingView price charts. Matcha expanded to Solana in early 2025, becoming one of the first DEX aggregators to support both SVM and EVM-compatible chains in a single interface.",
    sector: "DeFi",
    type: "Platform",
    links: {
      website: "https://matcha.xyz",
    },
    socials: {
      x: "https://x.com/matchaxyz",
      discord: "https://discord.gg/matchaxyz",
      telegram: "https://t.me/matchaxyz",
      github: "https://github.com/0xProject",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: matchaLogoLight,
      theme: "light",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: matchaLogoDark,
      theme: "dark",
    },
    {
      id: "logo-monotone",
      fileName: "logo-monotone.svg",
      format: "svg",
      source: matchaLogoMonotone,
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
