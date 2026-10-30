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
    destination: "/developers/docs/payments/pay-sh#let-an-agent-pay-x402",
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
    destination:
      "/developers/docs/tools/commerce-kit/quickstart/payment-button",
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
    destination: "/developers/docs/tools/production-readiness",
  },
  {
    source: "/docs/tokenization/quickstart",
    destination: "/developers/cookbook/tokens/create-mint-with-extensions",
  },
  {
    source: "/docs/tokenization",
    destination: "/developers/docs/assets#tokenization",
  },
  {
    source: "/docs/payments/quickstart",
    destination: "/developers/docs/payments/checkout/browser",
  },
  {
    source: "/docs/payments/accept-payments/solana-pay",
    destination: "/developers/docs/tools/commerce-kit/quickstart/solana-pay",
  },
  {
    source: "/docs/payments/pay-per-call",
    destination: "/developers/docs/payments/agentic-payments",
  },
  {
    source: "/docs/payments/agentic-payments/x402/making-a-payment",
    destination: "/developers/docs/payments/pay-sh#let-an-agent-pay-x402",
  },
  {
    source: "/docs/tools/solana-pay/quickstart",
    destination: "/developers/docs/tools/solana-pay#quick-start",
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
  { source: "/docs/tags/:tag+", destination: "/developers/docs/tags" },
];

/**
 * The Developer Bootcamp lives in Video tutorials. The old lesson pages go
 * to the matching video page.
 */
const bootcampRedirects: Redirect[] = [
  {
    source: "/developers/bootcamp",
    destination: "/developers/docs/video-guides/2026-developer-bootcamp",
  },
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
    destination: "/developers/docs/video-guides/2026-developer-bootcamp",
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
