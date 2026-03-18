import type { CompanyRecord } from "../../types";
import switchboardLogo from "../../../assets/companies/switchboard/logo.svg";

export const switchboard = {
  "id": "switchboard",
  "slug": "switchboard",
  "name": "Switchboard",
  "gridProfileSlug": null,
  "gridProfile": {
    "name": "Switchboard",
    "tagLine": "The Everything Oracle",
    "descriptionShort": "Switchboard is a permissionless, multi-chain oracle protocol on Solana that provides customizable data feeds, verifiable randomness, and off-chain compute for smart contracts.",
    "descriptionLong": "Switchboard is a decentralized, community-curated oracle network that brings real-world data on-chain across 10+ blockchains including Solana, Arbitrum, Aptos, and Sui. It serves as the data provider for prominent DeFi projects such as Kamino, Jito, MarginFi, and Drift. The protocol delivers price feeds at sub-100ms latency through its Surge oracle network.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Protocol"
    },
    "urls": [
      {
        "url": "https://switchboard.xyz",
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
              "url": "https://x.com/switchboardxyz",
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
              "url": "https://www.linkedin.com/company/switchboardxyz",
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
              "url": "https://discord.com/invite/sNeGymrabT",
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
              "url": "https://telegram.me/switchboardxyz",
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
              "url": "https://github.com/switchboard-xyz",
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
      "source": switchboardLogo
    }
  ]
} satisfies CompanyRecord;
