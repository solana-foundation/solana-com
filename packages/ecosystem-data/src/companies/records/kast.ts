import type { CompanyRecord } from "../../types";
import kastLogo from "../../../assets/companies/kast/logo.svg";
import kastLogoDark from "../../../assets/companies/kast/logo-dark.svg";
import kastMarkDark from "../../../assets/companies/kast/mark-dark.svg";

export const kast = {
  id: "kast",
  slug: "kast",
  name: "KAST",
  profile: {
    tagline: "Borderless finance for the internet economy.",
    summary:
      "KAST is building a global financial account that lets users hold, move, and spend stablecoins across cards, transfers, and everyday payments.",
    description:
      "KAST is a fintech platform focused on borderless finance for the internet economy. It offers a stablecoin-powered account experience designed to help users save, send, and spend digitally native money with familiar payment rails such as cards and transfers.",
    sector: "Payments",
    type: "Company",
    links: {
      website: "https://www.kast.xyz/",
    },
    socials: {
      x: "https://x.com/KASTxyz",
      linkedin: "https://www.linkedin.com/company/kastxyz",
      telegram: "https://t.me/KASTCommunity",
      discord: "https://discord.com/invite/KASTxyz",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo.svg",
      format: "svg",
      source: kastLogo,
      theme: "dark",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: kastLogoDark,
      theme: "light",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.svg",
      format: "svg",
      source: kastMarkDark,
      theme: "dark",
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
