import type { CompanyRecord } from "../../types";
import westernUnionBreakpoint2026White from "../../../assets/companies/western-union/breakpoint-2026-white.svg";

export const westernUnion = {
  id: "western-union",
  slug: "western-union",
  name: "Western Union",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: westernUnionBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
