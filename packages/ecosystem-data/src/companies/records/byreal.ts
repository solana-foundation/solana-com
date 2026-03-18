import type { CompanyRecord } from "../../types";
import byrealLogo from "../../../assets/companies/byreal/logo.svg";

export const byreal = {
  "id": "byreal",
  "slug": "byreal",
  "name": "Byreal",
  "gridProfileSlug": "byreal",
  "gridProfile": {
    "name": "Byreal",
    "tagLine": "The onchain liquidity network for the next wave of assets",
    "descriptionShort": "Byreal is an AI agent-native DEX on Solana incubated by Bybit, combining CEX-grade liquidity with DeFi-native transparency for trading real-world and digital assets.",
    "descriptionLong": "Byreal is a decentralized exchange built on Solana and incubated by Bybit that merges centralized exchange liquidity with decentralized finance transparency. The platform uses RFQ and CLMM routing to deliver low-slippage, MEV-protected trading with zero gas fees and zero price impact. Byreal supports spot swaps, a token launchpad, yield vaults, and perpetual trading, and is designed to serve both human traders and autonomous AI agents.",
    "profileSector": {
      "name": "DeFi"
    },
    "profileType": {
      "name": "Protocol"
    },
    "urls": [
      {
        "url": "https://www.byreal.io",
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
              "url": "https://x.com/byreal_io",
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
              "url": "https://t.me/Byreal_Community",
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
      "source": byrealLogo
    }
  ]
} satisfies CompanyRecord;
