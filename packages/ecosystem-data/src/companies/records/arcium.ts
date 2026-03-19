import type { CompanyRecord } from "../../types";
import arciumLogo from "../../../assets/companies/arcium/logo.svg";

export const arcium = {
  "id": "arcium",
  "slug": "arcium",
  "name": "Arcium",
  "profile": {
    "tagline": "Encrypt Everything. Compute Anything.",
    "summary": "Arcium is a decentralized confidential computing network built on Solana that enables encrypted computations using multi-party computation, fully homomorphic encryption, and zero-knowledge proofs.",
    "description": "Arcium provides a parallelized confidential computing network that serves as an encrypted supercomputer for developers and applications across DeFi, AI, healthcare, and beyond. Built natively on Solana, Arcium combines MPC, FHE, and ZKPs through its Multiparty computation eXecution Environments (MXEs) to enable trustless, verifiable encrypted computations at scale. The network introduced the CSPL Confidential Token Standard, allowing any existing Solana token to support encrypted balances and transfer amounts.",
    "sector": "Infrastructure",
    "type": "Protocol",
    "links": {
      "website": "https://www.arcium.com"
    },
    "socials": {
      "x": "https://x.com/ArciumHQ",
      "linkedin": "https://www.linkedin.com/company/arciumnetwork",
      "discord": "https://discord.com/invite/arcium",
      "github": "https://github.com/arcium-hq"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": arciumLogo
    }
  ]
} satisfies CompanyRecord;
