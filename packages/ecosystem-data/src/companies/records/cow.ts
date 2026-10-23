import type { CompanyRecord } from "../../types";
import cowLogoDark from "../../../assets/companies/cow/logo-dark.svg";
import cowLogoLight from "../../../assets/companies/cow/logo-light.svg";
import cowMarkDark from "../../../assets/companies/cow/mark-dark.svg";
import cowMarkLight from "../../../assets/companies/cow/mark-light.svg";

export const cow = {
  id: "cow",
  slug: "cow",
  name: "CoW Swap",
  profile: {
    tagline: "Decentralized trading through batch auctions.",
    summary:
      "CoW Swap is a trading interface built on CoW Protocol, which uses solver competition and batch auctions to execute trades and protect users from MEV.",
    description:
      "CoW Protocol is a decentralized trading protocol that collects trade intents and lets competing solvers find execution routes. CoW Swap is its trading interface. The protocol batches orders and can match trades directly before routing remaining liquidity to other exchanges.",
    sector: "DeFi",
    type: "Protocol",
    links: {
      website: "https://cow.fi/",
      app: "https://swap.cow.fi/",
      docs: "https://docs.cow.fi/cow-protocol",
    },
    socials: {
      x: "https://x.com/CoWSwap",
      github: "https://github.com/cowprotocol",
      discord: "https://discord.com/invite/cowprotocol",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: cowLogoDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: cowLogoLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.svg",
      format: "svg",
      source: cowMarkDark,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-light",
      fileName: "mark-light.svg",
      format: "svg",
      source: cowMarkLight,
      theme: "dark",
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
