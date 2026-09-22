import type { CompanyRecord } from "../../types";
import tritonBreakpoint2026White from "../../../assets/companies/triton/breakpoint-2026-white.svg";
import tritonLogoDark from "../../../assets/companies/triton/logo-dark.svg";
import tritonLogoDarkPng from "../../../assets/companies/triton/logo-dark.png";
import tritonLogoLight from "../../../assets/companies/triton/logo-light.svg";
import tritonLogoLightPng from "../../../assets/companies/triton/logo-light.png";
import tritonLogo from "../../../assets/companies/triton/logo.svg";
import tritonMark from "../../../assets/companies/triton/mark.svg";
import tritonMarkPng from "../../../assets/companies/triton/mark.png";

export const triton = {
  id: "triton",
  slug: "triton",
  name: "Triton",
  profile: {
    tagline: "Ship fast. Scale ambitiously. Never settle for downtime.",
    summary:
      "Triton One is a high-performance RPC infrastructure provider for Solana, offering enterprise-grade node services with full historical data access and advanced APIs.",
    description:
      "Triton One operates a large-scale Solana RPC deployment with 100 nodes across public and private pools, handling hundreds of millions of requests daily. The platform provides complete compatibility with Solana JSON-RPC and WebSocket APIs across Mainnet, Testnet, and Devnet, with full blockchain history back to genesis. Triton also offers advanced tools including the Digital Assets API (DAS) for querying NFTs and tokens, plus Project Yellowstone components like Dragon's Mouth for gRPC streaming.",
    sector: "Infrastructure",
    type: "Company",
    links: {
      website: "https://triton.one",
    },
    socials: {
      x: "https://x.com/triton_one",
      linkedin: "https://www.linkedin.com/company/triton-one",
      telegram: "https://t.me/+zxGloe4vMZUzZmVl",
      github: "https://github.com/rpcpool",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: tritonBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: tritonLogo,
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: tritonLogoLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-light-png",
      fileName: "logo-light.png",
      format: "png",
      source: tritonLogoLightPng,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: tritonLogoDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-dark-png",
      fileName: "logo-dark.png",
      format: "png",
      source: tritonLogoDarkPng,
      theme: "light",
      kind: "logo",
    },
    {
      id: "mark",
      fileName: "mark.svg",
      format: "svg",
      source: tritonMark,
      kind: "mark",
    },
    {
      id: "mark-png",
      fileName: "mark.png",
      format: "png",
      source: tritonMarkPng,
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
