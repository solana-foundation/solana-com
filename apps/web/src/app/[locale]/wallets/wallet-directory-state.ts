import {
  WALLET_CATEGORIES,
  WALLET_FEATURES,
  WALLET_PLATFORMS,
  type WalletCategory,
  type WalletFeature,
  type WalletPlatform,
} from "./wallet-directory";

export type DirectoryView = "grid" | "list";
export type DirectoryScope = "native" | "all";

export type DirectoryState = {
  scope: DirectoryScope;
  category: WalletCategory | "all";
  platforms: WalletPlatform[];
  features: WalletFeature[];
  search: string;
  view: DirectoryView;
};

export const DEFAULT_DIRECTORY_STATE: DirectoryState = {
  scope: "native",
  category: "all",
  platforms: [],
  features: [],
  search: "",
  view: "grid",
};

function parseCsv<T extends string>(
  value: string | null,
  allowedValues: readonly T[],
) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .filter((item): item is T => allowedValues.includes(item as T));
}

export function parseDirectoryState(
  searchParams: URLSearchParams,
): DirectoryState {
  const category = searchParams.get("category");
  const view = searchParams.get("view");
  const features = parseCsv(searchParams.get("features"), WALLET_FEATURES);

  return {
    scope: searchParams.get("scope") === "all" ? "all" : "native",
    category:
      category && WALLET_CATEGORIES.includes(category as WalletCategory)
        ? (category as WalletCategory)
        : "all",
    platforms: parseCsv(searchParams.get("platform"), WALLET_PLATFORMS),
    // `solana_native` used to be a regular feature facet. Keep old shared URLs
    // working while the new top-level scope owns that choice.
    features: features.filter((feature) => feature !== "solana_native"),
    search: searchParams.get("q") ?? "",
    view: view === "list" ? "list" : "grid",
  };
}

export function buildDirectorySearchParams(state: DirectoryState) {
  const params = new URLSearchParams();

  if (state.scope === "all") {
    params.set("scope", "all");
  }

  if (state.category !== "all") {
    params.set("category", state.category);
  }

  if (state.platforms.length) {
    params.set("platform", state.platforms.join(","));
  }

  if (state.features.length) {
    params.set("features", state.features.join(","));
  }

  if (state.search.trim()) {
    params.set("q", state.search.trim());
  }

  if (state.view !== DEFAULT_DIRECTORY_STATE.view) {
    params.set("view", state.view);
  }

  return params;
}
