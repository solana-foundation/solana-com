// Static destinations are checked by validate:content.
export const HERO_LINKS = [
  { id: "primary", href: "/developers/docs/payments" },
  { id: "secondary", href: "/developers/payments#payment-paths" },
] as const;

export const PAYMENT_PATHS = [
  { id: "accept", href: "/developers/docs/payments/accept-payments" },
  { id: "send", href: "/developers/docs/payments/send-payments" },
  {
    id: "payouts",
    href: "/developers/docs/payments/send-payments/payment-processing",
  },
  { id: "agentic", href: "/developers/docs/payments/agentic-payments" },
] as const;

export const BUILD_OPTIONS = [
  {
    id: "commerceKit",
    href: "/developers/docs/tools/commerce-kit/quickstart/payment-button",
  },
  { id: "solanaPay", href: "/developers/docs/tools/solana-pay" },
  { id: "paySh", href: "/developers/docs/payments/pay-sh" },
  { id: "custom", href: "/developers/docs/payments/interacting-with-solana" },
] as const;

export const SHOPIFY_LINKS = [
  { id: "app", href: "https://apps.shopify.com/solana-pay-helio" },
  { id: "guide", href: "https://docs.hel.io/docs/solana-pay-shopify-plugin" },
] as const;

export const SHOPIFY_PAYMENTS_LINK = {
  href: "https://help.shopify.com/en/manual/payments/shopify-payments/local-payment-methods/usdc-payments",
} as const;

export const RELATED_LINKS = [
  { id: "commerce", href: "/solutions/commerce-tooling" },
  { id: "platform", href: "/solutions/sdp" },
] as const;

export const PRODUCTION_LINK = {
  href: "/developers/docs/tools/production-readiness",
} as const;
