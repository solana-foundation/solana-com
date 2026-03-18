import type { CompanyRecord } from "../../types";
import atxpLogo from "../../../assets/companies/atxp/logo.svg";

export const atxp = {
  "id": "atxp",
  "slug": "atxp",
  "name": "ATXP",
  "profile": {
    "name": "ATXP",
    "tagLine": "A web-wide protocol for agentic payments",
    "descriptionShort": "ATXP is a protocol built by Circuit & Chisel that enables AI agents to autonomously handle commerce from discovery to payment, with support for Solana-based micropayments.",
    "descriptionLong": "ATXP (developed by Circuit & Chisel) is a web-wide protocol enabling AI agents to manage the full commerce lifecycle — discovery, negotiation, and payment — without human oversight. The protocol supports instant, nested, delegated micropayments between AI agents. Circuit & Chisel raised $19.2 million in seed funding led by Primary Venture Partners and ParaFi Capital, with participation from Stripe, Coinbase Ventures, Solana Ventures, and Samsung Next.",
    "profileSector": {
      "name": "Payments"
    },
    "profileType": {
      "name": "Protocol"
    },
    "urls": [
      {
        "url": "https://circuitandchisel.com",
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
              "url": "https://x.com/atxp_ai",
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
              "url": "https://www.linkedin.com/company/circuit-chisel",
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
              "url": "https://github.com/atxp-dev",
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
      "source": atxpLogo
    }
  ]
} satisfies CompanyRecord;
