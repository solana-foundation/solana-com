import type { CompanyRecord } from "../../types";
import ryderBreakpoint2026White from "../../../assets/companies/ryder/breakpoint-2026-white.svg";

export const ryder = {
  id: "ryder",
  slug: "ryder",
  name: "Ryder",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: ryderBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
