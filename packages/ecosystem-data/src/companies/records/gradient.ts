import type { CompanyRecord } from "../../types";
import gradientLogo from "../../../assets/companies/gradient/logo.png";

export const gradient = {
  "id": "gradient",
  "slug": "gradient",
  "name": "Gradient Network",
  "profile": {
    "name": "Gradient Network",
    "tagLine": "Building open intelligence collectively",
    "descriptionShort": "Gradient Network is a decentralized AI infrastructure platform on Solana that enables distributed training, serving, and agentic systems through its Open Intelligence Stack.",
    "descriptionLong": "Gradient is an AI R&D lab building the Open Intelligence Stack (OIS), a fully decentralized infrastructure on Solana for distributed AI workloads. The network transforms idle devices into compute nodes via a lightweight Chrome extension called Sentry Node, with over 1.6 million active nodes deployed across 190+ countries. Its core protocols enable AI models to run across distributed devices at scale.",
    "profileSector": {
      "name": "DePIN"
    },
    "profileType": {
      "name": "Protocol"
    },
    "urls": [
      {
        "url": "https://gradient.network/",
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
              "url": "https://x.com/Gradient_HQ",
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
              "url": "https://www.linkedin.com/company/gradient-network",
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
              "url": "https://discord.com/invite/gradientnetwork",
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
              "url": "https://t.me/Gradient_HQ",
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
      "source": gradientLogo
    }
  ]
} satisfies CompanyRecord;
