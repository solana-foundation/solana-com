import type { CompanyRecord } from "../../types";
import colosseumBreakpoint2026White from "../../../assets/companies/colosseum/breakpoint-2026-white.svg";
import colosseumLogoLight from "../../../assets/companies/colosseum/logo-light.svg";
import colosseumLogoDark from "../../../assets/companies/colosseum/logo-dark.svg";

export const colosseum = {
  id: "colosseum",
  slug: "colosseum",
  name: "Colosseum",
  profile: {
    tagline: "The proving ground for crypto's best builders",
    summary:
      "Colosseum runs Solana online hackathons, accelerates selected founders, and invests through its venture fund.",
    description:
      "Colosseum operates an integrated platform for Solana founders spanning hackathons, cofounder matching, an accelerator, and pre-seed investment. Teams compete online, and selected winners receive funding and join its founder network and accelerator.",
    sector: "Community",
    type: "Platform",
    links: {
      website: "https://colosseum.com/",
    },
    socials: {
      x: "https://x.com/colosseum",
      linkedin: "https://www.linkedin.com/company/colosseumorg",
      youtube: "https://www.youtube.com/@Colosseum",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: colosseumBreakpoint2026White,
      theme: "dark",
      kind: "logo",
      treatment: "monotone",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: colosseumLogoLight,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: colosseumLogoDark,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
