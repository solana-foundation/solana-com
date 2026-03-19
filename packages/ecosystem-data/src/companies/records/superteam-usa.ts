import type { CompanyRecord } from "../../types";
import superteamUsaLogo from "../../../assets/companies/superteam-usa/logo.svg";

export const superteamUsa = {
  "id": "superteam-usa",
  "slug": "superteam-usa",
  "name": "Solana Superteam USA",
  "profile": {
    "name": "Superteam USA",
    "tagLine": "The talent layer of Solana in the United States.",
    "descriptionShort": "US chapter of the Superteam community connecting founders, developers, creatives, and operators building on Solana.",
    "descriptionLong": "Superteam USA is the United States chapter of Superteam, a Solana talent community focused on helping builders learn, earn, and ship. It supports founders and contributors through community programming, ecosystem connections, and events tied to the broader Solana network.",
    "profileSector": {
      "name": "Community"
    },
    "profileType": {
      "name": "Community"
    },
    "urls": [
      {
        "url": "https://superteam.fun/",
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
              "url": "https://x.com/SuperteamUSA",
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
      "source": superteamUsaLogo
    }
  ]
} satisfies CompanyRecord;
