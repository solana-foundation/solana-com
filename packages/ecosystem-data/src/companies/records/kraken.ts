import type { CompanyRecord } from "../../types";
import krakenBreakpoint2026White from "../../../assets/companies/kraken/breakpoint-2026-white.png";

export const kraken = {
  id: "kraken",
  slug: "kraken",
  name: "Kraken",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: krakenBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
