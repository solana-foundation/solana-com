import type { CompanyRecord } from "../../types";
import solayerLogo from "../../../assets/companies/solayer/logo.svg";
import solayerLogoLight from "../../../assets/companies/solayer/logo-light.svg";
import solayerLogoDark from "../../../assets/companies/solayer/logo-dark.svg";
import solayerMarkLight from "../../../assets/companies/solayer/mark-light.svg";
import solayerMarkDark from "../../../assets/companies/solayer/mark-dark.svg";
import solayerWordmarkLight from "../../../assets/companies/solayer/wordmark-light.svg";
import solayerWordmarkDark from "../../../assets/companies/solayer/wordmark-dark.svg";

export const solayer = {
  "id": "solayer",
  "slug": "solayer",
  "name": "Solayer",
  "profile": {
    "tagline": "Hardware-accelerated SVM",
    "summary": "Solayer is Solana's native restaking protocol, enabling SOL holders to extend the utility of their staked assets to secure additional services and protocols within the ecosystem.",
    "description": "Solayer is the first native restaking and liquid restaking protocol on Solana, allowing SOL holders to restake their assets to secure Actively Validated Services (AVSs) such as oracles and bridges. Users receive sSOL in exchange for their staked SOL, earning additional yield while improving the security and reliability of ecosystem services. Solayer also offers sUSD, a yield-bearing stablecoin backed by US Treasury Bonds, and is building InfiniSVM, a hardware-accelerated SVM blockchain.",
    "sector": "Restaking",
    "type": "Protocol",
    "links": {
      "website": "https://solayer.org/"
    },
    "socials": {
      "x": "https://x.com/solayer_labs",
      "linkedin": "https://www.linkedin.com/company/solayer-labs",
      "discord": "https://discord.com/invite/solayerlabs",
      "telegram": "https://t.me/solayer_discussion",
      "github": "https://github.com/solayer-labs"
    }
  },
  "defaultLogoId": "logo-light",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": solayerLogo,
      "kind": "logo"
    },
    {
      "id": "logo-light",
      "fileName": "logo-light.svg",
      "format": "svg",
      "source": solayerLogoLight,
      "theme": "light",
      "kind": "logo"
    },
    {
      "id": "logo-dark",
      "fileName": "logo-dark.svg",
      "format": "svg",
      "source": solayerLogoDark,
      "theme": "dark",
      "kind": "logo"
    },
    {
      "id": "mark-light",
      "fileName": "mark-light.svg",
      "format": "svg",
      "source": solayerMarkLight,
      "theme": "light",
      "kind": "mark"
    },
    {
      "id": "mark-dark",
      "fileName": "mark-dark.svg",
      "format": "svg",
      "source": solayerMarkDark,
      "theme": "dark",
      "kind": "mark"
    },
    {
      "id": "wordmark-light",
      "fileName": "wordmark-light.svg",
      "format": "svg",
      "source": solayerWordmarkLight,
      "theme": "light",
      "kind": "wordmark"
    },
    {
      "id": "wordmark-dark",
      "fileName": "wordmark-dark.svg",
      "format": "svg",
      "source": solayerWordmarkDark,
      "theme": "dark",
      "kind": "wordmark"
    }
  ]
} satisfies CompanyRecord;
