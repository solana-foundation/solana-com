import type { CompanyRecord } from "../../types";
import walletconnectBreakpoint2026White from "../../../assets/companies/walletconnect/breakpoint-2026-white.svg";

export const walletconnect = {
  id: "walletconnect",
  slug: "walletconnect",
  name: "WalletConnect",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: walletconnectBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
