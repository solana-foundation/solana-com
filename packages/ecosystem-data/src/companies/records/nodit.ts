import type { CompanyRecord } from "../../types";
import noditBreakpoint2026White from "../../../assets/companies/nodit/breakpoint-2026-white.svg";
import noditLogoLight from "../../../assets/companies/nodit/logo-light.svg";
import noditLogoDark from "../../../assets/companies/nodit/logo-dark.svg";

export const nodit = {
  id: "nodit",
  slug: "nodit",
  name: "Nodit",
  profile: {
    tagline: "Enterprise-grade Web3 infrastructure for institutions",
    summary:
      "Nodit provides managed blockchain nodes, data APIs, real-time webhooks, staking infrastructure, and agent tools across Solana and other networks.",
    description:
      "Developed by Lambda256, Nodit is a multi-chain Web3 infrastructure platform for institutional and developer workflows. On Solana, it provides RPC and node infrastructure, indexed datasets and APIs, staking services, event notifications, and MCP-based access to onchain data.",
    sector: "Infrastructure",
    type: "Platform",
    links: {
      website: "https://www.nodit.io/",
      docs: "https://developer.nodit.io/",
    },
    socials: {
      x: "https://x.com/NoditPlatform",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: noditBreakpoint2026White,
      theme: "dark",
      kind: "logo",
      treatment: "monotone",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: noditLogoLight,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: noditLogoDark,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
