import type { CompanyRecord } from "../../types";
import veliaNetLogo from "../../../assets/companies/velia-net/logo.svg";

export const veliaNet = {
  "id": "velia-net",
  "slug": "velia-net",
  "name": "velia.net",
  "profile": {
    "name": "velia.net",
    "tagLine": "Bare Metal Server Power — Reliable Server Hosting",
    "descriptionShort": "Enterprise dedicated server and bare metal hosting provider with over 20 years of industry experience.",
    "descriptionLong": "velia.net supplies single-tenant bare metal infrastructure and computing services to enterprises across gaming, AI/ML, ecommerce, payment processing, and Web3 sectors. Operating globally from six data centers with a 4.2 TBit/s backbone and DDoS protection, the company serves approximately 5,000+ clients and maintains ISO 27001 and SOC 1 Type II certifications.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.velia.net/",
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
              "url": "https://x.com/velianet",
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
              "url": "https://www.linkedin.com/company/velia-net",
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
      "source": veliaNetLogo
    }
  ]
} satisfies CompanyRecord;
