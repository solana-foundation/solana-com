"use client";

import { useLocale, useTranslations } from "@workspace/i18n/client";
import { Link } from "@workspace/i18n/routing";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ExternalLink,
  Grid2X2,
  List,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  WALLET_CATEGORIES,
  WALLET_FEATURES,
  WALLET_PLATFORMS,
  type WalletCategory,
  type WalletDirectoryData,
  type WalletDirectoryEntry,
  type WalletFeature,
  type WalletPlatform,
} from "./wallet-directory";
import styles from "./WalletDirectory.module.scss";

type DirectoryView = "grid" | "list";

type DirectoryState = {
  category: WalletCategory | "all";
  platforms: WalletPlatform[];
  features: WalletFeature[];
  search: string;
  view: DirectoryView;
};

type FilterGroupId = "platforms";

type QueryUpdateMode = "push" | "replace";

const DEFAULT_STATE: DirectoryState = {
  category: "all",
  platforms: [],
  features: [],
  search: "",
  view: "grid",
};

const FEATURED_WALLET_COUNT = 4;
const FEATURED_WALLET_IDS = [
  "solflare",
  "backpack",
  "phantom",
  "squadsx",
  "fuse",
  "unruggable",
  "jupiter",
] as const;

type FeatureGroupId =
  | "ownership"
  | "everyday"
  | "solana"
  | "security"
  | "builders"
  | "networks";

type FeatureMatchGroupId = WalletFeature | "custody_model";

const FEATURE_GROUPS: Array<{
  id: FeatureGroupId;
  options: WalletFeature[];
}> = [
  {
    id: "ownership",
    options: ["non_custodial", "custodial", "mpc", "social_recovery"],
  },
  {
    id: "everyday",
    options: ["buy_crypto", "sell_crypto", "staking", "hold_nfts"],
  },
  {
    id: "solana",
    options: ["solana_native", "te", "blinks_and_actions", "solana_pay"],
  },
  {
    id: "security",
    options: ["hardware", "multi_sig", "spending_limits", "open_source"],
  },
  {
    id: "builders",
    options: ["gas_abstraction", "private_key_infrastructure"],
  },
  {
    id: "networks",
    options: ["multi_chain"],
  },
];

const CATEGORY_ORDER: WalletCategory[] = [
  "consumer",
  "hardware",
  "institutional",
  "payments",
  "infrastructure",
];

const QUICK_FILTERS: WalletFeature[] = [
  "non_custodial",
  "buy_crypto",
  "staking",
  "hold_nfts",
  "hardware",
  "multi_sig",
];

const PLATFORM_GROUPS: Array<{
  id: "apps" | "extensions" | "developers";
  options: WalletPlatform[];
}> = [
  {
    id: "apps",
    options: ["ios", "android", "desktop", "web", "hardware"],
  },
  {
    id: "extensions",
    options: ["chrome", "firefox", "brave", "edge"],
  },
  { id: "developers", options: ["api", "sdk"] },
];

const LEARN_RESOURCES: Array<{
  id: "whatIsWallet" | "sendingSol" | "stayingSafe" | "staking";
  href: string;
}> = [
  {
    id: "whatIsWallet",
    href: "/learn/what-is-a-wallet",
  },
  {
    id: "sendingSol",
    href: "/learn/sending-and-receiving-sol",
  },
  {
    id: "stayingSafe",
    href: "/learn/staying-safe-on-solana",
  },
  {
    id: "staking",
    href: "/learn/what-is-staking",
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

  return {
    category:
      category && CATEGORY_ORDER.includes(category as WalletCategory)
        ? (category as WalletCategory)
        : "all",
    platforms: parseCsv(searchParams.get("platform"), WALLET_PLATFORMS),
    features: parseCsv(searchParams.get("features"), WALLET_FEATURES),
    search: searchParams.get("q") ?? "",
    view: view === "list" ? "list" : "grid",
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

  return params;
}

function toggleArrayValue<T extends string>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function getInitialFeaturedWallets(wallets: WalletDirectoryEntry[]) {
  const walletsById = new Map(wallets.map((wallet) => [wallet.id, wallet]));

  return FEATURED_WALLET_IDS.map((id) => walletsById.get(id))
    .filter((wallet): wallet is WalletDirectoryEntry => Boolean(wallet))
    .slice(0, FEATURED_WALLET_COUNT);
}

function getWalletCategories(wallet: WalletDirectoryEntry) {
  return wallet.categories.length ? wallet.categories : [wallet.category];
}

function getWalletCategoryLabel(
  wallet: WalletDirectoryEntry,
  categoryLabels: Record<WalletCategory, string>,
) {
  const categories = getWalletCategories(wallet);
  const extraCategories = categories.filter(
    (category) => category !== wallet.category,
  ).length;

  return `${categoryLabels[wallet.category]}${extraCategories > 0 ? ` +${extraCategories}` : ""}`;
}

function getFeatureMatchGroup(feature: WalletFeature): FeatureMatchGroupId {
  return feature === "non_custodial" || feature === "custodial"
    ? "custody_model"
    : feature;
}

function walletMatchesSelectedFeatures(
  wallet: WalletDirectoryEntry,
  selectedFeatures: WalletFeature[],
  ignoredGroup?: FeatureMatchGroupId,
) {
  const selectedGroups = new Set(selectedFeatures.map(getFeatureMatchGroup));

  return [...selectedGroups].every((group) => {
    if (group === ignoredGroup) {
      return true;
    }

    const selectedInGroup = selectedFeatures.filter(
      (feature) => getFeatureMatchGroup(feature) === group,
    );

    return selectedInGroup.some((feature) => wallet.features.includes(feature));
  });
}

function walletMatchesState(
  wallet: WalletDirectoryEntry,
  state: DirectoryState,
  labels: {
    categories: Record<WalletCategory, string>;
    platforms: Record<WalletPlatform, string>;
    features: Record<WalletFeature, string>;
  },
  options: {
    ignoreGroup?: FilterGroupId | "category" | "search";
    ignoreFeatureGroup?: FeatureMatchGroupId;
  } = {},
) {
  const { ignoreGroup, ignoreFeatureGroup } = options;

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

  if (
    !walletMatchesSelectedFeatures(wallet, state.features, ignoreFeatureGroup)
  ) {
    return false;
  }

  if (ignoreGroup !== "search" && state.search.trim()) {
    const query = state.search.trim().toLowerCase();
    const searchable = [
      wallet.name,
      wallet.description,
      ...getWalletCategories(wallet).map(
        (category) => labels.categories[category],
      ),
      ...wallet.platforms.map((platform) => labels.platforms[platform]),
      ...wallet.features.map((feature) => labels.features[feature]),
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

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function WalletLogo({
  wallet,
  size = "default",
}: {
  wallet: WalletDirectoryEntry;
  size?: "default" | "small";
}) {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const iconUrls = useMemo(() => {
    const candidates = wallet.iconUrls?.length
      ? wallet.iconUrls
      : [wallet.iconUrl];
    return [
      ...new Set(candidates.filter((url): url is string => Boolean(url))),
    ];
  }, [wallet.iconUrl, wallet.iconUrls]);
  const iconUrl = iconUrls[candidateIndex];

  if (!iconUrl) {
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
      className={`${styles.logo} ${styles[`logo-${size}`]}`}
      loading="lazy"
      decoding="async"
      onError={() => {
        setCandidateIndex((current) => current + 1);
      }}
    />
  );
}

function formatVerificationDate(value: string | undefined, locale: string) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

function WalletTags({
  wallet,
  limit = 3,
}: {
  wallet: WalletDirectoryEntry;
  limit?: number;
}) {
  const t = useTranslations("wallets");
  const tags = wallet.features.slice(0, limit);
  const remaining = wallet.features.length - tags.length;

  if (!tags.length) {
    return null;
  }

  return (
    <p className={styles.featureLine}>
      {tags.map((feature) => t(`taxonomy.features.${feature}`)).join(" · ")}
      {remaining > 0 ? ` · +${remaining}` : ""}
    </p>
  );
}

function PlatformList({ wallet }: { wallet: WalletDirectoryEntry }) {
  const t = useTranslations("wallets");
  const platforms = wallet.platforms.slice(0, 5);
  const remaining = wallet.platforms.length - platforms.length;

  if (!platforms.length) {
    return (
      <span className={styles.mutedText}>{t("card.platformPending")}</span>
    );
  }

  return (
    <p className={styles.platformLine}>
      {platforms
        .map((platform) => t(`taxonomy.platforms.${platform}`))
        .join(" · ")}
      {remaining > 0 ? ` +${remaining}` : ""}
    </p>
  );
}

function WalletCard({
  wallet,
  categoryLabels,
}: {
  wallet: WalletDirectoryEntry;
  categoryLabels: Record<WalletCategory, string>;
}) {
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
      <p className={styles.walletCategory}>
        {getWalletCategoryLabel(wallet, categoryLabels)}
      </p>
      <p className={styles.walletDescription}>{wallet.description}</p>
      <div className={styles.walletMeta}>
        <PlatformList wallet={wallet} />
        <WalletTags wallet={wallet} />
      </div>
    </article>
  );
}

function WalletRow({
  wallet,
  categoryLabels,
}: {
  wallet: WalletDirectoryEntry;
  categoryLabels: Record<WalletCategory, string>;
}) {
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
        <span>{getWalletCategoryLabel(wallet, categoryLabels)}</span>
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
  const t = useTranslations("wallets");
  const locale = useLocale();
  const [state, setState] = useState<DirectoryState>(DEFAULT_STATE);
  const featuredWallets = useMemo(
    () => getInitialFeaturedWallets(data.wallets),
    [data.wallets],
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterPanelRef = useRef<HTMLElement>(null);
  const closeFiltersButtonRef = useRef<HTMLButtonElement>(null);
  const taxonomyLabels = useMemo(
    () => ({
      categories: Object.fromEntries(
        WALLET_CATEGORIES.map((category) => [
          category,
          t(`taxonomy.categories.${category}`),
        ]),
      ) as Record<WalletCategory, string>,
      platforms: Object.fromEntries(
        WALLET_PLATFORMS.map((platform) => [
          platform,
          t(`taxonomy.platforms.${platform}`),
        ]),
      ) as Record<WalletPlatform, string>,
      features: Object.fromEntries(
        WALLET_FEATURES.map((feature) => [
          feature,
          t(`taxonomy.features.${feature}`),
        ]),
      ) as Record<WalletFeature, string>,
    }),
    [t],
  );

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
    if (!filtersOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const filterButton = filterButtonRef.current;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFiltersOpen(false);
        return;
      }

      if (event.key !== "Tab" || !filterPanelRef.current) {
        return;
      }

      const focusableElements = Array.from(
        filterPanelRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), [href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeFiltersButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      filterButton?.focus();
    };
  }, [filtersOpen]);

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
    return data.wallets.filter((wallet) =>
      walletMatchesState(wallet, state, taxonomyLabels),
    );
  }, [data.wallets, state, taxonomyLabels]);

  const platformOptions = useMemo(
    () =>
      WALLET_PLATFORMS.filter((platform) =>
        data.wallets.some((wallet) => wallet.platforms.includes(platform)),
      ),
    [data.wallets],
  );

  const getCategoryCount = (category: WalletCategory | "all") => {
    return data.wallets.filter((wallet) => {
      if (
        !walletMatchesState(wallet, state, taxonomyLabels, {
          ignoreGroup: "category",
        })
      ) {
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
        walletMatchesState(wallet, state, taxonomyLabels, {
          ignoreGroup: "platforms",
        }) && wallet.platforms.includes(platform),
    ).length;
  };

  const getFeatureCount = (feature: WalletFeature) => {
    const featureGroup = getFeatureMatchGroup(feature);

    return data.wallets.filter(
      (wallet) =>
        walletMatchesState(wallet, state, taxonomyLabels, {
          ignoreFeatureGroup: featureGroup,
        }) && wallet.features.includes(feature),
    ).length;
  };

  const activeFacets = [
    ...(state.category !== "all"
      ? [
          {
            id: "category",
            label: t(`directory.audience.categories.${state.category}.label`),
            remove: () =>
              updateState((current) => ({ ...current, category: "all" })),
          },
        ]
      : []),
    ...state.platforms.map((platform) => ({
      id: `platform-${platform}`,
      label: taxonomyLabels.platforms[platform],
      remove: () =>
        updateState((current) => ({
          ...current,
          platforms: current.platforms.filter((item) => item !== platform),
        })),
    })),
    ...state.features.map((feature) => ({
      id: `feature-${feature}`,
      label: taxonomyLabels.features[feature],
      remove: () =>
        updateState((current) => ({
          ...current,
          features: current.features.filter((item) => item !== feature),
        })),
    })),
  ];

  const activeFilters = [
    ...activeFacets,
    ...(state.search.trim()
      ? [
          {
            id: "search",
            label: t("directory.search.active", {
              query: state.search.trim(),
            }),
            remove: () =>
              updateState((current) => ({ ...current, search: "" }), "replace"),
          },
        ]
      : []),
  ];

  const clearFilters = () => {
    updateState((current) => ({
      ...DEFAULT_STATE,
      view: current.view,
    }));
  };

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>{t("hero.eyebrow")}</p>
        <h1>{t("hero.headline")}</h1>
        <div className={styles.heroFoot}>
          <p className={styles.heroText}>{t("hero.body")}</p>
          <div className={styles.heroActions}>
            <a href="#wallet-directory" className={styles.primaryAction}>
              {t("hero.findWallet")}
            </a>
            <a href="#learn-wallets" className={styles.secondaryAction}>
              {t("hero.learnBasics")}
            </a>
            <a href="#build-wallets" className={styles.secondaryAction}>
              {t("hero.buildWithWallets")}
            </a>
          </div>
        </div>
      </header>

      <section
        className={styles.featuredStrip}
        aria-label={t("featured.ariaLabel")}
      >
        <div className={styles.featuredStripHeader}>
          <span>{t("featured.label")}</span>
          <a href="#wallet-directory">
            {t("featured.allWallets", { count: data.wallets.length })}
          </a>
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
                <small>
                  {getWalletCategoryLabel(wallet, taxonomyLabels.categories)}
                </small>
              </span>
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <section id="wallet-directory" className={styles.directorySection}>
        <div className={styles.directoryHeader}>
          <div>
            <p className={styles.eyebrow}>{t("directory.eyebrow")}</p>
            <h2>{t("grid.title")}</h2>
          </div>
        </div>

        <div className={styles.audienceSection}>
          <div className={styles.filterNavIntro}>
            <h3 id="wallet-type-heading">{t("directory.audience.title")}</h3>
            <p>{t("directory.audience.description")}</p>
          </div>
          <div
            className={styles.audienceNav}
            role="group"
            aria-labelledby="wallet-type-heading"
          >
            <button
              type="button"
              className={styles.audienceOption}
              aria-pressed={state.category === "all"}
              onClick={() =>
                updateState((current) => ({ ...current, category: "all" }))
              }
            >
              <span className={styles.audienceOptionTop}>
                <strong>{t("filters.all-wallets")}</strong>
                <small>{getCategoryCount("all")}</small>
              </span>
              <span>{t("directory.audience.allDescription")}</span>
            </button>
            {CATEGORY_ORDER.map((category) => {
              const count = getCategoryCount(category);

              return (
                <button
                  key={category}
                  type="button"
                  className={styles.audienceOption}
                  aria-pressed={state.category === category}
                  disabled={count === 0 && state.category !== category}
                  onClick={() =>
                    updateState((current) => ({ ...current, category }))
                  }
                >
                  <span className={styles.audienceOptionTop}>
                    <strong>
                      {t(`directory.audience.categories.${category}.label`)}
                    </strong>
                    <small>{count}</small>
                  </span>
                  <span>
                    {t(`directory.audience.categories.${category}.description`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.quickFilterBar}>
          <span id="popular-needs-heading">
            {t("directory.popularNeeds.label")}
          </span>
          <div
            className={styles.quickFilters}
            role="group"
            aria-labelledby="popular-needs-heading"
          >
            {QUICK_FILTERS.map((feature) => {
              const checked = state.features.includes(feature);
              const count = getFeatureCount(feature);

              return (
                <button
                  key={feature}
                  type="button"
                  className={styles.quickFilter}
                  aria-pressed={checked}
                  disabled={count === 0 && !checked}
                  onClick={() =>
                    updateState((current) => ({
                      ...current,
                      features: toggleArrayValue(current.features, feature),
                    }))
                  }
                >
                  {checked && <Check size={14} aria-hidden="true" />}
                  {t(`directory.popularNeeds.options.${feature}`)}
                  <small>{count}</small>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchField}>
            <Search size={18} aria-hidden="true" />
            <label className={styles.srOnly} htmlFor="wallet-search">
              {t("directory.search.label")}
            </label>
            <input
              id="wallet-search"
              type="search"
              value={state.search}
              placeholder={t("directory.search.placeholder")}
              onChange={(event) =>
                updateState(
                  (current) => ({ ...current, search: event.target.value }),
                  "replace",
                )
              }
            />
            {state.search && (
              <button
                type="button"
                className={styles.clearSearchButton}
                aria-label={t("directory.search.clear")}
                onClick={() =>
                  updateState(
                    (current) => ({ ...current, search: "" }),
                    "replace",
                  )
                }
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          <button
            ref={filterButtonRef}
            className={styles.mobileFilterButton}
            type="button"
            aria-controls="wallet-filter-panel"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal size={18} aria-hidden="true" />
            {t("directory.filters.more")}
            {activeFacets.length > 0 && <span>{activeFacets.length}</span>}
          </button>

          <div
            className={styles.viewToggle}
            aria-label={t("directory.view.ariaLabel")}
          >
            <button
              type="button"
              aria-label={t("directory.view.gridAria")}
              aria-pressed={state.view === "grid"}
              onClick={() =>
                updateState((current) => ({ ...current, view: "grid" }))
              }
            >
              <Grid2X2 size={18} aria-hidden="true" />
              <span>{t("directory.view.grid")}</span>
            </button>
            <button
              type="button"
              aria-label={t("directory.view.listAria")}
              aria-pressed={state.view === "list"}
              onClick={() =>
                updateState((current) => ({ ...current, view: "list" }))
              }
            >
              <List size={18} aria-hidden="true" />
              <span>{t("directory.view.list")}</span>
            </button>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div
            className={styles.activeFilters}
            aria-label={t("directory.filters.activeAria")}
          >
            <span className={styles.activeFiltersLabel}>
              {t("directory.filters.selected")}
            </span>
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
              {t("directory.filters.clearAll")}
            </button>
          </div>
        )}

        <div className={styles.directoryLayout}>
          <button
            type="button"
            className={`${styles.filterBackdrop} ${filtersOpen ? styles.filterBackdropOpen : ""}`}
            aria-label={t("directory.filters.close")}
            tabIndex={filtersOpen ? 0 : -1}
            onClick={() => setFiltersOpen(false)}
          />
          <aside
            ref={filterPanelRef}
            id="wallet-filter-panel"
            className={`${styles.filters} ${filtersOpen ? styles.filtersOpen : ""}`}
            role={filtersOpen ? "dialog" : undefined}
            aria-modal={filtersOpen || undefined}
            aria-labelledby="wallet-filter-heading"
          >
            <div className={styles.filtersHeader}>
              <div>
                <h3 id="wallet-filter-heading">
                  {t("directory.filters.heading")}
                </h3>
                <p>{t("directory.filters.description")}</p>
              </div>
              <div className={styles.filtersHeaderActions}>
                <button
                  type="button"
                  disabled={activeFilters.length === 0}
                  onClick={clearFilters}
                >
                  {t("directory.filters.reset")}
                </button>
                <button
                  ref={closeFiltersButtonRef}
                  type="button"
                  className={styles.closeFiltersButton}
                  onClick={() => setFiltersOpen(false)}
                >
                  <X size={18} aria-hidden="true" />
                  <span className={styles.srOnly}>
                    {t("directory.filters.close")}
                  </span>
                </button>
              </div>
            </div>

            <fieldset>
              <legend>{t("directory.filters.devicePlatform")}</legend>
              <p className={styles.filterHint}>
                {t("directory.filters.devicePlatformHint")}
              </p>
              <div className={styles.platformGroups}>
                {PLATFORM_GROUPS.map((group) => (
                  <div key={group.id} className={styles.platformGroup}>
                    <h4>{t(`directory.filters.platformGroups.${group.id}`)}</h4>
                    <div className={styles.filterOptions}>
                      {group.options
                        .filter((platform) =>
                          platformOptions.includes(platform),
                        )
                        .map((platform) => {
                          const count = getPlatformCount(platform);
                          const checked = state.platforms.includes(platform);
                          const disabled = count === 0 && !checked;

                          return (
                            <label
                              key={platform}
                              className={styles.checkOption}
                              data-disabled={disabled || undefined}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={disabled}
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
                              <span>{taxonomyLabels.platforms[platform]}</span>
                              <small
                                aria-label={t(
                                  "directory.filters.resultCountAria",
                                  { count },
                                )}
                              >
                                {count}
                              </small>
                            </label>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>

            {FEATURE_GROUPS.map((group) => (
              <fieldset key={group.id}>
                <legend>
                  {t(`directory.filters.featureGroups.${group.id}.label`)}
                </legend>
                <p className={styles.filterHint}>
                  {t(`directory.filters.featureGroups.${group.id}.description`)}
                </p>
                <div className={styles.filterOptions}>
                  {group.options.map((feature) => {
                    const count = getFeatureCount(feature);
                    const checked = state.features.includes(feature);
                    const disabled = count === 0 && !checked;

                    return (
                      <label
                        key={feature}
                        className={styles.checkOption}
                        data-disabled={disabled || undefined}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={disabled}
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
                        <span>{taxonomyLabels.features[feature]}</span>
                        <small
                          aria-label={t("directory.filters.resultCountAria", {
                            count,
                          })}
                        >
                          {count}
                        </small>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <button
              type="button"
              className={styles.applyFiltersButton}
              onClick={() => setFiltersOpen(false)}
            >
              {t("directory.filters.showWallets", {
                count: visibleWallets.length,
              })}
            </button>
          </aside>

          <section
            className={styles.results}
            aria-label={t("directory.results.ariaLabel")}
          >
            <div className={styles.resultsHeader}>
              <p aria-live="polite">
                {t.rich("directory.results.showing", {
                  visible: visibleWallets.length,
                  total: data.wallets.length,
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
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
                    <WalletCard
                      key={wallet.id}
                      wallet={wallet}
                      categoryLabels={taxonomyLabels.categories}
                    />
                  ) : (
                    <WalletRow
                      key={wallet.id}
                      wallet={wallet}
                      categoryLabels={taxonomyLabels.categories}
                    />
                  ),
                )}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <h3>{t("grid.no-results")}</h3>
                <p>{t("directory.results.noResultsDescription")}</p>
                <button type="button" onClick={clearFilters}>
                  {t("grid.reset-filters")}
                </button>
              </div>
            )}
          </section>
        </div>

        <p className={styles.disclaimer}>{t("directory.results.disclaimer")}</p>
      </section>

      <section
        className={styles.methodologySection}
        aria-labelledby="wallet-methodology-heading"
      >
        <div className={styles.methodologyIntro}>
          <p className={styles.eyebrow}>{t("methodology.eyebrow")}</p>
          <h2 id="wallet-methodology-heading">{t("methodology.title")}</h2>
          {data.lastReviewed && (
            <p className={styles.lastReviewed}>
              {t("methodology.updated")}{" "}
              <time dateTime={data.lastReviewed}>
                {formatVerificationDate(data.lastReviewed, locale)}
              </time>
            </p>
          )}
        </div>
        <div className={styles.methodologyGrid}>
          <article>
            <h3>{t("methodology.reviewTitle")}</h3>
            <p>{t("methodology.reviewBody")}</p>
          </article>
          <article>
            <h3>{t("methodology.qualificationTitle")}</h3>
            <p>{t("methodology.qualificationBody")}</p>
          </article>
          <article className={styles.safetyNote}>
            <h3>{t("methodology.safetyTitle")}</h3>
            <p>{t("methodology.safetyBody")}</p>
          </article>
        </div>
        <a
          className={styles.correctionLink}
          href="https://github.com/solana-foundation/solana-com/issues/new"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("methodology.correction")}
          <ExternalLink size={15} aria-hidden="true" />
        </a>
      </section>

      <section
        id="learn-wallets"
        className={styles.learnSection}
        aria-label={t("learn.ariaLabel")}
      >
        <div className={styles.directoryHeader}>
          <div>
            <p className={styles.eyebrow}>{t("learn.eyebrow")}</p>
            <h2>{t("learn.title")}</h2>
          </div>
          <Link href="/learn" className={styles.learnIndexLink}>
            {t("learn.allGuides")}
          </Link>
        </div>
        <div className={styles.learnGrid}>
          {LEARN_RESOURCES.map((resource, index) => (
            <Link
              key={resource.href}
              href={resource.href}
              className={styles.learnCard}
            >
              <div className={styles.learnCardTop}>
                <span className={styles.learnTopic}>
                  {String(index + 1).padStart(2, "0")} ·{" "}
                  {t(`learn.resources.${resource.id}.topic`)}
                </span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </div>
              <h3>{t(`learn.resources.${resource.id}.title`)}</h3>
              <p>{t(`learn.resources.${resource.id}.description`)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="build-wallets" className={styles.builderSection}>
        <div>
          <p className={styles.eyebrow}>{t("builders.eyebrow")}</p>
          <h2>{t("builders.title")}</h2>
          <p>{t("builders.description")}</p>
        </div>
        <div className={styles.builderLinks}>
          <a href="https://solana.com/docs/intro/wallets">
            {t("builders.walletDocs")}{" "}
            <ExternalLink size={15} aria-hidden="true" />
          </a>
          <a href="https://solana.com/solutions/actions">
            {t("builders.actions")}{" "}
            <ExternalLink size={15} aria-hidden="true" />
          </a>
          <a href="https://share.hsforms.com/1GE1hYdApQGaDiCgaiWMXHA5lohw">
            {t("builders.grant")} <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
