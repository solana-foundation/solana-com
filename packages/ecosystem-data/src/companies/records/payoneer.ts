import type { CompanyRecord } from "../../types";
import payoneerBreakpoint2026White from "../../../assets/companies/payoneer/breakpoint-2026-white.png";

export const payoneer = {
  id: "payoneer",
  slug: "payoneer",
  name: "Payoneer",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: payoneerBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
