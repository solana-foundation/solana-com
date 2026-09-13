import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  InkeepBaseSettings,
  InkeepSearchSettings,
} from "@inkeep/cxkit-react";

const baseSettings: InkeepBaseSettings = {
  apiKey: process.env.NEXT_PUBLIC_INKEEP_API_KEY!,
  primaryBrandColor: "#9945ff",
  theme: {
    styles: [
      {
        key: "custom-theme",
        type: "style",
        value: `
          #inkeep-widget-root {
            font-size: 1rem;
            font-family: "ABC Diatype", Inter, sans-serif;
          }
          .ikp-modal__overlay {
            backdrop-filter: blur(20px);
          }
          [data-theme="dark"] .ikp-modal__overlay {
            background-color: rgba(0, 0, 0, 0.90) !important;
          }
          [data-theme="dark"] .ikp-ai-search-results__scroll-area {
            --ikp-color-gray-dark-950: #101010E5 !important;
          }
          .ikp-modal__content {
            border: 1px solid #ECE4FD1F !important;
            backdrop-filter: blur(24px);
            border-radius: 24px !important;
            transform: none;
            position: relative !important;
            top: auto !important;
            left: auto !important;
            max-width: 100%;
            max-height: 100%;
          }
          [data-theme="dark"] .ikp-modal__content {
            background-color: #19181BA3 !important;
          }
          .ikp-ai-search-wrapper {
            background-color: transparent !important;
            border-radius: 24px !important;
          }
          .ikp-ai-search-loading,
          .ikp-ai-search-input-icon {
            width: 24px;
            min-width: 24px;
            height: 24px;
          }
          .ikp-ai-search-input-group {
            padding: 20px;
          }
          .ikp-ai-search-input {
            padding: 0;
            font-size: 18px;
            caret-color: #CA9FF5;
          }
          .ikp-ai-search-results__tab {
            font-size: 16px;
            line-height: 24px;
            padding-left: 16px;
            padding-right: 16px;
            background: none !important;
          }
          [data-theme="dark"] .ikp-ai-search-results__tab {
            --ikp-color-gray-dark-500: #ABABBA !important;
          }
          [data-theme="dark"] [data-state="inactive"].ikp-ai-search-results__tab {
            color: #ABABBC !important;
            border-color: rgba(240, 228, 255, 0.20) !important;
          }
          .ikp-ai-search-results__tab-list {
            padding-bottom: 16px;
          }
          .ikp-ai-search-results__item-breadcrumb-icon {
            display: inline-block;
            width: 14px;
            height: 14px;
          }
          .ikp-ai-search-results__list {
            gap: 4px;
          }
          .ikp-search-bar__container {
            margin: 0 0 0 16px;
          }
          .ikp-search-bar__button {
            padding: 0px 8px;
          }
          .ikp-ai-search-results__item {
            border-radius: 16px;
            padding: 20px;
          }
          .ikp-ai-search-results__item .ikp-ai-search-results__item-indicator {
            align-self: start;
          }
          .ikp-ai-search-results__item[data-selected="false"] {
            border-color: transparent;
            --ikp-color-white-alpha-200: transparent;
          }
          [data-theme="dark"] .ikp-ai-search-results__item[data-selected="false"] {
            background: rgba(240, 228, 255, 0.06) !important;
          }
          [data-theme="light"] .ikp-ai-search-results__item[data-selected="false"] {
            background: rgba(15, 27, 0, 0.06) !important;
          }
          .ikp-ai-search-results__item[data-selected="true"] {
            background: none !important;
          }
          .ikp-ai-search-results__item-breadcrumbs {
            padding-bottom: 4px;
            font-size: 14px;
          }
          [data-theme="dark"] .ikp-ai-search-results__item-description,
          [data-theme="dark"] .ikp-ai-search-results__item-breadcrumbs {
            color: #ABABBC;
          }
          .ikp-ai-search-results__item-title {
            font-size: 18px;
          }
          .ikp-ai-search-results__item-description {
            font-size: 16px;
          }
          [data-theme="dark"] .ikp-ai-search-results__item-icon {
            color: #fff;
          }
          .ikp-ai-search-results__item-icon {
            color: inherit;
            width: 18px;
            height: 18px;
          }
          .ikp-ai-search-footer {
            padding-top: 10px;
            padding-bottom: 20px;
          }
          .ikp-ai-search-tagline__text {
            font-size: 16px;
            font-weight: 500;
          }
          [data-theme="dark"] .ikp-ai-search-footer {
            --ikp-color-white-alpha-600: #fff !important;
            --ikp-color-white-alpha-500: #fff !important;
          }
          [data-theme="light"] .ikp-ai-search-footer {
            --ikp-color-gray-500: #000 !important;
            --ikp-color-gray-400: #000 !important;
          }
          .ikp-markdown-link {
            min-width: 16px;
            border-radius: 4px !important;
            padding-left: 0.3rem !important;
            padding-right: 0.3rem !important;
          }
          [data-theme="dark"] .ikp-markdown-link {
            background: rgba(240, 228, 255, 0.20) !important;
          }
          [data-theme="light"] .ikp-markdown-link {
            background: rgba(15, 27, 0, 0.10) !important;
          }
          .ikp-markdown-source-link {
            top: 0 !important;
          }

          @media (min-width: 768px) {
            .ikp-search-bar__container {
              min-width: 0px;
            }
          }
            
          @media (max-width: 768px) {
            .ikp-modal__overlay {
              backdrop-filter: blur(2px);
            }
            .ikp-search-bar__icon {
              font-size: 24px;
              color: #f5f6f7;
            }
            .ikp-search-bar__button {
              border-color: transparent;
            }
            .ikp-search-bar__text {
              display: none;
            }
            .ikp-search-bar__kbd-wrapper {
              display: none;
            }
            .search-bar__content-wrapper {
              gap: 0;
            }
            .ikp-modal__close {
              width: 40px;
              height: 40px;
              margin: 0;
            }
            .ikp-modal__close svg {
              width: 24px;
              height: 24px;
              color: #ABABBC !important;
            }
            .ikp-modal__overlay {
              align-content: end;
            }
            .ikp-modal__content {
              top: 0 !important;
              margin: 4px;
              overflow: hidden;
              width: calc(100% - 8px) !important;
              height: calc(100% - 8px) !important;
            }
            .ikp-ai-search-wrapper {
              // height: auto !important;
            }
            .ikp-ai-search-results__scroll-area {
              border-radius-botttom-left: 24px !important;
              border-radius-botttom-right: 24px !important;
            }
            .ikp-ai-search-input-group {
              row-gap: 20px;
              padding: 16px 16px 20px;
              grid-template-columns: max-content max-content;
              max-height: none !important;
              flex-wrap: wrap;
            }
            .ikp-ai-search-input-group .ikp-ai-search-loading,
            .ikp-ai-search-input-group .ikp-ai-search-input-icon {
              order: 3;
            }
            .ikp-ai-search-input-group .ikp-ai-search-input {
              order: 4; width: calc(100% - 56px);
            }
            .ikp-ai-search-input-group .ikp-modal__close {
              order: 2;
            }
            .ikp-ai-search-input {
              font-size: 14px;
            }
            .ikp-ai-search-results__tab {
              font-size: 14px;
              line-height: 20px;
            }
            .ikp-ai-search-results__tab-list {
              padding-left: 16px;
              padding-right: 16px;
            }
            .ikp-ai-search-results {
              --input-height: 134px !important;
              --ask-ai-trigger-height: 60px !important;
              --footer-height: 47px !important;
            }
            .ikp-ai-search-results__item-breadcrumbs {
              font-size: 12px;
            }
            .ikp-ai-search-results__item-title {
              font-size: 16px;
            }
            .ikp-ai-search-results__item-description {
              font-size: 14px;
            }
            .ikp-ai-search-results__item-icon {
              width: 16px;
              height: 16px;
            }
            .ikp-ai-search-tagline__text {
              font-size: 14px;
            }
            .ikp-ai-search-footer {
              padding-top: 10px;
              padding-bottom: 16px !important;
              height: auto !important;
            }
            .ikp-ai-search-results:not([data-has-content]) {
              height: 0 !important;
            }
          }
        `,
      },
    ],
    disableLoadingDefaultFont: true,
  },
  transformSource: (source) => {
    const urlPatterns = {
      docs: "solana.com",
      anchorLang: "https://www.anchor-lang.com/docs",
      kitDocs: "https://www.solanakit.com",
      anzaDocs: "https://docs.anza.xyz/",
      stackExchange: "https://solana.stackexchange.com/",
      github: "github.com",
    } as const;

    const tabConfig = {
      [urlPatterns.docs]: {
        tab: "Solana Docs",
        icon: undefined,
        shouldOpenInNewTab: false,
        getBreadcrumbs: (crumbs: string[]) => ["Docs", ...crumbs.slice(1)],
      },
      [urlPatterns.anchorLang]: {
        tab: "Anchor Docs",
        icon: undefined,
        shouldOpenInNewTab: true,
        getBreadcrumbs: (crumbs: string[]) => crumbs,
      },
      [urlPatterns.kitDocs]: {
        tab: "Kit Docs",
        icon: undefined,
        shouldOpenInNewTab: true,
        getBreadcrumbs: (crumbs: string[]) => crumbs,
      },
      [urlPatterns.anzaDocs]: {
        tab: "Anza Docs",
        icon: undefined,
        shouldOpenInNewTab: true,
        getBreadcrumbs: (crumbs: string[]) => crumbs,
      },
      [urlPatterns.stackExchange]: {
        tab: "Stack Exchange",
        icon: undefined,
        shouldOpenInNewTab: true,
        getBreadcrumbs: (crumbs: string[]) => crumbs,
      },
      [urlPatterns.github]: {
        tab: "GitHub",
        icon: "FaGithub",
        shouldOpenInNewTab: true,
        getBreadcrumbs: (crumbs: string[]) => crumbs,
      },
    } as const;

    // Find matching config based on URL
    const matchingPattern = Object.keys(tabConfig).find((pattern) =>
      source.url.includes(pattern),
    );
    const config = matchingPattern
      ? tabConfig[matchingPattern as keyof typeof tabConfig]
      : null;

    if (!config) {
      return source;
    }

    const breadcrumbs = config.getBreadcrumbs(source.breadcrumbs);
    const existingTabs = source.tabs ?? [];

    // Check if tab already exists
    const tabExists = existingTabs.some((existingTab) =>
      typeof existingTab === "string"
        ? existingTab === config.tab
        : Array.isArray(existingTab) && existingTab[0] === config.tab,
    );

    const tabs = tabExists
      ? existingTabs
      : [
          ...existingTabs,
          [
            config.tab,
            {
              breadcrumbs:
                breadcrumbs[0] === config.tab
                  ? breadcrumbs.slice(1)
                  : breadcrumbs,
            },
          ] as const,
        ];

    return {
      ...source,
      breadcrumbs,
      tabs,
      shouldOpenInNewTab: config.shouldOpenInNewTab,
      icon: config.icon ? { builtIn: config.icon } : undefined,
    };
  },
};

const searchSettings: InkeepSearchSettings = {
  placeholder: "Search",
  tabs: [
    "All",
    "Solana Docs",
    "Anchor Docs",
    "Kit Docs",
    "Anza Docs",
    "Stack Exchange",
    "GitHub",
  ],
};

export function useInkeepConfig(): {
  baseSettings: InkeepBaseSettings;
  searchSettings: InkeepSearchSettings;
  modalSettings: {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
  };
} {
  const searchParams = useSearchParams();
  const [syncTarget, setSyncTarget] = useState<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const searchFunctionsRef = useRef<{
    updateQuery: (query: string) => void;
    focusInput: () => void;
  } | null>(null);
  const searchQuery = searchParams.get("search")?.trim() ?? "";
  const hasSearchQuery = searchQuery.length > 0;

  // We do this because document is not available in the server
  useEffect(() => {
    setSyncTarget(document.documentElement);
  }, []);

  useEffect(() => {
    if (!hasSearchQuery) return;

    setIsOpen(true);
  }, [hasSearchQuery]);

  useEffect(() => {
    if (!hasSearchQuery || !isOpen) return;

    searchFunctionsRef.current?.updateQuery(searchQuery);
    searchFunctionsRef.current?.focusInput();
  }, [isOpen, searchQuery, hasSearchQuery]);

  return {
    baseSettings: {
      ...baseSettings,
      colorMode: {
        sync: {
          target: syncTarget,
          attributes: ["class"],
          isDarkMode: (attributes) => !!attributes.class?.includes("dark"),
        },
      },
    },
    modalSettings: {
      isOpen,
      onOpenChange: setIsOpen,
    },
    searchSettings: {
      ...searchSettings,
      defaultQuery: searchQuery,
      searchFunctionsRef,
    },
  };
}
