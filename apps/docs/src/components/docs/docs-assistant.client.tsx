"use client";

import { useHydrated } from "@/lib/docs/use-hydrated";
import { AskAi } from "./ask/ask-ai.client";
import { AskSearch } from "./ask/ask-search.client";

/**
 * The docs layout's assistant, on every page of the layout (the
 * /developers landing, /developers/docs, /developers/cookbook and the
 * 404): Ask AI (its launcher, panel and selection pill) and the docs search
 * on the agent's search API, which falls back to the docs' own index
 * (/api/docs-search). Mounted once in the layout, so a conversation and an
 * open panel survive client-side moves between pages.
 *
 * Mounted once hydrated: neither works before then (Ask AI's launcher
 * stays invisible until hydration), and the prerendered pages carry no
 * markup for them.
 */
export function DocsAssistant() {
  const hydrated = useHydrated();
  if (!hydrated) return null;
  return (
    <>
      <AskAi />
      <AskSearch />
    </>
  );
}
