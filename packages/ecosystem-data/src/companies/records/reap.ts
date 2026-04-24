import type { CompanyRecord } from "../../types";
import reapBreakpoint2026White from "../../../assets/companies/reap/breakpoint-2026-white.svg";

export const reap = {
  id: "reap",
  slug: "reap",
  name: "REAP",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: reapBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
