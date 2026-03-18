import type { CompanyRecord } from "../../types";
import visaLogo from "../../../assets/companies/visa/logo.png";

export const visa = {
  "id": "visa",
  "slug": "visa",
  "name": "Visa",
  "gridProfileSlug": null,
  "gridProfile": {
    "name": "Visa",
    "tagLine": "A world leader in digital payments",
    "descriptionShort": "Visa has expanded its stablecoin settlement capabilities to the Solana blockchain, using USDC for cross-border payments between participating banks.",
    "descriptionLong": "Visa is a global payments network facilitating transactions across more than 200 countries and territories. The company expanded its stablecoin settlement pilot to Solana, leveraging the blockchain's high throughput and low transaction fees for USDC-based cross-border bank settlements. Visa chose Solana for its sub-cent transaction fees, 400ms slot times, and global validator network.",
    "profileSector": {
      "name": "Payments"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://visa.com",
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
              "url": "https://x.com/Visa",
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
              "url": "https://www.linkedin.com/company/visa",
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
              "url": "https://github.com/visa",
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
      "source": visaLogo
    }
  ]
} satisfies CompanyRecord;
