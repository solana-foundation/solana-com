/**
 * Data for /privacy.
 *
 * Copy lives in `packages/i18n/messages/web/en/common.json` under `privacy`.
 * This file holds the stable identifiers, hrefs and non-translatable values the
 * page maps those strings onto.
 */

/** Contact for institutions asking about privacy on Solana. */
export const PRIVACY_CONTACT_EMAIL = "privacy@solana.org";

export const PRIVACY_LINKS = {
  confidentialBalancesDocs: "/docs/tokens/extensions/confidential-transfer",
  confidentialBalancesIntegration:
    "/docs/tokens/extensions/confidential-transfer/integration-guide",
  confidentialBalancesIssuer:
    "/docs/tokens/extensions/confidential-transfer/issuer-guide",
  securityAudits: "https://github.com/anza-xyz/security-audits",
  privateChannelsDocs: "/docs/tools/private-channels",
  privateChannelsGithub:
    "https://github.com/solana-foundation/solana-private-channels",
  privateChannelsAudits:
    "https://github.com/solana-foundation/solana-private-channels/tree/main/audits",
  privateChannelsProduct: "https://launch.solana.com/products/private-channels",
  rings: "https://helius.dev/privacy",
  ringsDemo: "https://helius.dev/privacy/demo",
  ringsDocs: "https://www.helius.dev/docs/privacy",
  attestationService: "https://attest.solana.com",
  developerPlatform: "https://platform.solana.com",
  comparePrivacyDocs: "/docs/finance/privacy",
  enterpriseFaq: "/solutions/enterprise/faq",
} as const;

/** Where a project sits on the two-axis privacy matrix. */
export type PrivacyMode =
  | "public"
  | "anonymous"
  | "confidential"
  | "fullyPrivate";

export type PrivacyStatus = "mainnet" | "mainnetBeta" | "devnetBeta";

export type FeaturedSolutionKey =
  | "confidentialBalances"
  | "privateChannels"
  | "rings";

export type FeaturedSolution = {
  key: FeaturedSolutionKey;
  status: PrivacyStatus;
  /** Anchor of the detail section on this page. */
  sectionId: string;
  /** Primary destination for the project. */
  href: string;
};

/**
 * The three solutions from the Solana Foundation privacy brochure. Order
 * matters: they lead the solutions section and the ecosystem grid.
 */
export const FEATURED_SOLUTIONS: readonly FeaturedSolution[] = [
  {
    key: "confidentialBalances",
    status: "mainnet",
    sectionId: "confidential-balances",
    href: PRIVACY_LINKS.confidentialBalancesDocs,
  },
  {
    key: "privateChannels",
    status: "mainnetBeta",
    sectionId: "private-channels",
    href: PRIVACY_LINKS.privateChannelsDocs,
  },
  {
    key: "rings",
    status: "devnetBeta",
    sectionId: "solana-rings",
    href: PRIVACY_LINKS.rings,
  },
] as const;

export type EcosystemProject = {
  key: string;
  href: string;
};

/** Additional projects building privacy infrastructure on Solana. */
export const ECOSYSTEM_PROJECTS: readonly EcosystemProject[] = [
  { key: "arcium", href: "https://arcium.com" },
  { key: "encrypt", href: "https://encrypt.xyz" },
  { key: "inco", href: "https://inco.org" },
  { key: "ligero", href: "https://ligero-inc.com/" },
  { key: "magicBlock", href: "https://magicblock.gg" },
  {
    key: "privacyCash",
    href: "https://www.privacycash.org",
  },
] as const;

/** Rows for the Confidential Balances public-view vs auditor-view comparison. */
export const CONFIDENTIAL_LEDGER_ROWS = [
  { key: "employee", amount: 8450 },
  { key: "supplier", amount: 412900 },
  { key: "treasury", amount: 38200000 },
] as const;

export const CONFIDENTIAL_BALANCES_TAGS = [
  "payroll",
  "supplierPayments",
  "treasury",
  "tokenizedFunds",
] as const;

export const CONFIDENTIAL_BALANCES_STATS = ["audits", "tokens", "fee"] as const;

export const PRIVATE_CHANNELS_TAGS = [
  "tokenizedDeposits",
  "privateExecution",
  "privateNetwork",
] as const;

export const PRIVATE_CHANNELS_STEPS = ["in", "settle", "out"] as const;

export const RINGS_TAGS = ["payments", "trading", "ramps"] as const;

export const RING_RULES = [
  "auditorAccess",
  "allowedAssets",
  "approvedParticipants",
  "blockedRecipients",
  "freeze",
  "coSigning",
  "recovery",
  "transferLimits",
  "depositLimits",
  "depositAuditing",
] as const;

export const COMPLIANCE_ITEMS = [
  "auditorKey",
  "visibleWallets",
  "verifiedCredentials",
  "travelRule",
] as const;

export const GLANCE_STATS = [
  { key: "transactions", highlight: true },
  { key: "uptime", highlight: false },
  { key: "blockTime", highlight: false },
  { key: "finality", highlight: false },
  { key: "fee", highlight: false },
  { key: "spot", highlight: false },
  { key: "rwa", highlight: true },
  { key: "xstocks", highlight: false },
  { key: "x402", highlight: false },
  { key: "gsibs", highlight: false },
] as const;

/** Brand names as printed in the brochure. Not translated. */
export const BUILDING_ON_SOLANA = [
  "Visa",
  "Mastercard",
  "PayPal",
  "Stripe",
  "Western Union",
  "Fiserv",
  "BlackRock",
  "Franklin Templeton",
  "Apollo",
  "Hamilton Lane",
  "WisdomTree",
  "VanEck",
  "Fidelity",
  "Galaxy",
  "Ondo",
  "Kraken",
  "Baillie Gifford",
  "Google Cloud",
] as const;

export type ResourceLink = {
  key: string;
  href: string;
  /** Short host or path shown under the title, like the brochure's QR captions. */
  display: string;
};

export const RESOURCE_LINKS: readonly ResourceLink[] = [
  {
    key: "platform",
    href: PRIVACY_LINKS.developerPlatform,
    display: "platform.solana.com",
  },
  {
    key: "confidentialBalances",
    href: PRIVACY_LINKS.confidentialBalancesDocs,
    display: "solana.com/docs/tokens/extensions/confidential-transfer",
  },
  {
    key: "privateChannels",
    href: PRIVACY_LINKS.privateChannelsDocs,
    display: "solana.com/docs/tools/private-channels",
  },
  {
    key: "rings",
    href: PRIVACY_LINKS.rings,
    display: "helius.dev/privacy",
  },
  {
    key: "attestation",
    href: PRIVACY_LINKS.attestationService,
    display: "attest.solana.com",
  },
  {
    key: "compare",
    href: PRIVACY_LINKS.comparePrivacyDocs,
    display: "solana.com/docs/finance/privacy",
  },
  {
    key: "faq",
    href: PRIVACY_LINKS.enterpriseFaq,
    display: "solana.com/solutions/enterprise/faq",
  },
  {
    key: "audits",
    href: PRIVACY_LINKS.securityAudits,
    display: "github.com/anza-xyz/security-audits",
  },
] as const;

export function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//i.test(href);
}
