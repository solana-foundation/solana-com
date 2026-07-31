"use client";

import { type FormEvent, useCallback, useMemo, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@workspace/i18n/routing";
import { ArrowUpRight, Mail, Rss } from "lucide-react";
import {
  DescriptionContent,
  type DescriptionContentProps,
} from "@/components/post/post-card";
import {
  CHANGELOG_CATEGORY,
  CHANGELOG_PAGE_SIZE,
  CHANGELOG_SUBSCRIBE_URL,
} from "@/lib/changelog";
import type { PageInfo, PostItem } from "@/lib/post-types";

const DEFAULT_PAGE_INFO: PageInfo = {
  hasPreviousPage: false,
  hasNextPage: false,
  startCursor: null,
  endCursor: null,
};

// Issues whose stripped title is just the publish date (e.g. "July 23, 2026")
// fall back to their summary text so the list scans by what changed.
const DATE_ONLY_TITLE = /^[A-Za-z]+ \d{1,2},? \d{4}$/;

type ChangelogPageProps = {
  initialPosts: PostItem[];
  initialPageInfo?: PageInfo;
};

type IssueGroup = {
  key: string;
  label: string;
  posts: PostItem[];
};

function getIssueTitle(title: string) {
  return title.replace(/^Solana Changelog:\s*/i, "");
}

function getMachineDate(post: PostItem) {
  return post.publishedAt?.slice(0, 10) ?? post.published;
}

function extractDocumentText(node: unknown): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractDocumentText).join(" ");
  if (typeof node === "object") {
    const record = node as { text?: unknown; children?: unknown };
    if (typeof record.text === "string") return record.text;
    return extractDocumentText(record.children);
  }
  return "";
}

function getIssueHeading(post: PostItem) {
  const title = getIssueTitle(post.title);
  if (!DATE_ONLY_TITLE.test(title)) {
    return { heading: title, showDescription: true };
  }

  const summary = extractDocumentText(post.description)
    .replace(/\s+/g, " ")
    .trim();
  return summary
    ? { heading: summary, showDescription: false }
    : { heading: title, showDescription: true };
}

function Description({ post }: { post: PostItem }) {
  return (
    <DescriptionContent
      description={post.description as DescriptionContentProps["description"]}
    />
  );
}

function SubscribeForm() {
  const t = useTranslations("changelog");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus("submitting");

    try {
      const data = new FormData();
      data.append("email", email.trim());

      const response = await fetch(CHANGELOG_SUBSCRIBE_URL, {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Changelog subscription failed");
      }

      setEmail("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const statusMessage =
    status === "submitting"
      ? t("subscribing")
      : status === "success"
        ? t("subscribeSuccess")
        : status === "error"
          ? t("subscribeError")
          : null;

  return (
    <form name="iterable-optin" onSubmit={handleSubmit} className="w-full">
      <label
        htmlFor="changelog-email"
        className="mb-2 block font-mono text-[0.6875rem] lowercase tracking-[0.14em] text-white/50"
      >
        <span aria-hidden># </span>
        {t("subscribeLabel")}
      </label>
      <div className="flex min-w-0 max-w-xl flex-col gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <div
            className={`flex min-h-11 min-w-0 items-center gap-2.5 border-b transition-colors focus-within:border-primary ${
              status === "error"
                ? "border-red-400"
                : status === "success"
                  ? "border-primary"
                  : "border-white/20 hover:border-white/30"
            }`}
          >
            <Mail aria-hidden className="size-4 shrink-0 text-primary" />
            <input
              id="changelog-email"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              aria-describedby={
                statusMessage ? "changelog-email-status" : undefined
              }
              aria-invalid={status === "error"}
              disabled={status === "submitting"}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status !== "idle") {
                  setStatus("idle");
                }
              }}
              placeholder={t("emailPlaceholder")}
              className="min-h-11 min-w-0 flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-white/45 disabled:cursor-wait disabled:opacity-70"
            />
          </div>
          {statusMessage && (
            <p
              id="changelog-email-status"
              role={status === "error" ? "alert" : "status"}
              className={`mt-2 font-mono text-xs ${
                status === "error" ? "text-red-400" : "text-primary"
              }`}
            >
              {statusMessage}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-black transition-colors duration-150 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-wait disabled:opacity-70"
        >
          <Mail aria-hidden className="size-4" />
          {status === "submitting" ? t("subscribing") : t("subscribe")}
        </button>
      </div>
    </form>
  );
}

export function ChangelogPage({
  initialPosts,
  initialPageInfo = DEFAULT_PAGE_INFO,
}: ChangelogPageProps) {
  const t = useTranslations("changelog");
  const format = useFormatter();
  const [posts, setPosts] = useState(initialPosts);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);

  const issueGroups = useMemo(() => {
    const groups = new Map<string, IssueGroup>();

    for (const post of posts) {
      const date = post.publishedAt ? new Date(post.publishedAt) : null;
      const isValid = date !== null && !Number.isNaN(date.getTime());
      const key = isValid ? post.publishedAt!.slice(0, 7) : "archive";
      const existing = groups.get(key);

      if (existing) {
        existing.posts.push(post);
        continue;
      }

      groups.set(key, {
        key,
        label: isValid
          ? format.dateTime(date, {
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            })
          : t("archiveGroup"),
        posts: [post],
      });
    }

    return [...groups.values()];
  }, [posts, format, t]);

  const handleLoadMore = useCallback(async () => {
    if (!pageInfo.hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);
    setHasLoadError(false);

    try {
      const params = new URLSearchParams({
        category: CHANGELOG_CATEGORY,
        limit: String(CHANGELOG_PAGE_SIZE),
      });

      if (pageInfo.endCursor) {
        params.set("cursor", pageInfo.endCursor);
      }

      const response = await fetch(`/api/posts/latest?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to load posts");
      }

      const data = (await response.json()) as {
        posts?: PostItem[];
        pageInfo?: PageInfo;
      };
      const nextPosts = data.posts ?? [];

      setPosts((currentPosts) => {
        const seen = new Set(currentPosts.map((post) => post.id));
        return [
          ...currentPosts,
          ...nextPosts.filter((post) => !seen.has(post.id)),
        ];
      });
      setPageInfo(data.pageInfo ?? DEFAULT_PAGE_INFO);
    } catch {
      setHasLoadError(true);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, pageInfo.endCursor, pageInfo.hasNextPage]);

  return (
    <div className="min-h-screen bg-[#07080a] text-white selection:bg-primary selection:text-black">
      <header
        aria-labelledby="changelog-title"
        className="border-b border-white/10"
      >
        <div className="mx-auto w-full max-w-[1280px] px-5 py-10 md:px-8 md:py-12 lg:py-16">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-[#0b0d10]">
            <div
              aria-hidden
              className="h-px bg-gradient-to-r from-[#9945FF] via-primary to-transparent"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5 font-mono text-[0.6875rem] lowercase tracking-[0.14em] text-white/55 md:px-8">
              <nav aria-label={t("breadcrumbLabel")}>
                <ol className="flex items-center">
                  <li aria-hidden>~/</li>
                  <li>
                    <Link
                      href="/"
                      className="text-white/70 transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      Solana
                    </Link>
                  </li>
                  <li aria-hidden>/</li>
                  <li aria-current="page">{t("breadcrumb")}</li>
                </ol>
              </nav>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-primary"
                />
                {t("updatedWeekly")}
              </div>
            </div>

            <div className="px-5 py-10 md:px-8 lg:px-10 lg:py-14">
              <p className="font-mono text-xs lowercase tracking-[0.04em] text-white/50">
                <span aria-hidden># </span>
                {t("kicker")}
              </p>
              <p className="mt-2 font-mono text-xs tracking-[0.04em] text-white/70 sm:text-sm">
                <span aria-hidden className="text-primary">
                  ${" "}
                </span>
                solana changelog{" "}
                <span className="text-[#a670ff]">--follow</span>
                <span
                  aria-hidden
                  className="ml-1 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] bg-primary/70 animate-caret-blink motion-reduce:animate-none"
                />
              </p>
              <h1
                id="changelog-title"
                className="mt-6 text-5xl font-medium leading-[0.98] tracking-[-0.05em] sm:text-6xl md:text-7xl"
              >
                {t("title")}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
                {t("description")}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs lowercase">
                <a
                  href="/changelog/rss.xml"
                  className="inline-flex min-h-11 items-center gap-2 text-white/60 transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Rss aria-hidden className="size-3.5" />
                  {t("rssFeed")}
                </a>
                <Link
                  href="/developers"
                  className="inline-flex min-h-11 items-center gap-2 text-white/60 transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {t("developerResources")}
                  <ArrowUpRight aria-hidden className="size-3.5" />
                </Link>
              </div>
            </div>

            <div className="border-t border-white/10 px-5 py-5 md:px-8">
              <SubscribeForm />
            </div>
          </div>
        </div>
      </header>

      <section
        aria-labelledby="release-log-title"
        className="mx-auto w-full max-w-[1280px] px-5 py-8 md:px-8 md:py-10"
      >
        <h2 id="release-log-title" className="sr-only">
          {t("releaseLog")}
        </h2>

        {issueGroups.length > 0 ? (
          <div className="border-t border-white/15">
            {issueGroups.map((group) => (
              <section
                key={group.key}
                aria-labelledby={`month-${group.key}`}
                className="grid border-b border-white/15 md:grid-cols-[9rem_minmax(0,1fr)]"
              >
                <div className="border-b border-white/10 bg-white/[0.015] px-4 py-4 md:border-b-0 md:border-r md:px-5 md:py-6">
                  <h3
                    id={`month-${group.key}`}
                    className="font-mono text-xs uppercase tracking-[0.1em] text-white/50"
                  >
                    {group.label}
                  </h3>
                </div>

                <ol>
                  {group.posts.map((post) => {
                    const isLatest = post.id === posts[0]?.id;
                    const { heading, showDescription } = getIssueHeading(post);

                    return (
                      <li
                        key={post.id}
                        className="relative border-b border-white/10 last:border-b-0"
                      >
                        {isLatest && (
                          <span
                            aria-hidden
                            className="absolute inset-y-0 left-0 w-px bg-primary"
                          />
                        )}
                        <article>
                          <Link
                            href={post.url}
                            className="group grid min-w-0 gap-3 px-4 py-5 transition-colors duration-150 hover:bg-white/[0.035] focus-visible:bg-white/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:grid-cols-[7.25rem_minmax(0,1fr)_1.5rem] sm:gap-5 sm:px-5 sm:py-6"
                          >
                            <div className="flex items-center gap-2 self-start pt-0.5 font-mono text-[0.6875rem] tracking-[0.04em] text-white/55 sm:block">
                              {post.publishedAt ? (
                                <time dateTime={post.publishedAt}>
                                  {getMachineDate(post)}
                                </time>
                              ) : (
                                <span>{getMachineDate(post)}</span>
                              )}
                              {isLatest && (
                                <span className="rounded-sm border border-primary/35 bg-primary/10 px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-primary sm:mt-2 sm:block sm:w-fit">
                                  {t("latest")}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0">
                              <h4 className="line-clamp-2 text-xl font-medium leading-snug tracking-[-0.025em] text-white transition-colors duration-150 group-hover:text-primary md:text-[1.375rem]">
                                {heading}
                              </h4>
                              {showDescription && (
                                <div className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/50 [&_p]:m-0 md:text-[0.9375rem]">
                                  <Description post={post} />
                                </div>
                              )}
                            </div>

                            <ArrowUpRight
                              aria-hidden
                              className="hidden size-4 self-center text-white/40 transition duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transform-none sm:block"
                            />
                          </Link>
                        </article>
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}
          </div>
        ) : (
          <div className="border-y border-white/15 py-16 text-center">
            <h3 className="text-xl font-medium">{t("emptyTitle")}</h3>
            <p className="mt-2 text-sm text-white/50">
              {t("emptyDescription")}
            </p>
          </div>
        )}

        {issueGroups.length > 0 && (
          <div
            className="flex min-h-24 flex-col items-center justify-center gap-3 pt-6"
            aria-live="polite"
          >
            {pageInfo.hasNextPage ? (
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-white/20 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.08em] text-white/70 transition-colors duration-150 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoadingMore ? t("loadingMore") : t("loadMore")}
              </button>
            ) : (
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-white/50">
                {t("endOfArchive")}
              </p>
            )}
            {hasLoadError && (
              <p className="text-sm text-red-300">{t("loadError")}</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
