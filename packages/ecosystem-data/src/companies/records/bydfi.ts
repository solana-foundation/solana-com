import type { CompanyRecord } from "../../types";
import bydfiLogoLight from "../../../assets/companies/bydfi/logo-light.svg";
import bydfiLogoDark from "../../../assets/companies/bydfi/logo-dark.svg";
import bydfiMarkLight from "../../../assets/companies/bydfi/mark-light.svg";
import bydfiMarkDark from "../../../assets/companies/bydfi/mark-dark.svg";

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
  "defaultLogoId": "logo-light",
  "logos": [
    {
      "id": "logo-light",
      "fileName": "logo-light.svg",
      "format": "svg",
      "source": bydfiLogoLight,
      "theme": "light"
    },
    {
      "id": "logo-dark",
      "fileName": "logo-dark.svg",
      "format": "svg",
      "source": bydfiLogoDark,
      "theme": "dark"
    },
    {
      "id": "mark-light",
      "fileName": "mark-light.svg",
      "format": "svg",
      "source": bydfiMarkLight,
      "theme": "light",
      "kind": "mark"
    },
    {
      "id": "mark-dark",
      "fileName": "mark-dark.svg",
      "format": "svg",
      "source": bydfiMarkDark,
      "theme": "dark",
      "kind": "mark"
    }
  ]
} satisfies CompanyRecord;
