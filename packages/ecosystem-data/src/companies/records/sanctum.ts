import type { CompanyRecord } from "../../types";
import sanctumLegacyLogo from "../../../assets/companies/sanctum/breakpoint-2026-white.svg";
import sanctumLogoColorOnLight from "../../../assets/companies/sanctum/logo-color-on-light.svg";
import sanctumBreakpoint2026White from "../../../assets/companies/sanctum/breakpoint-2026-white.png";

export const sanctum = {
  id: "sanctum",
  slug: "sanctum",
  name: "Sanctum",
  profile: {
    tagline: "Staking infrastructure for Solana.",
    summary:
      "Sanctum provides liquid staking infrastructure and liquidity for Solana, alongside validator and transaction delivery services.",
    description:
      "Sanctum helps teams launch custom liquid staking tokens and white-label validators on Solana. Its liquidity engine connects liquid staking tokens, while its Gateway and Ironforge products support transaction delivery and application infrastructure.",
    sector: "Staking",
    type: "Platform",
    links: {
      website: "https://sanctum.so/",
      app: "https://app.sanctum.so/",
      docs: "https://learn.sanctum.so/",
    },
    socials: {
      x: "https://x.com/sanctumso",
      discord: "https://discord.gg/sanctumso",
      telegram: "https://t.me/sanctum_dev",
    },
  },
  defaultLogoId: "logo-color-on-light",
  logos: [
    {
      id: "logo-legacy",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: sanctumLegacyLogo,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-color-on-light",
      fileName: "logo-color-on-light.svg",
      format: "svg",
      source: sanctumLogoColorOnLight,
      theme: "light",
      kind: "logo",
      width: 1501,
      height: 416,
    },
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: sanctumBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
      kind: "logo",
      background: "transparent",
      width: 1246,
      height: 235,
    },
  ],
} satisfies CompanyRecord;
