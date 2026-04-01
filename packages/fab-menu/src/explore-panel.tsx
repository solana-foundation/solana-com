/** @jsxImportSource preact */
import { useEffect, useRef, useState } from "preact/hooks";
import type { MenuData, FabMenuConfig, TabIcon } from "./types";
import { setupDialogBehavior } from "./dialog";
import { SolanaColorIcon } from "./icons/solana-color";
import { CloseIcon } from "./icons/close";
import { SearchIcon } from "./icons/search";
import { ExternalIcon } from "./icons/external";
import { TabBuilderIcon } from "./icons/tab-builder";
import { TabBusinessIcon } from "./icons/tab-business";
import { TabConsumerIcon } from "./icons/tab-consumer";
import {
  DocsIcon,
  ApiIcon,
  TemplatesIcon,
  SchoolIcon,
  EvmIcon,
  CalendarIcon,
  CoinIcon,
  TokenizeIcon,
  BankIcon,
  EnterpriseIcon,
  InfraIcon,
  RwaIcon,
  WalletIcon,
  LearnIcon,
  DefiIcon,
  CommunityIcon,
} from "./icons/link-icons";
import type { JSX } from "preact";

const TAB_ICON_MAP: Record<
  TabIcon,
  (p: JSX.SVGAttributes<SVGSVGElement>) => JSX.Element
> = {
  builder: TabBuilderIcon,
  business: TabBusinessIcon,
  consumer: TabConsumerIcon,
};

const LINK_ICON_MAP: Record<
  string,
  (p: JSX.SVGAttributes<SVGSVGElement>) => JSX.Element
> = {
  "/docs": DocsIcon,
  "/docs/rpc": ApiIcon,
  "/developers/templates": TemplatesIcon,
  "/developers": SchoolIcon,
  "/developers/evm-to-svm": EvmIcon,
  "/events": CalendarIcon,
  "/solutions/stablecoins": CoinIcon,
  "/solutions/tokenization": TokenizeIcon,
  "/solutions/institutional-payments": BankIcon,
  "/solutions/enterprise": EnterpriseIcon,
  "/solutions/financial-infrastructure": InfraIcon,
  "/solutions/real-world-assets": RwaIcon,
  "/learn": LearnIcon,
  "/wallets": WalletIcon,
  "/staking": CoinIcon,
  "/learn/introduction-to-defi-on-solana": DefiIcon,
  "/learn/what-is-solana": LearnIcon,
  "/community": CommunityIcon,
};

function getLinkIcon(
  href: string,
): (p: JSX.SVGAttributes<SVGSVGElement>) => JSX.Element {
  return LINK_ICON_MAP[href] ?? DocsIcon;
}

function resolveHref(href: string): string {
  if (href.startsWith("http")) return href;
  return `https://solana.com${href}`;
}

interface ExplorePanelProps {
  data: MenuData;
  config: FabMenuConfig;
  onClose: () => void;
}

export function ExplorePanel({ data, config, onClose }: ExplorePanelProps) {
  const [activeTab, setActiveTab] = useState(data.tabs[0]?.id ?? "builder");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    return setupDialogBehavior(el, onClose);
  }, [onClose]);

  const activeLinks = data.links[activeTab];
  const activeFeatured = data.featured[activeTab];
  const activeStat = data.stats[activeTab];

  const handleSearch = (e: Event) => {
    if ((e as KeyboardEvent).key === "Enter") {
      const input = e.target as HTMLInputElement;
      const q = input.value.trim();
      if (q) {
        const url = `${data.searchUrl || "https://solana.com"}?search=${encodeURIComponent(q)}`;
        window.open(url, "_blank", "noopener");
      }
    }
  };

  const sectionLabel =
    activeTab === "builder"
      ? "Resources"
      : activeTab === "business"
        ? "Solutions"
        : "Get Started";

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={data.title}
    >
      {/* Overlay */}
      <div class="sfab-overlay" onClick={onClose} />

      {/* Panel */}
      <div class="sfab-panel">
        {/* Header */}
        <div class="sfab-panel-header">
          <div class="sfab-brand">
            <SolanaColorIcon />
            <span class="sfab-brand-text">{data.title}</span>
          </div>
          <button
            class="sfab-close"
            onClick={onClose}
            aria-label="Close menu"
            type="button"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Search */}
        <div class="sfab-search">
          <input
            class="sfab-search-input"
            type="text"
            placeholder="Search docs, guides & solutions..."
            onKeyDown={handleSearch}
          />
          <SearchIcon class="sfab-search-ico" />
        </div>

        {/* Tabs */}
        <div class="sfab-tabs" role="tablist">
          {data.tabs.map((tab) => {
            const Icon = TAB_ICON_MAP[tab.icon];
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                class={`sfab-tab${isActive ? " sfab-tab--active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {Icon && <Icon />}
                {tab.title}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div class="sfab-content">
          {/* Featured + Stat */}
          <div class="sfab-featured-row">
            {activeFeatured && (
              <div class="sfab-featured">
                <div class="sfab-featured-label">{activeFeatured.label}</div>
                <div class="sfab-featured-title">{activeFeatured.title}</div>
                <a
                  class="sfab-featured-cta"
                  href={resolveHref(activeFeatured.ctaHref)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    config.onLinkClick?.(activeFeatured.ctaHref, activeTab)
                  }
                >
                  {activeFeatured.ctaText}
                  <ExternalIcon />
                </a>
              </div>
            )}
            {activeStat && (
              <div class="sfab-stat">
                <div class="sfab-stat-value">{activeStat.value}</div>
                <div class="sfab-stat-unit">{activeStat.label}</div>
              </div>
            )}
          </div>

          {/* Section label */}
          <div class="sfab-section-label">{sectionLabel}</div>

          {/* Links */}
          <div class="sfab-links">
            {activeLinks?.map((link, i) => {
              const Icon = getLinkIcon(link.href);
              return (
                <a
                  key={i}
                  class="sfab-link"
                  href={resolveHref(link.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => config.onLinkClick?.(link.href, activeTab)}
                >
                  <span class="sfab-link-ico">
                    <Icon />
                  </span>
                  <span class="sfab-link-label">{link.title}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Promo */}
        {data.promo && (
          <>
            <hr class="sfab-hr" />
            <a
              class="sfab-promo"
              href={resolveHref(data.promo.href)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="sfab-promo-badge">{data.promo.badge}</span>
              <span
                class="sfab-promo-text"
                dangerouslySetInnerHTML={{
                  __html: data.promo.text.replace(
                    /^([^—–\-]+)/,
                    "<strong>$1</strong>",
                  ),
                }}
              />
              <ExternalIcon class="sfab-promo-arrow" />
            </a>
          </>
        )}

        {/* Footer */}
        <div class="sfab-footer">
          <span class="sfab-footer-brand">
            <SolanaColorIcon />
            Powered by Solana
          </span>
          <div class="sfab-footer-links">
            <a
              class="sfab-footer-link"
              href="https://solana.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              solana.com
            </a>
            <a
              class="sfab-footer-link"
              href="https://solana.com/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
