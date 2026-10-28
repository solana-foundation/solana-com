import type { CompanyRecord } from "../../types";
import neodymeLogoHorizontalDark from "../../../assets/companies/neodyme/logo-horizontal-dark.svg";
import neodymeLogoStackedDark from "../../../assets/companies/neodyme/logo-stacked-dark.svg";
import neodymeMarkDark from "../../../assets/companies/neodyme/mark-dark.svg";
import neodymeMarkFilledDark from "../../../assets/companies/neodyme/mark-filled-dark.svg";
import neodymeMarkFilledLight from "../../../assets/companies/neodyme/mark-filled-light.svg";
import neodymeMarkLight from "../../../assets/companies/neodyme/mark-light.svg";
import neodymeMarkTransparent from "../../../assets/companies/neodyme/mark-transparent.svg";
import neodymeWordmarkDark from "../../../assets/companies/neodyme/wordmark-dark.svg";

export const neodyme = {
  id: "neodyme",
  slug: "neodyme",
  name: "Neodyme",
  profile: {
    tagline: "Security research and audits for blockchain software.",
    summary:
      "Neodyme audits blockchain software and conducts security research, including reviews of Solana programs.",
    description:
      "Neodyme is a security research firm that audits blockchain applications and infrastructure. Its Solana work includes program audits, protocol reviews, and developer security training.",
    sector: "Developer Tools",
    type: "Company",
    links: {
      website: "https://neodyme.io/",
    },
    socials: {
      x: "https://x.com/Neodyme",
      linkedin: "https://linkedin.com/company/neodyme-ag",
      github: "https://github.com/neodyme-labs",
    },
  },
  defaultLogoId: "logo-horizontal-dark",
  logos: [
    {
      id: "logo-horizontal-dark",
      fileName: "logo-horizontal-dark.svg",
      format: "svg",
      source: neodymeLogoHorizontalDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-stacked-dark",
      fileName: "logo-stacked-dark.svg",
      format: "svg",
      source: neodymeLogoStackedDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.svg",
      format: "svg",
      source: neodymeMarkDark,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-filled-dark",
      fileName: "mark-filled-dark.svg",
      format: "svg",
      source: neodymeMarkFilledDark,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-filled-light",
      fileName: "mark-filled-light.svg",
      format: "svg",
      source: neodymeMarkFilledLight,
      theme: "dark",
      kind: "mark",
    },
    {
      id: "mark-light",
      fileName: "mark-light.svg",
      format: "svg",
      source: neodymeMarkLight,
      theme: "dark",
      kind: "mark",
    },
    {
      id: "mark-transparent",
      fileName: "mark-transparent.svg",
      format: "svg",
      source: neodymeMarkTransparent,
      theme: "light",
      kind: "mark",
    },
    {
      id: "wordmark-dark",
      fileName: "wordmark-dark.svg",
      format: "svg",
      source: neodymeWordmarkDark,
      theme: "light",
      kind: "wordmark",
    },
  ],
} satisfies CompanyRecord;
