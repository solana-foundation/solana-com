import type { CompanyRecord } from "../../types";
import loopscaleLogoDark from "../../../assets/companies/loopscale/logo-dark.svg";

export const loopscale = {
  id: "loopscale",
  slug: "loopscale",
  name: "Loopscale",
  profile: {
    tagline: "Order book-based lending for onchain assets",
    summary:
      "Loopscale is a modular lending platform for borrowing and lending against onchain assets with fixed-rate market structure.",
    description:
      "Loopscale is a modular, order book-based lending platform for the next generation of onchain assets. The platform supports borrowing, lending, looped positions, and managed vaults across assets such as LP positions, staked assets, and more specialized collateral. Loopscale has supported RWA settlement liquidity and fixed-yield markets on Solana.",
    sector: "DeFi",
    type: "Platform",
    links: {
      website: "https://loopscale.com/",
      docs: "https://docs.loopscale.com/",
      blog: "https://blog.loopscale.com/",
    },
    socials: {
      x: "https://x.com/LoopscaleLabs",
      discord: "https://discord.gg/loopscale",
      linkedin: "https://www.linkedin.com/company/loopscale-labs",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: loopscaleLogoDark,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
