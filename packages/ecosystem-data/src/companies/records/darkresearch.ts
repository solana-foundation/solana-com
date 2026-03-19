import type { CompanyRecord } from "../../types";
import darkresearchLogo from "../../../assets/companies/darkresearch/logo.png";

export const darkresearch = {
  "id": "darkresearch",
  "slug": "darkresearch",
  "name": "Dark Research",
  "profile": {
    "name": "Dark Research",
    "tagLine": "An AI lab for the new internet",
    "descriptionShort": "Dark Research is an applied AI lab building production applications at the intersection of blockchain infrastructure and artificial intelligence, with tools for Solana.",
    "descriptionLong": "Dark Research is a technology company focused on closing the gap between frontier technology and human cognition through production applications. The company operates at the intersection of blockchain infrastructure and artificial intelligence, building tools including Model Context Protocol servers for interacting with the Solana blockchain powered by the Solana Agent Kit.",
    "profileSector": {
      "name": "Developer Tools"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.darkresearch.ai",
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
              "url": "https://x.com/darkresearchai",
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
              "url": "https://www.linkedin.com/company/dark-ai",
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
              "url": "https://github.com/darkresearch",
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
      "source": darkresearchLogo
    }
  ]
} satisfies CompanyRecord;
