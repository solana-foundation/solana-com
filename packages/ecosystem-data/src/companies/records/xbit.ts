import type { CompanyRecord } from "../../types";
import xbitBreakpoint2026White from "../../../assets/companies/xbit/breakpoint-2026-white.png";

export const xbit = {
  id: "xbit",
  slug: "xbit",
  name: "XBIT",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: xbitBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
