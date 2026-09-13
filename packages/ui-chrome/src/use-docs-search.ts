"use client";

import { useEffect, useState } from "react";

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
  const [state, setState] = useState<DocsSearchState>("idle");

  useEffect(() => {
    const q = query.trim();

    if (!q) {
      setResults([]);
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
        // so the last good results stay on screen and no error flashes. Other
        // failures (403 misconfig, 503 kill switch) fall through to the quiet
        // unavailable state; never surface a status code to the visitor.
        if (res.status === 429) {
          setState("idle");
          return;
        }

        if (!res.ok) {
          setResults([]);
          setState("error");
          return;
        }

        const data = await res.json();
        setResults(data.results ?? []);
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

  return { results, state };
}
