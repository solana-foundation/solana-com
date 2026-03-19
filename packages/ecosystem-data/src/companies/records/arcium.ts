import type { CompanyRecord } from "../../types";
import arciumLogo from "../../../assets/companies/arcium/logo.svg";

export const arcium = {
  "id": "arcium",
  "slug": "arcium",
  "name": "Arcium",
  "profile": {
    "name": "Arcium",
    "tagLine": "Encrypt Everything. Compute Anything.",
    "descriptionShort": "Arcium is a decentralized confidential computing network built on Solana that enables encrypted computations using multi-party computation, fully homomorphic encryption, and zero-knowledge proofs.",
    "descriptionLong": "Arcium provides a parallelized confidential computing network that serves as an encrypted supercomputer for developers and applications across DeFi, AI, healthcare, and beyond. Built natively on Solana, Arcium combines MPC, FHE, and ZKPs through its Multiparty computation eXecution Environments (MXEs) to enable trustless, verifiable encrypted computations at scale. The network introduced the CSPL Confidential Token Standard, allowing any existing Solana token to support encrypted balances and transfer amounts.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Protocol"
    },
    "urls": [
      {
        "url": "https://www.arcium.com",
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
              "url": "https://x.com/ArciumHQ",
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
              "url": "https://www.linkedin.com/company/arciumnetwork",
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
              "url": "https://discord.com/invite/arcium",
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
              "url": "https://github.com/arcium-hq",
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
      "source": arciumLogo
    }
  ]
} satisfies CompanyRecord;
