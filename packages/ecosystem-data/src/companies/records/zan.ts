import type { CompanyRecord } from "../../types";
import zanLogoColor from "../../../assets/companies/zan/logo-color.png";
import zanLogoLight from "../../../assets/companies/zan/logo-light.png";
import zanLogoPoweredByColor from "../../../assets/companies/zan/logo-powered-by-color.png";
import zanLogoPoweredByLight from "../../../assets/companies/zan/logo-powered-by-light.png";
import zanLogoPoweredByCompactColor from "../../../assets/companies/zan/logo-powered-by-compact-color.png";
import zanLogoPoweredByCompactLight from "../../../assets/companies/zan/logo-powered-by-compact-light.png";
import zanBreakpoint2026White from "../../../assets/companies/zan/breakpoint-2026-white.png";

export const zan = {
  id: "zan",
  slug: "zan",
  name: "ZAN",
  profile: {
    tagline: "Web3 infrastructure from Ant Digital Technologies.",
    summary:
      "ZAN provides blockchain node APIs, smart contract security tools, and developer services across Solana and other networks.",
    description:
      "ZAN is the Web3 infrastructure platform of Ant Digital Technologies. Its products include shared and dedicated RPC nodes, automated smart contract review, and identity tools for teams building on multiple blockchains.",
    sector: "Infrastructure",
    type: "Platform",
    links: { website: "https://zan.top/", docs: "https://docs.zan.top/" },
    socials: {
      x: "https://x.com/zan_team",
    },
  },
  defaultLogoId: "logo-color",
  logos: [
    {
      id: "logo-powered-by-color",
      fileName: "logo-powered-by-color.png",
      format: "png",
      source: zanLogoPoweredByColor,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-powered-by-light",
      fileName: "logo-powered-by-light.png",
      format: "png",
      source: zanLogoPoweredByLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-powered-by-compact-color",
      fileName: "logo-powered-by-compact-color.png",
      format: "png",
      source: zanLogoPoweredByCompactColor,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-powered-by-compact-light",
      fileName: "logo-powered-by-compact-light.png",
      format: "png",
      source: zanLogoPoweredByCompactLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-color",
      fileName: "logo-color.png",
      format: "png",
      source: zanLogoColor,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-light",
      fileName: "logo-light.png",
      format: "png",
      source: zanLogoLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: zanBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
