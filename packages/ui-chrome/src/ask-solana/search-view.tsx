"use client";

import * as React from "react";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";
import { MessageCircle, Search } from "react-feather";
import { searchDocs, type AskSearchResult } from "./api";
import { trackAskSolana } from "./analytics";

function cn(...inputs: classNames.ArgumentArray) {
  return twMerge(classNames(inputs));
}

const DEBOUNCE_MS = 250;

export function AskSolanaSearchView({
  isDark,
  initialQuery,
  onAskAI,
}: {
  isDark: boolean;
  initialQuery: string;
  onAskAI: (query: string) => void;
}) {
  const t = useTranslations();
  const [query, setQuery] = React.useState(initialQuery);
  const [results, setResults] = React.useState<AskSearchResult[]>([]);
  const [state, setState] = React.useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  React.useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setState("idle");
      return;
    }

    setState("loading");
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const found = await searchDocs(trimmed, controller.signal);
        setResults(found);
        setState("done");
        trackAskSolana("docs_ai_search", {
          query: trimmed,
          result_count: found.length,
        });
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
          setState("error");
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  const trimmed = query.trim();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        className={cn(
          "flex items-center gap-2 border-b px-5 py-3",
          isDark ? "border-white/10" : "border-gray-200",
        )}
      >
        <Search
          size={16}
          className={isDark ? "text-gray-500" : "text-gray-400"}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("askSolana.searchPlaceholder")}
          className={cn(
            "flex-1 bg-transparent text-sm outline-none",
            isDark
              ? "text-white placeholder:text-gray-500"
              : "text-black placeholder:text-gray-400",
          )}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        {trimmed ? (
          <button
            type="button"
            onClick={() => onAskAI(trimmed)}
            className={cn(
              "mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
              isDark
                ? "text-gray-200 hover:bg-white/5"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            <MessageCircle size={16} className="shrink-0 text-[#9945FF]" />
            <span className="truncate">
              {t("askSolana.askAIAbout", { query: trimmed })}
            </span>
          </button>
        ) : (
          <p
            className={cn(
              "px-3 py-6 text-center text-sm",
              isDark ? "text-gray-500" : "text-gray-400",
            )}
          >
            {t("askSolana.searchEmptyState")}
          </p>
        )}

        {state === "error" ? (
          <p
            className={cn(
              "px-3 py-4 text-sm",
              isDark ? "text-red-400" : "text-red-500",
            )}
          >
            {t("askSolana.errorGeneric")}
          </p>
        ) : null}

        {state === "done" && trimmed && results.length === 0 ? (
          <p
            className={cn(
              "px-3 py-4 text-sm",
              isDark ? "text-gray-500" : "text-gray-400",
            )}
          >
            {t("askSolana.noResults")}
          </p>
        ) : null}

        {results.map((result) => (
          <a
            key={result.url}
            href={result.url}
            onClick={() =>
              trackAskSolana("docs_ai_search_result_clicked", {
                query: trimmed,
                url: result.url,
              })
            }
            className={cn(
              "block rounded-lg px-3 py-2.5 transition-colors",
              isDark ? "hover:bg-white/5" : "hover:bg-gray-100",
            )}
          >
            <div
              className={cn(
                "text-sm font-medium",
                isDark ? "text-gray-100" : "text-gray-900",
              )}
            >
              {result.title}
            </div>
            {result.breadcrumbs && result.breadcrumbs.length > 0 ? (
              <div
                className={cn(
                  "mt-0.5 text-xs",
                  isDark ? "text-gray-500" : "text-gray-400",
                )}
              >
                {result.breadcrumbs.join(" › ")}
              </div>
            ) : null}
            {result.snippet ? (
              <div
                className={cn(
                  "mt-1 line-clamp-2 text-xs leading-relaxed",
                  isDark ? "text-gray-400" : "text-gray-500",
                )}
              >
                {result.snippet}
              </div>
            ) : null}
          </a>
        ))}
      </div>
    </div>
  );
}
