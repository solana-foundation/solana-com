import type { CompanyRecord } from "../../types";
import bonkLogo from "../../../assets/companies/bonk/logo.webp";
import bonkMark from "../../../assets/companies/bonk/mark.svg";

export const bonk = {
  "id": "bonk",
  "slug": "bonk",
  "name": "BONK",
  "profile": {
    "tagline": "The first Solana dog coin for the people, by the people",
    "summary": "BONK is a community-driven dog-themed memecoin on Solana, governed by BonkDAO, with over 350 on-chain integrations and a deflationary burn mechanism.",
    "description": "BONK launched on Christmas Day 2022 via a massive airdrop that distributed 50% of total supply to Solana community members, aiming to revitalize the ecosystem after the FTX collapse. Created by 22 anonymous Solana community builders with no venture capital backing, BONK is governed by BonkDAO and features a deflationary burn mechanism. The project has expanded into memecoin infrastructure through LetsBonk.fun, one of Solana's leading memecoin launchpads.",
    "sector": "Community",
    "type": "DAO",
    "links": {
      "website": "https://bonkcoin.com"
    },
    "socials": {
      "x": "https://x.com/bonk_inu",
      "linkedin": "https://www.linkedin.com/company/bonkinu",
      "discord": "https://discord.com/invite/FTfayXdpqH",
      "telegram": "https://t.me/Official_Bonk_Inu",
      "github": "https://github.com/BonkLabs"
    }
  },
  "defaultLogoId": "mark",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.webp",
      "format": "webp",
      "source": bonkLogo,
      "kind": "logo"
    },
    {
      "id": "mark",
      "fileName": "mark.svg",
      "format": "svg",
      "source": bonkMark,
      "kind": "mark"
    }
  ]
} satisfies CompanyRecord;
