import type { CompanyRecord } from "../../types";
import solpayBreakpoint2026White from "../../../assets/companies/solpay/breakpoint-2026-white.svg";

export const solpay = {
  id: "solpay",
  slug: "solpay",
  name: "SolPay",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: solpayBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
