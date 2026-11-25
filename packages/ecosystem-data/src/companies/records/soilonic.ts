import type { CompanyRecord } from "../../types";
import soilonicLogoWhite from "../../../assets/companies/soilonic/logo-white.svg";
import soilonicLogoWhiteOnDark from "../../../assets/companies/soilonic/logo-white-on-dark.svg";
import soilonicBreakpoint2026Logo from "../../../assets/companies/soilonic/breakpoint-2026-logo.png";

export const soilonic = {
  id: "soilonic",
  slug: "soilonic",
  name: "Soilonic",
  profile: {
    tagline: "Regenerative soil, art, and digital ownership.",
    summary:
      "Soilonic brings together regenerative agriculture, digital ownership, and art.",
    description:
      "Soilonic connects soil-focused projects with collectible artworks, design objects, and regenerative materials. Its artist collaborations and exhibitions bring soil regeneration into cultural experiences.",
    sector: "Tokenization",
    type: "Platform",
    links: {
      website: "https://soilonic.com/",
    },
    socials: {
      linkedin: "https://www.linkedin.com/company/soilonic",
    },
  },
  defaultLogoId: "logo-white",
  logos: [
    {
      id: "logo-white",
      fileName: "logo-white.svg",
      format: "svg",
      width: 178.1,
      height: 151.99,
      theme: "dark",
      background: "transparent",
      treatment: "monotone",
      kind: "logo",
      source: soilonicLogoWhite,
    },
    {
      id: "logo-white-on-dark",
      fileName: "logo-white-on-dark.svg",
      format: "svg",
      width: 470.23,
      height: 526.94,
      theme: "dark",
      background: "dark",
      kind: "logo",
      source: soilonicLogoWhiteOnDark,
    },
    {
      id: "breakpoint-2026-white",
      fileName: "logo-white.svg",
      format: "svg",
      width: 178.1,
      height: 151.99,
      theme: "dark",
      background: "transparent",
      treatment: "monotone",
      kind: "logo",
      source: soilonicLogoWhite,
    },
    {
      id: "logo-color",
      fileName: "breakpoint-2026-logo.png",
      format: "png",
      source: soilonicBreakpoint2026Logo,
      theme: "light",
      background: "transparent",
      kind: "logo",
      width: 1693,
      height: 929,
    },
  ],
} satisfies CompanyRecord;
