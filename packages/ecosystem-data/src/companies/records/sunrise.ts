import type { CompanyRecord } from "../../types";
import sunriseLogo from "../../../assets/companies/sunrise/logo.svg";

export const sunrise = {
  "id": "sunrise",
  "slug": "sunrise",
  "name": "Sunrise",
  "gridProfileSlug": "sunrise",
  "gridProfile": {
    "name": "Sunrise",
    "tagLine": "Strengthen Solana and offset carbon emissions simultaneously",
    "descriptionShort": "Sunrise Stake is a regenerative finance protocol on Solana that lets users stake SOL and automatically donate staking yield to carbon offset programs.",
    "descriptionLong": "Sunrise Stake is a non-custodial, permissionless smart contract on Solana that directs staking yield toward retiring carbon tokens and supporting climate-positive projects. Users stake SOL and receive gSOL (green SOL), a wrapped token representing their stake, which can be used across the Solana ecosystem. The protocol is volunteer-driven, charges no fees, and donates 100% of staking rewards to carbon offset initiatives.",
    "profileSector": {
      "name": "Staking"
    },
    "profileType": {
      "name": "Protocol"
    },
    "urls": [
      {
        "url": "https://www.sunrisestake.com",
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
              "url": "https://x.com/sunrisestake",
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
              "url": "https://www.linkedin.com/company/sunrisestake",
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
              "url": "https://discord.com/invite/dhhAddB6AJ",
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
              "url": "https://github.com/sunrise-stake",
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
      "source": sunriseLogo
    }
  ]
} satisfies CompanyRecord;
