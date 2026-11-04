"use client";

import {
  Content as DialogContent,
  Overlay as DialogOverlay,
  Portal as DialogPortal,
  Root as DialogRoot,
  Title as DialogTitle,
} from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { trackAskSolana } from "@solana-com/ui-chrome/ask-solana/analytics";
import {
  searchDocs,
  type AskSearchResult,
} from "@solana-com/ui-chrome/ask-solana/api";
import {
  clearAskSolanaInitialQuery,
  closeAskSolana,
  getAskSolanaState,
  openAskSolana,
  subscribeToAskSolana,
} from "@solana-com/ui-chrome/ask-solana/store";
import { openAskAi } from "@/lib/docs/ask-ai";
import { currentLocale } from "@/lib/docs/ask/page-context";
import { normalizeDocsHref } from "@/lib/docs/ask/protocol";
import {
  DOCS_SEARCH_OPEN_EVENT,
  takeSearchHandOff,
} from "@/lib/docs/search-hand-off";
import { DocsLink } from "../docs-link";
import { Lucide, SparkleIcon, XIcon } from "../docs-ui-icons";
import { FileTextIcon } from "./ask-sources.client";
import { cn } from "./cn";
import {
  focusRing,
  headerIconButton,
  iconTile,
  spinner,
  visuallyHidden,
} from "./ui";

/** As Bri's search view: search this long after the last keystroke. */
const DEBOUNCE_MS = 250;

/** Lucide search (ISC). */
function SearchIcon({ className }: { className?: string }) {
  return (
    <Lucide className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Lucide>
  );
}

/** Unboxed rows, as the panel's sources; negative margins hang the hover fill. */
const rowClass = cn(
  "group -mx-2 flex w-[calc(100%+1rem)] items-start gap-3 rounded-lg px-2 py-2 text-start no-underline transition-colors duration-150 hover:bg-[var(--sol-soft)] motion-reduce:transition-none",
  focusRing,
);

/**
 * Bri's search (`searchDocs`, GET /api/ask/search) for `query`: debounced,
 * and the previous request aborted when the query changes.
 */
function useDocsSearch(query: string) {
  const [results, setResults] = useState<AskSearchResult[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  useEffect(() => {
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
  return { results, state };
}

/** A snippet's Markdown marks (`**`, backticks, `## `) left out. */
function plainSnippet(text: string): string {
  return text
    .replace(/\*\*|__|`/g, "")
    .replace(/(^|\s)#{1,6}\s+/g, "$1")
    .trim();
}

function SearchResult({
  result,
  query,
}: {
  result: AskSearchResult;
  query: string;
}) {
  const href = normalizeDocsHref(result.url, currentLocale());
  // The trail, without the page itself (the agent often sends just that).
  const trail = result.breadcrumbs
    ?.filter((crumb) => crumb !== result.title)
    .join(" › ");
  return (
    <DocsLink
      href={href}
      data-search-row=""
      onClick={() => {
        trackAskSolana("docs_ai_search_result_clicked", {
          query,
          url: result.url,
        });
        closeAskSolana();
      }}
      className={rowClass}
    >
      <span aria-hidden="true" className={cn(iconTile, "mt-0.5 size-7")}>
        <FileTextIcon className="size-4" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[14px] font-medium leading-5 text-[var(--sol-text)] transition-colors duration-150 group-hover:text-[var(--sol-purple-text)] motion-reduce:transition-none">
          {result.title}
        </span>
        {trail ? (
          <span className="truncate text-[12px] leading-4 text-[var(--sol-dim)]">
            {trail}
          </span>
        ) : null}
        {result.snippet ? (
          <span className="mt-1 line-clamp-2 text-[13px] leading-5 text-[var(--sol-muted)]">
            {plainSnippet(result.snippet)}
          </span>
        ) : null}
      </span>
    </DocsLink>
  );
}

/**
 * The search field and what it finds: an "Ask AI" row that hands the query
 * to the Ask AI panel, then the matching docs pages. Starts from the query
 * the search was opened with, and takes a newer one if it is opened again.
 */
function SearchBody({ initialQuery }: { initialQuery: string }) {
  const t = useTranslations("askSolana");
  const tc = useTranslations("commands");
  const [query, setQuery] = useState(initialQuery);
  const field = useRef<HTMLInputElement>(null);
  const { results, state } = useDocsSearch(query);
  const trimmed = query.trim();

  useEffect(() => {
    field.current?.focus();
    field.current?.select();
  }, []);

  // Up and Down move between the field and the rows; Enter in the field
  // takes the first row (Ask AI).
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.nativeEvent.isComposing) return;
    const rows = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>("[data-search-row]"),
    );
    if (event.key === "Enter" && event.target === field.current) {
      if (!rows[0]) return;
      event.preventDefault();
      rows[0].click();
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const stops = [field.current, ...rows].filter(
      (stop): stop is HTMLElement => stop !== null,
    );
    const at = stops.indexOf(document.activeElement as HTMLElement);
    const next = stops[at + (event.key === "ArrowDown" ? 1 : -1)];
    if (at === -1 || !next) return;
    event.preventDefault();
    next.focus();
  };

  // Taken once, so a later open with nothing typed keeps this query.
  useEffect(() => {
    if (!initialQuery) return;
    setQuery(initialQuery);
    clearAskSolanaInitialQuery();
  }, [initialQuery]);

  return (
    <div
      onKeyDown={onKeyDown}
      className="flex min-h-0 flex-1 flex-col bg-[var(--sol-page)] text-[14px] leading-6 text-[var(--sol-text)]"
    >
      <div className="flex h-12 shrink-0 items-center gap-2.5 border-b border-[var(--sol-line)] pe-2.5 ps-4">
        <SearchIcon className="shrink-0 text-[var(--sol-dim)]" />
        <input
          ref={field}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label={t("searchPlaceholder")}
          placeholder={t("searchPlaceholder")}
          enterKeyHint="search"
          className="m-0 h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-[15px] text-[var(--sol-text)] outline-none placeholder:text-[var(--sol-dim)] max-sm:text-[16px]"
        />
        <button
          type="button"
          aria-label={tc("close")}
          title={tc("close")}
          onClick={() => closeAskSolana()}
          className={cn(headerIconButton, focusRing)}
        >
          <XIcon />
        </button>
      </div>
      {trimmed ? (
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-2">
          <button
            type="button"
            data-search-row=""
            onClick={() => {
              trackAskSolana("docs_ai_view_switched", { view: "chat" });
              closeAskSolana();
              openAskAi({ question: trimmed });
            }}
            className={cn(rowClass, "items-center")}
          >
            <span aria-hidden="true" className={cn(iconTile, "size-7")}>
              <SparkleIcon className="size-4" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[14px] font-medium leading-5 text-[var(--sol-text)]">
              {t("askAIAbout", { query: trimmed })}
            </span>
          </button>
          {state === "loading" ? (
            <p
              role="status"
              className="m-0 flex items-center gap-2 py-2 text-[13px] leading-5 text-[var(--sol-dim)]"
            >
              <span aria-hidden="true" className={spinner} />
              {t("statusSearching")}
            </p>
          ) : state === "error" ? (
            <p className="m-0 py-2 text-[13px] leading-5 text-[var(--sol-red)]">
              {t("errorGeneric")}
            </p>
          ) : state === "done" && results.length === 0 ? (
            <p className="m-0 py-2 text-[13px] leading-5 text-[var(--sol-dim)]">
              {t("noResults")}
            </p>
          ) : null}
          {results.length > 0 ? (
            <ul className="m-0 list-none p-0">
              {results.map((result, index) => (
                <li key={`${index}:${result.url}`}>
                  <SearchResult result={result} query={trimmed} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/**
 * The docs search, in place of Inkeep's: a dialog over the page, opened by
 * the docs header's search field (`openDocsSearch`, with what was typed,
 * and `?q=` on arrival) and by `?search=` links. Its open state is Bri's
 * Ask Solana store (`openAskSolana` in search mode); results come from her
 * `searchDocs`.
 */
export function AskSearch() {
  const tc = useTranslations("commands");
  const { isOpen, initialQuery } = useSyncExternalStore(
    subscribeToAskSolana,
    getAskSolanaState,
    getAskSolanaState,
  );

  useEffect(() => {
    const search = (query = "") =>
      openAskSolana("search", query, { mode: "search" });
    const onSearch = (event: Event) =>
      search((event as CustomEvent<{ query?: string }>).detail?.query);
    window.addEventListener(DOCS_SEARCH_OPEN_EVENT, onSearch);
    // `?search=` stays in the URL, as with Inkeep and Bri's modal.
    const linked = new URLSearchParams(window.location.search)
      .get("search")
      ?.trim();
    const handOff = takeSearchHandOff() ?? (linked || null);
    if (handOff !== null) search(handOff);
    return () => window.removeEventListener(DOCS_SEARCH_OPEN_EVENT, onSearch);
  }, []);

  useEffect(() => {
    if (isOpen) trackAskSolana("docs_ai_chat_opened", { view: "search" });
  }, [isOpen]);

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeAskSolana();
      }}
    >
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-[55] bg-black/40 animate-in fade-in-0 duration-150 motion-reduce:animate-none" />
        <DialogContent
          data-dev-landing="docs"
          data-docs=""
          aria-describedby={undefined}
          className="fixed inset-x-0 top-[12vh] z-[55] mx-auto flex max-h-[min(36rem,76vh)] w-[min(40rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-[var(--sol-line)] shadow-[var(--sol-menu-shadow)] outline-none animate-in fade-in-0 slide-in-from-top-1 duration-150 motion-reduce:animate-none dark:border-[var(--sol-line-strong)] max-sm:inset-0 max-sm:max-h-none max-sm:w-full max-sm:rounded-none max-sm:border-0"
        >
          <DialogTitle className={visuallyHidden}>{tc("search")}</DialogTitle>
          <SearchBody initialQuery={initialQuery} />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
