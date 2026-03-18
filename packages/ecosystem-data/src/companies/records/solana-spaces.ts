import type { CompanyRecord } from "../../types";
import solanaSpacesLogo from "../../../assets/companies/solana-spaces/logo.svg";

export const solanaSpaces = {
  "id": "solana-spaces",
  "slug": "solana-spaces",
  "name": "Solana Spaces",
  "gridProfileSlug": "solanaspaces",
  "gridProfile": {
    "name": "Solana Spaces",
    "tagLine": "Activating e-commerce and global IRL stores for Solana and its ecosystem",
    "descriptionShort": "Solana Spaces provides end-to-end events, merchandise, and community activations for the Solana ecosystem, operating pop-up retail stores at crypto conferences.",
    "descriptionLong": "Solana Spaces operates physical retail experiences and pop-up stores for the Solana ecosystem, offering branded apparel, hardware wallets, phones, gaming gear, and DePIN devices. Originally launched in 2022 with a flagship store in New York's Hudson Yards, the venture was revived as a pop-up model at crypto conferences. Solana Spaces partners with ecosystem teams to sell merchandise, turning community relationships into real-world cultural moments.",
    "profileSector": {
      "name": "Community"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://solanaspaces.com/",
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
              "url": "https://x.com/solanaspaces",
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
              "url": "https://www.linkedin.com/company/solana-spaces",
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
      "source": solanaSpacesLogo
    }
  ]
} satisfies CompanyRecord;
