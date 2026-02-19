import { useEffect, useState } from "react";
import type {
  InkeepBaseSettings,
  InkeepAIChatSettings,
  InkeepSearchSettings,
} from "@inkeep/cxkit-react";
import LongArrowUp from "./assets/long-arrow-up.svg";

const baseSettings: InkeepBaseSettings = {
  apiKey: process.env.NEXT_PUBLIC_INKEEP_API_KEY!,
  primaryBrandColor: "#9945ff",
  customIcons: {
    chatSubmit: {
      custom: LongArrowUp,
    },
  },
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
          [data-theme="dark"] .ikp-ai-chat-footer,
          [data-theme="dark"] .ikp-ai-chat-header {
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
          .ikp-ai-chat-wrapper,
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
          .ikp-view_toggle {
            padding: 4px;
            border-radius: 800px;
          }
          [data-theme="dark"] .ikp-view_toggle {
            border: 1px solid rgba(240, 228, 255, 0.20);
          }
          [data-theme="light"] .ikp-view_toggle {
            border: 1px solid rgba(15, 27, 0, 0.20);
          }
          .ikp-ai-search-input {
            padding: 0;
            font-size: 18px;
            caret-color: #CA9FF5;
          }
          .ikp-ai-ask-ai-trigger__indicator-text {
            opacity: 0;
            width: 0 !important;
            overflow: hidden;
          }
          .ikp-ai-ask-ai-trigger__indicator {
            opacity: 0.64 !important;
          }
          [data-theme="dark"] .ikp-ai-ask-ai-trigger__indicator {
            color: #fff;
          }
          [data-theme="light"] .ikp-ai-ask-ai-trigger__indicator {
            color: #000;
          }
          .ikp-ai-ask-ai-trigger {
            margin: 0 20px 20px;
            padding: 16px 20px !important;
            border-radius: 12px;
            line-height: 24px;
            border: 0 none;
            height: 56px !important;
            font-size: 18px;
          }
          [data-theme="dark"] .ikp-ai-ask-ai-trigger {
            background-color: #ECE4FD1F !important;
          }
          [data-theme="light"] .ikp-ai-ask-ai-trigger {
            background-color: rgba(15, 27, 0, 0.10) !important;
          }
          .ikp-view_toggle_button {
            display: flex;
            padding: 4px 16px 4px 8px;
            align-items: center;
            gap: 6px;
            border-radius: 800px;
            height: 32px;
            font-size: 16px;
            font-weight: 400;
            color: #ABABBC !important;
          }
          [data-theme="dark"] .ikp-view_toggle_button {
            color: #ABABBC !important;
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
          .ikp-view_toggle_button {
            flex: 1 1;
          }
          .ikp-ai-chat-message-source-item__breadcrumb-icon,
          .ikp-ai-search-results__item-breadcrumb-icon {
            display: inline-block;
            width: 14px;
            height: 14px;
          }
          [data-theme="dark"] .ikp-view_toggle_button[data-active] {
            border-top: 1px solid rgba(240, 228, 255, 0.12);
            background: rgba(240, 228, 255, 0.20);
            color: #fff !important;
          }
          [data-theme="light"] .ikp-view_toggle_button[data-active] {
            border-top: 1px solid rgba(15, 27, 0, 0.12);
            background: rgba(15, 27, 0, 0.10);
            color: #000 !important;
          }
          .ikp-ai-chat-message-sources__list,
          .ikp-ai-search-results__list {
            gap: 4px;
          }
          .ikp-view_toggle_icon {
            width: 18px;
            height: 18px;
            color: inherit !important;
            flex-shrink: 0;
          }
          .ikp-search-bar__container {
            margin: 0 0 0 16px;
          }
          .ikp-search-bar__button {
            padding: 0px 8px;
          }
          .ikp-ai-chat-message-source-item,
          .ikp-ai-search-results__item {
            border-radius: 16px;
            padding: 20px;
          }
          .ikp-ai-chat-message-source-item__indicator,
          .ikp-ai-search-results__item .ikp-ai-search-results__item-indicator {
            align-self: start;
          }
          .ikp-ai-chat-message-source-item,
          .ikp-ai-search-results__item[data-selected="false"] {
            border-color: transparent;
            --ikp-color-white-alpha-200: transparent;
          }
          [data-theme="dark"] .ikp-ai-chat-message-source-item,
          [data-theme="dark"] .ikp-ai-search-results__item[data-selected="false"] {
            background: rgba(240, 228, 255, 0.06) !important;
          }
          [data-theme="light"] .ikp-ai-chat-message-source-item,
          [data-theme="light"] .ikp-ai-search-results__item[data-selected="false"] {
            background: rgba(15, 27, 0, 0.06) !important;
          }
          .ikp-ai-chat-message-source-item:focus,
          .ikp-ai-search-results__item[data-selected="true"] {
            background: none !important;
          }
          .ikp-ai-chat-message-source-item__breadcrumbs,
          .ikp-ai-search-results__item-breadcrumbs {
            padding-bottom: 4px;
            font-size: 14px;
          }
          [data-theme="dark"] .ikp-ai-search-results__item-description,
          [data-theme="dark"] .ikp-ai-search-results__item-breadcrumbs {
            color: #ABABBC;
          }
          .ikp-ai-chat-message-source-item__title,
          .ikp-ai-search-results__item-title {
            font-size: 18px;
          }
          .ikp-ai-search-results__item-description {
            font-size: 16px;
          }
          [data-theme="dark"] .ikp-ai-search-results__item-icon,
          [data-theme="dark"] .ikp-ai-chat-message-source-item__icon {
            color: #fff;
          }
          .ikp-ai-search-results__item-icon,
          .ikp-ai-chat-message-source-item__icon {
            color: inherit;
            width: 18px;
            height: 18px;
          }
          .ikp-ai-search-footer {
            padding-top: 10px;
            padding-bottom: 20px;
          }
          .ikp-ai-chat-tagline__text,
          .ikp-ai-search-tagline__text {
            font-size: 16px;
            font-weight: 500;
          }
          [data-theme="dark"] .ikp-ai-chat-footer,
          [data-theme="dark"] .ikp-ai-search-footer {
            --ikp-color-white-alpha-600: #fff !important;
            --ikp-color-white-alpha-500: #fff !important;
          }
          [data-theme="light"] .ikp-ai-chat-footer,
          [data-theme="light"] .ikp-ai-search-footer {
            --ikp-color-gray-500: #000 !important;
            --ikp-color-gray-400: #000 !important;
          }
          .ikp-ai-chat-header__toolbar-header {
            font-size: 18px;
          }
          [data-theme="dark"] .ikp-ai-chat-header__toolbar-header {
            color: #fff;
          }
          [data-theme="light"] .ikp-ai-chat-header__toolbar-header {
            color: #000;
          }
          .ikp-ai-chat-header {
            background: none !important;
          }
          .ikp-ai-chat-header__toolbar {
            padding: 20px 20px 4px;
          }
          .ikp-ai-chat-disclaimer-trigger svg {
            width: 20px;
            height: 20px;
            color: #ABABBC;
          }
          .ikp-ai-chat-message-wrapper {
            padding-top: 24px;
            padding-bottom: 24px;
          }
          .ikp-ai-chat-footer {
            padding: 16px 20px 20px;
          }
          .ikp-ai-chat-input__fieldset {
            border-radius: 20px;
            font-size: 18px;
            caret-color: #CA9FF5;
          }
          [data-theme="dark"] .ikp-ai-chat-input__fieldset {
            background: rgba(240, 228, 255, 0.12) !important;
            color: #fff;
          }
          [data-theme="light"] .ikp-ai-chat-input__fieldset {
            background: rgba(15, 27, 0, 0.10) !important;
            color: #000;
          }
          .ikp-ai-chat-action-bar {
            margin-top: 20px;
          }
          .ikp-ai-chat__chat-action,
          .ikp-ai-chat-help-action {
            border-radius: 800px;
            font-size: 16px;
            font-weight: 500;
            line-height: 24px;
            padding: 4px 12px;
            height: 32px;
          }
          [data-theme="dark"] .ikp-ai-chat__chat-action,
          [data-theme="dark"] .ikp-ai-chat-help-action {
            border: 1px solid rgba(240, 228, 255, 0.12);
            background: rgba(240, 228, 255, 0.06);
            color: #fff;
          }
          [data-theme="light"] .ikp-ai-chat__chat-action,
          [data-theme="light"] .ikp-ai-chat-help-action {
            border: 1px solid rgba(15, 27, 0, 0.12);
            background: rgba(15, 27, 0, 0.06);
            color: #000;
          }
          .ikp-ai-chat-input__send-button {
            border-radius: 50%;
          }
          .ikp-ai-chat-input__send-button > svg,
          .ikp-ai-chat-input__send-button > img {
            transform: none !important;
            width: 20px;
            height: 20px;
            flex-shrink: 0;
            max-width: 20px;
          }
          [data-theme="dark"] .ikp-ai-chat-input__send-button {
            background-color: #fff !important;
            color: #000 !important;
          }
          [data-theme="dark"] .ikp-ai-chat-input__send-button.disabled,
          [data-theme="dark"] .ikp-ai-chat-input__send-button:disabled {
            background-color: rgba(240, 228, 255, 0.06) !important;
            color: #ABABBA !important;
            opacity: 1 !important;
          }
          [data-theme="dark"] .ikp-ai-chat-input__send-button.disabled img,
          [data-theme="dark"] .ikp-ai-chat-input__send-button:disabled img {
            filter: invert(1);
            opacity: 0.64 !important;
          }
          [data-theme="light"] .ikp-ai-chat-input__send-button {
            background-color: rgba(15, 27, 0, 0.20) !important;
            color: #fff !important;
          }
          .ikp-ai-chat-message-content + .ikp-ai-chat-disclaimer {
            display: none !important;
          }
          .ikp-ai-chat-message-loading > div,
          .ikp-ai-chat-message {
            font-size: 18px;
          }
          .ikp-ai-chat-message-avatar-content {
            display: flex;
            width: 48px;
            height: 48px;
            padding: 0 9px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 8px;
            border-radius: 800px;
          }
          [data-theme="dark"] .ikp-ai-chat-message-wrapper:after {
            border-color: rgba(240, 228, 255, 0.12) !important;
          }
          [data-theme="light"] .ikp-ai-chat-message-wrapper:after {
            border-color: rgba(15, 27, 0, 0.12) !important;
          }
          .ikp-ai-chat-message-avatar-content svg {
            color: inherit !important;
          }
          [data-theme="dark"] .ikp-ai-chat-message-avatar-content {
            background: linear-gradient(180deg, #000 0%, #003B1B 100%);
            box-shadow: 0 -4px 12px 0 #255321 inset;
            color: #14F195 !important;
          }
          [data-theme="light"] .ikp-ai-chat-message-avatar-content {
            background: linear-gradient(180deg, #fff 0%, #14F195 100%);
            box-shadow: 0 -4px 12px 0 #14F195 inset;
            color: #255321 !important;
          }
          [data-theme="dark"] [data-role="assistant"].ikp-ai-chat-message-avatar-content {
            background: linear-gradient(180deg, #000 0%, #2A013C 100%);
            box-shadow: 0 -4px 12px 0 #482654 inset;
          }
          [data-theme="light"] [data-role="assistant"].ikp-ai-chat-message-avatar-content {
            background: linear-gradient(180deg, #fff 0%, #DAACDE 100%);
            box-shadow: 0 -4px 12px 0 #DAACDE inset;
          }
          .ikp-ai-chat-example-questions-label {
            color: #ABABBC !important;
            font-size: 14px;
            letter-spacing: 1px;
            font-weight: 400;
          }
          .ikp-ai-chat-example-question {
            width: 100%;
          }
          .ikp-ai-chat-example-question-button {
            padding: 12px 20px;
            font-size: 16px;
            font-weight: 500;
            text-align: left;
            justify-content: start;
          }
          .ikp-ai-chat-example-questions-list {
            gap: 4px;
          }
          .ikp-ai-chat-example-question-button,
          .ikp-ai-chat-example-question {
            border-radius: 16px;
          }
          .ikp-ai-chat-example-question:after {
            border-radius: 16px;
          }
          [data-theme="dark"] .ikp-ai-chat-example-question:after {
            background: #1D1C1F;
          }
          [data-theme="dark"] .ikp-ai-chat-example-question:first-child .ikp-ai-chat-example-question-button {
            --ikp-color-white-alpha-200: rgba(240, 228, 255, 0.06);
          }
          [data-theme="dark"] .ikp-ai-chat-example-question:not(:first-child) .ikp-ai-chat-example-question-button {
            border-color: transparent;
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
          .ikp-ai-chat-message-sources__header {
            color: #ABABBC !important;
            font-size: 14px;
            font-weight: 400!important;
            letter-spacing: 1px;
            text-transform: uppercase;
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
            .ikp-view_toggle_button {
              height: 28px;
              font-size: 14px;
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
            .ikp-ai-chat-wrapper,
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
            .ikp-ai-search-input-group .ikp-view_toggle {
              order: 1; width: calc(100% - 56px);
            }
            .ikp-ai-search-input-group .ikp-modal__close {
              order: 2;
            }
            .ikp-ai-ask-ai-trigger {
              margin: 0 16px 16px;
              padding: 12px 20px !important;
              height: 44px !important;
              font-size: 16px;
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
            .ikp-ai-chat-message-source-item__breadcrumbs,
            .ikp-ai-search-results__item-breadcrumbs {
              font-size: 12px;
            }
            .ikp-ai-chat-message-source-item__title,
            .ikp-ai-search-results__item-title {
              font-size: 16px;
            }
            .ikp-ai-search-results__item-description {
              font-size: 14px;
            }
            .ikp-ai-search-results__item-icon,
            .ikp-ai-chat-message-source-item__icon {
              width: 16px;
              height: 16px;
            }
            .ikp-ai-chat-tagline__text,
            .ikp-ai-search-tagline__text {
              font-size: 14px;
            }
            .ikp-ai-search-footer {
              padding-top: 10px;
              padding-bottom: 16px !important;
              height: auto !important;
            }
            .ikp-ai-chat-header__toolbar-header-wrapper {
              display: none;
            }
            .ikp-ai-chat-header__toolbar .ikp-view_toggle {
              flex-grow: 1;
            }
            .ikp-ai-chat-header__toolbar {
              padding: 16px 16px 4px;
            }
            .ikp-ai-chat-footer {
              padding: 16px 16px 16px;
            }
            .ikp-ai-chat__chat-action,
            .ikp-ai-chat-help-action {
              font-size: 14px;
              line-height: 20px;
              height: 28px;
            }
            .ikp-ai-chat-input__fieldset {
              font-size: 16px;
            }
            .ikp-ai-chat-message-name {
              display: none;
            }
            [data-role="user"].ikp-ai-chat-message-avatar-content {
              display: flex;
            }
            .ikp-ai-chat-message-header {
              margin-bottom: 20px;
            }
            .ikp-ai-chat-message-loading > div,
            .ikp-ai-chat-message {
              font-size: 16px;
            }
            .ikp-ai-chat-example-questions-label {
              font-size: 12px;
            }
            .ikp-ai-chat-example-question {
            }
            .ikp-ai-chat-example-question-button {
              font-size: 14px;
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

export function useInkeepConfig(): {
  baseSettings: InkeepBaseSettings;
  searchSettings: InkeepSearchSettings;
  aiChatSettings: InkeepAIChatSettings;
  modalSettings: {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
  };
} {
  const [syncTarget, setSyncTarget] = useState<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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
    modalSettings: {
      isOpen,
      onOpenChange: setIsOpen,
    },
    searchSettings,
    aiChatSettings,
  };
}
