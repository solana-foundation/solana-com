import React from "react";

export interface SearchStatusProps {
  isPending: boolean;
  showEmptyState: boolean;
  showResults: boolean;
  resultCount: number;
}

export const SearchStatus = React.memo<SearchStatusProps>(
  ({ isPending, showEmptyState, showResults, resultCount }) => {
    return (
      <>
        <div id="search-instructions" className="sr-only">
          Use arrow keys to navigate results, Enter to select, Escape to close
        </div>

        <div
          id="search-status"
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
        >
          {isPending
            ? "Searching..."
            : showEmptyState
              ? "No templates found"
              : showResults
                ? `${resultCount} template${resultCount === 1 ? "" : "s"} found`
                : ""}
        </div>
      </>
    );
  },
);

SearchStatus.displayName = "SearchStatus";
