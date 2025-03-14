"use client";

import React, { useState, useCallback } from "react";
import { useInkeepConfig } from "./useInkeepConfig";
import dynamic from "next/dynamic";
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

  return (
    <>
      {/* Custom Search Button Trigger using existing DocSearch styles */}
      <button onClick={() => setIsOpen(true)} className="DocSearch-Button">
        <span className="DocSearch-Button-Container">
          <svg
            width="20"
            height="20"
            className="DocSearch-Search-Icon"
            viewBox="0 0 20 20"
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
        </span>
        <span className="DocSearch-Button-Placeholder">Search</span>
      </button>

      {/* Modal Search and Chat Component */}
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
