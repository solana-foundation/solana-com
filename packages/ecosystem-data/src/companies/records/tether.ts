import type { CompanyRecord } from "../../types";
import tetherBreakpoint2026White from "../../../assets/companies/tether/breakpoint-2026-white.svg";

export const tether = {
  id: "tether",
  slug: "tether",
  name: "Tether",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: tetherBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
