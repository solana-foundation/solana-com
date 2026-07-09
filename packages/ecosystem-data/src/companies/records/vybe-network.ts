import type { CompanyRecord } from "../../types";
import vybeNetworkBreakpoint2026White from "../../../assets/companies/vybe-network/breakpoint-2026-white.png";
import vybeNetworkMarkBlack from "../../../assets/companies/vybe-network/mark-black.png";
import vybeNetworkMarkBlackJpg from "../../../assets/companies/vybe-network/mark-black.jpg";
import vybeNetworkMarkWhite from "../../../assets/companies/vybe-network/mark-white.png";
import vybeNetworkMarkWhiteOutline from "../../../assets/companies/vybe-network/mark-white-outline.jpg";

export const vybeNetwork = {
  id: "vybe-network",
  slug: "vybe-network",
  name: "Vybe Network",
  profile: {
    tagline: "Solana intelligence for builders and analysts.",
    summary: "Don't trade on vibes. Trade on Vybe.",
    description: "Don't trade on vibes. Trade on Vybe.",
    sector: "Developer Tools",
    type: "Platform",
    links: {
      website: "https://www.vybenetwork.com/",
    },
    socials: {
      x: "https://x.com/Vybe_Network",
      telegram: "https://t.me/VybeNetwork_Official",
    },
  },
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: vybeNetworkBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "mark-black",
      fileName: "mark-black.png",
      format: "png",
      source: vybeNetworkMarkBlack,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-black-jpg",
      fileName: "mark-black.jpg",
      format: "jpg",
      source: vybeNetworkMarkBlackJpg,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-white",
      fileName: "mark-white.png",
      format: "png",
      source: vybeNetworkMarkWhite,
      theme: "dark",
      kind: "mark",
      treatment: "monotone",
    },
    {
      id: "mark-white-outline",
      fileName: "mark-white-outline.jpg",
      format: "jpg",
      source: vybeNetworkMarkWhiteOutline,
      theme: "dark",
      kind: "mark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
