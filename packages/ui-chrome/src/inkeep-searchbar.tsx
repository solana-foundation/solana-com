"use client";

import { useInkeepConfig } from "./inkeep-config";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { cn } from "./classnames";

const InkeepModalSearchAndChat = dynamic(
  () =>
    import("@inkeep/cxkit-react").then((mod) => mod.InkeepModalSearchAndChat),
  {
    ssr: false,
  },
);

const SearchIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="16"
      height="16"
      viewBox="0 0 20 20"
      className={className}
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
  );
};

interface InkeepSearchBarProps {
  className?: string;
  /** Show a full-width button with a visible text label. */
  expanded?: boolean;
}

export function InkeepSearchBar({ className, expanded }: InkeepSearchBarProps) {
  const inkeepConfig = useInkeepConfig();
  const t = useTranslations();

  return (
    <>
      <div
        data-expanded={expanded || undefined}
        className={cn(
          "group relative shrink-0 data-[expanded]:w-full data-[expanded]:max-w-[21.75rem]",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => inkeepConfig.modalSettings.onOpenChange(true)}
          aria-label={t("commands.search")}
          title={`${t("commands.search")} (⌘ K)`}
          className="m-0 flex size-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] p-0 text-white/70 transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.1] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 md:h-9 md:w-auto md:px-2.5 group-data-[expanded]:w-full group-data-[expanded]:justify-start group-data-[expanded]:px-3"
        >
          <SearchIcon className="flex-shrink-0" />

          <span className="hidden flex-1 text-left text-sm group-data-[expanded]:inline">
            {t("commands.search")}
          </span>

          <kbd
            aria-hidden="true"
            className="hidden h-5 items-center rounded border border-white/10 bg-black/30 px-1.5 font-sans text-[11px] font-medium leading-none text-white/55 md:inline-flex"
          >
            ⌘ K
          </kbd>
        </button>
      </div>

      <InkeepModalSearchAndChat
        defaultView="search"
        forceDefaultView={inkeepConfig.shouldForceSearchView}
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
