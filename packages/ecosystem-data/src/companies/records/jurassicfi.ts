import type { CompanyRecord } from "../../types";
import jurassicfiBreakpoint2026White from "../../../assets/companies/jurassicfi/breakpoint-2026-white.png";

export const jurassicfi = {
  id: "jurassicfi",
  slug: "jurassicfi",
  name: "JurassicFi",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: jurassicfiBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
