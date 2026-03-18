import type { CompanyRecord } from "../../types";
import quicknodeLogo from "../../../assets/companies/quicknode/logo.svg";

export const quicknode = {
  "id": "quicknode",
  "slug": "quicknode",
  "name": "Quicknode",
  "gridProfileSlug": "quicknode",
  "gridProfile": {
    "name": "QuickNode",
    "tagLine": "Build, scale, and ship without compromise",
    "descriptionShort": "QuickNode provides high-performance RPC endpoints and developer tooling for building and scaling applications on Solana and other blockchains.",
    "descriptionLong": "QuickNode is a multi-chain blockchain infrastructure platform that provides dedicated RPC endpoints, WebSocket subscriptions, and developer tools for production applications. On Solana, QuickNode serves over 50% of Solana projects with sub-100ms response times and 99.99% uptime. The platform offers Solana-specific add-ons including Jito bundles, Metaplex DAS for NFT data, Priority Fee API, and Jupiter swap routing.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.quicknode.com",
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
              "url": "https://x.com/QuickNode",
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
              "url": "https://www.linkedin.com/company/quicknode",
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
              "url": "https://discord.com/invite/quicknode",
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
              "url": "https://github.com/quiknode-labs",
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
      "source": quicknodeLogo
    }
  ]
} satisfies CompanyRecord;
