import type { CompanyRecord } from "../../types";
import solflareLogo from "../../../assets/companies/solflare/logo.svg";
import solflareMark from "../../../assets/companies/solflare/mark.svg";
import solflareWordmarkDark from "../../../assets/companies/solflare/wordmark-dark.svg";

export const solflare = {
  "id": "solflare",
  "slug": "solflare",
  "name": "Solflare",
  "profile": {
    "tagline": "The Solana Wallet",
    "summary": "Solflare is a self-custody wallet for the Solana ecosystem, enabling users to buy, store, stake, swap tokens, and manage NFTs across web, browser extension, and mobile platforms.",
    "description": "Solflare is a non-custodial wallet built for Solana, available as a web wallet, Chrome extension, and mobile app on iOS and Android. It supports buying, storing, staking, and swapping tokens as well as managing NFTs. Solflare integrates with hardware wallets like Ledger and Keystone for offline key management and features a built-in privacy layer with Private Send functionality.",
    "sector": "Wallet",
    "type": "Platform",
    "links": {
      "website": "https://www.solflare.com/"
    },
    "socials": {
      "x": "https://x.com/solflare_wallet",
      "linkedin": "https://www.linkedin.com/company/solflare-official",
      "discord": "https://discord.com/invite/solflare",
      "github": "https://github.com/solflare-wallet"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": solflareLogo
    },
    {
      "id": "mark",
      "fileName": "mark.svg",
      "format": "svg",
      "source": solflareMark,
      "kind": "mark"
    },
    {
      "id": "wordmark-dark",
      "fileName": "wordmark-dark.svg",
      "format": "svg",
      "source": solflareWordmarkDark,
      "kind": "wordmark",
      "theme": "light"
    }
  ]
} satisfies CompanyRecord;
