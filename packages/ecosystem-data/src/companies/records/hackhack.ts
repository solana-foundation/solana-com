import type { CompanyRecord } from "../../types";
import hackhackBreakpoint2026White from "../../../assets/companies/hackhack/breakpoint-2026-white.svg";
import hackhackLogoBrandGreen from "../../../assets/companies/hackhack/logo-brand-green.svg";
import hackhackLogoColorDark from "../../../assets/companies/hackhack/logo-color-dark.svg";
import hackhackLogoColorLight from "../../../assets/companies/hackhack/logo-color-light.svg";
import hackhackLogoDark from "../../../assets/companies/hackhack/logo-dark.svg";
import hackhackLogoLight from "../../../assets/companies/hackhack/logo-light.svg";
import hackhackMarkColorDark from "../../../assets/companies/hackhack/mark-color-dark.svg";
import hackhackMarkColorLight from "../../../assets/companies/hackhack/mark-color-light.svg";
import hackhackMarkDark from "../../../assets/companies/hackhack/mark-dark.svg";
import hackhackMarkLight from "../../../assets/companies/hackhack/mark-light.svg";

export const hackhack = {
  id: "hackhack",
  slug: "hackhack",
  name: "HackHack.ai",
  profile: {
    tagline: "Verified security reviews for Solana programs.",
    summary:
      "HackHack provides automated security reviews for Solana programs with runnable proof of concept exploits.",
    description:
      "HackHack reviews Solana programs written with Anchor, native Rust, and Pinocchio. Its automated reviews produce findings with runnable proof of concept exploits for developers to verify.",
    sector: "Developer Tools",
    type: "Platform",
    links: {
      website: "https://hackhack.ai/",
    },
  },
  defaultLogoId: "logo-color-dark",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: hackhackBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-brand-green",
      fileName: "logo-brand-green.svg",
      format: "svg",
      source: hackhackLogoBrandGreen,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-color-dark",
      fileName: "logo-color-dark.svg",
      format: "svg",
      source: hackhackLogoColorDark,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-color-light",
      fileName: "logo-color-light.svg",
      format: "svg",
      source: hackhackLogoColorLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: hackhackLogoDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: hackhackLogoLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "mark-color-dark",
      fileName: "mark-color-dark.svg",
      format: "svg",
      source: hackhackMarkColorDark,
      theme: "dark",
      kind: "mark",
    },
    {
      id: "mark-color-light",
      fileName: "mark-color-light.svg",
      format: "svg",
      source: hackhackMarkColorLight,
      theme: "dark",
      kind: "mark",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.svg",
      format: "svg",
      source: hackhackMarkDark,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-light",
      fileName: "mark-light.svg",
      format: "svg",
      source: hackhackMarkLight,
      theme: "dark",
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
