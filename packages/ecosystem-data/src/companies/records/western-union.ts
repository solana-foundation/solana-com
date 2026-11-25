import type { CompanyRecord } from "../../types";
import westernUnionLogoColor from "../../../assets/companies/western-union/logo-color.svg";
import westernUnionBreakpoint2026White from "../../../assets/companies/western-union/breakpoint-2026-white.svg";

export const westernUnion = {
  id: "western-union",
  slug: "western-union",
  name: "Western Union",
  profile: {
    tagline: "Cross-border money movement and payments.",
    summary:
      "Western Union provides international money transfer and payment services through digital channels and a global retail network.",
    description:
      "Western Union connects senders and recipients across countries and currencies. Customers can initiate transfers online or through agent locations, with payout options that include bank accounts, wallets, and cash pickup where available.",
    sector: "Payments",
    type: "Company",
    links: { website: "https://www.westernunion.com/" },
    socials: {
      x: "https://x.com/WesternUnion",
    },
  },
  defaultLogoId: "logo-color",
  logos: [
    {
      id: "logo-color",
      fileName: "logo-color.svg",
      format: "svg",
      source: westernUnionLogoColor,
      kind: "logo",
    },
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: westernUnionBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
