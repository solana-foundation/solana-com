import type { CompanyRecord } from "../../types";
import krakenLogoLight from "../../../assets/companies/kraken/logo-light.png";
import krakenLogoDark from "../../../assets/companies/kraken/logo-dark.png";
import krakenLogoColor from "../../../assets/companies/kraken/logo-color.png";
import krakenLogoColorDark from "../../../assets/companies/kraken/logo-color-dark.png";
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
  defaultLogoId: "logo-color",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.png",
      format: "png",
      source: krakenLogoLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.png",
      format: "png",
      source: krakenLogoDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-color",
      fileName: "logo-color.png",
      format: "png",
      source: krakenLogoColor,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-color-dark",
      fileName: "logo-color-dark.png",
      format: "png",
      source: krakenLogoColorDark,
      theme: "dark",
      kind: "logo",
    },
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
