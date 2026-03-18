import type { CompanyRecord } from "../../types";
import bydfiLogo from "../../../assets/companies/bydfi/logo.svg";

export const bydfi = {
  "id": "bydfi",
  "slug": "bydfi",
  "name": "BYDFi",
  "gridProfileSlug": "bydfi",
  "gridProfile": {
    "name": "BYDFi",
    "tagLine": "BUIDL Your Dream Finance",
    "descriptionShort": "BYDFi is a centralized cryptocurrency exchange supporting trading of 1000+ altcoins and 500+ perpetual contracts, including Solana ecosystem tokens.",
    "descriptionLong": "BYDFi (formerly BitYard) is a centralized cryptocurrency exchange registered in Canada, serving over 1,000,000 users across 190+ countries. The platform offers spot trading, futures trading with up to 200x leverage, leveraged tokens, trading bots, and copy trading. BYDFi supports over 650 cryptocurrencies including Solana ecosystem tokens, and partners with payment providers such as Banxa, Transak, Ramp, and Mercuryo for fiat on-ramps.",
    "profileSector": {
      "name": "Exchange"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.bydfi.com",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/BYDFi",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/bydfi",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.com/invite/VJjYhsWegV",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Telegram"
          },
          "urls": [
            {
              "url": "https://t.me/BYDFiEnglish",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
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
