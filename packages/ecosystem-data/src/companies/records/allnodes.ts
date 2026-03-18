import type { CompanyRecord } from "../../types";
import allnodesLogo from "../../../assets/companies/allnodes/logo.svg";

export const allnodes = {
  "id": "allnodes",
  "slug": "allnodes",
  "name": "Allnodes",
  "gridProfileSlug": "allnodes",
  "gridProfile": {
    "name": "Allnodes",
    "tagLine": "Non-custodial platform for node hosting and staking across 120+ protocols",
    "descriptionShort": "Allnodes is a non-custodial infrastructure platform that provides node hosting, validator services, and staking for Solana and 120+ other blockchain protocols.",
    "descriptionLong": "Allnodes provides reliable non-custodial node hosting and staking services, allowing users to deploy validators, full nodes, and stake assets across 120+ blockchain protocols. On Solana, Allnodes hosts over 100 nodes including 61 validators with 6.47M SOL staked. The platform also offers bare-metal servers purpose-built for Solana validators, featuring AMD EPYC Turin processors and enterprise-grade hardware.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Platform"
    },
    "urls": [
      {
        "url": "https://www.allnodes.com",
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
              "url": "https://x.com/Allnodes",
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
              "url": "https://www.linkedin.com/company/allnodes",
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
              "url": "https://discord.com/invite/allnodes",
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
              "url": "https://t.me/allnodes",
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
              "url": "https://github.com/allnodes",
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
      "source": allnodesLogo
    }
  ]
} satisfies CompanyRecord;
