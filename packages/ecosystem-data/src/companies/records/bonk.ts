import type { CompanyRecord } from "../../types";
import bonkBreakpoint2026White from "../../../assets/companies/bonk/breakpoint-2026-white.png";
import bonkLogoLight from "../../../assets/companies/bonk/logo-light.png";
import bonkLogoDark from "../../../assets/companies/bonk/logo-dark.png";
import bonkLogoMonotone from "../../../assets/companies/bonk/logo-monotone.svg";
import bonkLogoGrayscale from "../../../assets/companies/bonk/logo-grayscale.png";
import bonkMark from "../../../assets/companies/bonk/mark.png";

export const bonk = {
  id: "bonk",
  slug: "bonk",
  name: "BONK",
  profile: {
    tagline: "The first Solana dog coin for the people, by the people",
    summary:
      "BONK is a community-driven dog-themed memecoin on Solana, governed by BonkDAO, with over 350 onchain integrations and a deflationary burn mechanism.",
    description:
      "BONK launched on Christmas Day 2022 via a massive airdrop that distributed 50% of total supply to Solana community members, aiming to revitalize the ecosystem after the FTX collapse. Created by 22 anonymous Solana community builders with no venture capital backing, BONK is governed by BonkDAO and features a deflationary burn mechanism. The project has expanded into memecoin infrastructure through LetsBonk.fun, one of Solana's leading memecoin launchpads.",
    sector: "Community",
    type: "DAO",
    links: {
      website: "https://bonkcoin.com",
    },
    socials: {
      x: "https://x.com/bonk_inu",
      linkedin: "https://www.linkedin.com/company/bonkinu",
      discord: "https://discord.com/invite/FTfayXdpqH",
      telegram: "https://t.me/Official_Bonk_Inu",
      github: "https://github.com/BonkLabs",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: bonkBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-light",
      fileName: "logo-light.png",
      format: "png",
      source: bonkLogoLight,
      theme: "light",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.png",
      format: "png",
      source: bonkLogoDark,
      theme: "dark",
    },
    {
      id: "logo-monotone",
      fileName: "logo-monotone.svg",
      format: "svg",
      source: bonkLogoMonotone,
      treatment: "monotone",
    },
    {
      id: "logo-grayscale",
      fileName: "logo-grayscale.png",
      format: "png",
      source: bonkLogoGrayscale,
    },
    {
      id: "mark",
      fileName: "mark.png",
      format: "png",
      source: bonkMark,
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
