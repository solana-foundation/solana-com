import type { CompanyRecord } from "../../types";
import oslLogo from "../../../assets/companies/osl/logo.svg";

export const osl = {
  "id": "osl",
  "slug": "osl",
  "name": "OSL",
  "profile": {
    "name": "OSL",
    "tagLine": "Built for simple crypto trading.",
    "descriptionShort": "Licensed digital asset exchange providing secure trading, fiat deposits, and custody services.",
    "descriptionLong": "OSL offers regulated trading, OTC services, custody, trading APIs, tokenization, and payment infrastructure for individuals and institutions, backed by global compliance coverage.",
    "profileSector": {
      "name": "Exchange"
    },
    "profileType": {
      "name": "Platform"
    },
    "urls": [
      {
        "url": "https://www.osl.com/",
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
              "url": "https://twitter.com/OSLdotcom",
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
              "url": "https://hk.linkedin.com/company/osldotcom/",
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
              "url": "https://discord.com/invite/oslglobal",
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
              "url": "https://t.me/osl_community",
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
      "source": oslLogo
    }
  ]
} satisfies CompanyRecord;
