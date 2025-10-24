import React from "react";

export interface HeaderSearchButtonProps {
  onClick: () => void;
  showLabel?: boolean;
  showShortcut?: boolean;
  className?: string;
}

export const HeaderSearchButton = React.memo<HeaderSearchButtonProps>(
  ({
    onClick,
    showLabel = true,
    showShortcut = true,
    className = "flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm text-neutral-400 bg-neutral-900 hover:text-neutral-300 transition-colors duration-200 border border-neutral-700 rounded-lg hover:border-neutral-600",
  }) => {
    return (
      <button onClick={onClick} className={className}>
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {showLabel && <span className="hidden md:inline">Search</span>}
        {showShortcut && (
          <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-sm text-neutral-500 bg-neutral-800 border border-neutral-700 rounded">
            ⌘+K
          </kbd>
        )}
      </button>
    );
  },
);

HeaderSearchButton.displayName = "HeaderSearchButton";
