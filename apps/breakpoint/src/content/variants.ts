/**
 * Audience variants for the Breakpoint home page.
 *
 * Paid campaigns land on `/breakpoint?v=<slug>` and the page swaps its
 * messaging layer to match the ad the visitor clicked. A missing or unknown
 * `v` renders the default page, so a bad link can never 404 or show a broken
 * variant. The swap happens client-side after hydration so the page stays
 * fully static — see `useVariant` in `src/lib/use-variant.ts`.
 */

export const VARIANT_PARAM = "v";
export const VARIANT_FALLBACK_PARAM = "utm_content";

export type VariantCarouselItem = {
  id: string;
  title: string;
  url: string;
  tags: string[];
};

export type VariantStat = {
  value: string;
  suffix: string;
  label: string;
};

export type VariantConfig = {
  slug: string;
  /** Hero headline; `\n` forces a line break like the default headline. */
  heroHeadline: string;
  compactHeroHeadline?: boolean;
  heroCtaLabel: string;
  heroCtaHref: string;
  heroOriginalPrice?: string;
  /** Ad-continuity positioning statement, rendered as the narrative eyebrow. */
  positioningStatement: string;
  /** Narrative body paragraphs, revealed in order. */
  narrativeParagraphs: string[];
  carouselItems: VariantCarouselItem[];
  stats: VariantStat[];
  eventsHeadline?: string;
  eventNames?: string[];
  talkUrls: string[];
  /** Closing conversion line, rendered as the tickets section headline. */
  ticketsHeadline: string;
  ticketsSupportingText?: string;
};

const general: VariantConfig = {
  slug: "general",
  heroHeadline: "The Everything Chain",
  heroCtaLabel: "Buy Tickets Today",
  heroCtaHref: "https://luma.com/breakpoint2026",
  positioningStatement:
    "The best tech event you’ll ever experience: Breakpoint is where the people building the next wave of tech and finance come to meet each other.",
  narrativeParagraphs: [
    "Whatever you're working on, the person who can help you take it further will be in this room. Founders looking for a technical co-founder, engineers hunting for their next team, investors writing the checks that turn prototypes into companies, the operators and partners who help you actually ship. Three days, one place, and the shortest path between you and the people who matter for what comes next.",
    "We’ve carefully designed Breakpoint so the conversations you want are the ones you fall into, whether that's over coffee between talks, at a Hacker House late into the night, or across the table during VC speed-dating. You leave with more than notes. You leave with relationships, collaborators, and a few introductions that change your trajectory.",
    "Solana has become the place where AI, fintech, and frontier tech converge, which means the people you'll meet aren't just from your corner of the industry. They're from every corner of what's coming next. It's the rare event where the person beside you might be the key to unlocking the future you’ve always wanted to build.",
    "Breakpoint is coming to London on November 15–17. Buy your tickets today.",
  ],
  carouselItems: [
    {
      id: "general-wsop",
      title: "WSOP",
      url: "https://solana.com/news/world-series-of-poker",
      tags: ["News"],
    },
    {
      id: "general-sports-industry",
      title: "Sports Industry",
      url: "https://solana.com/news/chiliz-sports-industry-on-solana",
      tags: ["News"],
    },
    {
      id: "general-accelerate-usa",
      title: "Accelerate USA",
      url: "https://solana.com/news/accelerate-usa-recap",
      tags: ["News"],
    },
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
  talkUrls: [],
  ticketsHeadline:
    "Breakpoint is coming to London on November 15–17. Buy your tickets today.",
  ticketsSupportingText: "Use code BRAVE20 to save 20%",
};

const developers: VariantConfig = {
  slug: "developers",
  heroHeadline: "Building at the\nSpeed of Solana",
  heroCtaLabel: "Buy Dev Tickets $250",
  heroCtaHref: "https://solanafoundation.typeform.com/bp26-devapp",
  heroOriginalPrice: "$450",
  positioningStatement:
    "Innovators wanted: Breakpoint is the best event for builders looking to be a part of the next wave of innovation in tech and finance.",
  narrativeParagraphs: [
    "Everything is happening on Solana, and this November, the builders driving that innovation are heading to London for Breakpoint.",
    "Whether you’re working on an app, protocol, agent, market, or something entirely new, the people you need to meet will be in this room.",
    "Breakpoint is more than an event, it’s the convergence of the people and technologies creating new possibilities for our future, and this year we’ll have the most robust technical agenda ever. Hacker Houses and Scale or Die kick will set the tone, and even more awaits once the main event kicks off.",
    "Join us November 15–17 to swap notes, find your next collaborator, and see why Google, Mastercard and Paypal are building here. Dev tickets are available now at a special subsidized rate.",
  ],
  carouselItems: [
    {
      id: "developers-pay-sh",
      title: "Pay.SH",
      url: "https://solana.com/news/solana-foundation-launches-pay-sh-in-collaboration-with-google-cloud",
      tags: ["News"],
    },
    {
      id: "developers-sdp",
      title: "SDP",
      url: "https://solana.com/news/solana-developer-platform",
      tags: ["News"],
    },
    {
      id: "developers-robot-ai",
      title: "Robot AI",
      url: "https://solana.com/news/robot-ai",
      tags: ["News"],
    },
    {
      id: "developers-quantum-readiness",
      title: "Quantum Readiness",
      url: "https://solana.com/news/quantum-readiness",
      tags: ["News"],
    },
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
  eventsHeadline: "Join us early to take part in our dev track:",
  eventNames: ["Scale Or Die", "Hacker House"],
  talkUrls: [
    "https://www.youtube.com/watch?v=T9N0Sbk7UqU&list=PLilwLeBwGuK7bjP6jockOC7cIlof9qL1g&index=10",
    "https://www.youtube.com/watch?v=0RRKrabfvZY&list=PLilwLeBwGuK7bjP6jockOC7cIlof9qL1g&index=17",
    "https://www.youtube.com/watch?v=cTFumlE38k0&list=PLilwLeBwGuK5jTCJGnRzD7iu9UlHN_OC_&index=18",
    "https://www.youtube.com/watch?v=ELH2w3xf0Zw&list=PLilwLeBwGuK5jTCJGnRzD7iu9UlHN_OC_&index=27",
    "https://www.youtube.com/watch?v=O0VYopeDMhk&list=PLilwLeBwGuK4dz_gqiiDA3GfS094Yr46b&index=60",
  ],
  ticketsHeadline:
    "Dev tickets are available now at a special subsidized rate.",
};

const finance: VariantConfig = {
  slug: "finance",
  heroHeadline:
    "The Future of Capital Markets, in the birthplace of modern finance.",
  compactHeroHeadline: true,
  heroCtaLabel: "Join us in London",
  heroCtaHref: "https://luma.com/breakpoint2026",
  positioningStatement:
    "Breakpoint is Solana’s flagship yearly event, gathering the leaders, builders and institutions shaping the future of global capital markets.",
  narrativeParagraphs: [
    "For the first time, Breakpoint is coming to London, the birthplace of modern finance. The internet has rewritten the rules of nearly every industry. Finance, insulated by cheap leverage and financial engineering, has long been the exception. That era is over.",
    "We've entered a new supercycle defined by physical capacity: the energy grids, semiconductors, and datacenters powering the AI revolution have created global demand for capitalization at an unprecedented rate.",
    "Legacy markets can't meet that demand, because the real obstacle was never financial, it was technological. Solana is rebuilding the rails of modern finance: an always-on, unified layer for the world's capital, enabling the seamless issuance and trading of real assets.",
    "Breakpoint will gather the sharpest minds in finance, technology, and policy in one room to shape the narratives and build the rails for this transformative moment for global capital. You will want to be in that room.",
  ],
  carouselItems: [
    {
      id: "finance-sdp",
      title: "Solana Foundation Launches Solana Developer Platform",
      url: "https://solana.com/news/solana-developer-platform",
      tags: ["News"],
    },
    {
      id: "finance-institutions",
      title: "Goldman, Citi, Blackrock",
      url: "https://solana.com/news/state-of-solana-february-2026",
      tags: ["News"],
    },
    {
      id: "finance-tokenizing-gold",
      title: "Tokenizing Gold",
      url: "https://solana.com/news/tokenizing-gold-inside-oro-s-vertically-integrated-bet",
      tags: ["News"],
    },
    {
      id: "finance-accelerate-usa",
      title: "Accelerate USA",
      url: "https://solana.com/news/accelerate-usa-recap",
      tags: ["News"],
    },
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
  talkUrls: [
    "https://www.youtube.com/watch?v=zwkvyjwZ1o0&list=PLilwLeBwGuK5jTCJGnRzD7iu9UlHN_OC_&index=7",
    "https://www.youtube.com/watch?v=0_0Dl_vOgYc&list=PLilwLeBwGuK5jTCJGnRzD7iu9UlHN_OC_&index=17",
    "https://www.youtube.com/watch?v=WlJCP9vISMI&list=PLilwLeBwGuK5jTCJGnRzD7iu9UlHN_OC_&index=20",
    "https://www.youtube.com/watch?v=pXXc47BQUvE&list=PLilwLeBwGuK5uLyb-1oD6K1HcKDpKCei1&index=11",
    "https://www.youtube.com/watch?v=sdcu_Glm7EY&list=PLilwLeBwGuK5uLyb-1oD6K1HcKDpKCei1&index=13",
    "https://www.youtube.com/watch?v=f65eS-vrhs4&list=PLilwLeBwGuK5yeFH0YLgETacO-Gz4fjml&index=5",
  ],
  ticketsHeadline: "You will want to be in that room.",
  ticketsSupportingText: "Use code BRAVE20 to save 20%",
};

export const VARIANTS: Record<string, VariantConfig> = {
  general,
  developers,
  finance,
};

export function resolveVariant(
  value: string | null | undefined,
): VariantConfig | null {
  if (!value) return null;
  const key = value.toLowerCase();
  if (!Object.hasOwn(VARIANTS, key)) return null;
  return VARIANTS[key] ?? null;
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
