import type { CompanyRecord } from "../../types";
import bitgetWalletBreakpoint2026White from "../../../assets/companies/bitget-wallet/breakpoint-2026-white.svg";
import bitgetWalletLogoColor from "../../../assets/companies/bitget-wallet/logo-color.svg";
import bitgetWalletLogoDark from "../../../assets/companies/bitget-wallet/logo-dark.svg";
import bitgetWalletLogoLight from "../../../assets/companies/bitget-wallet/logo-light.svg";
import bitgetWalletMarkColor from "../../../assets/companies/bitget-wallet/mark-color.svg";
import bitgetWalletMarkDark from "../../../assets/companies/bitget-wallet/mark-dark.svg";
import bitgetWalletMarkLight from "../../../assets/companies/bitget-wallet/mark-light.svg";

export const bitgetWallet = {
  id: "bitget-wallet",
  slug: "bitget-wallet",
  name: "Bitget Wallet",
  profile: {
    tagline: "A self-custodial wallet for digital assets.",
    summary:
      "Bitget Wallet lets users hold assets, swap tokens, and connect to applications across multiple blockchains, including Solana.",
    description:
      "Bitget Wallet is a self-custodial wallet available on mobile and as a browser extension. It supports SOL and Solana tokens alongside assets on other networks, with wallet based access to swaps and decentralized applications.",
    sector: "Wallet",
    type: "Platform",
    links: {
      website: "https://web3.bitget.com/wallet",
    },
    socials: {
      x: "https://x.com/BitgetWallet",
      telegram: "https://t.me/Bitget_Wallet_Announcement",
    },
  },
  defaultLogoId: "logo-color",
  logos: [
    {
      id: "breakpoint-2026-white",
      fileName: "breakpoint-2026-white.svg",
      format: "svg",
      source: bitgetWalletBreakpoint2026White,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-color",
      fileName: "logo-color.svg",
      format: "svg",
      source: bitgetWalletLogoColor,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.svg",
      format: "svg",
      source: bitgetWalletLogoDark,
      theme: "light",
      kind: "logo",
    },
    {
      id: "logo-light",
      fileName: "logo-light.svg",
      format: "svg",
      source: bitgetWalletLogoLight,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "mark-color",
      fileName: "mark-color.svg",
      format: "svg",
      source: bitgetWalletMarkColor,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-dark",
      fileName: "mark-dark.svg",
      format: "svg",
      source: bitgetWalletMarkDark,
      theme: "light",
      kind: "mark",
    },
    {
      id: "mark-light",
      fileName: "mark-light.svg",
      format: "svg",
      source: bitgetWalletMarkLight,
      theme: "dark",
      kind: "mark",
    },
  ],
} satisfies CompanyRecord;
