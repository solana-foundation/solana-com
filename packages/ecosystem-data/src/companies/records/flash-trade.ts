import type { CompanyRecord } from "../../types";
import flashTradeBreakpoint2026White from "../../../assets/companies/flash-trade/breakpoint-2026-white.svg";

export const flashTrade = {
  id: "flash-trade",
  slug: "flash-trade",
  name: "Flash Trade",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: flashTradeBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
