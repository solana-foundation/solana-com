"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as VisuallyHiddenPrimitive from "@radix-ui/react-visually-hidden";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "./classnames";
import { Link } from "./link";
import { useDocsSearch } from "./use-docs-search";

const SearchIcon = ({ className }: { className?: string }) => (
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

/**
 * PostHog is initialised per app and only after cookie consent, so it is read
 * off the window rather than imported: this package is also rendered by
 * `apps/templates`, which has no PostHog at all. No consent, no global, no event.
 */
function captureSearch(query: string, resultCount: number) {
  if (typeof window === "undefined") return;

  const posthog = (
    window as unknown as {
      posthog?: { capture?: (event: string, props?: object) => void };
    }
  ).posthog;

  posthog?.capture?.("docs_search", { query, result_count: resultCount });
}

/**
 * useSearchParams() opts its caller out of static prerendering unless it sits
 * under a Suspense boundary, and this bar is mounted by the shared Header in
 * every app's root layout. Isolating the read here keeps that boundary tight
 * around the only thing that needs it, so the layouts around it stay static.
 */
function DeepLinkQuery({ onQuery }: { onQuery: (query: string) => void }) {
  const searchParams = useSearchParams();
  const deepLinkQuery = searchParams.get("search")?.trim() ?? "";

  useEffect(() => {
    if (deepLinkQuery) onQuery(deepLinkQuery);
  }, [deepLinkQuery, onQuery]);

  return null;
}

interface DocsSearchBarProps {
  className?: string;
  /** Show a full-width button with a visible text label. */
  expanded?: boolean;
}

export function DocsSearchBar({ className, expanded }: DocsSearchBarProps) {
  const t = useTranslations();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const { results, resultsQuery, state } = useDocsSearch(query);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const reportedQuery = useRef<string | null>(null);

  const trimmed = query.trim();
  const hasQuery = trimmed.length > 0;

  // ?search= deep link: open the modal with the query seeded.
  const onDeepLinkQuery = useCallback((deepLinkQuery: string) => {
    setQuery(deepLinkQuery);
    setOpen(true);
  }, []);

  // Cmd/Ctrl-K from anywhere on the page.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((isOpen) => !isOpen);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // A new result set always starts highlighted at the top.
  useEffect(() => {
    setActiveIndex(0);
  }, [results]);

  // Keep the highlighted row visible when arrowing through a long list.
  useEffect(() => {
    itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // One event per settled query — the debounce in the hook is what makes this
  // a "submission" rather than one event per keystroke.
  useEffect(() => {
    if (state !== "idle" || !resultsQuery) return;
    if (reportedQuery.current === resultsQuery) return;

    reportedQuery.current = resultsQuery;
    captureSearch(resultsQuery, results.length);
  }, [state, resultsQuery, results.length]);

  // Each opening starts clean; a deep link re-seeds itself via its own effect.
  const onOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuery("");
      setActiveIndex(0);
      reportedQuery.current = null;
    }
  }, []);

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      // Click the rendered anchor so ./link's cross-app routing decision
      // applies. `Link` does not forward refs, so reach it through the row.
      itemRefs.current[activeIndex]?.querySelector("a")?.click();
    }
  };

  const showResults = results.length > 0;
  // A throttled query leaves the previous query's results on screen; say so
  // rather than letting them read as answers to what was just typed.
  const isStale = showResults && resultsQuery !== trimmed;
  const answered = resultsQuery === trimmed;
  const showError = state === "error";
  const showNoResults =
    !showError && hasQuery && state === "idle" && !showResults && answered;
  // Covers both "still debouncing" and "throttled with nothing cached yet".
  const showBusy = !showError && hasQuery && !showResults && !showNoResults;

  return (
    <>
      <Suspense fallback={null}>
        <DeepLinkQuery onQuery={onDeepLinkQuery} />
      </Suspense>

      <div
        data-expanded={expanded || undefined}
        className={cn(
          "group relative shrink-0 data-[expanded]:w-full data-[expanded]:max-w-[21.75rem]",
          className,
        )}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
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

      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[20px] data-[state=open]:animate-in data-[state=open]:fade-in-0 dark:bg-black/90" />

          <DialogPrimitive.Content
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              triggerRef.current?.focus();
            }}
            aria-describedby={undefined}
            className="fixed left-1/2 top-4 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 flex-col overflow-hidden rounded-3xl border border-[#ECE4FD1F] bg-white/95 shadow-2xl backdrop-blur-[24px] focus:outline-none dark:bg-[#19181BA3] sm:top-[10vh]"
          >
            <VisuallyHiddenPrimitive.Root asChild>
              <DialogPrimitive.Title>
                {t("commands.search")}
              </DialogPrimitive.Title>
            </VisuallyHiddenPrimitive.Root>

            <div className="flex items-center gap-3 border-b border-black/10 p-5 dark:border-white/10">
              <SearchIcon className="size-6 shrink-0 opacity-60" />
              <input
                id="docs-search-input"
                type="search"
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder={t("commands.search")}
                aria-label={t("commands.search")}
                role="combobox"
                aria-expanded={showResults}
                aria-controls="docs-search-results"
                aria-activedescendant={
                  showResults ? `docs-search-result-${activeIndex}` : undefined
                }
                autoComplete="off"
                className="w-full bg-transparent p-0 text-lg caret-[#CA9FF5] outline-none placeholder:opacity-50"
              />
            </div>

            <div role="status" aria-live="polite" className="sr-only">
              {state === "idle" && resultsQuery
                ? t("commands.searchResultsCount", { count: results.length })
                : ""}
            </div>

            {isStale && (
              <p className="px-5 pt-4 text-sm text-black/60 dark:text-[#ABABBC]">
                {t("commands.searchShowingResultsFor", { query: resultsQuery })}
              </p>
            )}

            {showResults && (
              <ul
                id="docs-search-results"
                role="listbox"
                aria-label={t("commands.search")}
                className="flex list-none flex-col gap-1 overflow-y-auto p-3"
              >
                {results.map((result, index) => (
                  <li
                    key={`${result.url}-${index}`}
                    ref={(node) => {
                      itemRefs.current[index] = node;
                    }}
                  >
                    <Link
                      to={result.url}
                      id={`docs-search-result-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      onClick={() => onOpenChange(false)}
                      onMouseEnter={() => setActiveIndex(index)}
                      data-active={index === activeIndex || undefined}
                      className="block rounded-2xl bg-[rgba(15,27,0,0.06)] p-5 text-black no-underline transition-colors data-[active]:bg-[rgba(15,27,0,0.12)] dark:bg-[rgba(240,228,255,0.06)] dark:text-white dark:data-[active]:bg-[rgba(240,228,255,0.14)]"
                    >
                      {result.breadcrumbs && (
                        <span className="block pb-1 text-sm text-black/60 dark:text-[#ABABBC]">
                          {result.breadcrumbs}
                        </span>
                      )}
                      <span className="block text-lg font-medium">
                        {result.title ?? result.url}
                      </span>
                      <span className="block text-base text-black/70 dark:text-[#ABABBC]">
                        {result.snippet}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {(showBusy || showNoResults || showError || !hasQuery) && (
              <p className="px-5 py-8 text-center text-base opacity-60">
                {showError
                  ? t("commands.searchUnavailable")
                  : showBusy
                    ? t("commands.searching")
                    : showNoResults
                      ? t("commands.searchNoResults", { query: trimmed })
                      : t("commands.searchHint")}
              </p>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
