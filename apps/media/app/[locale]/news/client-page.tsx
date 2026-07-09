"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Link } from "@workspace/i18n/routing";
import { useTranslations } from "next-intl";
import ErrorBoundary from "@/components/error-boundary";
import { CampaignRailItem } from "@/components/news/campaign-rail-item";
import { NewsMasthead } from "@/components/news/news-masthead";
import { SectionHeader } from "@/components/news/section-header";
import {
  DescriptionContent,
  type DescriptionContentProps,
} from "@/components/post/post-card";
import { PostCard } from "@/components/post/post-card";
import LoadMoreStatus from "@/components/ui/load-more-status";
import type { NewsCampaign } from "@/lib/news-campaign";
import type { NewsNavItem } from "@/lib/news-nav";
import type { PageInfo, PostItem } from "@/lib/post-types";
import uniqBy from "lodash/uniqBy";

const DEFAULT_PAGE_INFO: PageInfo = {
  hasPreviousPage: false,
  hasNextPage: false,
  startCursor: null,
  endCursor: null,
};

interface PostsClientPageProps {
  campaign?: NewsCampaign | null;
  featuredPosts: PostItem[];
  latestPosts: PostItem[];
  initialPageInfo?: PageInfo;
  navItems: NewsNavItem[];
}

function isPost(post: PostItem | null): post is PostItem {
  return Boolean(post);
}

export default function PostsClientPage({
  campaign,
  featuredPosts,
  latestPosts,
  initialPageInfo,
  navItems,
}: PostsClientPageProps) {
  const [posts, setPosts] = useState<(PostItem | null)[]>(() => latestPosts);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageInfo, setPageInfo] = useState(
    initialPageInfo ?? DEFAULT_PAGE_INFO,
  );
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const t = useTranslations("news.front");

  const handleLoadMore = useCallback(async () => {
    if (!pageInfo?.hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      const cursor = currentCursor || pageInfo.endCursor;
      const params = new URLSearchParams({
        limit: "13",
        excludeTag: "featured",
      });
      if (cursor) params.set("cursor", cursor);

      const res = await fetch(`/api/posts/latest?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch posts");

      const response = await res.json();
      const newPosts = response.posts;

      if (newPosts.length > 0) {
        setPosts((prev) => uniqBy([...prev, ...newPosts], "id"));

        const lastEdge = newPosts[newPosts.length - 1];
        if (lastEdge?.cursor) {
          setCurrentCursor(lastEdge.cursor);
        }
      }

      setPageInfo(response.pageInfo ?? DEFAULT_PAGE_INFO);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [pageInfo.hasNextPage, pageInfo.endCursor, isLoadingMore, currentCursor]);

  useEffect(() => {
    setPosts(latestPosts || []);

    const lastPost = latestPosts[latestPosts.length - 1];
    if (lastPost?.cursor) {
      setCurrentCursor(lastPost.cursor);
    } else {
      setCurrentCursor(null);
    }
  }, [latestPosts]);

  const visiblePosts = useMemo(() => posts.filter(isPost), [posts]);
  const lead = featuredPosts[0] ?? null;
  const railStories = featuredPosts.slice(1, 5);
  const latestStories = visiblePosts;
  const leadCategory = lead?.categories?.find(Boolean);

  return (
    <ErrorBoundary>
      <div className="bg-default pb-16">
        <NewsMasthead navItems={navItems} />

        <div className="flex flex-col gap-12 pt-8">
          {lead && (
            <section
              aria-labelledby="lead-story-title"
              className="max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-0"
            >
              <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10">
                {/* Lead story */}
                <div className="flex flex-col gap-5">
                  {lead.heroImage && (
                    <Link
                      href={lead.url}
                      className="group relative block aspect-video w-full overflow-hidden"
                    >
                      <Image
                        src={lead.heroImage}
                        alt={lead.title}
                        fill
                        priority
                        sizes="(min-width: 1024px) 62vw, 100vw"
                        className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                      />
                    </Link>
                  )}
                  <div className="flex flex-col gap-3">
                    {leadCategory && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {leadCategory}
                      </span>
                    )}
                    <h1
                      id="lead-story-title"
                      className="text-3xl font-bold leading-[1.08] tracking-tight md:text-5xl"
                    >
                      <Link
                        href={lead.url}
                        className="text-inherit no-underline hover:underline"
                      >
                        {lead.title}
                      </Link>
                    </h1>
                    <div className="line-clamp-3 text-base text-muted-foreground md:text-lg">
                      <DescriptionContent
                        description={
                          lead.description as DescriptionContentProps["description"]
                        }
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {lead.published}
                    </span>
                  </div>
                </div>

                {/* More top stories rail */}
                {(railStories.length > 0 || campaign) && (
                  <div className="flex flex-col lg:border-l lg:border-border lg:pl-10">
                    <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("railTitle")}
                    </h2>
                    <ul className="flex flex-col divide-y divide-border">
                      {railStories.map((post) => {
                        const category = post.categories?.find(Boolean);
                        return (
                          <li key={post.id}>
                            <Link
                              href={post.url}
                              className="group flex flex-col gap-1.5 py-4"
                            >
                              {category && (
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                                  {category}
                                </span>
                              )}
                              <h3 className="text-base font-semibold leading-snug tracking-tight group-hover:underline md:text-lg">
                                {post.title}
                              </h3>
                              <span className="text-xs text-muted-foreground">
                                {post.published}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                      {campaign && <CampaignRailItem campaign={campaign} />}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          <section
            aria-labelledby="latest-updates-title"
            className="max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-0"
          >
            <SectionHeader id="latest-updates-title" title={t("latestTitle")} />

            {latestStories.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                {latestStories.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="py-8 text-sm text-muted-foreground">
                {t("emptyLatest")}
              </div>
            )}

            {posts.length > 0 && (
              <LoadMoreStatus
                isLoading={isLoadingMore}
                hasMore={pageInfo.hasNextPage}
                onLoadMore={handleLoadMore}
                loadingText={t("loadMore.loading")}
                noMoreText={t("loadMore.complete")}
              />
            )}
          </section>
        </div>
      </div>
    </ErrorBoundary>
  );
}
