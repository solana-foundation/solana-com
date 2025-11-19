"use client";

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

const SearchIcon = ({ className }: { className?: string }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" className={className}>
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

interface InkeepSearchBarProps {
  className?: string;
}

export function InkeepSearchBar({ className }: InkeepSearchBarProps) {
  const inkeepConfig = useInkeepConfig();

  const t = useTranslations();

  return (
    <>
      <div className={className + " relative xl:w-[21.75rem]"}>
        <button
          type="button"
          onClick={() => inkeepConfig.modalSettings.onOpenChange(true)}
          className="w-full flex items-center gap-twd-2 m-twd-0 py-twd-2.5 px-twd-2 xl:pr-twd-6 xl:pl-twd-5 !rounded-full bg-gray-900/50 max-xl:text-white xl:text-gray-400 hover:text-gray-300 hover:bg-gray-900/70 focus:ring-gray-700 xl:border-[1px] !border-gray-700 shadow-sm light:!bg-white light:!border-gray-300 light:text-[#7f8391] light:hover:!bg-white light:hover:text-gray-900 focus:outline-none focus:ring-2 text-sm md:text-base leading-6 tracking-normal cursor-text transition-all duration-200 ease-in-out"
        >
          <SearchIcon className="flex-shrink-0" />

          <span className="text-left flex-1 hidden xl:inline-flex">
            {t("commands.searchOrAskAI")}
          </span>

          <kbd className="hidden xl:inline-flex items-center gap-twd-1 px-twd-2 py-twd-0.5 text-xs font-medium text-gray-500 bg-gray-900/50 rounded light:text-gray-700 light:bg-gray-200">
            ⌘K
          </kbd>
        </button>
      </div>

      <InkeepModalSearchAndChat
        baseSettings={inkeepConfig.baseSettings}
        searchSettings={inkeepConfig.searchSettings}
        aiChatSettings={inkeepConfig.aiChatSettings}
        modalSettings={{
          isOpen: inkeepConfig.modalSettings.isOpen,
          onOpenChange: inkeepConfig.modalSettings.onOpenChange,
          shortcutKey: "k",
        }}
      />
    </>
  );
}
