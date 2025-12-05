export const config = {
  siteMetadata: {
    title: `Solana Media`,
    tagline: `News & Podcasts from the Solana Ecosystem`,
    description: `Breaking news, in-depth analysis, and exclusive podcasts from the Solana blockchain ecosystem. Stay informed on DeFi, NFTs, developer updates, and Web3 innovation.`,
    shortDescription: `Breaking news, in-depth analysis, and exclusive podcasts from the Solana blockchain ecosystem.`,
    socialShare: `https://solana.com/social/solana.jpg`,
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
      ? `http://localhost:3001`
      : (process.env.VERCEL_ENV != "production" && !!process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : `https://media.solana.com`) || `https://media.solana.com`,

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
