import type { CompanyRecord } from "../../types";
import gmgnBreakpoint2026White from "../../../assets/companies/gmgn/breakpoint-2026-white.svg";
import gmgnLogoDark from "../../../assets/companies/gmgn/logo-dark.svg";
import gmgnLogoLight from "../../../assets/companies/gmgn/logo-light.svg";
import gmgnMarkColor from "../../../assets/companies/gmgn/mark-color.svg";

export const gmgn = {
  id: "gmgn",
  slug: "gmgn",
  name: "GMGN",
  profile: {
    tagline: "Multi-chain meme trading terminal.",
    summary:
      "GMGN is a multi-chain platform for discovering and trading meme tokens with on-chain market, wallet, and social data.",
    description:
      "GMGN combines token analytics, smart-money and wallet tracking, security indicators, alerts, and trade execution in a single interface. The platform supports Solana and other networks for researching and trading fast-moving on-chain markets.",
    sector: "Exchange",
    type: "Platform",
    links: {
      website: "https://gmgn.ai/",
    },
    socials: {
      x: "https://x.com/gmgnai",
      telegram: "https://t.me/gmgnai",
      github: "https://github.com/GMGNAI",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: gmgnBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: gmgnLogoLight,
      theme: "light",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: gmgnLogoDark,
      theme: "dark",
    },
    {
      id: "mark-color",
      fileName: "mark-color.svg",
      format: "svg",
      source: gmgnMarkColor,
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
