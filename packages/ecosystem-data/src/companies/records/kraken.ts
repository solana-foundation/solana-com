import type { CompanyRecord } from "../../types";
import krakenBreakpoint2026White from "../../../assets/companies/kraken/breakpoint-2026-white.png";

export const kraken = {
  id: "kraken",
  slug: "kraken",
  name: "Kraken",
  profile: {
    tagline: "Digital asset trading and exchange services.",
    summary:
      "Kraken is a cryptocurrency exchange that matches orders from clients buying and selling digital assets.",
    description:
      "Kraken provides spot markets for digital assets and services for individual and institutional clients. Its exchange matches buy and sell orders, with product availability varying by jurisdiction.",
    sector: "Exchange",
    type: "Company",
    links: { website: "https://www.kraken.com/" },
    socials: {
      x: "https://x.com/krakenfx",
      linkedin: "https://www.linkedin.com/company/krakenfx",
    },
  },
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: krakenBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
