import type { CompanyRecord } from "../../types";
import spiLogo from "../../../assets/companies/spi/logo.svg";

export const spi = {
  "id": "spi",
  "slug": "spi",
  "name": "Solana Policy Institute",
  "profile": {
    "name": "Solana Policy Institute",
    "tagLine": "Educating policymakers on how decentralized networks are the future of the digital economy",
    "descriptionShort": "The Solana Policy Institute is a non-partisan, not-for-profit organization that educates policymakers on decentralized networks and advocates for legal clarity for the Solana ecosystem.",
    "descriptionLong": "The Solana Policy Institute is a non-partisan, not-for-profit organization focused on educating policymakers about how decentralized networks like Solana are transforming the digital economy. The institute serves as a liaison between policymakers and the Solana ecosystem, advocating for legislation and regulation that supports industry growth in the United States.",
    "profileSector": {
      "name": "Policy"
    },
    "profileType": {
      "name": "Community"
    },
    "urls": [
      {
        "url": "https://www.solanapolicyinstitute.org/",
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
              "url": "https://x.com/SolanaInstitute",
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
              "url": "https://www.linkedin.com/company/solana-policy-institute",
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
      "source": spiLogo
    }
  ]
} satisfies CompanyRecord;
