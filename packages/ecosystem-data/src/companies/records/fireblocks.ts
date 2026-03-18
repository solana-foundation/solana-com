import type { CompanyRecord } from "../../types";
import fireblocksLogo from "../../../assets/companies/fireblocks/logo.png";

export const fireblocks = {
  "id": "fireblocks",
  "slug": "fireblocks",
  "name": "Fireblocks",
  "gridProfileSlug": "Fireblocks",
  "gridProfile": {
    "name": "Fireblocks",
    "tagLine": "Digital asset and stablecoin infrastructure",
    "descriptionShort": "Fireblocks provides enterprise-grade digital asset infrastructure for securely storing, transferring, and issuing assets on Solana and other blockchains.",
    "descriptionLong": "Fireblocks is an enterprise digital asset infrastructure platform that enables institutions to build blockchain-based products and manage digital asset operations securely. The platform supports native Solana integration including SOL and SPL token custody, decoded program calls, gasless transactions, and tokenization capabilities. Fireblocks processes Solana transactions with sub-50ms broadcast times and sub-$0.01 fees.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Platform"
    },
    "urls": [
      {
        "url": "https://www.fireblocks.com",
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
              "url": "https://x.com/FireblocksHQ",
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
              "url": "https://www.linkedin.com/company/fireblocks",
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
              "url": "https://github.com/fireblocks",
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
      "fileName": "logo.png",
      "format": "png",
      "source": fireblocksLogo
    }
  ]
} satisfies CompanyRecord;
