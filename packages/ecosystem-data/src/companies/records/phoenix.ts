import type { CompanyRecord } from "../../types";
import phoenixBreakpoint2026Orange from "../../../assets/companies/phoenix/breakpoint-2026-orange.svg";
import phoenixLogoOrange from "../../../assets/companies/phoenix/logo-orange.svg";

export const phoenix = {
  id: "phoenix",
  slug: "phoenix",
  name: "Phoenix",
  profile: {
    tagline: "Solana's on-chain perpetuals exchange",
    summary:
      "Phoenix is a non-custodial decentralized exchange for perpetual futures on Solana. It provides on-chain perpetuals trading with a FIFO order book and liquidity designed for reliable execution.",
    description:
      "Phoenix is a Solana-native perpetual futures exchange developed by Ellipsis Labs. Its on-chain exchange combines a FIFO order book with spline liquidity and supports trading, market data, and developer integrations through its API and SDKs. Phoenix's prior spot exchange now operates as Phoenix Legacy.",
    sector: "DeFi",
    type: "Protocol",
    links: {
      website: "https://www.phoenix.trade/",
      docs: "https://docs.phoenix.trade/",
      blog: "https://www.ellipsislabs.xyz/blog-posts/introducing-phoenix-perpetuals",
    },
    socials: {
      x: "https://x.com/PhoenixTrade",
      github: "https://github.com/Ellipsis-Labs",
    },
  },
  defaultLogoId: "logo-orange",
  logos: [
    {
      id: "breakpoint-2026-orange",
      fileName: "breakpoint-2026-orange.svg",
      format: "svg",
      source: phoenixBreakpoint2026Orange,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-orange",
      fileName: "logo-orange.svg",
      format: "svg",
      source: phoenixLogoOrange,
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
