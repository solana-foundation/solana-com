import type { CompanyRecord } from "../../types";
import solflareLogo from "../../../assets/companies/solflare/logo.svg";

export const solflare = {
  "id": "solflare",
  "slug": "solflare",
  "name": "Solflare",
  "profile": {
    "name": "Solflare",
    "tagLine": "The Solana Wallet",
    "descriptionShort": "Solflare is a self-custody wallet for the Solana ecosystem, enabling users to buy, store, stake, swap tokens, and manage NFTs across web, browser extension, and mobile platforms.",
    "descriptionLong": "Solflare is a non-custodial wallet built for Solana, available as a web wallet, Chrome extension, and mobile app on iOS and Android. It supports buying, storing, staking, and swapping tokens as well as managing NFTs. Solflare integrates with hardware wallets like Ledger and Keystone for offline key management and features a built-in privacy layer with Private Send functionality.",
    "profileSector": {
      "name": "Wallet"
    },
    "profileType": {
      "name": "Platform"
    },
    "urls": [
      {
        "url": "https://www.solflare.com/",
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
              "url": "https://x.com/solflare_wallet",
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
              "url": "https://www.linkedin.com/company/solflare-official",
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
              "url": "https://discord.com/invite/solflare",
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
              "url": "https://github.com/solflare-wallet",
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
      "source": solflareLogo
    }
  ]
} satisfies CompanyRecord;
