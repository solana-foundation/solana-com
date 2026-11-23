import type { CompanyRecord } from "../../types";
import agridexBreakpoint2026White from "../../../assets/companies/agridex/breakpoint-2026-white.svg";
import agridexLoamLogoDark from "../../../assets/companies/agridex/loam-logo-dark.svg";
import agridexLoamLogoLight from "../../../assets/companies/agridex/loam-logo-light.svg";

export const agridex = {
  id: "agridex",
  slug: "agridex",
  name: "Agridex",
  profile: {
    tagline: "A digital marketplace for agricultural trade.",
    summary:
      "Agridex connects agricultural producers and international buyers through a digital marketplace.",
    description:
      "Agridex provides a marketplace for agricultural trade and cross border settlement. Its Loam payments product is the brand used for its Breakpoint 2026 kiosk.",
    sector: "Payments",
    type: "Platform",
    links: {
      website: "https://agridex.com/",
    },
    socials: {
      linkedin: "https://www.linkedin.com/company/agridexplatform/",
    },
  },
  defaultLogoId: "loam-logo-dark",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: agridexBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "loam-logo-dark",
      fileName: "loam-logo-dark.svg",
      format: "svg",
      source: agridexLoamLogoDark,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "loam-logo-light",
      fileName: "loam-logo-light.svg",
      format: "svg",
      source: agridexLoamLogoLight,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
