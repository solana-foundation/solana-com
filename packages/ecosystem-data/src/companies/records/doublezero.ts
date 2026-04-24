import type { CompanyRecord } from "../../types";
import doublezeroBreakpoint2026White from "../../../assets/companies/doublezero/breakpoint-2026-white.svg";
import doublezeroLogo from "../../../assets/companies/doublezero/logo.svg";

export const doublezero = {
  id: "doublezero",
  slug: "doublezero",
  name: "DoubleZero",
  profile: {
    tagline: "The High-Performance Global Network",
    summary:
      "DoubleZero is a decentralized fiber network providing low-latency connectivity for distributed systems like blockchain networks.",
    description:
      "DoubleZero Foundation operates a global fiber network designed to deliver high-performance networking infrastructure to blockchains and systems requiring millisecond-level responsiveness. The protocol enables validators to connect to dedicated network links while introducing revenue opportunities through real-time data distribution services.",
    sector: "Infrastructure",
    type: "Company",
    links: {
      website: "https://www.doublezero.xyz/",
    },
    socials: {
      x: "https://x.com/DoubleZeroXYZ",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: doublezeroBreakpoint2026White,
      theme: "dark",
      treatment: "monotone",
    },
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: doublezeroLogo,
    },
  ],
} satisfies CompanyRecord;
