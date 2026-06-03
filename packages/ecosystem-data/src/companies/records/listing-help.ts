import type { CompanyRecord } from "../../types";
import listingHelpBreakpoint2026White from "../../../assets/companies/listing-help/breakpoint-2026-white.svg";

export const listingHelp = {
  id: "listing-help",
  slug: "listing-help",
  name: "Listing.Help",
  profile: null,
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: listingHelpBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
  ],
} satisfies CompanyRecord;
