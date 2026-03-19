import type { CompanyRecord } from "../../types";
import byrealLogo from "../../../assets/companies/byreal/logo.svg";

export const byreal = {
  "id": "byreal",
  "slug": "byreal",
  "name": "Byreal",
  "profile": {
    "tagline": "The onchain liquidity network for the next wave of assets",
    "summary": "Byreal is an AI agent-native DEX on Solana incubated by Bybit, combining CEX-grade liquidity with DeFi-native transparency for trading real-world and digital assets.",
    "description": "Byreal is a decentralized exchange built on Solana and incubated by Bybit that merges centralized exchange liquidity with decentralized finance transparency. The platform uses RFQ and CLMM routing to deliver low-slippage, MEV-protected trading with zero gas fees and zero price impact. Byreal supports spot swaps, a token launchpad, yield vaults, and perpetual trading, and is designed to serve both human traders and autonomous AI agents.",
    "sector": "DeFi",
    "type": "Protocol",
    "links": {
      "website": "https://www.byreal.io"
    },
    "socials": {
      "x": "https://x.com/byreal_io",
      "telegram": "https://t.me/Byreal_Community"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": byrealLogo
    }
  ]
} satisfies CompanyRecord;
