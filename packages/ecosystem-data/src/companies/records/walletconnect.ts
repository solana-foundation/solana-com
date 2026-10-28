import type { CompanyRecord } from "../../types";
import walletconnectBreakpoint2026White from "../../../assets/companies/walletconnect/breakpoint-2026-white.svg";
import walletconnectLogoDark from "../../../assets/companies/walletconnect/logo-dark.svg";

export const walletconnect = {
  id: "walletconnect",
  slug: "walletconnect",
  name: "WalletConnect",
  profile: {
    tagline: "The wallet UX layer for the decentralized web.",
    description:
      "WalletConnect is the digital asset infrastructure powering payments, trading, and compliance at global scale. Founded in 2018, the WalletConnect network connects over 900 million users and thousands of institutions across 700+ wallets, all major blockchains, and powered more than $400 billion in transaction volume in 2025.",
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
