import type { CompanyRecord } from "../../types";
import beezieBreakpoint2026White from "../../../assets/companies/beezie/breakpoint-2026-white.png";
import beezieLogoPrimary from "../../../assets/companies/beezie/logo-primary.svg";
import beezieLogoPrimaryPng from "../../../assets/companies/beezie/logo-primary.png";
import beezieLogoWhite from "../../../assets/companies/beezie/logo-white.svg";
import beezieLogoWhitePng from "../../../assets/companies/beezie/logo-white.png";
import beezieMark from "../../../assets/companies/beezie/mark.svg";
import beezieMarkPng from "../../../assets/companies/beezie/mark.png";

export const beezie = {
  id: "beezie",
  slug: "beezie",
  name: "Beezie",
  profile: {
    tagline: "Vault, buy, and sell your favorite collectibles.",
    summary:
      "Beezie is a collectibles platform for buying, selling, vaulting, and redeeming physical assets onchain.",
    description:
      "Beezie provides a marketplace and onchain vaulting for collectibles including trading cards, games, and luxury items. Its platform combines digital ownership experiences with logistics and secured storage for redeemable physical assets.",
    sector: "Tokenization",
    type: "Platform",
    links: {
      website: "https://beezie.com/",
    },
    socials: {
      x: "https://x.com/beezie",
      discord: "https://discord.gg/beezie",
    },
  },
  defaultLogoId: "logo-primary",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: beezieBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-primary",
      fileName: "logo-primary.svg",
      format: "svg",
      source: beezieLogoPrimary,
      kind: "logo",
    },
    {
      id: "logo-primary-png",
      fileName: "logo-primary.png",
      format: "png",
      source: beezieLogoPrimaryPng,
      kind: "logo",
    },
    {
      id: "logo-white",
      fileName: "logo-white.svg",
      format: "svg",
      source: beezieLogoWhite,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-white-png",
      fileName: "logo-white.png",
      format: "png",
      source: beezieLogoWhitePng,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "mark",
      fileName: "mark.svg",
      format: "svg",
      source: beezieMark,
      kind: "mark",
    },
    {
      id: "mark-png",
      fileName: "mark.png",
      format: "png",
      source: beezieMarkPng,
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
