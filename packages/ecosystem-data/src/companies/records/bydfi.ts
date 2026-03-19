import type { CompanyRecord } from "../../types";
import bydfiLogo from "../../../assets/companies/bydfi/logo.svg";

export const bydfi = {
  "id": "bydfi",
  "slug": "bydfi",
  "name": "BYDFi",
  "profile": {
    "tagline": "BUIDL Your Dream Finance",
    "summary": "BYDFi is a centralized cryptocurrency exchange supporting trading of 1000+ altcoins and 500+ perpetual contracts, including Solana ecosystem tokens.",
    "description": "BYDFi (formerly BitYard) is a centralized cryptocurrency exchange registered in Canada, serving over 1,000,000 users across 190+ countries. The platform offers spot trading, futures trading with up to 200x leverage, leveraged tokens, trading bots, and copy trading. BYDFi supports over 650 cryptocurrencies including Solana ecosystem tokens, and partners with payment providers such as Banxa, Transak, Ramp, and Mercuryo for fiat on-ramps.",
    "sector": "Exchange",
    "type": "Company",
    "links": {
      "website": "https://www.bydfi.com"
    },
    "socials": {
      "x": "https://x.com/BYDFi",
      "linkedin": "https://www.linkedin.com/company/bydfi",
      "discord": "https://discord.com/invite/VJjYhsWegV",
      "telegram": "https://t.me/BYDFiEnglish"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": bydfiLogo
    }
  ]
} satisfies CompanyRecord;
