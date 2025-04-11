"use client";

import React, { useState, useCallback } from "react";
import { useInkeepConfig } from "./useInkeepConfig";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import styles from "./inkeep-searchbar.module.scss";

const InkeepModalSearchAndChat = dynamic(
  () =>
    import("@inkeep/cxkit-react").then((mod) => mod.InkeepModalSearchAndChat),
  {
    ssr: false,
  },
);

export function InkeepSearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const baseConfig = useInkeepConfig();

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setIsOpen(newOpen);
  }, []);

  const { t } = useTranslation();

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={styles.searchButton}>
        <svg width="18" height="18" viewBox="0 0 20 20">
          <path
            d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
            stroke="currentColor"
            fill="none"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span>{t("commands.search")}</span>
      </button>

      <InkeepModalSearchAndChat
        baseSettings={baseConfig.baseSettings}
        searchSettings={baseConfig.searchSettings}
        aiChatSettings={baseConfig.aiChatSettings}
        modalSettings={{
          isOpen,
          onOpenChange: handleOpenChange,
          shortcutKey: "k",
        }}
      />
    </>
  );
}
