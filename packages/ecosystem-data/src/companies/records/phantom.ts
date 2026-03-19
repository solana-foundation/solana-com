import type { CompanyRecord } from "../../types";
import phantomLogo from "../../../assets/companies/phantom/logo.svg";

export const phantom = {
  "id": "phantom",
  "slug": "phantom",
  "name": "Phantom",
  "profile": {
    "name": "Phantom",
    "tagLine": "The crypto app for everyone",
    "descriptionShort": "Phantom is a self-custodial multi-chain crypto wallet originally built for Solana, supporting token management, swaps, NFTs, and dApp interactions.",
    "descriptionLong": "Phantom is a leading self-custodial crypto wallet that originated on Solana and has expanded to support Ethereum, Bitcoin, Base, and Sui. It provides a unified interface for buying, storing, sending, swapping tokens, and managing NFTs across supported chains. Phantom is available as a browser extension for Chrome, Brave, and Firefox, as well as native mobile apps on iOS and Android.",
    "profileSector": {
      "name": "Wallet"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://phantom.com",
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
              "url": "https://x.com/phantom",
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
              "url": "https://www.linkedin.com/company/phantomwallet",
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
              "url": "https://discord.gg/phantom",
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
              "url": "https://github.com/phantom",
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
      "source": phantomLogo
    }
  ]
} satisfies CompanyRecord;
