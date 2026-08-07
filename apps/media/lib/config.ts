import faviconPng from "@solana-com/ui-chrome/assets/favicon.png";
import {
  DEFAULT_SOCIAL_IMAGE,
  DEFAULT_SOCIAL_IMAGE_URL,
} from "@solana-com/ui-chrome/social-image";
import { getLocalAppUrl } from "@workspace/app-topology";

export const config = {
  siteMetadata: {
    title: `Solana Media`,
    tagline: `News, changelogs, research, upgrades, and podcasts from Solana`,
    description: `Official Solana news, developer changelogs, research reports, network upgrades, and podcasts covering builders, markets, technology, and the ecosystem.`,
    shortDescription: `Official news, research, network updates, and podcasts from across the Solana ecosystem.`,
    socialShare: DEFAULT_SOCIAL_IMAGE_URL,
    author: `Solana Foundation`,
    keywords: [
      "Solana",
      "blockchain",
      "cryptocurrency",
      "DeFi",
      "NFTs",
      "Web3",
      "podcasts",
      "crypto news",
      "Solana ecosystem",
      "blockchain technology",
    ],
    googleAnalytics: {
      trackingId: `G-94WS0LRZRS`,
      adWordsId: `AW-302884864`,
    },
    googleTagManagerID: "GTM-TNX63HZ",
  },

  siteUrl:
    process.env.NODE_ENV === `development`
      ? getLocalAppUrl("media")
      : (process.env.VERCEL_ENV != "production" && !!process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : `https://media.solana.com`) || `https://media.solana.com`,

  /** Public-facing base URL for canonical links, OG tags, and social sharing */
  publicUrl: `https://solana.com`,

  shareImageWidth: DEFAULT_SOCIAL_IMAGE.width,
  shareImageHeight: DEFAULT_SOCIAL_IMAGE.height,
  social: {
    twitter: {
      name: `solana`,
      mapping: {
        title: "title",
        tags: "hashtags",
        name: "via",
      },
    },
  },
  siteIcon: faviconPng.src,
};
