import type { CompanyRecord } from "../../types";
import zelleBreakpoint2026White from "../../../assets/companies/zelle/breakpoint-2026-white.png";

export const zelle = {
  id: "zelle",
  slug: "zelle",
  name: "Zelle",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: zelleBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
