import type { CompanyRecord } from "../../types";
import safepalWalletLogo from "../../../assets/companies/safepal-wallet/logo.svg";

export const safepalWallet = {
  "id": "safepal-wallet",
  "slug": "safepal-wallet",
  "name": "Safepal wallet",
  "profile": {
    "tagline": "The best wallet to protect your assets",
    "summary": "SafePal is a hardware and software crypto wallet suite supporting Solana and 100+ blockchains, offering air-gapped cold storage and integrated DeFi access.",
    "description": "SafePal is a non-custodial crypto wallet ecosystem backed by Binance and Animoca Brands, serving over 10 million users globally. The company offers hardware wallets (S1 air-gapped and X1 Bluetooth), a mobile app, and a browser extension supporting Solana, Ethereum, Bitcoin, and 100+ other blockchains. SafePal provides native Solana DeFi hub features including buying, swapping, trading, and staking SOL and SPL tokens.",
    "sector": "Wallet",
    "type": "Company",
    "links": {
      "website": "https://www.safepal.com"
    },
    "socials": {
      "x": "https://x.com/iSafePal",
      "linkedin": "https://www.linkedin.com/company/safepal",
      "telegram": "https://t.me/SafePalwallet",
      "github": "https://github.com/SafePalWallet"
    }
  },
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": safepalWalletLogo
    }
  ]
} satisfies CompanyRecord;
