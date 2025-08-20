export const config = {
  siteMetadata: {
    title: `Solana`,
    description: `Fast. Decentralized. Scalable. Energy efficient. Solana can power thousands of transactions per second.`,
    socialShare: `https://solana.com/social/solana.jpg`,
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
          : `https://solana.com`) || `https://solana.com`,

  shareImageWidth: 1000,
  shareImageHeight: 523,
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
  siteIcon: `https://solana.com/favicon.png`,
};
