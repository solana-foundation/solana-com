export type CategoryTranslations = Record<string, string>;

export type Category = {
  labelKey: string;
  accent: string;
  badge: string;
};

// ── Category definitions ────────────────────────────────────────────────
export const SKILL: Category = {
  labelKey: "skill",
  accent: "border-l-white/20",
  badge: "bg-white/10 text-white/50",
};

export const PROGRAMS: Category = {
  labelKey: "programs",
  accent: "border-l-purple-500",
  badge: "bg-purple-500/15 text-purple-300",
};

export const TESTING: Category = {
  labelKey: "testing",
  accent: "border-l-blue-500",
  badge: "bg-blue-500/15 text-blue-300",
};

export const TOOLING: Category = {
  labelKey: "tooling",
  accent: "border-l-amber-500",
  badge: "bg-amber-500/15 text-amber-300",
};

export const FRONTEND: Category = {
  labelKey: "frontend",
  accent: "border-l-green-500",
  badge: "bg-green-500/15 text-green-300",
};

export const SECURITY: Category = {
  labelKey: "security",
  accent: "border-l-red-500",
  badge: "bg-red-500/15 text-red-300",
};

export const TOKENS: Category = {
  labelKey: "tokens",
  accent: "border-l-teal-500",
  badge: "bg-teal-500/15 text-teal-300",
};

export const PAYMENTS: Category = {
  labelKey: "payments",
  accent: "border-l-emerald-500",
  badge: "bg-emerald-500/15 text-emerald-300",
};

export const REFERENCE: Category = {
  labelKey: "reference",
  accent: "border-l-gray-500",
  badge: "bg-gray-500/15 text-gray-300",
};

export const DEFI: Category = {
  labelKey: "defi",
  accent: "border-l-cyan-500",
  badge: "bg-cyan-500/15 text-cyan-300",
};

export const INFRASTRUCTURE: Category = {
  labelKey: "infrastructure",
  accent: "border-l-indigo-500",
  badge: "bg-indigo-500/15 text-indigo-300",
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
