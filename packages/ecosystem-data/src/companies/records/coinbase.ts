import type { CompanyRecord } from "../../types";
import coinbaseLogo from "../../../assets/companies/coinbase/logo.svg";

export const coinbase = {
  "id": "coinbase",
  "slug": "coinbase",
  "name": "Coinbase",
  "profile": {
    "name": "Coinbase",
    "tagLine": "Increase economic freedom in the world",
    "descriptionShort": "Coinbase is a publicly traded cryptocurrency exchange that provides a platform for buying, selling, storing, and managing digital assets including Solana and SPL tokens.",
    "descriptionLong": "Coinbase is one of the largest regulated cryptocurrency exchanges, offering trading, custody, and staking services for a wide range of digital assets. The platform provides full Solana ecosystem support including native DEX trading via Jupiter integration, cbBTC on Solana, and Coinbase Wallet compatibility with SPL tokens and Solana dApps. The company is publicly traded on NASDAQ under ticker COIN.",
    "profileSector": {
      "name": "Exchange"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.coinbase.com",
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
              "url": "https://x.com/coinbase",
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
              "url": "https://www.linkedin.com/company/coinbase",
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
              "url": "https://github.com/coinbase",
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
      "source": coinbaseLogo
    }
  ]
} satisfies CompanyRecord;
