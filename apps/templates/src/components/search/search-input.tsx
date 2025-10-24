import React from "react";
import { useTemplatesTranslations } from "../../lib/use-translations";

export interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  showResults: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const SearchInput = React.memo<SearchInputProps>(
  ({ value, onChange, onFocus, onBlur, onKeyDown, showResults, inputRef }) => {
    const t = useTemplatesTranslations();

    return (
      <div className="">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-neutral-400"
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
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={showResults}
          aria-controls={showResults ? "search-results" : undefined}
          aria-autocomplete="list"
          aria-label={t("actions.search_label")}
          aria-describedby="search-instructions search-status"
          placeholder={t("filter.search_placeholder")}
          className="
          w-full pl-10 pr-4 py-3
          bg-[#0d000e] border border-neutral-800 rounded-2xl
          text-neutral-100 placeholder-neutral-400
          focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent
          transition-colors duration-200
        "
        />
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
