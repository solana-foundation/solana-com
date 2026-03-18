import type { CompanyRecord } from "../../types";
import doublezeroLogo from "../../../assets/companies/doublezero/logo.svg";

export const doublezero = {
  "id": "doublezero",
  "slug": "doublezero",
  "name": "DoubleZero",
  "gridProfileSlug": null,
  "gridProfile": {
    "name": "DoubleZero",
    "tagLine": "The High-Performance Global Network",
    "descriptionShort": "DoubleZero is a decentralized fiber network providing low-latency connectivity for distributed systems like blockchain networks.",
    "descriptionLong": "DoubleZero Foundation operates a global fiber network designed to deliver high-performance networking infrastructure to blockchains and systems requiring millisecond-level responsiveness. The protocol enables validators to connect to dedicated network links while introducing revenue opportunities through real-time data distribution services.",
    "profileSector": {
      "name": "Infrastructure"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.doublezero.xyz/",
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
              "url": "https://x.com/DoubleZeroXYZ",
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
      "source": doublezeroLogo
    }
  ]
} satisfies CompanyRecord;
