import type { CompanyRecord } from "../../types";
import zanBreakpoint2026White from "../../../assets/companies/zan/breakpoint-2026-white.png";

export const zan = {
  id: "zan",
  slug: "zan",
  name: "ZAN",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: zanBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
