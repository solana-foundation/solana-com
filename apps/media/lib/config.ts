import faviconPng from "@solana-com/ui-chrome/assets/favicon.png";
import {
  DEFAULT_SOCIAL_IMAGE,
  DEFAULT_SOCIAL_IMAGE_URL,
} from "@solana-com/ui-chrome/social-image";

export const config = {
  siteMetadata: {
    title: `Solana Media`,
    tagline: `News & Podcasts from the Solana Ecosystem`,
    description: `Breaking news, in-depth analysis, and exclusive podcasts from the Solana blockchain ecosystem. Stay informed on DeFi, NFTs, developer updates, and Web3 innovation.`,
    shortDescription: `Breaking news, in-depth analysis, and exclusive podcasts from the Solana blockchain ecosystem.`,
    socialShare: DEFAULT_SOCIAL_IMAGE_URL,
    author: `@solana`,
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
      ? `http://localhost:3002`
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
