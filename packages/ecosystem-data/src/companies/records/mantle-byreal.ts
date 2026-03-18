import type { CompanyRecord } from "../../types";
import mantleByrealLogo from "../../../assets/companies/mantle-byreal/logo.svg";

export const mantleByreal = {
  "id": "mantle-byreal",
  "slug": "mantle-byreal",
  "name": "Mantle / Byreal",
  "gridProfileSlug": "mantle_xyz",
  "gridProfile": {
    "name": "Mantle / Byreal",
    "tagLine": "Building the Liquidity Chain of the Future",
    "descriptionShort": "Mantle is an Ethereum Layer 2 network that has expanded to Solana via the Mantle Super Portal and Byreal, a Solana-native decentralized exchange incubated by Bybit.",
    "descriptionLong": "Mantle Network is an Ethereum L2 blockchain focused on capital efficiency through modular architecture and zero-knowledge proofs. In partnership with Bybit and Byreal, Mantle launched the Super Portal, a native cross-chain infrastructure that bridges $MNT tokens between Ethereum and Solana. This integration positions $MNT as a cross-ecosystem asset connecting Ethereum L2 liquidity, Solana DeFi, and centralized exchange infrastructure.",
    "profileSector": {
      "name": "DeFi"
    },
    "profileType": {
      "name": "Platform"
    },
    "urls": [
      {
        "url": "https://www.mantle.xyz/",
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
              "url": "https://x.com/0xMantle",
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
              "url": "https://www.linkedin.com/company/0xmantle",
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
              "url": "https://discord.com/invite/0xMantle",
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
              "url": "https://t.me/mantlenetwork",
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
              "url": "https://github.com/mantlenetworkio",
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
      "source": mantleByrealLogo
    }
  ]
} satisfies CompanyRecord;
