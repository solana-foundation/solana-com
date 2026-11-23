"use client";

import { useEffect, useRef, useState } from "react";

export type DocsSearchResult = {
  title: string | null;
  url: string;
  snippet: string;
  breadcrumbs: string | null;
  tree: string | null;
};

export type DocsSearchState = "idle" | "loading" | "error";

const DEBOUNCE_MS = 180;
const TOP_K = 8;

export function useDocsSearch(query: string) {
  const [results, setResults] = useState<DocsSearchResult[]>([]);
  // The query these results actually describe. On a rate-limited request the
  // results stay on screen, so this is the only thing that says which query
  // they belong to — callers must label, announce and report against it
  // rather than against whatever is currently typed.
  const [resultsQuery, setResultsQuery] = useState("");
  const [state, setState] = useState<DocsSearchState>("idle");
  // Mirrors whether any results are on screen, so the 429 branch can tell if
  // there is something to fall back to without re-running the effect.
  const hasResultsRef = useRef(false);

  useEffect(() => {
    const q = query.trim();

    if (!q) {
      hasResultsRef.current = false;
      setResults([]);
      setResultsQuery("");
      setState("idle");
      return;
    }

    const controller = new AbortController();
    setState("loading");

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/ask/search?q=${encodeURIComponent(q)}&top_k=${TOP_K}`,
          { signal: controller.signal },
        );

        // 429 is routine for search-as-you-type against a per-visitor limit,
        // so the last good results stay on screen and no error flashes. They
        // keep their original resultsQuery, which is what stops them being
        // silently relabelled as results for the query that was throttled.
        // With nothing cached there is nothing to fall back to, so settle on
        // the quiet unavailable state instead of leaving "Searching…" up.
        if (res.status === 429) {
          setState(hasResultsRef.current ? "idle" : "error");
          return;
        }

        // Other failures (403 misconfig, 503 kill switch) fall through to the
        // quiet unavailable state; never surface a status code to the visitor.
        if (!res.ok) {
          hasResultsRef.current = false;
          setResults([]);
          setResultsQuery("");
          setState("error");
          return;
        }

        const data = await res.json();
        const next: DocsSearchResult[] = data.results ?? [];
        hasResultsRef.current = next.length > 0;
        setResults(next);
        setResultsQuery(q);
        setState("idle");
      } catch (err) {
        if ((err as Error).name !== "AbortError") setState("error");
      }
    }, DEBOUNCE_MS);

    // Cancels both the pending debounce and any in-flight request, so a stale
    // response can never land after a newer query.
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return { results, resultsQuery, state };
}
