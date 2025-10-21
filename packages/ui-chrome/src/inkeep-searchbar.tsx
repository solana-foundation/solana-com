"use client";

import React, { useState, useCallback } from "react";
import { useInkeepConfig } from "./inkeep-config";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

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

  const t = useTranslations();

  return (
    <>
      <div className="relative xl:w-[21.75rem]">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-2 m-0 py-2.5 pr-6 pl-5 rounded-full !bg-gray-800/50 text-gray-400 text-sm md:text-base leading-6 tracking-normal cursor-text transition-all duration-200 ease-in-out hover:!bg-gray-800/70 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            className="flex-shrink-0"
          >
            <path
              d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
              stroke="currentColor"
              fill="none"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-left flex-1">{t("commands.search")}</span>

          <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-900/50 rounded">
            ⌘K
          </kbd>
        </button>
      </div>

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
