import type { CompanyRecord } from "../../types";
import beezieBreakpoint2026White from "../../../assets/companies/beezie/breakpoint-2026-white.png";

export const beezie = {
  id: "beezie",
  slug: "beezie",
  name: "Beezie",
  profile: {
    tagline: "Vault, buy, and sell your favorite collectibles.",
    summary:
      "Beezie is a collectibles platform for buying, selling, vaulting, and redeeming physical assets onchain.",
    description:
      "Beezie provides a marketplace and onchain vaulting for collectibles including trading cards, games, and luxury items. Its platform combines digital ownership experiences with logistics and secured storage for redeemable physical assets.",
    sector: "Tokenization",
    type: "Platform",
    links: {
      website: "https://beezie.com/",
    },
    socials: {
      x: "https://x.com/beezie",
      discord: "https://discord.gg/beezie",
    },
  },
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: beezieBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
