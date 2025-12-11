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
          className="w-full flex items-center gap-2 m-0 py-2.5 max-xl:px-2 xl:pr-6 xl:pl-5 !rounded-full xl:!bg-[rgba(255,255,255,0.08)] max-xl:text-white xl:text-[rgba(255,255,255,0.64)] hover:text-white light:!bg-[rgba(0,0,0,0.08)] light:text-grey-800 light:hover:text-gray-900 focus:outline-none focus:ring-2 text-sm md:text-base leading-6 tracking-normal cursor-text transition-all duration-200 ease-in-out"
        >
          <SearchIcon className="flex-shrink-0" />

          <span className="text-left flex-1 hidden xl:inline-flex">
            {t("commands.searchOrAskAI")}
          </span>

          <kbd className="hidden xl:inline-flex items-center gap-1 px-2 pt-1 pb-0.5 text-[14px] font-medium text-[rgba(255,255,255,0.64)] !bg-[rgba(255,255,255,0.08)] rounded-lg border-b border-[rgba(255,255,255,0.04)] light:text-gray-700 light:bg-gray-200 h-[24px]">
            ⌘ K
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
