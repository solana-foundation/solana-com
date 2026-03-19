import type { CompanyRecord } from "../../types";
import tritonLogo from "../../../assets/companies/triton/logo.svg";

export const triton = {
  "id": "triton",
  "slug": "triton",
  "name": "Triton",
  "profile": {
    "tagline": "Ship fast. Scale ambitiously. Never settle for downtime.",
    "summary": "Triton One is a high-performance RPC infrastructure provider for Solana, offering enterprise-grade node services with full historical data access and advanced APIs.",
    "description": "Triton One operates a large-scale Solana RPC deployment with 100 nodes across public and private pools, handling hundreds of millions of requests daily. The platform provides complete compatibility with Solana JSON-RPC and WebSocket APIs across Mainnet, Testnet, and Devnet, with full blockchain history back to genesis. Triton also offers advanced tools including the Digital Assets API (DAS) for querying NFTs and tokens, plus Project Yellowstone components like Dragon's Mouth for gRPC streaming.",
    "sector": "Infrastructure",
    "type": "Company",
    "links": {
      "website": "https://triton.one"
    },
    "socials": {
      "x": "https://x.com/triton_one",
      "linkedin": "https://www.linkedin.com/company/triton-one",
      "telegram": "https://t.me/+zxGloe4vMZUzZmVl",
      "github": "https://github.com/rpcpool"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": tritonLogo
    }
  ]
} satisfies CompanyRecord;
