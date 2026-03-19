import type { CompanyRecord } from "../../types";
import kastLogo from "../../../assets/companies/kast/logo.svg";

export const kast = {
  "id": "kast",
  "slug": "kast",
  "name": "KAST",
  "profile": {
    "tagline": "Borderless finance for the internet economy.",
    "summary": "KAST is building a global financial account that lets users hold, move, and spend stablecoins across cards, transfers, and everyday payments.",
    "description": "KAST is a fintech platform focused on borderless finance for the internet economy. It offers a stablecoin-powered account experience designed to help users save, send, and spend digitally native money with familiar payment rails such as cards and transfers.",
    "sector": "Payments",
    "type": "Company",
    "links": {
      "website": "https://www.kast.xyz/"
    },
    "socials": {
      "x": "https://x.com/KASTxyz",
      "linkedin": "https://www.linkedin.com/company/kastxyz",
      "telegram": "https://t.me/KASTCommunity",
      "discord": "https://discord.com/invite/KASTxyz"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": kastLogo
    }
  ]
} satisfies CompanyRecord;
