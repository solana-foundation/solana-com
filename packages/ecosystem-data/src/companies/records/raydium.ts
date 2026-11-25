import type { CompanyRecord } from "../../types";
import raydiumLogoLight from "../../../assets/companies/raydium/logo-light.png";
import raydiumLogoDarkRaster from "../../../assets/companies/raydium/logo-dark-raster.png";
import raydiumMarkColor from "../../../assets/companies/raydium/mark-color.png";
import raydiumBreakpoint2026White from "../../../assets/companies/raydium/breakpoint-2026-white.png";
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
      x: "https://x.com/Raydium",
      discord: "https://discord.gg/raydium",
      github: "https://github.com/raydium-io",
      medium: "https://raydium.medium.com/",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.png",
      format: "png",
      source: raydiumLogoLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-dark-raster",
      fileName: "logo-dark-raster.png",
      format: "png",
      source: raydiumLogoDarkRaster,
      theme: "light",
      kind: "logo",
    },
    {
      id: "mark-color",
      fileName: "mark-color.png",
      format: "png",
      source: raydiumMarkColor,
      kind: "mark",
    },
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: raydiumBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
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
