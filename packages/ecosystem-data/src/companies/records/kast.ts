import type { CompanyRecord } from "../../types";
import kastLogo from "../../../assets/companies/kast/logo.svg";

export const kast = {
  "id": "kast",
  "slug": "kast",
  "name": "KAST",
  "profile": {
    "name": "KAST",
    "tagLine": "Borderless finance for the internet economy.",
    "descriptionShort": "KAST is building a global financial account that lets users hold, move, and spend stablecoins across cards, transfers, and everyday payments.",
    "descriptionLong": "KAST is a fintech platform focused on borderless finance for the internet economy. It offers a stablecoin-powered account experience designed to help users save, send, and spend digitally native money with familiar payment rails such as cards and transfers.",
    "profileSector": {
      "name": "Payments"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.kast.xyz/",
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
              "url": "https://x.com/KASTxyz",
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
              "url": "https://www.linkedin.com/company/kastxyz",
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
              "url": "https://t.me/KASTCommunity",
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
              "url": "https://discord.com/invite/KASTxyz",
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
      "source": kastLogo
    }
  ]
} satisfies CompanyRecord;
