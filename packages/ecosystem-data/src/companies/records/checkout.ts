import type { CompanyRecord } from "../../types";
import checkoutBreakpoint2026White from "../../../assets/companies/checkout/breakpoint-2026-white.svg";

export const checkout = {
  id: "checkout",
  slug: "checkout",
  name: "Checkout.com",
  profile: null,
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
