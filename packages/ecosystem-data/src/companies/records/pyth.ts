import type { CompanyRecord } from "../../types";
import pythWordmarkDark from "../../../assets/companies/pyth/wordmark-dark.svg";
import pythWordmarkDarkPng from "../../../assets/companies/pyth/wordmark-dark.png";
import pythWordmarkLight from "../../../assets/companies/pyth/wordmark-light.svg";
import pythWordmarkLightPng from "../../../assets/companies/pyth/wordmark-light.png";

export const pyth = {
  id: "pyth",
  slug: "pyth",
  name: "Pyth",
  profile: {
    tagline: "Real-time market data for decentralized applications.",
    summary:
      "Pyth is an oracle network delivering real-time financial market data to applications across Solana and other blockchains.",
    description:
      "Pyth is a decentralized oracle network that publishes low-latency price feeds and market data for crypto, equities, foreign exchange, and commodities. The network is used by onchain applications that need timely data for trading, lending, risk management, and other financial workflows.",
    sector: "Infrastructure",
    type: "Protocol",
    links: {
      website: "https://www.pyth.network/",
    },
    socials: {
      x: "https://x.com/PythNetwork",
      linkedin: "https://www.linkedin.com/company/pyth-network/",
      github: "https://github.com/pyth-network",
      discord: "https://discord.com/invite/PythNetwork",
      telegram: "https://t.me/Pyth_Network",
      youtube: "https://www.youtube.com/@pythnetwork",
    },
  },
  defaultLogoId: "wordmark-dark",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "wordmark-light.svg",
      format: "svg",
      source: pythWordmarkLight,
      theme: "dark",
      kind: "wordmark",
      treatment: "monotone",
    },
    {
      id: "wordmark-light-png",
      fileName: "wordmark-light.png",
      format: "png",
      source: pythWordmarkLightPng,
      theme: "dark",
      kind: "wordmark",
      treatment: "monotone",
    },
    {
      id: "wordmark-dark",
      fileName: "wordmark-dark.svg",
      format: "svg",
      source: pythWordmarkDark,
      theme: "light",
      kind: "wordmark",
      treatment: "monotone",
    },
    {
      id: "wordmark-dark-png",
      fileName: "wordmark-dark.png",
      format: "png",
      source: pythWordmarkDarkPng,
      theme: "light",
      kind: "wordmark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
