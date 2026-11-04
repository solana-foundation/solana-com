"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "./cn";
import { askStore } from "@/lib/docs/ask/store";
import { useAskSelector } from "@/lib/docs/ask/use-ask";
import {
  readPageContext,
  type AskPageContext,
} from "@/lib/docs/ask/page-context";
import { FileTextIcon } from "./ask-sources.client";
import { focusRing, iconTile, signatureLabel } from "./ui";

/**
 * Each suggestion marked in the tone its subject has in the diagrams:
 * minting green, deriving purple, invoking blue, validators amber.
 */
const SUGGESTIONS = [
  { key: "token", mark: "bg-[var(--tone-green)]" },
  { key: "pda", mark: "bg-[var(--tone-purple)]" },
  { key: "fees", mark: "bg-[var(--tone-amber)]" },
  { key: "cpi", mark: "bg-[var(--tone-blue)]" },
] as const;

/** Unboxed rows, as the docs sidebar's links; negative margins hang the hover fill. */
const rowClass =
  "-mx-2 flex w-[calc(100%+1rem)] items-center rounded-lg px-2 text-start transition-colors duration-150 hover:bg-[var(--sol-soft)] motion-reduce:transition-none";

/**
 * The empty thread: one line on what the panel answers from, "Ask about
 * this page" (a docs page only, until it is attached) as a page-actions
 * row, questions to start with, and the disclaimer last.
 */
export function AskEmpty() {
  const t = useTranslations("docsAsk");
  const pathname = usePathname();
  // The page's #content carries its title. The panel only renders after
  // hydration, so the first read can happen during render (no row popping
  // in); later reads wait for client navigation to commit.
  const [page, setPage] = useState<AskPageContext | null>(readPageContext);
  useEffect(() => setPage(readPageContext()), [pathname]);
  const attached = useAskSelector((s) => s.pageContext?.url ?? null);

  return (
    <div>
      {/* Rows follow the page's direction; <bdi> keeps an untranslated
          (English) sentence's full stop at its end on an Arabic page. */}
      <p className="m-0 text-[14px] leading-[1.55] text-[var(--sol-muted)]">
        <bdi>{t("emptyBody")}</bdi>
      </p>
      {page && page.url !== attached ? (
        <button
          type="button"
          onClick={() => askStore.attachCurrentPage()}
          className={cn(rowClass, "mt-5 gap-3 py-1.5", focusRing)}
        >
          <span aria-hidden="true" className={cn(iconTile, "size-7")}>
            <FileTextIcon className="size-4" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-[14px] font-medium leading-5 text-[var(--sol-text)]">
              <bdi>{t("askAboutPage")}</bdi>
            </span>
            <span className="truncate text-[12px] leading-4 text-[var(--sol-dim)]">
              {page.title}
            </span>
          </span>
        </button>
      ) : null}
      <p className={cn(signatureLabel, "m-0 mt-6")}>{t("suggestionsLabel")}</p>
      <ul className="m-0 mt-1.5 list-none p-0">
        {SUGGESTIONS.map(({ key, mark }) => (
          <li key={key}>
            <button
              type="button"
              onClick={() =>
                askStore.send(t(`suggestions.${key}`), { pageContext: null })
              }
              className={cn(
                rowClass,
                "gap-2.5 py-1.5 text-[14px] leading-6 text-[var(--sol-muted)] hover:text-[var(--sol-text)]",
                focusRing,
              )}
            >
              {/* The docs' concept-chip mark, as on the diagram cards. */}
              <span
                aria-hidden="true"
                className={cn(
                  "mx-px size-[5px] shrink-0 rotate-45 rounded-[1px]",
                  mark,
                )}
              />
              <bdi className="min-w-0">{t(`suggestions.${key}`)}</bdi>
            </button>
          </li>
        ))}
      </ul>
      <p className="m-0 mt-6 text-[12px] leading-[1.5] text-[var(--sol-dim)]">
        <bdi>{t("disclaimer")}</bdi> <bdi>{t("privacy")}</bdi>
      </p>
    </div>
  );
}
