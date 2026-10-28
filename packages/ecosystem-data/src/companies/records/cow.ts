import type { CompanyRecord } from "../../types";
import cowLogoLightBlue from "../../../assets/companies/cow/logo-light-blue.svg";
import cowLogoDarkBlue from "../../../assets/companies/cow/logo-dark-blue.svg";
import cowMarkLightBlue from "../../../assets/companies/cow/mark-light-blue.svg";
import cowMarkDarkBlue from "../../../assets/companies/cow/mark-dark-blue.svg";
import cowMarkCircleLightBlue from "../../../assets/companies/cow/mark-circle-light-blue.svg";
import cowMarkCircleDarkBlue from "../../../assets/companies/cow/mark-circle-dark-blue.svg";
import cowMarkSquareLightBlue from "../../../assets/companies/cow/mark-square-light-blue.svg";
import cowMarkSquareDarkBlue from "../../../assets/companies/cow/mark-square-dark-blue.svg";
import cowBreakpoint2026White from "../../../assets/companies/cow/breakpoint-2026-white.svg";
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
      id: "logo-light-blue",
      fileName: "logo-light-blue.svg",
      format: "svg",
      source: cowLogoLightBlue,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-dark-blue",
      fileName: "logo-dark-blue.svg",
      format: "svg",
      source: cowLogoDarkBlue,
      theme: "light",
      kind: "logo",
    },
    {
      id: "mark-light-blue",
      fileName: "mark-light-blue.svg",
      format: "svg",
      source: cowMarkLightBlue,
      theme: "dark",
      kind: "mark",
    },
    {
      id: "mark-dark-blue",
      fileName: "mark-dark-blue.svg",
      format: "svg",
      source: cowMarkDarkBlue,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-circle-light-blue",
      fileName: "mark-circle-light-blue.svg",
      format: "svg",
      source: cowMarkCircleLightBlue,
      theme: "dark",
      kind: "mark",
    },
    {
      id: "mark-circle-dark-blue",
      fileName: "mark-circle-dark-blue.svg",
      format: "svg",
      source: cowMarkCircleDarkBlue,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-square-light-blue",
      fileName: "mark-square-light-blue.svg",
      format: "svg",
      source: cowMarkSquareLightBlue,
      theme: "dark",
      kind: "mark",
    },
    {
      id: "mark-square-dark-blue",
      fileName: "mark-square-dark-blue.svg",
      format: "svg",
      source: cowMarkSquareDarkBlue,
      theme: "light",
      kind: "mark",
    },
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: cowBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
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
