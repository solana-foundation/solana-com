export type CategoryTranslations = Record<string, string>;

export type Category = {
  labelKey: string;
  accent: string;
  badge: string;
};

// ── Category definitions ────────────────────────────────────────────────
// Each color is a unique stop along the Solana logo gradient:
// solana-purple → solana-blue → solana-cyan → solana-teal → solana-green

export const SKILL: Category = {
  labelKey: "skill",
  accent: "border-l-solana-purple",
  badge: "bg-solana-purple/15 text-solana-purple",
};

export const PROGRAMS: Category = {
  labelKey: "programs",
  accent: "border-l-solana-violet",
  badge: "bg-solana-violet/15 text-solana-violet",
};

export const TESTING: Category = {
  labelKey: "testing",
  accent: "border-l-solana-blue-violet",
  badge: "bg-solana-blue-violet/15 text-solana-blue-violet",
};

export const TOOLING: Category = {
  labelKey: "tooling",
  accent: "border-l-solana-blue",
  badge: "bg-solana-blue/15 text-solana-blue",
};

export const FRONTEND: Category = {
  labelKey: "frontend",
  accent: "border-l-solana-green",
  badge: "bg-solana-green/15 text-solana-green",
};

export const SECURITY: Category = {
  labelKey: "security",
  accent: "border-l-solana-steel",
  badge: "bg-solana-steel/15 text-solana-steel",
};

export const TOKENS: Category = {
  labelKey: "tokens",
  accent: "border-l-solana-mint",
  badge: "bg-solana-mint/15 text-solana-mint",
};

export const PAYMENTS: Category = {
  labelKey: "payments",
  accent: "border-l-solana-seafoam",
  badge: "bg-solana-seafoam/15 text-solana-seafoam",
};

export const REFERENCE: Category = {
  labelKey: "reference",
  accent: "border-l-solana-dark-cyan",
  badge: "bg-solana-dark-cyan/15 text-solana-dark-cyan",
};

export const DEFI: Category = {
  labelKey: "defi",
  accent: "border-l-solana-cyan",
  badge: "bg-solana-cyan/15 text-solana-cyan",
};

export const INFRASTRUCTURE: Category = {
  labelKey: "infrastructure",
  accent: "border-l-solana-teal",
  badge: "bg-solana-teal/15 text-solana-teal",
};

// ── Aliases ─────────────────────────────────────────────────────────────
export const DEFAULT_CATEGORY = SKILL;

// ── Slug → category map for endorsed skills ─────────────────────────────
export const CATEGORY_MAP: Record<string, Category> = {
  "programs-anchor": PROGRAMS,
  "programs-pinocchio": PROGRAMS,
  testing: TESTING,
  surfpool: TOOLING,
  "surfpool-cheatcodes": TOOLING,
  "frontend-framework-kit": FRONTEND,
  "idl-codegen": TOOLING,
  "kit-web3-interop": TOOLING,
  "compatibility-matrix": TOOLING,
  security: SECURITY,
  "confidential-transfers": TOKENS,
  payments: PAYMENTS,
  "common-errors": REFERENCE,
  resources: REFERENCE,
};
