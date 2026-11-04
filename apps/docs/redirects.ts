/**
 * Redirects of the docs app (next.config.ts `redirects()`). The developer
 * docs moved from /docs to /developers/docs; old URLs answer one permanent
 * redirect to their page there.
 *
 * Every rule below is a literal `{ source, destination }` (apps/web's
 * scripts/validate-content.mjs reads the sources). `docsRedirects()` adds
 * each rule's `.md` twin (raw-markdown URLs; a destination's #anchor is
 * dropped) and its locale twins (`/<locale>/docs/...`). Rules match in
 * order, so specific pages come before the catch-alls at the end.
 *
 * A destination's #anchor replaces the one an old link carries, so a page
 * whose old sections are spread over the new page has no #anchor here: its
 * old anchors go to their sections through anchorAliases (same page) or
 * the legacy anchors (content/legacy-anchors, another page).
 */
import { locales } from "@workspace/i18n/config";

type Redirect = { source: string; destination: string };

/** Docs pages that moved, were merged or were removed. */
const movedDocsRedirects: Redirect[] = [
  {
    source: "/docs/payments/agentic-payments/intro-to-x402",
    destination: "/developers/docs/payments/agentic-payments/x402",
  },
  {
    source: "/docs/payments/agentic-payments/x402-quickstart",
    destination: "/developers/docs/payments/pay-sh",
  },
  {
    source: "/docs/payments/agentic-payments/x402-facilitator",
    destination: "/developers/docs/tools/x402-facilitator",
  },
  {
    source: "/docs/references",
    destination: "/developers/docs/references/clusters",
  },
  {
    source: "/docs/clients/javascript",
    destination: "/developers/docs/clients/official/javascript",
  },
  {
    source: "/docs/clients/game-sdks",
    destination: "/developers/docs/clients/community/game-sdks",
  },
  {
    source: "/docs/clients/go",
    destination: "/developers/docs/clients/community/go",
  },
  {
    source: "/docs/clients/java",
    destination: "/developers/docs/clients/community/java",
  },
  {
    source: "/docs/clients/python",
    destination: "/developers/docs/clients/community/python",
  },
  {
    source: "/docs/clients/rust",
    destination: "/developers/docs/clients/official/rust",
  },
  {
    source: "/docs/frontend/kit",
    destination: "/developers/docs/frontend/client",
  },
  {
    source: "/docs/intro/quick-start/cross-program-invocation",
    destination: "/developers/docs/core/cpi",
  },
  {
    source: "/docs/intro/quick-start/deploying-programs",
    destination: "/developers/docs/programs/build-first-program",
  },
  {
    source: "/docs/intro/quick-start/program-derived-address",
    destination: "/developers/docs/core/pda",
  },
  {
    source: "/docs/references/economics/staking",
    destination: "/developers/docs/references/staking",
  },
  {
    source: "/docs/advanced/actions",
    destination: "/developers/docs/tools/actions",
  },
  {
    source: "/docs/payments/accept-payments/payment-button",
    destination: "/developers/docs/tools/solana-pay",
  },
  {
    source: "/docs/payments/accept-payments/pay-sh",
    destination: "/developers/docs/payments/pay-sh",
  },
  {
    source: "/docs/payments/subscriptions/pay-sh",
    destination: "/developers/docs/payments/pay-sh",
  },
  {
    source: "/docs/payments/production-readiness",
    destination:
      "/developers/docs/tools/transaction-landing#transaction-landing",
  },
  {
    source: "/docs/tokenization/quickstart",
    destination: "/developers/cookbook/tokens/create-mint-with-extensions",
  },
  {
    source: "/docs/tokenization",
    destination: "/developers/docs/assets",
  },
  {
    // Live's Solana Pay QR quickstart ("Quickstart: accept a payment") is
    // the checkout tutorial's QR code step here.
    source: "/docs/payments/quickstart",
    destination: "/developers/docs/payments/checkout/browser",
  },
  {
    source: "/docs/payments/accept-payments/solana-pay",
    destination: "/developers/docs/tools/solana-pay",
  },
  {
    source: "/docs/payments/pay-per-call",
    destination: "/developers/docs/payments/agentic-payments",
  },
  {
    source: "/docs/payments/agentic-payments/x402/making-a-payment",
    destination: "/developers/docs/payments/pay-sh",
  },
  {
    source: "/docs/tools/solana-pay/quickstart",
    destination: "/developers/docs/tools/solana-pay",
  },
  {
    source: "/docs/tools/kora/json-rpc-api/authentication",
    destination: "/developers/docs/tools/kora/operators/authentication",
  },
  { source: "/docs/from-ethereum", destination: "/developers/docs/from-evm" },
  {
    source: "/docs/intro/quick-start/build-first-program",
    destination: "/developers/docs/programs/build-first-program",
  },
  {
    source: "/docs/intro/quick-start",
    destination: "/developers/docs/quickstart",
  },
  {
    source: "/docs/intro/quick-start/reading-from-network",
    destination: "/developers/docs/quickstart/check-balance",
  },
  {
    source: "/docs/intro/quick-start/writing-to-network",
    destination: "/developers/docs/quickstart/send-dollars",
  },
  { source: "/docs/finance", destination: "/developers/docs" },
  {
    source: "/docs/intro/installation",
    destination: "/developers/docs/quickstart",
  },
  // apps/web sends the HTML URL here too; this covers the `.md` twin.
  { source: "/docs/intro/rent", destination: "/developers/docs/core/rent" },
  { source: "/docs/tags/:tag+", destination: "/developers/docs/tags" },
  // Program questions moved to Solana Stack Exchange (as apps/web sends
  // /docs/programs/faq). An external page has no Markdown twin, so the
  // `.md` URL is written out: it goes to the same page.
  {
    source: "/docs/programs/faq",
    destination: "https://solana.stackexchange.com",
  },
  {
    source: "/docs/programs/faq.md",
    destination: "https://solana.stackexchange.com",
  },
];

/**
 * The Developer Bootcamp lives in Video tutorials. The old lesson pages go
 * to the matching video page, and their Markdown twins (`.md`) to its
 * Markdown twin. `markdownTwin` skips patterns, so the `.md` rules are
 * written out, before the HTML patterns (which would also match `x.md`).
 * `/:path*.md` also matches the course page's own twin
 * (/developers/bootcamp/depin.md).
 */
const BOOTCAMP_PAGE = "/developers/docs/video-guides/2026-developer-bootcamp";

/**
 * 2026 Developer Bootcamp lessons and courses: the chapter of the video page
 * that covers each (heading ids on that page). Courses go to the chapter list.
 */
const bootcampChapters: Record<string, string> = {
  foundations: "chapters",
  "foundations/bootcamp-intro": "introduction",
  "foundations/quick-intro-to-blockchain": "introduction",
  "foundations/local-installation": "local-installation",
  "foundations/hello-world": "hello-world",
  "foundations/ai-best-practices": "ai-best-practices",
  "program-patterns": "chapters",
  "program-patterns/voting": "onchain-voting",
  "program-patterns/escrow-application": "escrow-application",
  "program-patterns/stable-coin": "stablecoin",
  "program-patterns/stable-swap": "stable-swap",
  "program-patterns/security": "security-checklist",
  "fullstack-apps": "chapters",
  "fullstack-apps/private-transfers": "private-transfers",
  "fullstack-apps/x402": "x402",
  "fullstack-apps/real-world-assets": "real-world-assets",
  "fullstack-apps/prediction-market": "prediction-market",
  "shipping-production": "chapters",
  "shipping-production/indexing": "indexing",
  "shipping-production/production-readiness": "production-readiness",
};

const bootcampRedirects: Redirect[] = [
  {
    source: "/developers/bootcamp/solana-crashcourse/:path*.md",
    destination: "/developers/docs/video-guides/solana-crash-course.md",
  },
  {
    source: "/developers/bootcamp/depin/:path*.md",
    destination: "/developers/docs/video-guides/building-depin-projects.md",
  },
  {
    source: "/developers/bootcamp/:path+.md",
    destination: `${BOOTCAMP_PAGE}.md`,
  },
  {
    source: "/developers/bootcamp",
    destination: BOOTCAMP_PAGE,
  },
  ...Object.entries(bootcampChapters).map(([lesson, chapter]) => ({
    source: `/developers/bootcamp/${lesson}`,
    destination: `${BOOTCAMP_PAGE}#${chapter}`,
  })),
  {
    source: "/developers/bootcamp/solana-crashcourse/:path*",
    destination: "/developers/docs/video-guides/solana-crash-course",
  },
  {
    source: "/developers/bootcamp/depin/:path*",
    destination: "/developers/docs/video-guides/building-depin-projects",
  },
  {
    source: "/developers/bootcamp/:path*",
    destination: BOOTCAMP_PAGE,
  },
];

/** Every other old docs URL: the same path under /developers/docs. */
const docsPrefixRedirects: Redirect[] = [
  { source: "/docs", destination: "/developers/docs" },
  { source: "/docs/:path+", destination: "/developers/docs/:path+" },
];

// Constrained to real locales: an unconstrained `/:locale/docs/...` would
// also match /developers/docs/... and loop.
const LOCALE = `:locale(${locales.join("|")})`;

const isExternal = (url: string) => /^https?:\/\//.test(url);

function markdownTwin({ source, destination }: Redirect): Redirect[] {
  // Patterns already match `.md` paths; external pages have no twin.
  if (source.includes(":") || isExternal(destination)) return [];
  return [
    {
      source: `${source}.md`,
      destination: `${destination.split("#")[0]}.md`,
    },
  ];
}

function localeTwin({ source, destination }: Redirect): Redirect {
  return {
    source: `/${LOCALE}${source}`,
    destination: isExternal(destination)
      ? destination
      : `/:locale${destination}`,
  };
}

export function docsRedirects() {
  return [...movedDocsRedirects, ...bootcampRedirects, ...docsPrefixRedirects]
    .flatMap((rule) => [rule, ...markdownTwin(rule)])
    .flatMap((rule) => [rule, localeTwin(rule)])
    .map((rule) => ({ ...rule, permanent: true }));
}
