/**
 * Audience variants for the Breakpoint home page.
 *
 * Paid campaigns land on `/breakpoint` with either a `v` variant or an exact
 * `utm_content` fallback, and the page swaps its messaging layer (hero,
 * narrative, stats, tickets closing line) to match the ad the visitor clicked.
 * A missing or unknown variant renders the default page, so a bad link can
 * never 404 or show broken variant copy. The swap happens client-side after
 * hydration so the page stays fully static — see `useVariant` in
 * `src/lib/use-variant.ts`.
 */

import {
  DEVELOPER_APPLICATION_HREF,
  GENERAL_ADMISSION_HREF,
} from "@/content/links";

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
  heroCtaHref: string;
  /** Ad-continuity positioning statement, rendered as the narrative eyebrow. */
  positioningStatement: string;
  /** Narrative body paragraphs, revealed in order. */
  narrativeParagraphs: string[];
  stats: VariantStat[];
  /** Closing conversion line, rendered as the tickets section headline. */
  ticketsHeadline: string;
  /** Optional supporting copy rendered directly below the tickets headline. */
  ticketsStrapline?: string;
};

const builders: VariantConfig = {
  slug: "developers",
  heroHeadline: "Building at the\nSpeed of Solana",
  heroCtaLabel: "Buy Dev Tickets $250",
  heroCtaHref: DEVELOPER_APPLICATION_HREF,
  positioningStatement:
    "Firedancer is live. Alpenglow is coming. Meet the engineers shipping the fastest chain in production — and build what comes next.",
  narrativeParagraphs: [
    "Everything is happening on Solana, and this November, the builders driving that innovation are heading to London for Breakpoint.",
    "Whether you’re working on an app, protocol, agent, market, or something entirely new, the people you need to meet will be in this room.",
    "Breakpoint is more than an event, it’s the convergence of the people and technologies creating new possibilities for our future, and this year we’ll have the most robust technical agenda ever. Hacker Houses and Scale or Die kick will set the tone, and even more awaits once the main event kicks off.",
    "Join us November 15-17 to swap notes, find your next collaborator, and see why Google, Mastercard and Paypal are building here.",
    "Dev tickets are available now at a special subsidized rate.",
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
    "Dev tickets are available now at a special subsidized rate.",
};

const tech: VariantConfig = {
  slug: "tech",
  heroHeadline: "The best tech event\nyou’ll ever experience",
  heroCtaLabel: "Buy Tickets Today",
  heroCtaHref: GENERAL_ADMISSION_HREF,
  positioningStatement: "The Everything Chain",
  narrativeParagraphs: [
    "Breakpoint is where the people building the next wave of tech and finance come to meet each other. Whatever you’re working on, the person who can help you take it further will be in this room. Founders looking for a technical co-founder, engineers hunting for their next team, investors writing the checks that turn prototypes into companies, the operators and partners who help you actually ship. Three days, one place, and the shortest path between you and the people who matter for what comes next.",
    "We’ve carefully designed Breakpoint so the conversations you want are the ones you fall into, whether that’s over coffee between talks, at a Hacker House late into the night, or across the table during VC speed-dating. You leave with more than notes. You leave with relationships, collaborators, and a few introductions that change your trajectory.",
    "Solana has become the place where AI, fintech, and frontier tech converge, which means the people you’ll meet aren’t just from your corner of the industry. They’re from every corner of what’s coming next. It’s the rare event where the person beside you might be the key to unlocking the future you’ve always wanted to build.",
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
  ticketsHeadline: "Breakpoint is coming to London on November 15–17.",
  ticketsStrapline: "Buy your tickets today and use code BRAVE20 to save 20%.",
};

const finance: VariantConfig = {
  slug: "finance",
  heroHeadline: "Where Global Finance\nComes Onchain",
  heroCtaLabel: "Join us in London",
  heroCtaHref: GENERAL_ADMISSION_HREF,
  positioningStatement:
    "Breakpoint is Solana’s flagship yearly event, gathering the leaders, builders, and institutions shaping the future of global capital markets. For the first time, Breakpoint is coming to London, the birthplace of modern finance.",
  narrativeParagraphs: [
    "The internet has rewritten the rules of nearly every industry. Finance, insulated by cheap leverage and financial engineering, has long been the exception. That era is over.",
    "We’ve entered a new supercycle defined by physical capacity: the energy grids, semiconductors, and datacenters powering the AI revolution have created global demand for capitalization at an unprecedented rate.",
    "Legacy markets can’t meet that demand, because the real obstacle was never financial, it was technological. Solana is rebuilding the rails of modern finance: an always-on, unified layer for the world’s capital, enabling the seamless issuance and trading of real assets.",
    "Breakpoint will gather the sharpest minds in finance, technology, and policy in one room to shape the narratives and build the rails for this transformative moment for global capital. You will want to be in that room.",
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
  ticketsHeadline: "You will want to be in that room.",
  ticketsStrapline: "Use code BRAVE20 to save 20%.",
};

export const VARIANTS: Record<string, VariantConfig> = {
  tech,
  finance,
  developers: builders,
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
