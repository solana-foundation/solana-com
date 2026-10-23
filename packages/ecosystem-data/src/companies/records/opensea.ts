import type { CompanyRecord } from "../../types";
import openseaBreakpoint2026White from "../../../assets/companies/opensea/breakpoint-2026-white.svg";
import openseaLogoLight from "../../../assets/companies/opensea/logo-light.svg";

export const opensea = {
  id: "opensea",
  slug: "opensea",
  name: "OpenSea",
  profile: {
    tagline: "Every asset. Every chain. Everywhere.",
    summary:
      "OpenSea is a peer-to-peer web3 platform for discovering and directly interacting with NFTs, tokens, and other blockchain-based items.",
    description:
      "OpenSea provides a marketplace for digital collectibles and tokens across public blockchains. Users can browse collections, participate in drops, and trade from a connected wallet without OpenSea taking custody of their assets.",
    sector: "Exchange",
    type: "Platform",
    links: {
      website: "https://opensea.io/",
    },
    socials: {
      x: "https://x.com/opensea",
      linkedin: "https://www.linkedin.com/company/opensea/",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: openseaBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: openseaLogoLight,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
