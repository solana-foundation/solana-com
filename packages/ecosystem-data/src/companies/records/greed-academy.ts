import type { CompanyRecord } from "../../types";
import greedAcademyLogoRed from "../../../assets/companies/greed-academy/logo-red.svg";
import greedAcademyLogoBlack from "../../../assets/companies/greed-academy/logo-black.svg";
import greedAcademyLogoWhite from "../../../assets/companies/greed-academy/logo-white.svg";
import greedAcademyMarkRed from "../../../assets/companies/greed-academy/mark-red.svg";
import greedAcademyMarkBlack from "../../../assets/companies/greed-academy/mark-black.svg";
import greedAcademyMarkWhite from "../../../assets/companies/greed-academy/mark-white.svg";

export const greedAcademy = {
  id: "greed-academy",
  slug: "greed-academy",
  name: "GREED Academy",
  profile: {
    tagline: "Free education on cryptocurrency and digital security.",
    summary:
      "GREED Academy is a free educational initiative covering cryptocurrency, blockchain, and digital security, funded by its Solana validator.",
    description:
      "GREED Academy publishes lessons on topics including wallets, staking, governance, and decentralized finance. The initiative uses revenue from the GREED Validator to fund free learning resources and compensate educators who create courses and content.",
    sector: "Community",
    type: "Community",
    links: {
      website: "https://greed.academy/",
    },
    socials: {
      x: "https://x.com/GreedAcademy",
      medium: "https://medium.com/@GreedAcademy",
    },
  },
  defaultLogoId: "logo-red",
  logos: [
    {
      id: "logo-red",
      fileName: "logo-red.svg",
      format: "svg",
      width: 1051,
      height: 222,
      kind: "logo",
      theme: "light",
      background: "transparent",
      source: greedAcademyLogoRed,
    },
    {
      id: "logo-black",
      fileName: "logo-black.svg",
      format: "svg",
      width: 1051,
      height: 222,
      kind: "logo",
      theme: "light",
      background: "transparent",
      source: greedAcademyLogoBlack,
    },
    {
      id: "logo-white",
      fileName: "logo-white.svg",
      format: "svg",
      width: 1051,
      height: 222,
      kind: "logo",
      theme: "dark",
      background: "transparent",
      treatment: "monotone",
      source: greedAcademyLogoWhite,
    },
    {
      id: "mark-red",
      fileName: "mark-red.svg",
      format: "svg",
      width: 686,
      height: 412,
      kind: "mark",
      theme: "light",
      background: "transparent",
      source: greedAcademyMarkRed,
    },
    {
      id: "mark-black",
      fileName: "mark-black.svg",
      format: "svg",
      width: 686,
      height: 412,
      kind: "mark",
      theme: "light",
      background: "transparent",
      source: greedAcademyMarkBlack,
    },
    {
      id: "mark-white",
      fileName: "mark-white.svg",
      format: "svg",
      width: 686,
      height: 412,
      kind: "mark",
      theme: "dark",
      background: "transparent",
      treatment: "monotone",
      source: greedAcademyMarkWhite,
    },
    {
      id: "breakpoint-2026-white",
      fileName: "logo-white.svg",
      format: "svg",
      width: 1051,
      height: 222,
      kind: "logo",
      theme: "dark",
      background: "transparent",
      treatment: "monotone",
      source: greedAcademyLogoWhite,
    },
  ],
} satisfies CompanyRecord;
