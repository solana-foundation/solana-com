import faviconPng from "@solana-com/ui-chrome/assets/favicon.png";
import {
  DEFAULT_SOCIAL_IMAGE,
  DEFAULT_SOCIAL_IMAGE_URL,
} from "@solana-com/ui-chrome/social-image";

const PUBLIC_SITE_URL = "https://solana.com";

export const config = {
  siteMetadata: {
    title: `Solana`,
    description: `Fast. Decentralized. Scalable. Energy efficient. Solana can power thousands of transactions per second.`,
    socialShare: DEFAULT_SOCIAL_IMAGE_URL,
    author: `@solana`,
    googleAnalytics: {
      trackingId: `G-94WS0LRZRS`,
      adWordsId: `AW-302884864`,
    },
    googleTagManagerID: "GTM-TNX63HZ",
  },

  siteUrl:
    process.env.NODE_ENV === `development`
      ? `http://localhost:3000`
      : (process.env.VERCEL_ENV != "production" && !!process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : PUBLIC_SITE_URL) || PUBLIC_SITE_URL,

  publicUrl: PUBLIC_SITE_URL,

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
