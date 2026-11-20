"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { InkeepChatButton } from "@solana-com/ui-chrome";
import { closeAskSolana } from "@solana-com/ui-chrome/ask-solana/store";
import { isAskAiPath } from "@/lib/docs/ask-ai";
import { useHydrated } from "@/lib/docs/use-hydrated";
import { AskAi } from "./ask/ask-ai.client";
import { AskSearch } from "./ask/ask-search.client";
import { DocsInkeep } from "./inkeep.client";

/**
 * The docs layout's assistant, by the address bar's path (isAskAiPath): on
 * /developers/docs, Ask AI (its launcher, panel and selection pill) and
 * the docs search on the agent's search API; everywhere else in this app
 * (the /developers landing, the cookbook), Inkeep's chat button and its
 * modal search and chat, as before Ask AI. A client-side move between the
 * docs and the cookbook swaps them; the Ask AI conversation stays in its
 * store and comes back with the docs. The search doesn't: leaving the docs
 * closes it (its open state is Bri's store, which outlives the dialog), so
 * it doesn't open by itself over the next docs page.
 *
 * Chosen once hydrated: a missing page is the prerendered 404
 * (app/global-not-found.tsx) under the URL that was asked for, which its
 * render doesn't know. Neither side shows anything that works before then
 * (Ask AI's launcher stays invisible until hydration).
 */
export function DocsAssistant() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const askAi = isAskAiPath(pathname);
  useEffect(() => {
    if (hydrated && !askAi) closeAskSolana();
  }, [hydrated, askAi]);
  if (!hydrated) return null;
  if (askAi) {
    return (
      <>
        <AskAi />
        <AskSearch />
      </>
    );
  }
  return (
    <>
      {/* Above the docs' sticky table of contents (z-index 21). */}
      <InkeepChatButton className="z-40" />
      <DocsInkeep />
    </>
  );
}
