import type { CompanyRecord } from "../../types";
import stripeLogoLight from "../../../assets/companies/stripe/logo-light.svg";

export const stripe = {
  id: "stripe",
  slug: "stripe",
  name: "Stripe",
  profile: {
    tagline: "Financial infrastructure for the internet",
    summary:
      "Stripe launched its fiat-to-crypto payments onramp with strong Solana ecosystem participation, and processes stablecoin payments on Solana.",
    description:
      "Stripe is a financial infrastructure platform for businesses. The company debuted its fiat-to-crypto payments onramp, with 11 of the 16 initial projects built on Solana. Stripe also supports USDC payments on Solana, enabling businesses to accept and send stablecoin payments with low fees and instant settlement.",
    sector: "Payments",
    type: "Company",
    links: {
      website: "https://stripe.com",
    },
    socials: {
      x: "https://x.com/stripe",
      linkedin: "https://www.linkedin.com/company/stripe",
      github: "https://github.com/stripe",
    },
  },
  defaultLogoId: "logo-light",
  logos: [
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: stripeLogoLight,
      theme: "light",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
