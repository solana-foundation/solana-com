// Static destinations are checked by validate:content.
export const HERO_LINKS = [
  { id: "primary", href: "/docs/payments" },
  { id: "secondary", href: "/developers/payments#payment-paths" },
] as const;

export const PAYMENT_PATHS = [
  { id: "accept", href: "/docs/payments/accept-payments" },
  { id: "send", href: "/docs/payments/send-payments" },
  { id: "payouts", href: "/docs/payments/send-payments/payment-processing" },
  { id: "agentic", href: "/docs/payments/agentic-payments" },
] as const;

export const BUILD_OPTIONS = [
  {
    id: "commerceKit",
    href: "/docs/tools/commerce-kit/quickstart/payment-button",
  },
  { id: "solanaPay", href: "/docs/payments/accept-payments/solana-pay" },
  { id: "custom", href: "/docs/payments/interacting-with-solana" },
] as const;

export const RELATED_LINKS = [
  { id: "commerce", href: "/solutions/commerce-tooling" },
  { id: "platform", href: "/solutions/sdp" },
] as const;

export const PRODUCTION_LINK = {
  href: "/docs/tools/production-readiness",
} as const;
