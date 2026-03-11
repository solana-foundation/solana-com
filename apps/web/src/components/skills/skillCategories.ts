export type CategoryTranslations = Record<string, string>;

export type Category = {
  labelKey: string;
  accent: string;
  badge: string;
};

export const DEFAULT_CATEGORY: Category = {
  labelKey: "skill",
  accent: "border-t-white/20",
  badge: "bg-white/10 text-white/50",
};

export const CATEGORY_MAP: Record<string, Category> = {
  "programs-anchor": {
    labelKey: "programs",
    accent: "border-t-purple-500",
    badge: "bg-purple-500/15 text-purple-300",
  },
  "programs-pinocchio": {
    labelKey: "programs",
    accent: "border-t-purple-500",
    badge: "bg-purple-500/15 text-purple-300",
  },
  testing: {
    labelKey: "testing",
    accent: "border-t-blue-500",
    badge: "bg-blue-500/15 text-blue-300",
  },
  surfpool: {
    labelKey: "tooling",
    accent: "border-t-amber-500",
    badge: "bg-amber-500/15 text-amber-300",
  },
  "surfpool-cheatcodes": {
    labelKey: "tooling",
    accent: "border-t-amber-500",
    badge: "bg-amber-500/15 text-amber-300",
  },
  "frontend-framework-kit": {
    labelKey: "frontend",
    accent: "border-t-green-500",
    badge: "bg-green-500/15 text-green-300",
  },
  "idl-codegen": {
    labelKey: "tooling",
    accent: "border-t-amber-500",
    badge: "bg-amber-500/15 text-amber-300",
  },
  "kit-web3-interop": {
    labelKey: "tooling",
    accent: "border-t-amber-500",
    badge: "bg-amber-500/15 text-amber-300",
  },
  "compatibility-matrix": {
    labelKey: "tooling",
    accent: "border-t-amber-500",
    badge: "bg-amber-500/15 text-amber-300",
  },
  security: {
    labelKey: "security",
    accent: "border-t-red-500",
    badge: "bg-red-500/15 text-red-300",
  },
  "confidential-transfers": {
    labelKey: "tokens",
    accent: "border-t-teal-500",
    badge: "bg-teal-500/15 text-teal-300",
  },
  payments: {
    labelKey: "payments",
    accent: "border-t-emerald-500",
    badge: "bg-emerald-500/15 text-emerald-300",
  },
  "common-errors": {
    labelKey: "reference",
    accent: "border-t-gray-500",
    badge: "bg-gray-500/15 text-gray-300",
  },
  resources: {
    labelKey: "reference",
    accent: "border-t-gray-500",
    badge: "bg-gray-500/15 text-gray-300",
  },
};
