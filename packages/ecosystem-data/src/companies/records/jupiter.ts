import type { CompanyRecord } from "../../types";
import jupiterLogoDark from "../../../assets/companies/jupiter/logo-dark.svg";

export const jupiter = {
  id: "jupiter",
  slug: "jupiter",
  name: "Jupiter",
  profile: {
    tagline: "Liquidity infrastructure for Solana trading",
    summary:
      "Jupiter is a Solana trading and liquidity platform that routes swaps and supports capital market products across the network.",
    description:
      "Jupiter provides Solana trading infrastructure for swaps, routing, and market access across decentralized liquidity venues. Its developer platform exposes APIs and tooling for integrations that need aggregated liquidity and clear attribution. Jupiter routes tokenized stocks, ETFs, and other external assets once they are live in Solana markets.",
    sector: "DeFi",
    type: "Platform",
    links: {
      website: "https://jup.ag/",
      docs: "https://developers.jup.ag/",
    },
    socials: {
      x: "https://x.com/JupiterExchange",
      discord: "https://discord.gg/jup",
      github: "https://github.com/jup-ag",
      telegram: "https://t.me/jup_ag",
      youtube: "https://www.youtube.com/@JupiterExchange",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: jupiterLogoDark,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
