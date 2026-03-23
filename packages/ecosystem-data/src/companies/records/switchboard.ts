import type { CompanyRecord } from "../../types";
import switchboardLogo from "../../../assets/companies/switchboard/logo.svg";

export const switchboard = {
  "id": "switchboard",
  "slug": "switchboard",
  "name": "Switchboard",
  "profile": {
    "tagline": "The Everything Oracle",
    "summary": "Switchboard is a permissionless, multi-chain oracle protocol on Solana that provides customizable data feeds, verifiable randomness, and off-chain compute for smart contracts.",
    "description": "Switchboard is a decentralized, community-curated oracle network that brings real-world data on-chain across 10+ blockchains including Solana, Arbitrum, Aptos, and Sui. It serves as the data provider for prominent DeFi projects such as Kamino, Jito, MarginFi, and Drift. The protocol delivers price feeds at sub-100ms latency through its Surge oracle network.",
    "sector": "Infrastructure",
    "type": "Protocol",
    "links": {
      "website": "https://switchboard.xyz"
    },
    "socials": {
      "x": "https://x.com/switchboardxyz",
      "linkedin": "https://www.linkedin.com/company/switchboardxyz",
      "discord": "https://discord.com/invite/sNeGymrabT",
      "telegram": "https://telegram.me/switchboardxyz",
      "github": "https://github.com/switchboard-xyz"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": switchboardLogo
    }
  ]
} satisfies CompanyRecord;
