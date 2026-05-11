import type { CompanyRecord } from "../../types";
import altitudeBreakpoint2026White from "../../../assets/companies/altitude/breakpoint-2026-white.svg";
import altitudeLogoMonotone from "../../../assets/companies/altitude/logo-monotone.svg";

export const altitude = {
  id: "altitude",
  slug: "altitude",
  name: "Altitude",
  profile: {
    tagline: "Banking for companies on the frontier",
    summary:
      "Altitude provides global business accounts, stablecoin and traditional bank payments, yield on balances, and CFO tools for companies operating across crypto and traditional finance.",
    description:
      "Altitude is a financial platform that combines modern operating accounts, integrated payment rails, and treasury management into a single product. It enables businesses to open USD and EUR accounts with local bank details, on- and off-ramp between stablecoins and fiat with zero fees, and earn up to 3.25% APY on qualifying treasury balances. The platform serves crypto companies, startups, agencies, enterprises, and import/export businesses in over 150 countries.",
    sector: "Payments",
    type: "Company",
    links: {
      website: "https://altitude.xyz/",
    },
    socials: {
      x: "https://x.com/altitude",
    },
  },
  defaultLogoId: "logo-monotone",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: altitudeBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-monotone",
      fileName: "logo-monotone.svg",
      format: "svg",
      source: altitudeLogoMonotone,
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
