import type { CompanyRecord } from "../../types";
import tokenCreatorLogoDark from "../../../assets/companies/token-creator/logo-dark.svg";
import tokenCreatorLogoLight from "../../../assets/companies/token-creator/logo-light.svg";
import tokenCreatorLogoMonotone from "../../../assets/companies/token-creator/logo-monotone.svg";

export const tokenCreator = {
  id: "token-creator",
  slug: "token-creator",
  name: "Token Creator",
  profile: {
    tagline: "Launch a community token on Solana — no code required.",
    summary:
      "Token Creator is a no-code Solana token launcher for community founders.",
    description:
      "Token Creator lets anyone create an SPL token, lock their founder allocation via Streamflow vesting, add liquidity via Orca Whirlpool, and share a public token page with live price, chart, and holder data — all in one flow, without writing a single line of code.",
    sector: "Tools",
    type: "Platform",
    links: {
      website: "https://token-creator.space",
    },
    socials: {
      x: "https://x.com/TokenCreatorApp",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: tokenCreatorLogoDark,
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: tokenCreatorLogoLight,
    },
    {
      id: "logo-monotone",
      fileName: "logo-monotone.svg",
      format: "svg",
      source: tokenCreatorLogoMonotone,
    },
  ],
} satisfies CompanyRecord;
