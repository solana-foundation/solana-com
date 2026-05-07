import type { CompanyRecord } from "../../types";
import drpcBreakpoint2026White from "../../../assets/companies/drpc/breakpoint-2026-white.svg";

export const drpc = {
  id: "drpc",
  slug: "drpc",
  name: "dRPC",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: drpcBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
