import type { CompanyRecord } from "../../types";
import solanaIncubatorLogoDark from "../../../assets/companies/solana-incubator/logo-dark.webp";
import solanaIncubatorLogoLight from "../../../assets/companies/solana-incubator/logo-light.webp";
import solanaIncubatorLogoHorizontal from "../../../assets/companies/solana-incubator/logo-horizontal.svg";
import solanaIncubatorBreakpoint2026White from "../../../assets/companies/solana-incubator/breakpoint-2026-white.svg";

export const solanaIncubator = {
  id: "solana-incubator",
  slug: "solana-incubator",
  name: "Solana Incubator",
  profile: {
    tagline: "A Solana Labs program for early-stage teams.",
    summary:
      "Solana Incubator is a Solana Labs program that helps teams develop products in the Solana ecosystem.",
    description:
      "Solana Incubator brings early-stage teams together with Solana Labs for a three-month in-person program in New York. The program offers support with development, product strategy, fundraising, brand, and ecosystem connections.",
    sector: "Community",
    type: "Community",
    links: {
      website: "https://incubator.solanalabs.com/",
    },
    socials: {
      x: "https://x.com/incubator",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.webp",
      format: "webp",
      source: solanaIncubatorLogoDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-light",
      fileName: "logo-light.webp",
      format: "webp",
      source: solanaIncubatorLogoLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-horizontal",
      fileName: "logo-horizontal.svg",
      format: "svg",
      source: solanaIncubatorLogoHorizontal,
      theme: "dark",
      kind: "logo",
      width: 200,
      height: 16,
    },
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: solanaIncubatorBreakpoint2026White,
      theme: "dark",
      kind: "logo",
      treatment: "monotone",
      background: "transparent",
      width: 200,
      height: 16,
    },
  ],
} satisfies CompanyRecord;
