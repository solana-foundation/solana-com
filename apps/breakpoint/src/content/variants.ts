/**
 * Audience variants for the Breakpoint home page.
 *
 * Paid campaigns land on `/breakpoint?v=<slug>` and the page swaps its
 * messaging layer (hero, narrative, stats, tickets closing line) to match the
 * ad the visitor clicked. A missing or unknown `v` renders the default page,
 * so a bad link can never 404 or show a broken variant. The swap happens
 * client-side after hydration so the page stays fully static — see
 * `useVariant` in `src/lib/use-variant.ts`.
 */

export const VARIANT_PARAM = "v";
export const VARIANT_FALLBACK_PARAM = "utm_content";

export type VariantStat = {
  value: string;
  suffix: string;
  label: string;
};

export type VariantConfig = {
  slug: string;
  /** Hero headline; `\n` forces a line break like the default headline. */
  heroHeadline: string;
  heroCtaLabel: string;
  /** Ad-continuity positioning statement, rendered as the narrative eyebrow. */
  positioningStatement: string;
  /** Narrative body paragraphs, revealed in order. */
  narrativeParagraphs: string[];
  stats: VariantStat[];
  /** Closing conversion line, rendered as the tickets section headline. */
  ticketsHeadline: string;
};

const developers: VariantConfig = {
  slug: "developers",
  heroHeadline: "Building at the\nSpeed of Solana",
  heroCtaLabel: "Get tickets",
  positioningStatement:
    "Firedancer is live. Alpenglow is coming. Meet the engineers shipping the fastest chain in production — and build what comes next.",
  narrativeParagraphs: [
    "At Breakpoint 2025 in Abu Dhabi, the headline was Firedancer — the promise of a faster, more resilient network that no longer ran on a single piece of software.",
    "That promise has been kept. Firedancer, which demonstrated over 1 million transactions per second in controlled testing, reached Solana mainnet. The Alpenglow consensus upgrade is bringing finality down from roughly 12.8 seconds toward about 150 milliseconds — close to a 100x improvement.",
    "These upgrades unlock use cases that weren't possible before: latency-sensitive apps, high-frequency DeFi, payments, real-time games. And the progress is measurable — Solana processed more than 10 billion transactions in the first quarter of 2026 alone.",
    "At Breakpoint 2026 in London, hear directly from the engineers and founders building all of it — core protocol, infra, payment rails, and the next wave of onchain apps.",
  ],
  stats: [
    { value: "1M", suffix: "+", label: "TPS demonstrated by Firedancer" },
    {
      value: "150",
      suffix: "ms",
      label: "Finality with Alpenglow — close to a 100x improvement",
    },
    { value: "10B", suffix: "+", label: "Transactions processed in Q1 2026" },
  ],
  ticketsHeadline:
    "Claim your ticket and help write the next chapter of what's possible onchain.",
};

const ai: VariantConfig = {
  slug: "ai",
  heroHeadline: "Home Base for the\nAgentic Economy",
  heroCtaLabel: "Get tickets",
  positioningStatement:
    "AI agents already make millions of payments on Solana. Meet the people building the infrastructure of the agentic internet.",
  narrativeParagraphs: [
    "Autonomous AI agents transact in fractions of a cent — paying for an API call, a data query, a few seconds of compute. Those economics simply don't work on higher-fee chains, which is why Solana has quietly become home base for the agentic economy.",
    "The network has already processed 15 million payments initiated by agents, and roughly 65% of agentic payments settling through the x402 standard now run on Solana. x402 is an open payment standard stewarded by the Linux Foundation, with backing from Google, Stripe, Visa, and Mastercard. Through gateways like Pay.sh, an agent can fund a wallet in about a minute and pay per request for Google Cloud services like Gemini and Vertex AI alongside 50-plus other APIs — no accounts, no subscriptions.",
    "At Breakpoint 2026 in London, the people building this stack will be on stage and in the halls — agent frameworks, payment rails, and the companies wiring AI to money. Hear what they shipped, what's next, and where the opportunities are.",
  ],
  stats: [
    {
      value: "15M",
      suffix: "",
      label: "Payments initiated by AI agents on Solana",
    },
    {
      value: "65",
      suffix: "%",
      label: "Of x402 agentic payments settle on Solana",
    },
    { value: "50", suffix: "+", label: "APIs payable per-request via Pay.sh" },
  ],
  ticketsHeadline:
    "Be in the room where AI meets money. Get your Breakpoint 2026 ticket.",
};

const finance: VariantConfig = {
  slug: "finance",
  heroHeadline: "Where Global Finance\nComes Onchain",
  heroCtaLabel: "Get tickets",
  positioningStatement:
    "Equities, bonds, and billions in real-world assets now trade on Solana. Meet the institutions and builders making markets onchain.",
  narrativeParagraphs: [
    "At Breakpoint 2025, the conversation about tokenized real-world assets revolved around their promise. The case was simple but powerful: Solana's speed and near-zero transaction costs make it a natural home for global finance.",
    "Over the next year, that narrative moved from promise to reality. Equities, bonds, precious metals, and private-company stock were tokenized in record numbers — and found real liquidity onchain.",
    "The value of real-world assets tokenized on Solana climbed past $2 billion in early 2026, up 43% in a single quarter. More wallets hold tokenized RWAs on Solana than on any other blockchain, and tokenized equities like Tesla and NVIDIA trade with instant settlement — Solana has captured roughly 97% of all onchain tokenized-equity spot volume.",
    "At Breakpoint 2026 in London — a global capital of finance — hear directly from the institutions and founders driving this shift: the progress made, and where the story goes next.",
  ],
  stats: [
    {
      value: "$2B",
      suffix: "+",
      label: "In real-world assets tokenized on Solana",
    },
    { value: "43", suffix: "%", label: "RWA growth in a single quarter" },
    {
      value: "97",
      suffix: "%",
      label: "Of onchain tokenized-equity spot volume",
    },
    {
      value: "#1",
      suffix: "",
      label: "Chain by wallets holding tokenized RWAs",
    },
  ],
  ticketsHeadline:
    "Buy your ticket and be in the room where the next chapter of onchain finance is written.",
};

const collectibles: VariantConfig = {
  slug: "collectibles",
  heroHeadline: "Every Asset,\nOnchain",
  heroCtaLabel: "Get tickets",
  positioningStatement:
    "From Pokémon cards to dinosaur bones, collectors are trading real-world assets on Solana with instant liquidity and global reach.",
  narrativeParagraphs: [
    "From SpaceX stock to Pokémon cards, Solana has emerged as the best network to trade every asset. Global access, instant liquidity, and fast, near-free execution have enabled novel ways to invest, collect, and trade for millions of users.",
    "The value of real-world assets tokenized on Solana climbed past $2 billion in early 2026, up 43% in a single quarter — and today, more wallets hold tokenized RWAs on Solana than on any other blockchain. Precious metals, luxury goods, sports and gaming collectibles, even dinosaur bones: if it can be collected, it's coming onchain.",
    "At Breakpoint 2026, the companies and people powering this trend will be in the room. Hear how blockchain is transforming legacy assets — directly from the people driving the transformation.",
  ],
  stats: [
    {
      value: "$2B",
      suffix: "+",
      label: "In real-world assets tokenized on Solana",
    },
    { value: "43", suffix: "%", label: "RWA growth in a single quarter" },
    {
      value: "#1",
      suffix: "",
      label: "Chain by wallets holding tokenized RWAs",
    },
  ],
  ticketsHeadline:
    "Get your ticket and meet the people bringing every asset onchain.",
};

export const VARIANTS: Record<string, VariantConfig> = {
  developers,
  ai,
  finance,
  collectibles,
};

export function resolveVariant(
  value: string | null | undefined,
): VariantConfig | null {
  if (!value) return null;
  return VARIANTS[value.toLowerCase()] ?? null;
}

/**
 * `?v=` is the canonical variant key; an exact-slug `utm_content` works as a
 * fallback so a link tagged only with UTMs still personalizes. Creative-level
 * values like `utm_content=finance-video-b` don't match and fall back to the
 * default page.
 */
export function resolveVariantFromParams(
  params: URLSearchParams,
): VariantConfig | null {
  return (
    resolveVariant(params.get(VARIANT_PARAM)) ??
    resolveVariant(params.get(VARIANT_FALLBACK_PARAM))
  );
}
