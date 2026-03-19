import type { CompanyRecord } from "../../types";
import safepalWalletLogo from "../../../assets/companies/safepal-wallet/logo.svg";

export const safepalWallet = {
  "id": "safepal-wallet",
  "slug": "safepal-wallet",
  "name": "Safepal wallet",
  "profile": {
    "name": "SafePal",
    "tagLine": "The best wallet to protect your assets",
    "descriptionShort": "SafePal is a hardware and software crypto wallet suite supporting Solana and 100+ blockchains, offering air-gapped cold storage and integrated DeFi access.",
    "descriptionLong": "SafePal is a non-custodial crypto wallet ecosystem backed by Binance and Animoca Brands, serving over 10 million users globally. The company offers hardware wallets (S1 air-gapped and X1 Bluetooth), a mobile app, and a browser extension supporting Solana, Ethereum, Bitcoin, and 100+ other blockchains. SafePal provides native Solana DeFi hub features including buying, swapping, trading, and staking SOL and SPL tokens.",
    "profileSector": {
      "name": "Wallet"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.safepal.com",
        "urlType": {
          "name": "website"
        }
      }
    ],
    "root": {
      "socials": [
        {
          "socialType": {
            "name": "Twitter / X"
          },
          "urls": [
            {
              "url": "https://x.com/iSafePal",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "LinkedIn"
          },
          "urls": [
            {
              "url": "https://www.linkedin.com/company/safepal",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Telegram"
          },
          "urls": [
            {
              "url": "https://t.me/SafePalwallet",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "GitHub"
          },
          "urls": [
            {
              "url": "https://github.com/SafePalWallet",
              "urlType": {
                "name": "main"
              }
            }
          ]
        }
      ]
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
