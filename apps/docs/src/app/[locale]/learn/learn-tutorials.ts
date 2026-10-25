/**
 * Ordered /learn tutorials.
 * The pages themselves are docs pages at /learn/<slug>; titles and
 * descriptions come from learn.tutorials.items.<slug> in the web messages.
 */
export const learnTutorials = [
  { id: 1, slug: "what-is-solana" },
  { id: 2, slug: "what-is-a-wallet" },
  { id: 3, slug: "understanding-solana-transaction-fees" },
  { id: 4, slug: "sending-and-receiving-sol" },
  { id: 5, slug: "what-is-staking" },
  { id: 6, slug: "introduction-to-solana-tokens" },
  { id: 7, slug: "what-are-nfts" },
  { id: 8, slug: "introduction-to-defi-on-solana" },
  { id: 9, slug: "exploring-solana-applications" },
  { id: 10, slug: "staying-safe-on-solana" },
] as const;

export const tutorialOrder = learnTutorials.map((tutorial) => tutorial.slug);

export const LEARN_RESOURCES = [
  { id: "documentation", href: "/developers/docs", external: false },
  { id: "cookbook", href: "/developers/cookbook", external: false },
  { id: "courses", href: "https://learn.blueshift.gg/", external: true },
  { id: "wallets", href: "/wallets", external: false },
] as const;
