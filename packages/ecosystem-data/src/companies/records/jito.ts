import type { CompanyRecord } from "../../types";
import jitoLogo from "../../../assets/companies/jito/logo.svg";

export const jito = {
  "id": "jito",
  "slug": "jito",
  "name": "Jito",
  "gridProfileSlug": "jito",
  "gridProfile": {
    "name": "Jito",
    "tagLine": "Non-custodial liquid staking on Solana",
    "descriptionShort": "Jito is the largest DeFi protocol on Solana, providing non-custodial liquid staking with MEV rewards and MEV-optimized validator infrastructure.",
    "descriptionLong": "Jito operates two core products on Solana: a liquid staking protocol that lets users stake any amount of SOL and receive JitoSOL with auto-compounded rewards amplified by MEV extraction, and a MEV infrastructure suite including an open-source validator client and transaction relayer. The Jito Foundation governs the protocol through JTO token holders who shape its development.",
    "profileSector": {
      "name": "Staking"
    },
    "profileType": {
      "name": "Protocol"
    },
    "urls": [
      {
        "url": "https://www.jito.network/",
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
              "url": "https://x.com/jito_sol",
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
              "url": "https://www.linkedin.com/company/jito-labs",
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
              "url": "https://discord.gg/jito",
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
              "url": "https://github.com/jito-foundation",
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
      "source": jitoLogo
    }
  ]
} satisfies CompanyRecord;
