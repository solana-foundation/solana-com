import type { CompanyRecord } from "../../types";
import aisaLogo from "../../../assets/companies/aisa/logo.svg";

export const aisa = {
  "id": "aisa",
  "slug": "aisa",
  "name": "AIsa",
  "legalName": "AIsa Inc.",
  "profile": {
    "name": "AIsa",
    "tagLine": "The Unified Resource & Payment Layer for AI Agents",
    "descriptionShort": "AIsa is an AI infrastructure platform that combines a unified resource gateway with usage-based payment infrastructure for AI agents and applications.",
    "descriptionLong": "AIsa provides a unified API layer for AI models, search, financial data, social data, and packaged agent skills, alongside a payments stack built for high-frequency, pay-per-use AI workloads. The platform positions itself as infrastructure for autonomous agents to discover resources, execute micropayments, and settle usage without vendor-specific integrations. The company says it was founded in San Francisco in late 2024, while its LinkedIn page lists the company as founded in 2025.",
    "profileSector": {
      "name": "Payments"
    },
    "profileType": {
      "name": "Platform"
    },
    "urls": [
      {
        "url": "https://aisa.one/",
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
              "url": "https://x.com/AIsaOneHQ",
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
              "url": "https://www.linkedin.com/company/aipayhq",
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
              "url": "https://discord.gg/bhjDrRKc",
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
      "source": aisaLogo
    }
  ]
} satisfies CompanyRecord;
