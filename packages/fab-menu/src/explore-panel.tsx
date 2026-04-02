import { useEffect, useRef, useState } from "react";
import type { ComponentType, KeyboardEventHandler, SVGProps } from "react";
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
  ComputerIcon,
  DiamondIcon,
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

const TAB_ICON_MAP: Record<TabIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  builder: TabBuilderIcon,
  business: TabBusinessIcon,
  consumer: TabConsumerIcon,
};

const LINK_ICON_MAP: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  "/docs": DocsIcon,
  "/docs/rpc": ApiIcon,
  "/developers/templates": TemplatesIcon,
  "/developers": SchoolIcon,
  "/developers/evm-to-svm": ComputerIcon,
  "/events": DiamondIcon,
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

function getLinkIcon(href: string): ComponentType<SVGProps<SVGSVGElement>> {
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

  useEffect(() => {
    if (!data.tabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(data.tabs[0]?.id ?? "builder");
    }
  }, [activeTab, data.tabs]);

  const activeLinks = data.links[activeTab];
  const activeFeatured = data.featured[activeTab];
  const activeStat = data.stats[activeTab];

  const handleSearch: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      const query = event.currentTarget.value.trim();
      if (query) {
        const url = `${data.searchUrl || "https://solana.com"}?search=${encodeURIComponent(query)}`;
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
      <div className="sfab-overlay" onClick={onClose} />

      <div className="sfab-panel">
        <div className="sfab-panel-header">
          <div className="sfab-brand">
            <SolanaColorIcon />
            <span className="sfab-brand-text">{data.title}</span>
          </div>
          <button
            className="sfab-close"
            onClick={onClose}
            aria-label="Close menu"
            type="button"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="sfab-search">
          <input
            className="sfab-search-input"
            type="text"
            placeholder="Search docs, guides & solutions..."
            onKeyDown={handleSearch}
          />
          <SearchIcon className="sfab-search-ico" />
        </div>

        <div className="sfab-tabs" role="tablist">
          {data.tabs.map((tab) => {
            const Icon = TAB_ICON_MAP[tab.icon];
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                className={`sfab-tab${isActive ? " sfab-tab--active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {Icon && <Icon />}
                {tab.title}
              </button>
            );
          })}
        </div>

        <div className="sfab-content">
          <div className="sfab-featured-row">
            {activeFeatured && (
              <div className="sfab-featured">
                <div className="sfab-featured-label">
                  {activeFeatured.label}
                </div>
                <div className="sfab-featured-title">
                  {activeFeatured.title}
                </div>
                <a
                  className="sfab-featured-cta"
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
              <div className="sfab-stat">
                <div className="sfab-stat-value">{activeStat.value}</div>
                <div className="sfab-stat-unit">{activeStat.label}</div>
              </div>
            )}
          </div>

          <div className="sfab-section-label">{sectionLabel}</div>

          <div className="sfab-links">
            {activeLinks?.map((link, i) => {
              const Icon = getLinkIcon(link.href);
              return (
                <a
                  key={i}
                  className="sfab-link"
                  href={resolveHref(link.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => config.onLinkClick?.(link.href, activeTab)}
                >
                  <span className="sfab-link-ico">
                    <Icon />
                  </span>
                  <span className="sfab-link-label">{link.title}</span>
                </a>
              );
            })}
          </div>
        </div>

        {data.promo && (
          <>
            <hr className="sfab-hr" />
            <a
              className="sfab-promo"
              href={resolveHref(data.promo.href)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sfab-promo-badge">{data.promo.badge}</span>
              <span
                className="sfab-promo-text"
                dangerouslySetInnerHTML={{
                  __html: data.promo.text.replace(
                    /^([^—-]+)/,
                    "<strong>$1</strong>",
                  ),
                }}
              />
              <ExternalIcon className="sfab-promo-arrow" />
            </a>
          </>
        )}

        <div className="sfab-footer">
          <span className="sfab-footer-brand">
            <SolanaColorIcon />
            Powered by Solana
          </span>
          <div className="sfab-footer-links">
            <a
              className="sfab-footer-link"
              href="https://solana.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              solana.com
            </a>
            <a
              className="sfab-footer-link"
              href="https://solana.com/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              docs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
