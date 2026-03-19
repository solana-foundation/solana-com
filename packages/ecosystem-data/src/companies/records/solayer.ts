import type { CompanyRecord } from "../../types";
import solayerLogo from "../../../assets/companies/solayer/logo.svg";

export const solayer = {
  "id": "solayer",
  "slug": "solayer",
  "name": "Solayer",
  "profile": {
    "name": "Solayer",
    "tagLine": "Hardware-accelerated SVM",
    "descriptionShort": "Solayer is Solana's native restaking protocol, enabling SOL holders to extend the utility of their staked assets to secure additional services and protocols within the ecosystem.",
    "descriptionLong": "Solayer is the first native restaking and liquid restaking protocol on Solana, allowing SOL holders to restake their assets to secure Actively Validated Services (AVSs) such as oracles and bridges. Users receive sSOL in exchange for their staked SOL, earning additional yield while improving the security and reliability of ecosystem services. Solayer also offers sUSD, a yield-bearing stablecoin backed by US Treasury Bonds, and is building InfiniSVM, a hardware-accelerated SVM blockchain.",
    "profileSector": {
      "name": "Restaking"
    },
    "profileType": {
      "name": "Protocol"
    },
    "urls": [
      {
        "url": "https://solayer.org/",
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
              "url": "https://x.com/solayer_labs",
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
              "url": "https://www.linkedin.com/company/solayer-labs",
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
              "url": "https://discord.com/invite/solayerlabs",
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
              "url": "https://t.me/solayer_discussion",
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
              "url": "https://github.com/solayer-labs",
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
      "source": solayerLogo
    }
  ]
} satisfies CompanyRecord;
