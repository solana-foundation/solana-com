import type { CompanyRecord } from "../../types";
import galaxyLogo from "../../../assets/companies/galaxy/logo.svg";

export const galaxy = {
  "id": "galaxy",
  "slug": "galaxy",
  "name": "Galaxy",
  "profile": {
    "name": "Galaxy",
    "tagLine": "Global leader in digital assets and data center infrastructure",
    "descriptionShort": "Galaxy is a publicly traded digital asset and blockchain financial services firm that provides institutional-grade trading, asset management, and infrastructure solutions.",
    "descriptionLong": "Galaxy (TSX: GLXY) is a digital asset and blockchain leader founded by Michael Novogratz, headquartered in New York. The company operates three complementary businesses: Global Markets, Asset Management, and Digital Infrastructure Solutions, serving institutions, startups, and qualified individuals. Galaxy is a major participant in the Solana ecosystem and a significant SOL holder.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.galaxy.com/",
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
              "url": "https://x.com/galaxyhq",
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
              "url": "https://www.linkedin.com/company/galaxyhq",
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
              "url": "https://github.com/galaxy-digital",
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
      "source": galaxyLogo
    }
  ]
} satisfies CompanyRecord;
