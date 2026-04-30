import type { CompanyRecord } from "../../types";
import phantomLogoDark from "../../../assets/companies/phantom/logo-dark.svg";
import phantomLogoLight from "../../../assets/companies/phantom/logo-light.svg";
import phantomLogoPurple from "../../../assets/companies/phantom/logo-purple.svg";
import phantomMarkDark from "../../../assets/companies/phantom/mark-dark.svg";
import phantomMarkLight from "../../../assets/companies/phantom/mark-light.svg";
import phantomMarkPurple from "../../../assets/companies/phantom/mark-purple.svg";

export const phantom = {
  id: "phantom",
  slug: "phantom",
  name: "Phantom",
  profile: {
    tagline: "The crypto app for everyone",
    summary:
      "Phantom is a self-custodial multi-chain crypto wallet originally built for Solana, supporting token management, swaps, NFTs, and dApp interactions.",
    description:
      "Phantom is a leading self-custodial crypto wallet that originated on Solana and has expanded to support Ethereum, Bitcoin, Base, and Sui. It provides a unified interface for buying, storing, sending, swapping tokens, and managing NFTs across supported chains. Phantom is available as a browser extension for Chrome, Brave, and Firefox, as well as native mobile apps on iOS and Android.",
    sector: "Wallet",
    type: "Company",
    links: {
      website: "https://phantom.com",
    },
    socials: {
      x: "https://x.com/phantom",
      linkedin: "https://www.linkedin.com/company/phantomwallet",
      discord: "https://discord.gg/phantom",
      github: "https://github.com/phantom",
    },
  },
  defaultLogoId: "logo-purple",
  logos: [
    {
      id: "logo-purple",
      fileName: "logo-purple.svg",
      format: "svg",
      source: phantomLogoPurple,
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: phantomLogoDark,
      theme: "light",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: phantomLogoLight,
      theme: "dark",
    },
    {
      id: "mark-purple",
      fileName: "mark-purple.svg",
      format: "svg",
      source: phantomMarkPurple,
      kind: "mark",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.svg",
      format: "svg",
      source: phantomMarkDark,
      kind: "mark",
      theme: "light",
    },
    {
      id: "mark-light",
      fileName: "mark-light.svg",
      format: "svg",
      source: phantomMarkLight,
      kind: "mark",
      theme: "dark",
    },
  ],
} satisfies CompanyRecord;
