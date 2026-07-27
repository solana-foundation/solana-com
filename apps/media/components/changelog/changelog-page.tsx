"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { Link } from "@workspace/i18n/routing";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Braces,
  Mail,
  Network,
  Rss,
} from "lucide-react";
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

const coverage = [
  {
    title: "Core protocol",
    description: "SIMDs, validator clients, and RPC",
    Icon: Network,
  },
  {
    title: "SDKs & programs",
    description: "Language clients and program releases",
    Icon: Braces,
  },
  {
    title: "Developer tooling",
    description: "Testing, frameworks, and local workflows",
    Icon: Boxes,
  },
] as const;

type ChangelogPageProps = {
  initialPosts: PostItem[];
  initialPageInfo?: PageInfo;
};

function getIssueTitle(title: string) {
  return title.replace(/^Solana Changelog:\s*/i, "");
}

function Description({ post }: { post: PostItem }) {
  return (
    <DescriptionContent
      description={post.description as DescriptionContentProps["description"]}
    />
  );
}

function FocusRing() {
  return (
    <span
      aria-hidden
      className="absolute inset-0 rounded-[inherit] ring-primary ring-offset-2 ring-offset-black group-focus-visible:ring-2"
    />
  );
}

function SubscribeForm({
  id,
  compact = false,
}: {
  id: string;
  compact?: boolean;
}) {
  const inputId = `changelog-email-${id}`;

  return (
    <form
      name="iterable-optin"
      action={CHANGELOG_SUBSCRIBE_URL}
      target="_blank"
      method="POST"
      className="w-full max-w-xl"
    >
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <div
        className={`flex border border-white/20 bg-black/25 p-1.5 backdrop-blur-sm transition-colors focus-within:border-primary ${
          compact
            ? "flex-row rounded-full"
            : "flex-col rounded-2xl sm:flex-row sm:rounded-full"
        }`}
      >
        <input
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="Enter your email"
          className="min-h-12 min-w-0 flex-1 bg-transparent px-4 text-base text-white outline-none placeholder:text-white/40"
        />
        <button
          type="submit"
          className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-5 font-medium text-black transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Mail aria-hidden className="size-4" />
          Subscribe
        </button>
      </div>
      <p className="mt-2 px-2 text-xs leading-relaxed text-white/45">
        Weekly developer updates. Unsubscribe anytime.{" "}
        <a
          href="/changelog/rss.xml"
          className="rounded-sm text-white/65 underline underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Prefer RSS?
        </a>
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

  const latestIssue = posts[0] ?? null;
  const pastIssues = useMemo(() => posts.slice(1), [posts]);

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
    <div className="overflow-hidden bg-black text-white selection:bg-primary selection:text-black">
      <section
        aria-labelledby="changelog-title"
        className="relative isolate border-b border-white/10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_76%_18%,rgba(153,69,255,0.3),transparent_31%),radial-gradient(circle_at_18%_74%,rgba(20,241,149,0.15),transparent_27%),linear-gradient(180deg,#09080c_0%,#000_82%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-12rem] top-20 -z-10 size-[32rem] rounded-full border border-white/10 shadow-[0_0_120px_rgba(153,69,255,0.16)] md:right-[-4rem] md:size-[42rem]"
        >
          <div className="absolute inset-[16%] rounded-full border border-white/10" />
          <div className="absolute inset-[34%] rounded-full border border-primary/25" />
        </div>

        <div className="mx-auto flex min-h-[680px] w-full max-w-[1440px] flex-col justify-between px-5 pb-8 pt-16 md:min-h-[780px] md:px-8 md:pb-10 md:pt-24 xl:min-h-[880px] xl:px-10 xl:pt-32">
          <div className="relative max-w-5xl">
            <div className="mb-8 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-primary md:text-sm">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-50 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
              </span>
              Solana Changelog
              <span className="text-white/35" aria-hidden>
                /
              </span>
              Weekly
            </div>
            <h1
              id="changelog-title"
              className="max-w-4xl text-[3.35rem] font-medium leading-[0.94] tracking-[-0.055em] sm:text-7xl md:text-8xl xl:text-[7rem]"
            >
              The week in Solana,{" "}
              <span className="font-light text-white/65">for builders.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[#c8c7d0] md:mt-9 md:text-2xl md:leading-[1.45]">
              A concise weekly read on validator clients, protocol changes, SDK
              releases, and the tools moving Solana development forward.
            </p>

            <div className="mt-9 flex flex-wrap gap-3 md:mt-12">
              {latestIssue && (
                <Link
                  href={latestIssue.url}
                  className="group relative inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-5 py-3 text-base font-medium text-black transition-colors duration-200 hover:bg-primary focus-visible:outline-none"
                >
                  Read the latest issue
                  <ArrowRight
                    aria-hidden
                    className="size-4"
                    strokeWidth={2.5}
                  />
                  <FocusRing />
                </Link>
              )}
              <a
                href="/changelog/rss.xml"
                className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-base font-medium text-white backdrop-blur-sm transition-colors duration-200 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Rss aria-hidden className="size-4" />
                Follow via RSS
              </a>
            </div>
            <div className="mt-5">
              <SubscribeForm id="hero" />
            </div>
          </div>

          <div
            aria-label="Changelog coverage"
            className="mt-20 grid border-t border-white/15 md:grid-cols-3"
          >
            {coverage.map(({ title, description, Icon }, index) => (
              <div
                key={title}
                className={`flex min-h-28 items-start gap-4 border-white/15 py-5 md:px-6 md:py-6 ${
                  index > 0 ? "border-t md:border-l md:border-t-0" : ""
                }`}
              >
                <Icon
                  aria-hidden
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  strokeWidth={1.75}
                />
                <div>
                  <p className="text-base font-medium">{title}</p>
                  <p className="mt-1 max-w-56 text-sm leading-relaxed text-white/55">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {latestIssue ? (
        <section
          aria-labelledby="latest-issue-title"
          className="mx-auto w-full max-w-[1440px] px-5 py-20 md:px-8 md:py-28 xl:px-10 xl:py-36"
        >
          <div className="mb-7 flex items-end justify-between gap-6 md:mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Latest issue
              </p>
              <h2
                id="latest-issue-title"
                className="mt-3 text-3xl font-medium tracking-[-0.035em] md:text-5xl"
              >
                Start with what just shipped.
              </h2>
            </div>
            <a
              href="/changelog/rss.xml"
              className="hidden min-h-11 items-center gap-2 text-sm text-white/65 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:inline-flex"
            >
              <Rss aria-hidden className="size-4" />
              RSS feed
            </a>
          </div>

          <article className="grid overflow-hidden rounded-2xl border border-white/15 bg-[#100e15] shadow-[0_32px_100px_rgba(0,0,0,0.45)] lg:grid-cols-[1.08fr_0.92fr]">
            {latestIssue.heroImage && (
              <Link
                href={latestIssue.url}
                aria-label={`Read ${latestIssue.title}`}
                className="group relative block aspect-[16/10] overflow-hidden bg-white/5 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary lg:aspect-auto lg:min-h-[520px]"
              >
                <Image
                  src={latestIssue.heroImage}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.015] group-hover:opacity-90 motion-reduce:transition-none"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#100e15]/25"
                />
              </Link>
            )}

            <div className="flex flex-col justify-between p-6 sm:p-8 md:p-10 xl:p-14">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                  <span className="text-primary">Solana Changelog</span>
                  <span aria-hidden>•</span>
                  {latestIssue.publishedAt ? (
                    <time dateTime={latestIssue.publishedAt}>
                      {latestIssue.published}
                    </time>
                  ) : (
                    <span>{latestIssue.published}</span>
                  )}
                </div>
                <h3 className="mt-6 text-3xl font-medium leading-[1.08] tracking-[-0.04em] md:text-5xl">
                  <Link
                    href={latestIssue.url}
                    className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {getIssueTitle(latestIssue.title)}
                  </Link>
                </h3>
                <div className="mt-6 line-clamp-4 text-base leading-relaxed text-white/65 [&_p]:m-0 md:text-lg">
                  <Description post={latestIssue} />
                </div>
              </div>

              <Link
                href={latestIssue.url}
                className="group mt-10 inline-flex min-h-12 w-fit items-center gap-3 rounded-full bg-primary px-5 py-3 font-medium text-black transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#100e15]"
              >
                Read this issue
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  strokeWidth={2.5}
                />
              </Link>
            </div>
          </article>
        </section>
      ) : (
        <section className="mx-auto max-w-3xl px-5 py-28 text-center">
          <h2 className="text-3xl font-medium">
            The first issue is on its way.
          </h2>
          <p className="mt-4 text-white/60">
            Check back for weekly Solana engineering updates.
          </p>
        </section>
      )}

      {pastIssues.length > 0 && (
        <section
          aria-labelledby="past-issues-title"
          className="border-t border-white/10 bg-[#08070a]"
        >
          <div className="mx-auto w-full max-w-[1440px] px-5 py-20 md:px-8 md:py-28 xl:px-10 xl:py-36">
            <div className="flex flex-col justify-between gap-6 border-b border-white/15 pb-8 md:flex-row md:items-end md:pb-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Archive
                </p>
                <h2
                  id="past-issues-title"
                  className="mt-3 text-4xl font-medium tracking-[-0.04em] md:text-6xl"
                >
                  Past issues
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-white/55 md:text-right md:text-base">
                Browse weekly release notes and protocol progress in reverse
                chronological order.
              </p>
            </div>

            <ol>
              {pastIssues.map((post) => (
                <li key={post.id} className="border-b border-white/15">
                  <Link
                    href={post.url}
                    className="group grid min-h-40 gap-5 py-7 transition-colors duration-200 hover:bg-white/[0.035] focus-visible:bg-white/[0.035] focus-visible:outline-none md:grid-cols-[10rem_minmax(0,1fr)_1.2fr_2.5rem] md:items-center md:gap-8 md:px-4 md:py-8"
                  >
                    <div className="text-sm font-medium uppercase tracking-[0.12em] text-primary">
                      {post.publishedAt ? (
                        <time dateTime={post.publishedAt}>
                          {post.published}
                        </time>
                      ) : (
                        post.published
                      )}
                    </div>
                    <h3 className="text-xl font-medium leading-snug tracking-[-0.025em] md:text-2xl">
                      {getIssueTitle(post.title)}
                    </h3>
                    <div className="line-clamp-2 text-sm leading-relaxed text-white/55 [&_p]:m-0 md:text-base">
                      <Description post={post} />
                    </div>
                    <span className="hidden size-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-black md:flex">
                      <ArrowUpRight aria-hidden className="size-4" />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>

            <div
              className="flex min-h-28 flex-col items-center justify-center gap-3 pt-10"
              aria-live="polite"
            >
              {pageInfo.hasNextPage && (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-full border border-white/20 px-6 py-3 font-medium transition-colors hover:border-white/45 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {isLoadingMore ? "Loading issues…" : "Load more issues"}
                </button>
              )}
              {!pageInfo.hasNextPage && (
                <p className="text-sm text-white/45">
                  You&apos;ve reached the beginning of the archive.
                </p>
              )}
              {loadError && (
                <p className="text-sm text-red-300">
                  {loadError} Please try again.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <section
        aria-labelledby="changelog-subscribe-title"
        className="relative isolate border-t border-white/10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_90%,rgba(20,241,149,0.16),transparent_30%),radial-gradient(circle_at_88%_20%,rgba(153,69,255,0.2),transparent_32%),#050507]"
        />
        <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[1fr_minmax(28rem,36rem)] lg:items-end xl:px-10 xl:py-36">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Stay current
            </p>
            <h2
              id="changelog-subscribe-title"
              className="mt-4 text-4xl font-medium leading-[1.02] tracking-[-0.045em] md:text-6xl xl:text-7xl"
            >
              Choose your signal.
              <span className="block font-light text-white/55">
                Inbox or RSS.
              </span>
            </h2>
          </div>
          <SubscribeForm id="footer" compact />
        </div>
      </section>
    </div>
  );
}
