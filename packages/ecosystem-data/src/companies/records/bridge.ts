import type { CompanyRecord } from "../../types";
import bridgeLogo from "../../../assets/companies/bridge/logo.svg";

export const bridge = {
  "id": "bridge",
  "slug": "bridge",
  "name": "Bridge",
  "profile": {
    "name": "Bridge",
    "tagLine": "Make money move",
    "descriptionShort": "An entirely new payments platform built with stablecoins to simplify global money movement.",
    "descriptionLong": "Bridge provides a fully integrated stablecoin infrastructure platform enabling businesses to receive, store, convert, issue, and spend stablecoins. The platform offers APIs for orchestration, issuance, card programs, wallets, and cross-border payments. By handling regulatory, compliance, and technical complexities, Bridge allows companies to expand globally and move funds faster and cheaper.",
    "profileSector": {
      "name": "Payments"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.bridge.xyz/",
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
              "url": "https://x.com/StableCoin",
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
              "url": "https://www.linkedin.com/company/bridge-apis/",
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
      "source": bridgeLogo
    }
  ]
} satisfies CompanyRecord;
