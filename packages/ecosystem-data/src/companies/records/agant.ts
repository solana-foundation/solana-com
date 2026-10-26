import type { CompanyRecord } from "../../types";
import agantBreakpoint2026White from "../../../assets/companies/agant/breakpoint-2026-white.svg";

export const agant = {
  id: "agant",
  slug: "agant",
  name: "Agant",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: agantBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
