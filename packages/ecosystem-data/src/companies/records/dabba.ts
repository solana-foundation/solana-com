import type { CompanyRecord } from "../../types";
import dabbaLogo from "../../../assets/companies/dabba/logo.svg";

export const dabba = {
  "id": "dabba",
  "slug": "dabba",
  "name": "Dabba",
  "gridProfileSlug": "dabba",
  "gridProfile": {
    "name": "Dabba",
    "tagLine": "Web3 powered WiFi networks, built for emerging markets",
    "descriptionShort": "Dabba Network is a DePIN project on Solana that deploys decentralized WiFi hotspots across India to provide affordable high-speed internet access to underserved communities.",
    "descriptionLong": "Dabba Network operates a decentralized physical infrastructure network (DePIN) on Solana, deploying WiFi hotspots across India through local cable operators. The network is live in over 11,000 locations, with a mission to bring internet access to a billion Indians over the next decade. The platform uses the DBT utility token to reward hotspot owners and network participants, with tokens burned as data is consumed.",
    "profileSector": {
      "name": "DePIN"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://dabba.com",
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
              "url": "https://x.com/DabbaNetwork",
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
              "url": "https://www.linkedin.com/company/wifidabba",
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
              "url": "https://discord.gg/dabbanetwork",
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
              "url": "https://t.me/DabbaHQ",
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
              "url": "https://github.com/wifidabba",
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
      "source": dabbaLogo
    }
  ]
} satisfies CompanyRecord;
