import type { CompanyRecord } from "../../types";
import mantleByrealLogo from "../../../assets/companies/mantle-byreal/logo.svg";

export const mantleByreal = {
  "id": "mantle-byreal",
  "slug": "mantle-byreal",
  "name": "Mantle / Byreal",
  "profile": {
    "tagline": "Building the Liquidity Chain of the Future",
    "summary": "Mantle is an Ethereum Layer 2 network that has expanded to Solana via the Mantle Super Portal and Byreal, a Solana-native decentralized exchange incubated by Bybit.",
    "description": "Mantle Network is an Ethereum L2 blockchain focused on capital efficiency through modular architecture and zero-knowledge proofs. In partnership with Bybit and Byreal, Mantle launched the Super Portal, a native cross-chain infrastructure that bridges $MNT tokens between Ethereum and Solana. This integration positions $MNT as a cross-ecosystem asset connecting Ethereum L2 liquidity, Solana DeFi, and centralized exchange infrastructure.",
    "sector": "DeFi",
    "type": "Platform",
    "links": {
      "website": "https://www.mantle.xyz/"
    },
    "socials": {
      "x": "https://x.com/0xMantle",
      "linkedin": "https://www.linkedin.com/company/0xmantle",
      "discord": "https://discord.com/invite/0xMantle",
      "telegram": "https://t.me/mantlenetwork",
      "github": "https://github.com/mantlenetworkio"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": mantleByrealLogo
    }
  ]
} satisfies CompanyRecord;
