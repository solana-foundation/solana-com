const getSiteUrl = () => {
  if (process.env.NODE_ENV === `development`) {
    return `http://localhost:3004`;
  }
  if (process.env.VERCEL_ENV !== "production" && !!process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return `https://solana.com/accelerate`;
};

const siteUrl = getSiteUrl();

export const config = {
  siteMetadata: {
    title: `Solana Accelerate APAC - Hong Kong`,
    description: `Join us at Solana Accelerate APAC in Hong Kong on February 11, 2026. Connect with the Solana ecosystem, meet builders, and explore the future of blockchain.`,
    shortDescription: `Solana Accelerate APAC - Hong Kong | February 11, 2026`,
    keywords: [
      "Solana",
      "blockchain",
      "cryptocurrency",
      "web3",
      "Hong Kong",
      "APAC",
      "conference",
      "event",
      "crypto event",
      "blockchain conference",
    ],
    socialShare: `${siteUrl}/images/social-card.webp`,
    author: `@solana`,
  },
  siteUrl,
  social: {
    twitter: {
      name: `solana`,
    },
  },
  siteIcon: `https://solana.com/favicon.png`,
  event: {
    name: "Solana Accelerate APAC",
    location: {
      name: "Hong Kong",
      address: "Hong Kong",
    },
    startDate: "2026-02-11",
    endDate: "2026-02-11",
    description:
      "Join us at Solana Accelerate APAC in Hong Kong on February 11, 2026. Connect with the Solana ecosystem, meet builders, and explore the future of blockchain.",
  },
};
