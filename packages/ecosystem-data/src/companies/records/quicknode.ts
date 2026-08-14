import type { CompanyRecord } from "../../types";
import quicknodeBreakpoint2026White from "../../../assets/companies/quicknode/breakpoint-2026-white.svg";
import quicknodeLogo from "../../../assets/companies/quicknode/logo.svg";
import quicknodeLogoLight from "../../../assets/companies/quicknode/logo-light.png";

export const quicknode = {
  id: "quicknode",
  slug: "quicknode",
  name: "Quicknode",
  profile: {
    tagline: "Build without compromise",
    summary:
      "QuickNode provides blockchain infrastructure, real-time and indexed data, and developer tools for applications across Solana and other networks.",
    description:
      "QuickNode offers managed RPC, dedicated clusters, gRPC, streams, webhooks, indexed data, and validator services. Solana developers can use its infrastructure and data APIs to build, monitor, and scale production applications.",
    sector: "Infrastructure",
    type: "Company",
    links: {
      website: "https://www.quicknode.com",
    },
    socials: {
      x: "https://x.com/QuickNode",
      linkedin: "https://www.linkedin.com/company/quicknode",
      discord: "https://discord.com/invite/quicknode",
      github: "https://github.com/quiknode-labs",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: quicknodeBreakpoint2026White,
      theme: "dark",
      kind: "logo",
      treatment: "monotone",
    },
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: quicknodeLogo,
      kind: "logo",
    },
    {
      id: "logo-light",
      fileName: "logo-light.png",
      format: "png",
      source: quicknodeLogoLight,
      theme: "light",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
