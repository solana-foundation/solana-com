"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type {
  InkeepAIChatSettings,
  InkeepBaseSettings,
  InkeepSearchSettings,
} from "@inkeep/cxkit-react";
import { baseSettings } from "./inkeep-config";
import {
  SEARCH_TABS,
  SEARCH_TAB_KEYS,
  createSourceTransformer,
} from "./inkeep-sources";
import faviconPng from "./assets/favicon.png";

export function useSiteInkeepConfig(isOpen: boolean): {
  baseSettings: InkeepBaseSettings;
  searchSettings: InkeepSearchSettings;
  aiChatSettings: InkeepAIChatSettings;
} {
  const searchParams = useSearchParams();
  const t = useTranslations("inkeep");
  const labels = Object.fromEntries(
    SEARCH_TABS.map((tab, index) => [
      tab,
      t(`categories.${SEARCH_TAB_KEYS[index]}`),
    ]),
  );
  const [syncTarget, setSyncTarget] = useState<HTMLElement | null>(null);
  const searchFunctionsRef = useRef<{
    updateQuery: (query: string) => void;
    focusInput: () => void;
  } | null>(null);
  const query = searchParams.get("search")?.trim().slice(0, 500) ?? "";
  const origin =
    typeof window === "undefined"
      ? "https://solana.com"
      : window.location.origin;
  const apiBase = `${origin}/api/inkeep`;

  useEffect(() => setSyncTarget(document.documentElement), []);
  useEffect(() => {
    if (!query || !isOpen) return;
    searchFunctionsRef.current?.updateQuery(query);
    searchFunctionsRef.current?.focusInput();
  }, [query, isOpen]);

  return {
    baseSettings: {
      ...baseSettings,
      transformSource: createSourceTransformer(labels),
      aiApiBaseUrl: apiBase,
      analyticsApiBaseUrl: `${apiBase}/analytics`,
      colorMode: {
        sync: {
          target: syncTarget,
          attributes: ["class"],
          isDarkMode: (attributes) => !!attributes.class?.includes("dark"),
        },
      },
    } satisfies InkeepBaseSettings,
    searchSettings: {
      placeholder: t("placeholder"),
      tabs: SEARCH_TABS.map((tab) => labels[tab] ?? tab),
      searchApiBaseUrl: `${apiBase}/search`,
      defaultQuery: query,
      debounceTimeMs: 150,
      searchFunctionsRef,
    } satisfies InkeepSearchSettings,
    aiChatSettings: {
      chatSubjectName: "Solana",
      aiAssistantAvatar: faviconPng.src,
      introMessage: t("intro"),
      placeholder: t("chatPlaceholder"),
      disclaimerSettings: { isEnabled: true, label: "" },
      exampleQuestions: ["wallets", "build", "enterprise", "community"].map(
        (key) => t(`questions.${key}`),
      ),
      getHelpOptions: [
        {
          name: t("community"),
          action: { type: "open_link", url: "https://solana.com/community" },
        },
        {
          name: t("developerSupport"),
          action: {
            type: "open_link",
            url: "https://solana.stackexchange.com/",
          },
        },
      ],
    } satisfies InkeepAIChatSettings,
  };
}
