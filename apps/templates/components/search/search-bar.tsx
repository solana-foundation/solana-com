"use client";

import { useRef } from "react";
import { RepokitTemplate } from "@/lib/generated/repokit";
import { useSearch } from "../hooks/use-search";
import { useSearchKeyboard } from "../hooks/use-search-keyboard";
import { SearchInput } from "./search-input";
import { SearchResults } from "./search-results";
import { SearchStatus } from "./search-status";

interface SearchBarProps {
  templates: RepokitTemplate[];
  onCardClick?: () => void;
}

export function SearchBar({ templates, onCardClick }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const {
    query,
    isPending,
    isFocused,
    filteredTemplates,
    showResults,
    showEmptyState,
    isShowingFeatured,
    handleInputChange,
    handleFocus,
    handleBlur,
    clearSearch,
  } = useSearch(templates);

  const { activeIndex, setActiveIndex, handleKeyDown } = useSearchKeyboard({
    isFocused,
    filteredTemplates,
    query,
    onCardClick,
    clearSearch,
    inputRef,
  });

  const handleInputChangeWithIndex = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    await handleInputChange(e);
    setActiveIndex(-1);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <SearchInput
        value={query}
        onChange={handleInputChangeWithIndex}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        showResults={showResults}
        inputRef={inputRef}
      />

      <SearchStatus
        isPending={isPending}
        showEmptyState={showEmptyState}
        showResults={showResults}
        resultCount={filteredTemplates.length}
      />

      {(showResults || showEmptyState) && (
        <SearchResults
          filteredTemplates={filteredTemplates}
          activeIndex={activeIndex}
          showEmptyState={showEmptyState}
          isShowingFeatured={isShowingFeatured}
          onCardClick={onCardClick}
          resultsRef={resultsRef}
        />
      )}
    </div>
  );
}
