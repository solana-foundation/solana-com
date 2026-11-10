import type { CompanyRecord } from "../../types";
import openledgerLogoColor from "../../../assets/companies/openledger/logo-color.svg";
import openledgerMarkColor from "../../../assets/companies/openledger/mark-color.svg";
import openledgerLogoTwoTone from "../../../assets/companies/openledger/logo-two-tone.svg";
import openledgerLogoWhite from "../../../assets/companies/openledger/logo-white.svg";

export const openledger = {
  id: "openledger",
  slug: "openledger",
  name: "OpenLedger",
  profile: {
    tagline: "Blockchain infrastructure for AI data and models.",
    summary:
      "OpenLedger provides blockchain infrastructure for training and deploying specialized AI models using community-contributed datasets.",
    description:
      "OpenLedger lets users create datasets, contribute training data, and build AI models. The network tracks data and model contributions onchain to support attribution and contributor rewards when models are used.",
    sector: "Infrastructure",
    type: "Platform",
    links: {
      website: "https://www.openledger.xyz/",
      docs: "https://openledger.gitbook.io/openledger",
    },
    socials: {
      x: "https://x.com/OpenledgerHQ",
    },
  },
  defaultLogoId: "logo-two-tone",
  logos: [
    {
      id: "logo-color",
      fileName: "logo-color.svg",
      format: "svg",
      width: 3563,
      height: 1422,
      kind: "logo",
      theme: "light",
      background: "transparent",
      source: openledgerLogoColor,
    },
    {
      id: "mark-color",
      fileName: "mark-color.svg",
      format: "svg",
      width: 566,
      height: 566,
      kind: "mark",
      theme: "light",
      background: "transparent",
      source: openledgerMarkColor,
    },
    {
      id: "logo-two-tone",
      fileName: "logo-two-tone.svg",
      format: "svg",
      width: 3080,
      height: 1168,
      kind: "logo",
      theme: "light",
      background: "transparent",
      source: openledgerLogoTwoTone,
    },
    {
      id: "logo-white",
      fileName: "logo-white.svg",
      format: "svg",
      width: 3080,
      height: 1168,
      kind: "logo",
      theme: "dark",
      background: "transparent",
      treatment: "monotone",
      source: openledgerLogoWhite,
    },
    {
      id: "breakpoint-2026-white",
      fileName: "logo-white.svg",
      format: "svg",
      width: 3080,
      height: 1168,
      kind: "logo",
      theme: "dark",
      background: "transparent",
      treatment: "monotone",
      source: openledgerLogoWhite,
    },
  ],
} satisfies CompanyRecord;
