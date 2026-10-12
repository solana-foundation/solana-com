import type { CompanyRecord } from "../../types";
import accretionLogoDark from "../../../assets/companies/accretion/logo-dark.svg";
import accretionLogoLight from "../../../assets/companies/accretion/logo-light.svg";
import accretionLogoRed from "../../../assets/companies/accretion/logo-red.svg";
import accretionMarkDark from "../../../assets/companies/accretion/mark-dark.svg";
import accretionMarkLight from "../../../assets/companies/accretion/mark-light.svg";
import accretionMarkRed from "../../../assets/companies/accretion/mark-red.svg";

export const accretion = {
  id: "accretion",
  slug: "accretion",
  name: "Accretion",
  profile: {
    tagline: "Security audits for Solana programs.",
    summary:
      "Accretion Labs audits Solana programs and researches vulnerabilities in the Solana runtime.",
    description:
      "Accretion Labs is a security research firm focused on Solana programs. Its services include smart contract audits, vulnerability research, and public security tooling for Solana developers.",
    sector: "Developer Tools",
    type: "Company",
    links: {
      website: "https://accretion.xyz/",
    },
    socials: {
      github: "https://github.com/accretion-xyz",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: accretionLogoDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: accretionLogoLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-red",
      fileName: "logo-red.svg",
      format: "svg",
      source: accretionLogoRed,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.svg",
      format: "svg",
      source: accretionMarkDark,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-light",
      fileName: "mark-light.svg",
      format: "svg",
      source: accretionMarkLight,
      theme: "dark",
      kind: "mark",
    },
    {
      id: "mark-red",
      fileName: "mark-red.svg",
      format: "svg",
      source: accretionMarkRed,
      theme: "dark",
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
