import type { CompanyRecord } from "../../types";
import yalaBreakpoint2026White from "../../../assets/companies/yala/breakpoint-2026-white.png";

export const yala = {
  id: "yala",
  slug: "yala",
  name: "Yala",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: yalaBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
