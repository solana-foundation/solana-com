"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Grid2X2,
  List,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  DEFAULT_WALLET_ICON_URL,
  WALLET_CATEGORIES,
  WALLET_CATEGORY_LABELS,
  WALLET_FEATURE_DESCRIPTIONS,
  WALLET_FEATURE_LABELS,
  WALLET_PLATFORM_LABELS,
  WALLET_PLATFORMS,
  type WalletCategory,
  type WalletDirectoryData,
  type WalletDirectoryEntry,
  type WalletFeature,
  type WalletPlatform,
} from "@/data/wallets/wallet-directory";
import styles from "./WalletDirectory.module.scss";

type DirectoryView = "grid" | "list";
type DirectorySort = "recommended" | "name";

type DirectoryState = {
  category: WalletCategory | "all";
  platforms: WalletPlatform[];
  features: WalletFeature[];
  search: string;
  view: DirectoryView;
  sort: DirectorySort;
};

type FilterGroupId = "platforms" | "features";

type QueryUpdateMode = "push" | "replace";

const DEFAULT_STATE: DirectoryState = {
  category: "all",
  platforms: [],
  features: [],
  search: "",
  view: "grid",
  sort: "recommended",
};

const FEATURED_WALLET_COUNT = 4;

const FEATURE_GROUPS: Array<{
  label: string;
  options: WalletFeature[];
}> = [
  {
    label: "Custody",
    options: ["non_custodial", "custodial", "mpc", "social_recovery"],
  },
  {
    label: "Solana features",
    options: [
      "solana_native",
      "staking",
      "hold_nfts",
      "te",
      "blinks_and_actions",
      "solana_pay",
    ],
  },
  {
    label: "Funding",
    options: ["buy_crypto", "sell_crypto"],
  },
  {
    label: "Security and teams",
    options: ["hardware", "multi_sig", "spending_limits", "open_source"],
  },
  {
    label: "Developer infrastructure",
    options: ["gas_abstraction", "private_key_infrastructure", "multi_chain"],
  },
];

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

function parseDirectoryState(searchParams: URLSearchParams): DirectoryState {
  const category = searchParams.get("category");
  const view = searchParams.get("view");
  const sort = searchParams.get("sort");

  return {
    category:
      category && WALLET_CATEGORIES.includes(category as WalletCategory)
        ? (category as WalletCategory)
        : "all",
    platforms: parseCsv(searchParams.get("platform"), WALLET_PLATFORMS),
    features: parseCsv(
      searchParams.get("features"),
      Object.keys(WALLET_FEATURE_LABELS) as WalletFeature[],
    ),
    search: searchParams.get("q") ?? "",
    view: view === "list" ? "list" : "grid",
    sort: sort === "name" ? "name" : "recommended",
  };
}

function buildSearchParams(state: DirectoryState) {
  const params = new URLSearchParams();

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

  if (state.view !== DEFAULT_STATE.view) {
    params.set("view", state.view);
  }

  if (state.sort !== DEFAULT_STATE.sort) {
    params.set("sort", state.sort);
  }

  return params;
}

function toggleArrayValue<T extends string>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function isSolflareWallet(wallet: WalletDirectoryEntry) {
  return (
    wallet.slug === "solflare" ||
    wallet.companyId === "solflare" ||
    wallet.name.toLowerCase() === "solflare"
  );
}

function shuffleItems<T>(values: T[]) {
  const items = [...values];

  for (let index = items.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
  }

  return items;
}

function getInitialFeaturedWallets(wallets: WalletDirectoryEntry[]) {
  const solflare = wallets.find(isSolflareWallet);
  const remaining = wallets.filter((wallet) => wallet.id !== solflare?.id);

  return [
    ...(solflare ? [solflare] : []),
    ...remaining.slice(0, FEATURED_WALLET_COUNT - (solflare ? 1 : 0)),
  ];
}

function getRandomFeaturedWallets(wallets: WalletDirectoryEntry[]) {
  const solflare = wallets.find(isSolflareWallet);
  const remaining = wallets.filter((wallet) => wallet.id !== solflare?.id);
  const selected = [
    ...(solflare ? [solflare] : []),
    ...shuffleItems(remaining).slice(
      0,
      FEATURED_WALLET_COUNT - (solflare ? 1 : 0),
    ),
  ];

  return shuffleItems(selected).slice(0, FEATURED_WALLET_COUNT);
}

function getWalletCategories(wallet: WalletDirectoryEntry) {
  return wallet.categories.length ? wallet.categories : [wallet.category];
}

function getWalletCategoryLabel(wallet: WalletDirectoryEntry) {
  const categories = getWalletCategories(wallet);
  const extraCategories = categories.filter(
    (category) => category !== wallet.category,
  ).length;

  return `${WALLET_CATEGORY_LABELS[wallet.category]}${extraCategories > 0 ? ` +${extraCategories}` : ""}`;
}

function walletMatchesState(
  wallet: WalletDirectoryEntry,
  state: DirectoryState,
  ignoreGroup?: FilterGroupId | "category" | "search",
) {
  if (
    ignoreGroup !== "category" &&
    state.category !== "all" &&
    !getWalletCategories(wallet).includes(state.category)
  ) {
    return false;
  }

  if (ignoreGroup !== "platforms" && state.platforms.length) {
    const hasPlatform = state.platforms.some((platform) =>
      wallet.platforms.includes(platform),
    );

    if (!hasPlatform) {
      return false;
    }
  }

  if (ignoreGroup !== "features" && state.features.length) {
    const hasFeature = state.features.some((feature) =>
      wallet.features.includes(feature),
    );

    if (!hasFeature) {
      return false;
    }
  }

  if (ignoreGroup !== "search" && state.search.trim()) {
    const query = state.search.trim().toLowerCase();
    const searchable = [
      wallet.name,
      wallet.description,
      ...getWalletCategories(wallet).map(
        (category) => WALLET_CATEGORY_LABELS[category],
      ),
      ...wallet.platforms.map((platform) => WALLET_PLATFORM_LABELS[platform]),
      ...wallet.features.map((feature) => WALLET_FEATURE_LABELS[feature]),
      ...wallet.supportedChains,
      ...wallet.supportedAssets,
    ]
      .join(" ")
      .toLowerCase();

    if (!searchable.includes(query)) {
      return false;
    }
  }

  return true;
}

function sortWallets(wallets: WalletDirectoryEntry[], sort: DirectorySort) {
  return sort === "name"
    ? [...wallets].sort((a, b) => a.name.localeCompare(b.name))
    : wallets;
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

// Logos above this width-to-height ratio are wordmarks: they turn illegible
// when squeezed into a square tile, so they get a wide tile instead.
const WORDMARK_ASPECT_RATIO = 1.45;

function WalletLogo({
  wallet,
  size = "default",
}: {
  wallet: WalletDirectoryEntry;
  size?: "default" | "small";
}) {
  const [failed, setFailed] = useState(false);
  const [defaultFailed, setDefaultFailed] = useState(false);
  const [isWordmark, setIsWordmark] = useState(false);
  const iconUrl =
    !wallet.iconUrl || failed ? DEFAULT_WALLET_ICON_URL : wallet.iconUrl;

  const measure = (image: HTMLImageElement) => {
    if (image.naturalWidth && image.naturalHeight) {
      setIsWordmark(
        image.naturalWidth / image.naturalHeight > WORDMARK_ASPECT_RATIO,
      );
    }
  };

  if (!iconUrl || defaultFailed) {
    return (
      <span
        className={`${styles.logoFallback} ${styles[`logoFallback-${size}`]}`}
      >
        {getInitials(wallet.name)}
      </span>
    );
  }

  return (
    <img
      src={iconUrl}
      alt=""
      width={size === "small" ? 40 : 56}
      height={size === "small" ? 40 : 56}
      className={`${styles.logo} ${styles[`logo-${size}`]}${isWordmark ? ` ${styles.logoWide}` : ""}`}
      loading="lazy"
      decoding="async"
      ref={(node) => {
        if (node?.complete) {
          measure(node);
        }
      }}
      onLoad={(event) => measure(event.currentTarget)}
      onError={() => {
        setIsWordmark(false);

        if (iconUrl === DEFAULT_WALLET_ICON_URL) {
          setDefaultFailed(true);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}

function WalletTags({
  wallet,
  limit = 3,
}: {
  wallet: WalletDirectoryEntry;
  limit?: number;
}) {
  const tags = wallet.features.slice(0, limit);
  const remaining = wallet.features.length - tags.length;

  if (!tags.length) {
    return null;
  }

  return (
    <p className={styles.featureLine}>
      {tags.map((feature) => WALLET_FEATURE_LABELS[feature]).join(" · ")}
      {remaining > 0 ? ` · +${remaining}` : ""}
    </p>
  );
}

function PlatformList({ wallet }: { wallet: WalletDirectoryEntry }) {
  const platforms = wallet.platforms.slice(0, 5);
  const remaining = wallet.platforms.length - platforms.length;

  if (!platforms.length) {
    return <span className={styles.mutedText}>Platform details pending</span>;
  }

  return (
    <p className={styles.platformLine}>
      {platforms
        .map((platform) => WALLET_PLATFORM_LABELS[platform])
        .join(" · ")}
      {remaining > 0 ? ` +${remaining}` : ""}
    </p>
  );
}

function WalletCard({ wallet }: { wallet: WalletDirectoryEntry }) {
  return (
    <article className={styles.walletCard}>
      <div className={styles.walletCardTop}>
        <WalletLogo wallet={wallet} />
        <ExternalLink
          size={16}
          aria-hidden="true"
          className={styles.walletCardArrow}
        />
      </div>
      <h3>
        <a
          className={styles.walletLink}
          href={wallet.website}
          target="_blank"
          rel="noopener noreferrer"
        >
          {wallet.name}
        </a>
      </h3>
      <p className={styles.walletCategory}>{getWalletCategoryLabel(wallet)}</p>
      <p className={styles.walletDescription}>{wallet.description}</p>
      <div className={styles.walletMeta}>
        <PlatformList wallet={wallet} />
        <WalletTags wallet={wallet} />
      </div>
    </article>
  );
}

function WalletRow({ wallet }: { wallet: WalletDirectoryEntry }) {
  return (
    <article className={styles.walletRow}>
      <div className={styles.walletRowLead}>
        <WalletLogo wallet={wallet} size="small" />
        <div>
          <h3>
            <a
              className={styles.walletLink}
              href={wallet.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              {wallet.name}
            </a>
          </h3>
          <p>{wallet.description}</p>
        </div>
      </div>
      <div className={styles.walletRowMeta}>
        <span>{getWalletCategoryLabel(wallet)}</span>
        <PlatformList wallet={wallet} />
        <WalletTags wallet={wallet} limit={4} />
      </div>
      <ExternalLink
        size={16}
        aria-hidden="true"
        className={styles.walletCardArrow}
      />
    </article>
  );
}

export function WalletDirectory({ data }: { data: WalletDirectoryData }) {
  const [state, setState] = useState<DirectoryState>(DEFAULT_STATE);
  const [featuredWallets, setFeaturedWallets] = useState(() =>
    getInitialFeaturedWallets(data.wallets),
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setState(parseDirectoryState(new URLSearchParams(window.location.search)));

    const handlePopState = () => {
      setState(
        parseDirectoryState(new URLSearchParams(window.location.search)),
      );
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    setFeaturedWallets(getRandomFeaturedWallets(data.wallets));
  }, [data.wallets]);

  const commitState = (
    nextState: DirectoryState,
    mode: QueryUpdateMode = "push",
  ) => {
    setState(nextState);

    const params = buildSearchParams(nextState);
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;

    window.history[mode === "replace" ? "replaceState" : "pushState"](
      null,
      "",
      nextUrl,
    );
  };

  const updateState = (
    updater: (_currentState: DirectoryState) => DirectoryState,
    mode?: QueryUpdateMode,
  ) => {
    commitState(updater(state), mode);
  };

  const visibleWallets = useMemo(() => {
    return sortWallets(
      data.wallets.filter((wallet) => walletMatchesState(wallet, state)),
      state.sort,
    );
  }, [data.wallets, state]);

  const platformOptions = useMemo(
    () =>
      WALLET_PLATFORMS.filter((platform) =>
        data.wallets.some((wallet) => wallet.platforms.includes(platform)),
      ),
    [data.wallets],
  );

  const getCategoryCount = (category: WalletCategory | "all") => {
    return data.wallets.filter((wallet) => {
      if (!walletMatchesState(wallet, state, "category")) {
        return false;
      }

      return (
        category === "all" || getWalletCategories(wallet).includes(category)
      );
    }).length;
  };

  const getPlatformCount = (platform: WalletPlatform) => {
    return data.wallets.filter(
      (wallet) =>
        walletMatchesState(wallet, state, "platforms") &&
        wallet.platforms.includes(platform),
    ).length;
  };

  const getFeatureCount = (feature: WalletFeature) => {
    return data.wallets.filter(
      (wallet) =>
        walletMatchesState(wallet, state, "features") &&
        wallet.features.includes(feature),
    ).length;
  };

  const activeFilters = [
    ...(state.category !== "all"
      ? [
          {
            id: "category",
            label: WALLET_CATEGORY_LABELS[state.category],
            remove: () =>
              updateState((current) => ({ ...current, category: "all" })),
          },
        ]
      : []),
    ...state.platforms.map((platform) => ({
      id: `platform-${platform}`,
      label: WALLET_PLATFORM_LABELS[platform],
      remove: () =>
        updateState((current) => ({
          ...current,
          platforms: current.platforms.filter((item) => item !== platform),
        })),
    })),
    ...state.features.map((feature) => ({
      id: `feature-${feature}`,
      label: WALLET_FEATURE_LABELS[feature],
      remove: () =>
        updateState((current) => ({
          ...current,
          features: current.features.filter((item) => item !== feature),
        })),
    })),
  ];

  const clearFilters = () => {
    updateState((current) => ({
      ...DEFAULT_STATE,
      view: current.view,
      sort: current.sort,
    }));
  };

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Wallet directory</p>
        <h1>Find a wallet for how you use Solana</h1>
        <div className={styles.heroFoot}>
          <p className={styles.heroText}>
            A wallet is where you hold assets, approve transactions, and connect
            to apps. Compare Solana wallets by platform, custody, and the
            features that matter to you.
          </p>
          <div className={styles.heroActions}>
            <a href="#wallet-directory" className={styles.primaryAction}>
              Find a wallet
            </a>
            <a href="#build-wallets" className={styles.secondaryAction}>
              Build with wallets
            </a>
          </div>
        </div>
      </header>

      <section className={styles.featuredStrip} aria-label="Featured wallets">
        <div className={styles.featuredStripHeader}>
          <span>Featured</span>
          <a href="#wallet-directory">All {data.wallets.length} wallets</a>
        </div>
        <div className={styles.featuredList}>
          {featuredWallets.map((wallet) => (
            <a
              key={wallet.id}
              href={wallet.website}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.featuredWallet}
            >
              <WalletLogo wallet={wallet} size="small" />
              <span>
                <strong>{wallet.name}</strong>
                <small>{getWalletCategoryLabel(wallet)}</small>
              </span>
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <section id="wallet-directory" className={styles.directorySection}>
        <div className={styles.directoryHeader}>
          <div>
            <p className={styles.eyebrow}>Directory</p>
            <h2>Compare Solana wallets</h2>
          </div>
          <div className={styles.attribution}>
            <a
              href="https://thegrid.id/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.gridAttributionLink}
              aria-label="Wallet URLs sourced from The Grid"
            >
              <span>URLs sourced from</span>
              <img
                src="/images/logos/the-grid-white.svg"
                alt="The Grid"
                width={84}
                height={18}
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>
        </div>

        <div className={styles.toolbar}>
          <label className={styles.searchField}>
            <Search size={18} aria-hidden="true" />
            <span className={styles.srOnly}>Search wallets</span>
            <input
              type="search"
              value={state.search}
              placeholder="Search wallets"
              onChange={(event) =>
                updateState(
                  (current) => ({ ...current, search: event.target.value }),
                  "replace",
                )
              }
            />
          </label>

          <button
            className={styles.mobileFilterButton}
            type="button"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal size={18} aria-hidden="true" />
            Filters
            {activeFilters.length > 0 && <span>{activeFilters.length}</span>}
          </button>

          <label className={styles.sortField}>
            <span>Sort</span>
            <select
              value={state.sort}
              onChange={(event) =>
                updateState((current) => ({
                  ...current,
                  sort: event.target.value as DirectorySort,
                }))
              }
            >
              <option value="recommended">Recommended</option>
              <option value="name">A to Z</option>
            </select>
          </label>

          <div className={styles.viewToggle} aria-label="Choose result view">
            <button
              type="button"
              aria-pressed={state.view === "grid"}
              onClick={() =>
                updateState((current) => ({ ...current, view: "grid" }))
              }
            >
              <Grid2X2 size={18} aria-hidden="true" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              aria-pressed={state.view === "list"}
              onClick={() =>
                updateState((current) => ({ ...current, view: "list" }))
              }
            >
              <List size={18} aria-hidden="true" />
              <span>List</span>
            </button>
          </div>
        </div>

        <div className={styles.categoryTabs} aria-label="Wallet categories">
          <button
            type="button"
            className={state.category === "all" ? styles.activeTab : ""}
            onClick={() =>
              updateState((current) => ({ ...current, category: "all" }))
            }
          >
            All <span>{getCategoryCount("all")}</span>
          </button>
          {WALLET_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={state.category === category ? styles.activeTab : ""}
              onClick={() =>
                updateState((current) => ({ ...current, category }))
              }
            >
              {WALLET_CATEGORY_LABELS[category]}{" "}
              <span>{getCategoryCount(category)}</span>
            </button>
          ))}
        </div>

        {activeFilters.length > 0 && (
          <div className={styles.activeFilters} aria-label="Active filters">
            {activeFilters.map((filter) => (
              <button key={filter.id} type="button" onClick={filter.remove}>
                {filter.label}
                <X size={14} aria-hidden="true" />
              </button>
            ))}
            <button
              type="button"
              className={styles.clearButton}
              onClick={clearFilters}
            >
              Clear all
            </button>
          </div>
        )}

        <div className={styles.directoryLayout}>
          <aside
            className={`${styles.filters} ${filtersOpen ? styles.filtersOpen : ""}`}
            aria-label="Wallet filters"
          >
            <div className={styles.filtersHeader}>
              <h3>Filters</h3>
              <button
                type="button"
                className={styles.closeFiltersButton}
                onClick={() => setFiltersOpen(false)}
              >
                <X size={18} aria-hidden="true" />
                <span className={styles.srOnly}>Close filters</span>
              </button>
            </div>

            <fieldset>
              <legend>Platforms</legend>
              <div className={styles.filterOptions}>
                {platformOptions.map((platform) => {
                  const count = getPlatformCount(platform);
                  const checked = state.platforms.includes(platform);

                  if (count === 0 && !checked) {
                    return null;
                  }

                  return (
                    <label key={platform} className={styles.checkOption}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          updateState((current) => ({
                            ...current,
                            platforms: toggleArrayValue(
                              current.platforms,
                              platform,
                            ),
                          }))
                        }
                      />
                      <span>{WALLET_PLATFORM_LABELS[platform]}</span>
                      <small>{count}</small>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {FEATURE_GROUPS.map((group) => {
              const visibleOptions = group.options.filter(
                (feature) =>
                  getFeatureCount(feature) > 0 ||
                  state.features.includes(feature),
              );

              if (!visibleOptions.length) {
                return null;
              }

              return (
                <fieldset key={group.label}>
                  <legend>{group.label}</legend>
                  <div className={styles.filterOptions}>
                    {visibleOptions.map((feature) => {
                      const count = getFeatureCount(feature);
                      const checked = state.features.includes(feature);

                      return (
                        <label
                          key={feature}
                          className={styles.checkOption}
                          title={WALLET_FEATURE_DESCRIPTIONS[feature]}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              updateState((current) => ({
                                ...current,
                                features: toggleArrayValue(
                                  current.features,
                                  feature,
                                ),
                              }))
                            }
                          />
                          <span>{WALLET_FEATURE_LABELS[feature]}</span>
                          <small>{count}</small>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}

            <button
              type="button"
              className={styles.applyFiltersButton}
              onClick={() => setFiltersOpen(false)}
            >
              Show {visibleWallets.length} wallets
            </button>
          </aside>

          <section className={styles.results} aria-label="Wallet results">
            <div className={styles.resultsHeader}>
              <p aria-live="polite">
                Showing <strong>{visibleWallets.length}</strong> of{" "}
                {data.wallets.length} wallets
              </p>
            </div>

            {visibleWallets.length > 0 ? (
              <div
                className={
                  state.view === "grid" ? styles.walletGrid : styles.walletList
                }
              >
                {visibleWallets.map((wallet) =>
                  state.view === "grid" ? (
                    <WalletCard key={wallet.id} wallet={wallet} />
                  ) : (
                    <WalletRow key={wallet.id} wallet={wallet} />
                  ),
                )}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <h3>No wallets match these filters</h3>
                <p>Remove a filter or clear the current selection.</p>
                <button type="button" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            )}
          </section>
        </div>

        <p className={styles.disclaimer}>
          Wallet URLs are sourced through The Grid for research and maintained
          in Solana ecosystem records with Solana-maintained feature research.
          Listings are informational and do not imply endorsement by the Solana
          Foundation or The Grid.
        </p>
      </section>

      <section id="build-wallets" className={styles.builderSection}>
        <div>
          <p className={styles.eyebrow}>For builders</p>
          <h2>Build wallet experiences on Solana</h2>
          <p>
            Solana supports self-custody, embedded wallets, payments, token
            extensions, sponsored transactions, and multisig workflows for teams
            building consumer or institutional products.
          </p>
        </div>
        <div className={styles.builderLinks}>
          <a href="https://solana.com/docs/intro/wallets">
            Wallet docs <ExternalLink size={15} aria-hidden="true" />
          </a>
          <a href="https://solana.com/solutions/actions">
            Actions and Blinks <ExternalLink size={15} aria-hidden="true" />
          </a>
          <a href="https://share.hsforms.com/1GE1hYdApQGaDiCgaiWMXHA5lohw">
            Apply for a grant <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
