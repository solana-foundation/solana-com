import type { CompanyRecord } from "../../types";
import stablecardLogoColorDark from "../../../assets/companies/stablecard/logo-color-dark.svg";
import stablecardLogoDark from "../../../assets/companies/stablecard/logo-dark.svg";

export const stablecard = {
  id: "stablecard",
  slug: "stablecard",
  name: "Stablecard by Western Union",
  profile: {
    tagline: "Spend and withdraw against USDPT held in a digital wallet.",
    summary:
      "Stablecard by Western Union is a Visa card and mobile wallet that lets eligible customers spend and withdraw against USDPT, a Solana-based dollar token.",
    description:
      "Stablecard lets customers hold USDPT in a mobile wallet and use it as collateral for card purchases and cash withdrawals. Western Union offers the product in partnership with Rain, which issues and manages the card program.",
    sector: "Payments",
    type: "Platform",
    links: {
      website:
        "https://www.westernunion.com/global/en/digital-assets-stablecard.html",
    },
    socials: {
      x: "https://x.com/WesternUnion",
    },
  },
  defaultLogoId: "logo-color-dark",
  logos: [
    {
      id: "logo-color-dark",
      fileName: "logo-color-dark.svg",
      format: "svg",
      source: stablecardLogoColorDark,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: stablecardLogoDark,
      theme: "light",
      kind: "logo",
      background: "light",
    },
  ],
} satisfies CompanyRecord;
