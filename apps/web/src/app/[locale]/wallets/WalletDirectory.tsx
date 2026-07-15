"use client";

import Link from "next/link";
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
  DEFAULT_WALLET_ICON_URL,
  WALLET_CATEGORY_LABELS,
  WALLET_FEATURE_LABELS,
  WALLET_PLATFORM_LABELS,
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
  label: string;
  description: string;
  options: WalletFeature[];
}> = [
  {
    id: "ownership",
    label: "Ownership and recovery",
    description: "How access to the wallet and its assets is controlled.",
    options: ["non_custodial", "custodial", "mpc", "social_recovery"],
  },
  {
    id: "everyday",
    label: "Everyday use",
    description: "Common things you may want to do from your wallet.",
    options: ["buy_crypto", "sell_crypto", "staking", "hold_nfts"],
  },
  {
    id: "solana",
    label: "Solana experiences",
    description: "Features built for Solana apps, tokens, and payments.",
    options: ["solana_native", "te", "blinks_and_actions", "solana_pay"],
  },
  {
    id: "security",
    label: "Security and shared control",
    description: "Extra protection for holdings, teams, and treasuries.",
    options: ["hardware", "multi_sig", "spending_limits", "open_source"],
  },
  {
    id: "builders",
    label: "Developer capabilities",
    description: "Infrastructure for building wallet experiences into apps.",
    options: ["gas_abstraction", "private_key_infrastructure"],
  },
  {
    id: "networks",
    label: "Networks",
    description: "Choose whether the wallet also supports other chains.",
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

const CATEGORY_NAV: Record<
  WalletCategory,
  { label: string; description: string }
> = {
  consumer: {
    label: "Everyday wallets",
    description: "Use apps, tokens, and collectibles",
  },
  hardware: {
    label: "Hardware wallets",
    description: "Keep keys on a dedicated device",
  },
  institutional: {
    label: "Teams and institutions",
    description: "Manage policy and shared approvals",
  },
  payments: {
    label: "Payments",
    description: "Buy, sell, pay, and get paid",
  },
  infrastructure: {
    label: "Developer tools",
    description: "APIs, SDKs, and embedded wallets",
  },
};

const QUICK_FILTERS: Array<{
  feature: WalletFeature;
  label: string;
}> = [
  { feature: "non_custodial", label: "Self-custody" },
  { feature: "buy_crypto", label: "Buy crypto" },
  { feature: "staking", label: "Stake SOL" },
  { feature: "hold_nfts", label: "View NFTs" },
  { feature: "hardware", label: "Hardware support" },
  { feature: "multi_sig", label: "Multisig" },
];

const PLATFORM_GROUPS: Array<{
  label: string;
  options: WalletPlatform[];
}> = [
  {
    label: "Apps and devices",
    options: ["ios", "android", "desktop", "web", "hardware"],
  },
  {
    label: "Browser extensions",
    options: ["chrome", "firefox", "brave", "edge"],
  },
  { label: "For developers", options: ["api", "sdk"] },
];

const LEARN_RESOURCES: Array<{
  href: string;
  topic: string;
  title: string;
  description: string;
}> = [
  {
    href: "/learn/what-is-a-wallet",
    topic: "Basics",
    title: "What is a wallet?",
    description:
      "How wallets hold your keys, sign transactions, and connect you to applications — and how to set one up safely.",
  },
  {
    href: "/learn/sending-and-receiving-sol",
    topic: "First steps",
    title: "Sending and receiving SOL",
    description:
      "Make your first transfer: how addresses work, what fees to expect, and how transactions confirm in seconds.",
  },
  {
    href: "/learn/staying-safe-on-solana",
    topic: "Security",
    title: "Staying safe on Solana",
    description:
      "Protect your seed phrase, spot common scams, and review transactions before you approve them.",
  },
  {
    href: "/learn/what-is-staking",
    topic: "Earning",
    title: "What is staking?",
    description:
      "Earn rewards for helping secure the network, straight from wallets in this directory that support staking.",
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
    features: parseCsv(
      searchParams.get("features"),
      Object.keys(WALLET_FEATURE_LABELS) as WalletFeature[],
    ),
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

function sortWallets(wallets: WalletDirectoryEntry[]) {
  return [...wallets].sort((a, b) => a.name.localeCompare(b.name));
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
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [isWordmark, setIsWordmark] = useState(false);
  const iconUrls = useMemo(() => {
    const candidates = wallet.iconUrls?.length
      ? wallet.iconUrls
      : [wallet.iconUrl];
    return [
      ...new Set(
        [...candidates, DEFAULT_WALLET_ICON_URL].filter((url): url is string =>
          Boolean(url),
        ),
      ),
    ];
  }, [wallet.iconUrl, wallet.iconUrls]);
  const iconUrl = iconUrls[candidateIndex];

  const measure = (image: HTMLImageElement) => {
    if (image.naturalWidth && image.naturalHeight) {
      setIsWordmark(
        image.naturalWidth / image.naturalHeight > WORDMARK_ASPECT_RATIO,
      );
    }
  };

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
        setCandidateIndex((current) => current + 1);
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
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterPanelRef = useRef<HTMLElement>(null);
  const closeFiltersButtonRef = useRef<HTMLButtonElement>(null);

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
    return sortWallets(
      data.wallets.filter((wallet) => walletMatchesState(wallet, state)),
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
      if (!walletMatchesState(wallet, state, { ignoreGroup: "category" })) {
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
        walletMatchesState(wallet, state, { ignoreGroup: "platforms" }) &&
        wallet.platforms.includes(platform),
    ).length;
  };

  const getFeatureCount = (feature: WalletFeature) => {
    const featureGroup = getFeatureMatchGroup(feature);

    return data.wallets.filter(
      (wallet) =>
        walletMatchesState(wallet, state, {
          ignoreFeatureGroup: featureGroup,
        }) && wallet.features.includes(feature),
    ).length;
  };

  const activeFacets = [
    ...(state.category !== "all"
      ? [
          {
            id: "category",
            label: CATEGORY_NAV[state.category].label,
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

  const activeFilters = [
    ...activeFacets,
    ...(state.search.trim()
      ? [
          {
            id: "search",
            label: `Search: “${state.search.trim()}”`,
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
            <a href="#learn-wallets" className={styles.secondaryAction}>
              Learn the basics
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

        <div className={styles.audienceSection}>
          <div className={styles.filterNavIntro}>
            <h3 id="wallet-type-heading">What kind of wallet do you need?</h3>
            <p>
              Choose a starting point, then refine only what matters to you.
            </p>
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
                <strong>All wallets</strong>
                <small>{getCategoryCount("all")}</small>
              </span>
              <span>Explore the full directory</span>
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
                    <strong>{CATEGORY_NAV[category].label}</strong>
                    <small>{count}</small>
                  </span>
                  <span>{CATEGORY_NAV[category].description}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.quickFilterBar}>
          <span id="popular-needs-heading">Popular needs</span>
          <div
            className={styles.quickFilters}
            role="group"
            aria-labelledby="popular-needs-heading"
          >
            {QUICK_FILTERS.map(({ feature, label }) => {
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
                  {label}
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
              Search by wallet name or feature
            </label>
            <input
              id="wallet-search"
              type="search"
              value={state.search}
              placeholder="Search by wallet name or feature"
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
                aria-label="Clear search"
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
            More filters
            {activeFacets.length > 0 && <span>{activeFacets.length}</span>}
          </button>

          <div className={styles.viewToggle} aria-label="Choose result view">
            <button
              type="button"
              aria-label="Grid view"
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
              aria-label="List view"
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

        {activeFilters.length > 0 && (
          <div className={styles.activeFilters} aria-label="Active filters">
            <span className={styles.activeFiltersLabel}>Selected</span>
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
          <button
            type="button"
            className={`${styles.filterBackdrop} ${filtersOpen ? styles.filterBackdropOpen : ""}`}
            aria-label="Close filters"
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
                <h3 id="wallet-filter-heading">Refine results</h3>
                <p>Add requirements to narrow your matches.</p>
              </div>
              <div className={styles.filtersHeaderActions}>
                <button
                  type="button"
                  disabled={activeFilters.length === 0}
                  onClick={clearFilters}
                >
                  Reset
                </button>
                <button
                  ref={closeFiltersButtonRef}
                  type="button"
                  className={styles.closeFiltersButton}
                  onClick={() => setFiltersOpen(false)}
                >
                  <X size={18} aria-hidden="true" />
                  <span className={styles.srOnly}>Close filters</span>
                </button>
              </div>
            </div>

            <fieldset>
              <legend>Device and platform</legend>
              <p className={styles.filterHint}>
                Where you want to access or integrate the wallet.
              </p>
              <div className={styles.platformGroups}>
                {PLATFORM_GROUPS.map((group) => (
                  <div key={group.label} className={styles.platformGroup}>
                    <h4>{group.label}</h4>
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
                              <span>{WALLET_PLATFORM_LABELS[platform]}</span>
                              <small aria-label={`${count} results`}>
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
                <legend>{group.label}</legend>
                <p className={styles.filterHint}>{group.description}</p>
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
                        <span>{WALLET_FEATURE_LABELS[feature]}</span>
                        <small aria-label={`${count} results`}>{count}</small>
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

      <section
        id="learn-wallets"
        className={styles.learnSection}
        aria-label="Learn about wallets"
      >
        <div className={styles.directoryHeader}>
          <div>
            <p className={styles.eyebrow}>Learn</p>
            <h2>New to wallets? Start here</h2>
          </div>
          <Link href="/learn" className={styles.learnIndexLink}>
            All learn guides
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
                  {String(index + 1).padStart(2, "0")} · {resource.topic}
                </span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </div>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
            </Link>
          ))}
        </div>
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
