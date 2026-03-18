import type { CompanyRecord } from "../../types";
import bonkLogo from "../../../assets/companies/bonk/logo.webp";

export const bonk = {
  "id": "bonk",
  "slug": "bonk",
  "name": "BONK",
  "gridProfileSlug": "Bonk",
  "gridProfile": {
    "name": "BONK",
    "tagLine": "The first Solana dog coin for the people, by the people",
    "descriptionShort": "BONK is a community-driven dog-themed memecoin on Solana, governed by BonkDAO, with over 350 on-chain integrations and a deflationary burn mechanism.",
    "descriptionLong": "BONK launched on Christmas Day 2022 via a massive airdrop that distributed 50% of total supply to Solana community members, aiming to revitalize the ecosystem after the FTX collapse. Created by 22 anonymous Solana community builders with no venture capital backing, BONK is governed by BonkDAO and features a deflationary burn mechanism. The project has expanded into memecoin infrastructure through LetsBonk.fun, one of Solana's leading memecoin launchpads.",
    "profileSector": {
      "name": "Community"
    },
    "profileType": {
      "name": "DAO"
    },
    "urls": [
      {
        "url": "https://bonkcoin.com",
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
              "url": "https://x.com/bonk_inu",
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
              "url": "https://www.linkedin.com/company/bonkinu",
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
              "url": "https://discord.com/invite/FTfayXdpqH",
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
              "url": "https://t.me/Official_Bonk_Inu",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/BonkLabs",
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
      "fileName": "logo.webp",
      "format": "webp",
      "source": bonkLogo
    }
  ]
} satisfies CompanyRecord;
