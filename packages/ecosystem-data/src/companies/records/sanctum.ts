import type { CompanyRecord } from "../../types";
import sanctumBreakpoint2026White from "../../../assets/companies/sanctum/breakpoint-2026-white.svg";

export const sanctum = {
  id: "sanctum",
  slug: "sanctum",
  name: "Sanctum",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: sanctumBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
