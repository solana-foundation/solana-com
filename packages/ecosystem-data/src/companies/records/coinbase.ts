import type { CompanyRecord } from "../../types";
import coinbaseLogo from "../../../assets/companies/coinbase/logo.svg";

export const coinbase = {
  id: "coinbase",
  slug: "coinbase",
  name: "Coinbase",
  profile: {
    tagline: "Increase economic freedom in the world",
    summary:
      "Coinbase is a publicly traded cryptocurrency exchange that provides a platform for buying, selling, storing, and managing digital assets including Solana and SPL tokens.",
    description:
      "Coinbase is one of the largest regulated cryptocurrency exchanges, offering trading, custody, and staking services for a wide range of digital assets. The platform provides full Solana ecosystem support including native DEX trading via Jupiter integration, cbBTC on Solana, and Coinbase Wallet compatibility with SPL tokens and Solana dApps. The company is publicly traded on NASDAQ under ticker COIN.",
    sector: "Exchange",
    type: "Company",
    links: {
      website: "https://www.coinbase.com",
    },
    socials: {
      x: "https://x.com/coinbase",
      linkedin: "https://www.linkedin.com/company/coinbase",
      github: "https://github.com/coinbase",
    },
  },
  defaultLogoId: "logo",
  logos: [
    {
      id: "logo",
      fileName: "logo.svg",
      format: "svg",
      source: coinbaseLogo,
    },
  ],
} satisfies CompanyRecord;
