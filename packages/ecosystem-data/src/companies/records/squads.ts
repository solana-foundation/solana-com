import type { CompanyRecord } from "../../types";
import squadsLogo from "../../../assets/companies/squads/logo.svg";

export const squads = {
  "id": "squads",
  "slug": "squads",
  "name": "Squads",
  "gridProfileSlug": "Squads",
  "gridProfile": {
    "name": "Squads",
    "tagLine": "Finance Without Legacy Constraints",
    "descriptionShort": "Squads is the multisig standard on Solana, providing smart account infrastructure for teams, DAOs, and businesses to securely manage on-chain assets with shared ownership and permissions.",
    "descriptionLong": "Squads is the industry-standard multisig platform on Solana, built on the formally verified Squads Protocol. Teams can deploy a multisig in a few clicks, configuring time locks, spending limits, roles, sub-accounts, and custom access controls. Major Solana projects including Helium, Jito, Pyth, Drift, and Orca rely on Squads for on-chain operations.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Protocol"
    },
    "urls": [
      {
        "url": "https://squads.xyz/",
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
              "url": "https://x.com/SquadsProtocol",
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
              "url": "https://www.linkedin.com/company/squads-labs",
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
              "url": "https://github.com/Squads-Protocol",
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
      "source": squadsLogo
    }
  ]
} satisfies CompanyRecord;
