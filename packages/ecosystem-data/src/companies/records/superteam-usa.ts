import type { CompanyRecord } from "../../types";
import superteamUsaLogo from "../../../assets/companies/superteam-usa/logo.svg";
import superteamUsaMark from "../../../assets/companies/superteam-usa/mark.png";

export const superteamUsa = {
  "id": "superteam-usa",
  "slug": "superteam-usa",
  "name": "Solana Superteam USA",
  "profile": {
    "tagline": "The talent layer of Solana in the United States.",
    "summary": "US chapter of the Superteam community connecting founders, developers, creatives, and operators building on Solana.",
    "description": "Superteam USA is the United States chapter of Superteam, a Solana talent community focused on helping builders learn, earn, and ship. It supports founders and contributors through community programming, ecosystem connections, and events tied to the broader Solana network.",
    "sector": "Community",
    "type": "Community",
    "links": {
      "website": "https://superteam.fun/"
    },
    "socials": {
      "x": "https://x.com/SuperteamUSA"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": superteamUsaLogo,
      "kind": "logo"
    },
    {
      "id": "mark",
      "fileName": "mark.png",
      "format": "png",
      "source": superteamUsaMark,
      "kind": "mark"
    }
  ]
} satisfies CompanyRecord;
