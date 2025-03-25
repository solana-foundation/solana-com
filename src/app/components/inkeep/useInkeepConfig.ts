import { useEffect, useState } from "react";
import type {
  InkeepBaseSettings,
  InkeepAIChatSettings,
  InkeepSearchSettings,
} from "@inkeep/cxkit-react";

const baseSettings: InkeepBaseSettings = {
  apiKey: "20556dc0f7d6c26e590fc57f247c63e86fe5f6b992a5b6e4",
  primaryBrandColor: "#9945ff",
  theme: {
    styles: [
      {
        key: "custom-theme",
        type: "style",
        value: `
        #inkeep-widget-root {
          font-size: 1rem; 
        }
        .ikp-search-bar__container {
          margin: 0 0 0 16px;
        }
        .ikp-search-bar__button {
          padding: 0px 8px;
        }
        @media (min-width: 768px) {
          .ikp-search-bar__container {
            min-width: 0px;
          }
        }
        @media (max-width: 768px) {
          .ikp-search-bar__icon {
            font-size: 24px;
            color: var(--docsearch-text-color);
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
        }
      `,
      },
    ],
  },
  transformSource: (source) => {
    const urlPatterns = {
      docs: "solana.com",
      anchorLang: "https://www.anchor-lang.com/docs",
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
    "Anza Docs",
    "Stack Exchange",
    "GitHub",
  ],
};

const aiChatSettings: InkeepAIChatSettings = {
  chatSubjectName: "Solana",
  introMessage:
    "I'm an AI assistant trained on documentation, github repos, and other content. Ask me anything about `Solana`.",
  aiAssistantAvatar: "https://solana.com/favicon.png",
  disclaimerSettings: {
    isEnabled: true,
    label: "",
  },
  toolbarButtonLabels: {
    getHelp: "Get Support",
  },
  getHelpOptions: [
    {
      name: "Stack Exchange",
      action: {
        type: "open_link",
        url: "https://solana.stackexchange.com/",
      },
      icon: {
        builtIn: "FaStackOverflow",
      },
    },
  ],
  exampleQuestions: [
    "How to quickly install Solana dependencies for local development?",
    "What is the Solana Account Model?",
    "What is a Solana Token?",
  ],
};

export function useInkeepConfig() {
  const [syncTarget, setSyncTarget] = useState<HTMLElement | null>(null);

  // We do this because document is not available in the server
  useEffect(() => {
    setSyncTarget(document.documentElement);
  }, []);
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
    searchSettings,
    aiChatSettings,
  };
}
