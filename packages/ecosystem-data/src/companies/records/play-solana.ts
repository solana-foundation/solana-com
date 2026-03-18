import type { CompanyRecord } from "../../types";
import playSolanaLogo from "../../../assets/companies/play-solana/logo.svg";

export const playSolana = {
  "id": "play-solana",
  "slug": "play-solana",
  "name": "Play Solana",
  "gridProfileSlug": "playsolana",
  "gridProfile": {
    "name": "Play Solana",
    "tagLine": "Your gateway to the Web3 gaming revolution",
    "descriptionShort": "Play Solana is a Web3 gaming ecosystem on Solana that combines a handheld gaming console, a token economy, and a curated game library.",
    "descriptionLong": "Play Solana builds the gaming layer for Solana, uniting hardware, software, and cultural IP within a connected network called the Play Solana SuperHUB. Its flagship product, the PSG1, is the first handheld Web3 gaming device built on Solana, featuring a built-in hardware wallet for managing tokens, NFTs, and rewards. The ecosystem includes a curated gaming library, the $PLAYSOLANA token for staking and in-game economies, and identity NFT collections.",
    "profileSector": {
      "name": "Gaming"
    },
    "profileType": {
      "name": "Company"
    },
    "urls": [
      {
        "url": "https://www.playsolana.com",
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
              "url": "https://x.com/playsolana",
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
              "url": "https://www.linkedin.com/company/play-solana",
              "urlType": {
                "name": "main"
              }
            }
          ]
        },
        {
          "socialType": {
            "name": "Discord"
          },
          "urls": [
            {
              "url": "https://discord.com/invite/playsolanaofficial",
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
              "url": "https://t.me/playsolanaofficial",
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
              "url": "https://github.com/playsolana",
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
      "source": playSolanaLogo
    }
  ]
} satisfies CompanyRecord;
