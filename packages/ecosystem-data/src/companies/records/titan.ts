import type { CompanyRecord } from "../../types";
import titanBreakpoint2026White from "../../../assets/companies/titan/breakpoint-2026-white.svg";
import titanLogoDark from "../../../assets/companies/titan/logo-dark.svg";
import titanLogoLight from "../../../assets/companies/titan/logo-light.svg";

export const titan = {
  id: "titan",
  slug: "titan",
  name: "Titan",
  profile: {
    tagline: "Outperformance on your token swaps",
    summary:
      "Titan is a Solana trading and liquidity-routing platform that aggregates swap quotes across decentralized venues to help users execute token swaps.",
    description:
      "Titan is a meta-DEX aggregator for Solana swaps. It compares routes from multiple aggregators and on-chain liquidity sources, then presents a quoted route for the user to approve through a connected wallet. The platform also offers configurable swap settings and tracks user trading activity.",
    sector: "DeFi",
    type: "Platform",
    links: {
      website: "https://titan.exchange/",
      app: "https://titan.exchange/swap",
      docs: "https://titan-exchange.gitbook.io/titan",
    },
    socials: {
      x: "https://x.com/Titan_Exchange",
      linkedin: "https://www.linkedin.com/company/titan-exchange",
      telegram: "https://t.me/Titan_Exchange",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: titanBreakpoint2026White,
      theme: "dark",
      kind: "logo",
      treatment: "monotone",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: titanLogoLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: titanLogoDark,
      theme: "light",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
