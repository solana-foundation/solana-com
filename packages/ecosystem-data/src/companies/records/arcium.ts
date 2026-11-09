import type { CompanyRecord } from "../../types";
import arciumLogo from "../../../assets/companies/arcium/logo.svg";
import arciumLogoLight from "../../../assets/companies/arcium/logo-light.svg";
import arciumMarkLight from "../../../assets/companies/arcium/mark-light.svg";
import arciumWordmarkLight from "../../../assets/companies/arcium/wordmark-light.svg";
import arciumBreakpoint2026White from "../../../assets/companies/arcium/breakpoint-2026-white.svg";
import arciumLogoWhiteOnPurple from "../../../assets/companies/arcium/logo-white-on-purple.svg";
import arciumLogoBlack from "../../../assets/companies/arcium/logo-black.svg";
import arciumLogoColorOnLight from "../../../assets/companies/arcium/logo-color-on-light.svg";
import arciumWordmarkWhite from "../../../assets/companies/arcium/wordmark-white.svg";
import arciumWordmarkBlack from "../../../assets/companies/arcium/wordmark-black.svg";
import arciumMarkPurple from "../../../assets/companies/arcium/mark-purple.svg";
import arciumMarkBlack from "../../../assets/companies/arcium/mark-black.svg";
import arciumMarkPurpleTile from "../../../assets/companies/arcium/mark-purple-tile.svg";
import arciumMarkGrayOnPurple from "../../../assets/companies/arcium/mark-gray-on-purple.svg";
import arciumMarkWhite from "../../../assets/companies/arcium/mark-white.svg";

export const arcium = {
  id: "arcium",
  slug: "arcium",
  name: "Arcium",
  profile: {
    tagline: "Confidential computing for blockchain applications.",
    summary:
      "Arcium provides a decentralized network for confidential computation, including applications and token transfers on Solana.",
    description:
      "Arcium distributes encrypted computation across independent nodes using secure multiparty computation. Developers use its execution environments to build applications that process confidential data. Its C-SPL token standard supports confidential balances and transfer amounts for Solana tokens.",
    sector: "Infrastructure",
    type: "Protocol",
    links: {
      website: "https://www.arcium.com",
    },
    socials: {
      x: "https://x.com/arcium",
      linkedin: "https://www.linkedin.com/company/arciumnetwork",
      discord: "https://discord.gg/jYh6Z7DEg",
      github: "https://github.com/arcium-hq",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: arciumLogo,
      kind: "logo",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: arciumLogoLight,
      theme: "light",
      kind: "logo",
    },
    {
      id: "mark-light",
      fileName: "mark-light.svg",
      format: "svg",
      source: arciumMarkLight,
      theme: "light",
      kind: "mark",
    },
    {
      id: "wordmark-light",
      fileName: "wordmark-light.svg",
      format: "svg",
      source: arciumWordmarkLight,
      theme: "light",
      kind: "wordmark",
    },
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: arciumBreakpoint2026White,
      kind: "logo",
      theme: "dark",
      treatment: "monotone",
      background: "transparent",
      width: 1643.5,
      height: 274.7,
    },
    {
      id: "logo-white-on-purple",
      fileName: "logo-white-on-purple.svg",
      format: "svg",
      source: arciumLogoWhiteOnPurple,
      kind: "logo",
      theme: "dark",
      width: 1643.5,
      height: 274.7,
    },
    {
      id: "logo-black",
      fileName: "logo-black.svg",
      format: "svg",
      source: arciumLogoBlack,
      kind: "logo",
      theme: "light",
      width: 1643.5,
      height: 274.7,
    },
    {
      id: "logo-color-on-light",
      fileName: "logo-color-on-light.svg",
      format: "svg",
      source: arciumLogoColorOnLight,
      kind: "logo",
      theme: "light",
      width: 1643.5,
      height: 274.7,
    },
    {
      id: "wordmark-white",
      fileName: "wordmark-white.svg",
      format: "svg",
      source: arciumWordmarkWhite,
      kind: "wordmark",
      theme: "dark",
      width: 1583.7,
      height: 192.1,
    },
    {
      id: "wordmark-black",
      fileName: "wordmark-black.svg",
      format: "svg",
      source: arciumWordmarkBlack,
      kind: "wordmark",
      theme: "light",
      width: 1583.7,
      height: 192.1,
    },
    {
      id: "mark-purple",
      fileName: "mark-purple.svg",
      format: "svg",
      source: arciumMarkPurple,
      kind: "mark",
      width: 86,
      height: 60,
    },
    {
      id: "mark-black",
      fileName: "mark-black.svg",
      format: "svg",
      source: arciumMarkBlack,
      kind: "mark",
      theme: "light",
      width: 86,
      height: 60,
    },
    {
      id: "mark-purple-tile",
      fileName: "mark-purple-tile.svg",
      format: "svg",
      source: arciumMarkPurpleTile,
      kind: "mark",
      width: 128,
      height: 128,
    },
    {
      id: "mark-gray-on-purple",
      fileName: "mark-gray-on-purple.svg",
      format: "svg",
      source: arciumMarkGrayOnPurple,
      kind: "mark",
      theme: "dark",
      width: 128,
      height: 128,
    },
    {
      id: "mark-white",
      fileName: "mark-white.svg",
      format: "svg",
      source: arciumMarkWhite,
      kind: "mark",
      theme: "dark",
      width: 86,
      height: 61,
    },
  ],
} satisfies CompanyRecord;
