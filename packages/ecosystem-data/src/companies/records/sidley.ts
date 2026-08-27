import type { CompanyRecord } from "../../types";
import sidleyBreakpoint2026White from "../../../assets/companies/sidley/breakpoint-2026-white.png";
import sidleyLogoSlateBlue from "../../../assets/companies/sidley/logo-slate-blue.png";

export const sidley = {
  id: "sidley",
  slug: "sidley",
  name: "Sidley",
  legalName: "Sidley Austin LLP",
  profile: {
    tagline: "Global law firm",
    summary:
      "Sidley is a global law firm advising clients on transactional, regulatory, litigation, and industry matters, including banking, payments, fintech, blockchain, and technology.",
    description:
      "Sidley Austin LLP is a global law firm with more than 2,300 lawyers across major commercial, financial, and regulatory centers. The firm advises clients on complex transactions, regulatory issues, disputes, and investigations across sectors that include banking, payments and fintech, blockchain, and technology.",
    sector: "Policy",
    type: "Company",
    links: {
      website: "https://www.sidley.com/en",
    },
    socials: {
      x: "https://x.com/SidleyLaw",
      linkedin: "https://www.linkedin.com/company/sidley-austin-llp",
    },
  },
  defaultLogoId: "logo-slate-blue",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: sidleyBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo-slate-blue",
      fileName: "logo-slate-blue.png",
      format: "png",
      source: sidleyLogoSlateBlue,
      theme: "light",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
