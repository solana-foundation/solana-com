"use client";

import { useCallback, useMemo, useState } from "react";
import { Link } from "@workspace/i18n/routing";
import { ArrowUpRight, Braces, Mail, Rss } from "lucide-react";
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

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

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

function getMonth(post: PostItem) {
  if (!post.publishedAt) {
    return { key: "archive", label: "Archive" };
  }

  const date = new Date(post.publishedAt);
  if (Number.isNaN(date.getTime())) {
    return { key: "archive", label: "Archive" };
  }

  return {
    key: post.publishedAt.slice(0, 7),
    label: monthFormatter.format(date),
  };
}

function groupIssues(posts: PostItem[]) {
  return posts.reduce<IssueGroup[]>((groups, post) => {
    const month = getMonth(post);
    const currentGroup = groups[groups.length - 1];

    if (currentGroup?.key === month.key) {
      currentGroup.posts.push(post);
      return groups;
    }

    groups.push({ ...month, posts: [post] });
    return groups;
  }, []);
}

function Description({ post }: { post: PostItem }) {
  return (
    <DescriptionContent
      description={post.description as DescriptionContentProps["description"]}
    />
  );
}

function SubscribeForm() {
  return (
    <form
      name="iterable-optin"
      action={CHANGELOG_SUBSCRIBE_URL}
      target="_blank"
      method="POST"
      className="w-full"
    >
      <label
        htmlFor="changelog-email"
        className="mb-2 block font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-white/50"
      >
        Get the weekly diff
      </label>
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
        <input
          id="changelog-email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="you@company.com"
          className="min-h-11 min-w-0 flex-1 rounded-md border border-white/20 bg-black/35 px-3.5 font-mono text-sm text-white outline-none transition-colors placeholder:text-white/35 hover:border-white/30 focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-black transition-colors duration-150 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0d10]"
        >
          <Mail aria-hidden className="size-4" />
          Subscribe
        </button>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-white/40">
        One engineering brief a week. No marketing noise.
      </p>
    </form>
  );
}

export function ChangelogPage({
  initialPosts,
  initialPageInfo = DEFAULT_PAGE_INFO,
}: ChangelogPageProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const issueGroups = useMemo(() => groupIssues(posts), [posts]);

  const handleLoadMore = useCallback(async () => {
    if (!pageInfo.hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);
    setLoadError(null);

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
        throw new Error("The archive could not be loaded.");
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
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "The archive could not be loaded.",
      );
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, pageInfo.endCursor, pageInfo.hasNextPage]);

  return (
    <div className="min-h-screen bg-[#07080a] text-white selection:bg-primary selection:text-black">
      <header
        aria-labelledby="changelog-title"
        className="relative isolate overflow-hidden border-b border-white/10 bg-[#0b0d10]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_82%_10%,rgba(153,69,255,0.16),transparent_28%),radial-gradient(circle_at_10%_110%,rgba(20,241,149,0.1),transparent_30%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:linear-gradient(to_right,black,transparent_88%)]"
        />

        <div className="mx-auto w-full max-w-[1280px] px-5 py-10 md:px-8 md:py-14 lg:py-16">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-white/45">
            <div className="flex items-center gap-2.5">
              <Braces aria-hidden className="size-3.5 text-primary" />
              <span className="text-white/70">Solana</span>
              <span aria-hidden>/</span>
              <span>Changelog</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(20,241,149,0.8)]"
              />
              Updated weekly
            </div>
          </div>

          <div className="grid gap-9 pt-9 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-end lg:gap-16 lg:pt-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                Release notes for builders
              </p>
              <h1
                id="changelog-title"
                className="mt-3 text-5xl font-medium leading-[0.98] tracking-[-0.05em] sm:text-6xl md:text-7xl"
              >
                Solana Changelog
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
                A concise record of protocol changes, validator releases, SDK
                updates, and developer tooling across the Solana ecosystem.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs">
                <a
                  href="/changelog/rss.xml"
                  className="inline-flex min-h-11 items-center gap-2 text-white/60 transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Rss aria-hidden className="size-3.5" />
                  RSS feed
                </a>
                <Link
                  href="/developers"
                  className="inline-flex min-h-11 items-center gap-2 text-white/60 transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Developer resources
                  <ArrowUpRight aria-hidden className="size-3.5" />
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/20 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.22)] md:p-5">
              <SubscribeForm />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1280px] lg:grid-cols-[13rem_minmax(0,1fr)]">
        <aside
          aria-label="Changelog details"
          className="border-b border-white/10 px-5 py-6 md:px-8 lg:border-b-0 lg:border-r lg:px-6 lg:py-10"
        >
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-white/35">
            Log index
          </p>
          <dl className="mt-4 grid grid-cols-3 gap-3 lg:grid-cols-1 lg:gap-0">
            <div className="border-l border-white/10 pl-3 lg:border-b lg:border-l-0 lg:pb-4 lg:pl-0">
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-white/35">
                Cadence
              </dt>
              <dd className="mt-1 text-sm text-white/75">Weekly</dd>
            </div>
            <div className="border-l border-white/10 pl-3 lg:border-b lg:border-l-0 lg:py-4 lg:pl-0">
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-white/35">
                Order
              </dt>
              <dd className="mt-1 text-sm text-white/75">Newest first</dd>
            </div>
            <div className="border-l border-white/10 pl-3 lg:border-l-0 lg:pt-4 lg:pl-0">
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-white/35">
                Format
              </dt>
              <dd className="mt-1 text-sm text-white/75">Engineering brief</dd>
            </div>
          </dl>
        </aside>

        <section
          aria-labelledby="release-log-title"
          className="min-w-0 px-5 py-8 md:px-8 md:py-10 lg:px-10 lg:py-10"
        >
          <div className="flex flex-wrap items-end justify-between gap-4 pb-6">
            <div>
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-primary">
                Archive
              </p>
              <h2
                id="release-log-title"
                className="mt-1.5 text-2xl font-medium tracking-[-0.025em] md:text-3xl"
              >
                Release log
              </h2>
            </div>
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-white/35">
              {posts.length} {posts.length === 1 ? "issue" : "issues"} loaded
            </p>
          </div>

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
                              <div className="flex items-center gap-2 self-start pt-0.5 font-mono text-[0.6875rem] tracking-[0.04em] text-white/40 sm:block">
                                {post.publishedAt ? (
                                  <time dateTime={post.publishedAt}>
                                    {getMachineDate(post)}
                                  </time>
                                ) : (
                                  <span>{getMachineDate(post)}</span>
                                )}
                                {isLatest && (
                                  <span className="rounded-sm border border-primary/35 bg-primary/10 px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-primary sm:mt-2 sm:block sm:w-fit">
                                    Latest
                                  </span>
                                )}
                              </div>

                              <div className="min-w-0">
                                <h4 className="text-xl font-medium leading-snug tracking-[-0.025em] text-white transition-colors duration-150 group-hover:text-primary md:text-[1.375rem]">
                                  {getIssueTitle(post.title)}
                                </h4>
                                <div className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/50 [&_p]:m-0 md:text-[0.9375rem]">
                                  <Description post={post} />
                                </div>
                              </div>

                              <ArrowUpRight
                                aria-hidden
                                className="hidden size-4 self-center text-white/30 transition duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transform-none sm:block"
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
              <h3 className="text-xl font-medium">
                The first issue is on its way.
              </h3>
              <p className="mt-2 text-sm text-white/50">
                Check back for weekly Solana engineering updates.
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
                  {isLoadingMore ? "Loading issues…" : "Load older issues"}
                </button>
              ) : (
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-white/30">
                  End of archive
                </p>
              )}
              {loadError && (
                <p className="text-sm text-red-300">
                  {loadError} Please try again.
                </p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
