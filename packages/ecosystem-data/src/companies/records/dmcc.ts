import type { CompanyRecord } from "../../types";
import dmccBreakpoint2026White from "../../../assets/companies/dmcc/breakpoint-2026-white.svg";

export const dmcc = {
  id: "dmcc",
  slug: "dmcc",
  name: "DMCC",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: dmccBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
