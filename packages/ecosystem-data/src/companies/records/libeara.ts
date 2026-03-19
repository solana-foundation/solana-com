import type { CompanyRecord } from "../../types";
import libearaLogo from "../../../assets/companies/libeara/logo.svg";

export const libeara = {
  "id": "libeara",
  "slug": "libeara",
  "name": "Libeara",
  "profile": {
    "name": "Libeara",
    "tagLine": "Investing is more accessible and equitable with tokenised assets.",
    "descriptionShort": "SC Ventures incubated tokenisation platform helping organizations create, issue, and manage real-world assets on-chain.",
    "descriptionLong": "Libeara is a road-tested asset tokenisation platform focused on making markets more accessible, transparent, and secure, with solutions for regulated funds, tokenised government bonds, and other real-world assets.",
    "profileSector": {
      "name": "Tokenization"
    },
    "profileType": {
      "name": "Platform"
    },
    "urls": [
      {
        "url": "https://libeara.com/",
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
              "url": "https://x.com/libeara_",
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
              "url": "https://www.linkedin.com/company/libeara/",
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
      "source": libearaLogo
    }
  ]
} satisfies CompanyRecord;
