import React from "react";
import { RepokitTemplate } from "@/lib/generated/repokit";
import { SearchCard } from "./search-card";

export interface SearchResultsProps {
  filteredTemplates: RepokitTemplate[];
  activeIndex: number;
  showEmptyState: boolean;
  isShowingFeatured: boolean;
  onCardClick?: () => void;
  resultsRef: React.RefObject<HTMLDivElement | null>;
}

export const SearchResults = React.memo<SearchResultsProps>(
  ({
    filteredTemplates,
    activeIndex,
    showEmptyState,
    isShowingFeatured,
    onCardClick,
    resultsRef,
  }) => {
    return (
      <div
        ref={resultsRef}
        id="search-results"
        role="listbox"
        aria-label={`Search results, ${filteredTemplates.length} template${filteredTemplates.length === 1 ? "" : "s"} found`}
        aria-activedescendant={
          activeIndex >= 0 ? `option-${activeIndex}` : undefined
        }
        className="
        absolute top-full left-0 right-0 mt-2 px-2 py-4
        bg-[#0d000e] border border-purple-400/10 rounded-2xl shadow-xl
        max-h-96 overflow-y-auto z-50 custom-scrollbar
      "
      >
        {showEmptyState ? (
          <div className="p-4 text-center text-neutral-400 text-sm">
            No templates found.
          </div>
        ) : (
          <div className="space-y-3">
            {isShowingFeatured && (
              <div className="px-3">
                <h3 className="text-neutral-300 text-sm font-medium">
                  Featured Templates
                </h3>
              </div>
            )}
            <div className="p-2 space-y-3">
              {filteredTemplates.map((template, index) => (
                <SearchCard
                  key={template.id}
                  id={`option-${index}`}
                  template={template}
                  isActive={index === activeIndex}
                  onCardClick={onCardClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
);

SearchResults.displayName = "SearchResults";
