import type { CompanyRecord } from "../../types";
import walletconnectBreakpoint2026White from "../../../assets/companies/walletconnect/breakpoint-2026-white.svg";
import walletconnectLogoDark from "../../../assets/companies/walletconnect/logo-dark.svg";

export const walletconnect = {
  id: "walletconnect",
  slug: "walletconnect",
  name: "WalletConnect",
  profile: {
    tagline: "The wallet UX layer for the decentralized web.",
    summary:
      "WalletConnect provides wallet connectivity, messaging, and identity infrastructure for web3 applications.",
    description:
      "WalletConnect is an open protocol and product ecosystem for connecting wallets to decentralized applications. It provides wallet connection, messaging, and identity infrastructure used by apps and wallets across multiple blockchain ecosystems.",
    sector: "Developer Tools",
    type: "Platform",
    links: {
      website: "https://walletconnect.network/",
    },
    socials: {
      x: "https://x.com/wcthub",
      discord: "https://discord.com/invite/walletconnectnetwork",
      telegram: "https://t.me/walletconnect",
    },
  },
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
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: walletconnectLogoDark,
      theme: "light",
    },
  ],
} satisfies CompanyRecord;
