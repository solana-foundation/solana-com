import type { CompanyRecord } from "../../types";
import checkoutBreakpoint2026White from "../../../assets/companies/checkout/breakpoint-2026-white.svg";

export const checkout = {
  id: "checkout",
  slug: "checkout",
  name: "Checkout.com",
  profile: {
    tagline: "Payment processing for digital businesses.",
    summary:
      "Checkout.com provides a global payments platform with gateway, acquiring, processing, and fraud prevention services.",
    description:
      "Checkout.com helps businesses accept online payments through cards and local payment methods. Its platform combines payment processing, acquiring, and fraud prevention tools across multiple currencies.",
    sector: "Payments",
    type: "Company",
    links: { website: "https://www.checkout.com/" },
    socials: {
      x: "https://x.com/checkout",
      linkedin: "https://www.linkedin.com/company/checkout",
    },
  },
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: checkoutBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
