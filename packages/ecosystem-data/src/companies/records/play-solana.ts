import type { CompanyRecord } from "../../types";
import playSolanaWordmark from "../../../assets/companies/play-solana/wordmark.svg";
import playSolanaLogoDark from "../../../assets/companies/play-solana/logo-dark.png";
import playSolanaWordmarkDark from "../../../assets/companies/play-solana/wordmark-dark.png";

export const playSolana = {
  id: "play-solana",
  slug: "play-solana",
  name: "Play Solana",
  profile: {
    tagline: "Your gateway to the Web3 gaming revolution",
    summary:
      "Play Solana is a Web3 gaming ecosystem on Solana that combines a handheld gaming console, a token economy, and a curated game library.",
    description:
      "Play Solana builds the gaming layer for Solana, uniting hardware, software, and cultural IP within a connected network called the Play Solana SuperHUB. Its flagship product, the PSG1, is the first handheld Web3 gaming device built on Solana, featuring a built-in hardware wallet for managing tokens, NFTs, and rewards. The ecosystem includes a curated gaming library, the $PLAYSOLANA token for staking and in-game economies, and identity NFT collections.",
    sector: "Gaming",
    type: "Company",
    links: {
      website: "https://www.playsolana.com",
    },
    socials: {
      x: "https://x.com/playsolana",
      linkedin: "https://www.linkedin.com/company/play-solana",
      discord: "https://discord.com/invite/playsolanaofficial",
      telegram: "https://t.me/playsolanaofficial",
      github: "https://github.com/playsolana",
    },
  },
  defaultLogoId: "logo-dark",
  logos: [
    {
      id: "wordmark",
      fileName: "wordmark.svg",
      format: "svg",
      source: playSolanaWordmark,
      kind: "wordmark",
    },
    {
      id: "logo-dark",
      fileName: "logo-dark.png",
      format: "png",
      source: playSolanaLogoDark,
      theme: "dark",
      kind: "logo",
    },
    {
      id: "wordmark-dark",
      fileName: "wordmark-dark.png",
      format: "png",
      source: playSolanaWordmarkDark,
      theme: "dark",
      kind: "wordmark",
    },
  ],
} satisfies CompanyRecord;
