import type { CompanyRecord } from "../../types";
import zanBreakpoint2026White from "../../../assets/companies/zan/breakpoint-2026-white.png";

export const zan = {
  id: "zan",
  slug: "zan",
  name: "ZAN",
  profile: {
    tagline: "Web3 infrastructure from Ant Digital Technologies.",
    summary:
      "ZAN provides blockchain node APIs, smart contract security tools, and developer services across Solana and other networks.",
    description:
      "ZAN is the Web3 infrastructure platform of Ant Digital Technologies. Its products include shared and dedicated RPC nodes, automated smart contract review, and identity tools for teams building on multiple blockchains.",
    sector: "Infrastructure",
    type: "Platform",
    links: { website: "https://zan.top/", docs: "https://docs.zan.top/" },
    socials: {
      x: "https://x.com/zan_team",
    },
  },
  defaultLogoId: "breakpoint-2026-white",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.png",
      format: "png",
      source: zanBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
  ],
} satisfies CompanyRecord;
