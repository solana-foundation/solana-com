"use client";

import { useState } from "react";
import { useTranslations } from "@workspace/i18n/client";
import { Link } from "@workspace/i18n/routing";
import Button from "@/components/Button";
import { breakpointHref } from "@/lib/links";
import type {
  HereForSuggestion,
  HereForSuggestionReason,
} from "@/lib/here-for/types";
import {
  HERE_FOR_PATH,
  handleSlug,
  joinHandles,
  openXIntent,
  personUrl,
  useMe,
  withAsk,
} from "./client";
import BackToMap from "./BackToMap";
import { hereForType } from "./typography";

type Filter = "all" | "addedYou" | "sharedAdd" | "step";
const FILTERS: Filter[] = ["all", "addedYou", "sharedAdd", "step"];
const PAGE_SIZE = 10;

const matches = (suggestion: HereForSuggestion, filter: Filter) =>
  filter === "all" ||
  suggestion.reasons.some((reason) =>
    filter === "step"
      ? reason.kind === "yourAddAdded" || reason.kind === "coAdded"
      : reason.kind === filter,
  );

export default function FindMutuals({ locale }: { locale: string }) {
  const t = useTranslations("breakpoint.hereFor");
  const [me] = useMe();
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(0);

  const reasonText = (reason: HereForSuggestionReason) =>
    reason.kind === "addedYou"
      ? t("mutuals.reasons.addedYou")
      : t(`mutuals.reasons.${reason.kind}`, { handle: reason.via });

  const data = me.status === "ready" ? me.data : null;
  const suggestions = data?.suggestions ?? [];
  const filtered = suggestions.filter((s) => matches(s, filter));
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = Math.min(page, pages - 1) * PAGE_SIZE;
  const shown = filtered.slice(start, start + PAGE_SIZE);
  const nextUp = suggestions.slice(0, 3);
  const next = joinHandles(nextUp.map((s) => s.handle));
  // Mutuals have added theirs by definition, so only "next up" can be asked.
  const mutualsPost = data
    ? withAsk(
        data.mutuals.length
          ? t("share.mutuals", { mutuals: joinHandles(data.mutuals), next })
          : t("share.mutualsNone", { next }),
        t("share.ask"),
        nextUp.some((s) => !s.claimed),
      )
    : "";

  const postMutuals = () => {
    if (!data?.handle) return;
    openXIntent(
      mutualsPost,
      personUrl(locale, data.handle, { card: "mutuals" }),
    );
  };

  return (
    <section className="bg-black pb-3xl pt-[120px] md:pb-4xl md:pt-[136px]">
      <div className="mx-auto grid w-full max-w-[1440px] gap-l px-4 md:grid-cols-bp-desktop md:gap-x-s md:px-8">
        <header className="flex flex-col gap-xs border-b border-stroke-primary pb-l md:col-span-16">
          <BackToMap />
          <p className={`${hereForType.eyebrow} text-core-purple`}>
            {t("mutuals.eyebrow")}
          </p>
          <h1 className="type-h1">{t("mutuals.title")}</h1>
          <p
            className={`max-w-[640px] ${hereForType.lead} text-text-secondary`}
          >
            {t("mutuals.description")}
          </p>
        </header>

        {me.status === "loading" ? (
          <p
            role="status"
            className={`${hereForType.label} text-text-secondary md:col-span-16`}
          >
            {t("mutuals.loading")}
          </p>
        ) : !data?.handle ? (
          <div className="flex flex-col items-start gap-s md:col-span-10">
            <p className={`${hereForType.lead} text-text-secondary`}>
              {t("mutuals.needsHandle")}
            </p>
            <Button href={`${HERE_FOR_PATH}/add`} label={t("nav.add")} arrow />
          </div>
        ) : (
          <>
            <aside className="flex flex-col gap-l md:col-span-4">
              <div>
                <p className={`${hereForType.label} mb-xs text-text-secondary`}>
                  {t("mutuals.yourMutuals", { count: data.mutuals.length })}
                </p>
                {data.mutuals.length === 0 ? (
                  <p className={`${hereForType.body} text-text-secondary`}>
                    {t("mutuals.noMutuals")}
                  </p>
                ) : (
                  <ul className="unstyled-list flex flex-col gap-3xs">
                    {data.mutuals.map((handle) => (
                      <li key={handle}>
                        <Link
                          href={breakpointHref(
                            `${HERE_FOR_PATH}/${handleSlug(handle)}`,
                          )}
                          className={`flex h-11 items-center gap-xs bg-core-green px-2xs ${hereForType.name} text-black hover:bg-neutral-50`}
                        >
                          <span aria-hidden="true" className="font-mono">
                            ⇄
                          </span>
                          {handle}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <p
                  className={`flex h-10 items-center border-y border-stroke-primary px-2xs ${hereForType.label} text-text-secondary`}
                >
                  {t("mutuals.filtersLabel")}
                </p>
                <div role="group" aria-label={t("mutuals.filtersLabel")}>
                  {FILTERS.map((key, i) => {
                    const selected = filter === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => {
                          setFilter(key);
                          setPage(0);
                        }}
                        className={`flex h-10 w-full items-center gap-s border-b border-stroke-primary px-2xs text-left ${hereForType.control} focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-core-purple ${
                          selected
                            ? "bg-white text-black"
                            : "text-white hover:bg-neutral-800"
                        }`}
                      >
                        <span className="w-m">0{i + 1}</span>
                        <span className="flex-1">
                          {t(`mutuals.filters.${key}`)}
                        </span>
                        <span>
                          {suggestions.filter((s) => matches(s, key)).length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className={`${hereForType.small} text-text-secondary`}>
                {t("mutuals.scoring")}
              </p>
            </aside>

            <div className="flex flex-col border-t-[6px] border-core-purple bg-background-secondary md:col-span-11 md:col-start-6">
              <div className="flex flex-col gap-3xs border-b border-stroke-primary p-s md:flex-row md:items-baseline md:justify-between md:px-l">
                <span className={`${hereForType.label} text-text-secondary`}>
                  {t("mutuals.count", {
                    from: shown.length ? start + 1 : 0,
                    to: start + shown.length,
                    total: filtered.length,
                  })}
                </span>
                <span className={`${hereForType.caption} text-text-secondary`}>
                  {t("mutuals.your3", { handles: joinHandles(data.adds) })}
                </span>
              </div>
              {shown.length === 0 ? (
                <p
                  className={`p-s ${hereForType.body} text-text-secondary md:px-l`}
                >
                  {t("mutuals.empty")}
                </p>
              ) : (
                <ul className="unstyled-list">
                  {shown.map((s) => (
                    <li
                      key={s.handle}
                      className="flex flex-wrap items-center gap-xs border-b border-stroke-primary px-s py-s md:flex-nowrap md:gap-s md:px-l"
                    >
                      <div className="flex min-w-0 flex-1 basis-full flex-col gap-2xs md:basis-auto">
                        <Link
                          href={breakpointHref(
                            `${HERE_FOR_PATH}/${handleSlug(s.handle)}`,
                          )}
                          aria-label={t("mutuals.viewOnMap", {
                            handle: s.handle,
                          })}
                          className={`truncate ${hereForType.title} transition-colors hover:text-core-purple`}
                        >
                          {s.handle}
                        </Link>
                        <span className="flex flex-wrap gap-3xs">
                          {s.reasons.map((reason, i) => (
                            <span
                              key={i}
                              className={`inline-flex min-h-[22px] items-center px-[6px] py-[3px] ${hereForType.tag} ${
                                reason.kind === "addedYou"
                                  ? "bg-core-yellow text-black"
                                  : reason.kind === "sharedAdd"
                                    ? "border border-core-purple text-white"
                                    : "border border-stroke-secondary text-text-secondary"
                              }`}
                            >
                              {reasonText(reason)}
                            </span>
                          ))}
                        </span>
                      </div>
                      <span
                        className={`mr-auto w-12 md:mr-0 md:text-right ${hereForType.stat} text-text-secondary`}
                      >
                        {s.score}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          openXIntent(
                            t("share.sayHi", { handle: s.handle }),
                            personUrl(locale, s.handle),
                          )
                        }
                        className={`h-8 border border-white px-xs ${hereForType.control} hover:bg-neutral-700`}
                      >
                        {t("mutuals.sayHi")} ↗
                      </button>
                      <Link
                        href={breakpointHref(
                          `${HERE_FOR_PATH}/add?add=${handleSlug(s.handle)}`,
                        )}
                        className={`inline-flex h-8 min-w-[72px] items-center justify-center bg-white px-xs ${hereForType.control} text-black hover:bg-neutral-200`}
                      >
                        {t("mutuals.swapIn")}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {pages > 1 && (
                <nav
                  aria-label={t("mutuals.pagination")}
                  className="flex items-center justify-between gap-s border-b border-stroke-primary px-s py-xs md:px-l"
                >
                  <button
                    type="button"
                    onClick={() => setPage(start / PAGE_SIZE - 1)}
                    disabled={start === 0}
                    className={`h-8 border border-white px-xs ${hereForType.control} hover:bg-neutral-700 disabled:cursor-not-allowed disabled:border-stroke-secondary disabled:text-neutral-500 disabled:hover:bg-transparent`}
                  >
                    ← {t("mutuals.previous")}
                  </button>
                  <span
                    className={`${hereForType.caption} text-text-secondary`}
                  >
                    {t("mutuals.page", {
                      page: start / PAGE_SIZE + 1,
                      pages,
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage(start / PAGE_SIZE + 1)}
                    disabled={start / PAGE_SIZE + 1 >= pages}
                    className={`h-8 border border-white px-xs ${hereForType.control} hover:bg-neutral-700 disabled:cursor-not-allowed disabled:border-stroke-secondary disabled:text-neutral-500 disabled:hover:bg-transparent`}
                  >
                    {t("mutuals.next")} →
                  </button>
                </nav>
              )}
              <div className="mt-auto flex flex-col gap-s border-t border-stroke-primary p-s md:flex-row md:items-center md:px-l">
                <p className={`flex-1 ${hereForType.body} text-white`}>
                  {mutualsPost}
                </p>
                <Button
                  label={t("mutuals.postMutuals")}
                  onClick={postMutuals}
                  arrow
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
