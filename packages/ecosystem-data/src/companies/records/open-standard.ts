import type { CompanyRecord } from "../../types";
import openStandardLogo from "../../../assets/companies/open-standard/open-standard-logo.svg";
import openStandardWordmark from "../../../assets/companies/open-standard/open-standard-wordmark.svg";
import openStandardSymbol from "../../../assets/companies/open-standard/open-standard-symbol.svg";
import openUsdLogo from "../../../assets/companies/open-standard/open-usd-logo.svg";
import ousdSymbol from "../../../assets/companies/open-standard/ousd-symbol.svg";
import openStandardBreakpoint2026White from "../../../assets/companies/open-standard/breakpoint-2026-white.png";

export const openStandard = {
  id: "open-standard",
  slug: "open-standard",
  name: "Open Standard",
  profile: {
    tagline: "Stablecoin infrastructure for global payments.",
    summary:
      "Open Standard operates Open USD (OUSD), a stablecoin for businesses moving money globally.",
    description:
      "Open Standard provides Open USD as a shared transactional asset for businesses. Its model combines partner governance with reserve revenue sharing for companies that distribute and use OUSD. Businesses can access integration support and tools for payments and settlement.",
    sector: "Payments",
    type: "Company",
    links: { website: "https://joinopenstandard.com/" },
    socials: {
      x: "https://x.com/openstandard",
      linkedin: "https://www.linkedin.com/company/openstandard",
    },
  },
  defaultLogoId: "open-standard-logo",
  logos: [
    {
      id: "open-standard-logo",
      fileName: "open-standard-logo.svg",
      format: "svg",
      source: openStandardLogo,
      kind: "logo",
    },
    {
      id: "open-standard-wordmark",
      fileName: "open-standard-wordmark.svg",
      format: "svg",
      source: openStandardWordmark,
      kind: "wordmark",
    },
    {
      id: "open-standard-symbol",
      fileName: "open-standard-symbol.svg",
      format: "svg",
      source: openStandardSymbol,
      kind: "mark",
    },
    {
      id: "open-usd-logo",
      fileName: "open-usd-logo.svg",
      format: "svg",
      source: openUsdLogo,
      kind: "logo",
    },
    {
      id: "ousd-symbol",
      fileName: "ousd-symbol.svg",
      format: "svg",
      source: ousdSymbol,
      kind: "mark",
    },
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: openStandardBreakpoint2026White,
      kind: "logo",
      theme: "dark",
      treatment: "monotone",
      background: "transparent",
      width: 1115,
      height: 150,
    },
  ],
} satisfies CompanyRecord;
