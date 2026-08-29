import type { CompanyRecord } from "../../types";
import collectorCryptBadgeDark from "../../../assets/companies/collector-crypt/badge-dark.svg";
import collectorCryptBadgeLight from "../../../assets/companies/collector-crypt/badge-light.svg";
import collectorCryptBreakpoint2026White from "../../../assets/companies/collector-crypt/breakpoint-2026-white.svg";
import collectorCryptLogoDark from "../../../assets/companies/collector-crypt/logo-dark.svg";
import collectorCryptLogoLight from "../../../assets/companies/collector-crypt/logo-light.svg";
import collectorCryptLogoPatternDark from "../../../assets/companies/collector-crypt/logo-pattern-dark.svg";
import collectorCryptLogoPatternLight from "../../../assets/companies/collector-crypt/logo-pattern-light.svg";
import collectorCryptMarkDark from "../../../assets/companies/collector-crypt/mark-dark.svg";
import collectorCryptMarkLight from "../../../assets/companies/collector-crypt/mark-light.svg";
import collectorCryptMarkPattern from "../../../assets/companies/collector-crypt/mark-pattern.svg";

export const collectorCrypt = {
  id: "collector-crypt",
  slug: "collector-crypt",
  name: "Collector Crypt",
  profile: {
    tagline: "A marketplace for collectors.",
    summary:
      "Collector Crypt is a platform for buying, selling, and managing physical collectibles with blockchain-enabled ownership records.",
    description:
      "Collector Crypt lets collectors vault, authenticate, and trade physical collectibles through an online marketplace. The platform connects custody and marketplace activity with blockchain-based records for collectors and their assets.",
    sector: "Gaming",
    type: "Platform",
    links: {
      website: "https://collectorcrypt.com/",
      docs: "https://docs.collectorcrypt.com/",
      x: "https://x.com/Collector_Crypt",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: collectorCryptBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: collectorCryptLogoLight,
      theme: "light",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: collectorCryptLogoDark,
      theme: "dark",
    },
    {
      id: "logo-pattern-light",
      fileName: "logo-pattern-light.svg",
      format: "svg",
      source: collectorCryptLogoPatternLight,
      theme: "light",
    },
    {
      id: "logo-pattern-dark",
      fileName: "logo-pattern-dark.svg",
      format: "svg",
      source: collectorCryptLogoPatternDark,
      theme: "dark",
    },
    {
      id: "mark-light",
      fileName: "mark-light.svg",
      format: "svg",
      source: collectorCryptMarkLight,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.svg",
      format: "svg",
      source: collectorCryptMarkDark,
      theme: "dark",
      kind: "mark",
    },
    {
      id: "mark-pattern",
      fileName: "mark-pattern.svg",
      format: "svg",
      source: collectorCryptMarkPattern,
      kind: "mark",
    },
    {
      id: "badge-light",
      fileName: "badge-light.svg",
      format: "svg",
      source: collectorCryptBadgeLight,
      background: "light",
    },
    {
      id: "badge-dark",
      fileName: "badge-dark.svg",
      format: "svg",
      source: collectorCryptBadgeDark,
      background: "light",
    },
  ],
} satisfies CompanyRecord;
