import type { CompanyRecord } from "../../types";
import unclaimedSolBreakpoint2026NegativeRelief from "../../../assets/companies/unclaimed-sol/breakpoint-2026-negative-relief.svg";
import unclaimedSolBreakpoint2026White from "../../../assets/companies/unclaimed-sol/breakpoint-2026-white.svg";
import unclaimedSolClaimy from "../../../assets/companies/unclaimed-sol/claimy.png";
import unclaimedSolLogo from "../../../assets/companies/unclaimed-sol/logo.png";

export const unclaimedSol = {
  id: "unclaimed-sol",
  slug: "unclaimed-sol",
  name: "UnclaimedSOL",
  profile: {
    tagline: "Find and claim missed Solana rewards.",
    summary:
      "UnclaimedSOL helps Solana users discover and claim eligible rewards, assets, and missed opportunities.",
    description:
      "UnclaimedSOL provides tools for Solana users to identify and claim eligible unclaimed rewards or assets. Its product focuses on simplifying discovery and recovery flows for users who may have missed ecosystem opportunities.",
    sector: "Community",
    type: "Platform",
    links: {
      website: "https://unclaimedsol.com/",
    },
    socials: {
      x: "https://x.com/unclaimed_sol",
      telegram: "https://t.me/unclaimedsol",
      discord: "https://discord.gg/SG8hdqfPPt",
    },
  },
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-negative-relief",
      fileName: "breakpoint-2026-negative-relief.svg",
      format: "svg",
      source: unclaimedSolBreakpoint2026NegativeRelief,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: unclaimedSolBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo",
      fileName: "logo.png",
      format: "png",
      source: unclaimedSolLogo,
      kind: "mark",
    },
    {
      id: "claimy",
      fileName: "claimy.png",
      format: "png",
      source: unclaimedSolClaimy,
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
