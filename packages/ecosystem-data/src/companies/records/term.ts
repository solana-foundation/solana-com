import type { CompanyRecord } from "../../types";
import termBreakpoint2026White from "../../../assets/companies/term/breakpoint-2026-white.svg";

export const term = {
  id: "term",
  slug: "term",
  name: "Term",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: termBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
