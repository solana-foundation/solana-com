"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ErrorBoundary from "@/components/error-boundary";
import { CampaignHero } from "@/components/news/campaign-hero";
import { NewsMasthead } from "@/components/news/news-masthead";
import { PostCard } from "@/components/post/post-card";
import LoadMoreStatus from "@/components/ui/load-more-status";
import type { NewsCampaign } from "@/lib/news-campaign";
import type { NewsNavItem } from "@/lib/news-nav";
import type { PageInfo, PostItem } from "@/lib/post-types";
import uniqBy from "lodash/uniqBy";

interface CategoryPostsClientPageProps {
  category: string;
  categorySlug: string;
  campaign?: NewsCampaign | null;
  latestPosts: PostItem[];
  initialPageInfo?: PageInfo;
  navItems: NewsNavItem[];
}

export default function CategoryPostsClientPage({
  category,
  categorySlug,
  campaign,
  latestPosts,
  initialPageInfo,
  navItems,
}: CategoryPostsClientPageProps) {
  const [posts, setPosts] = useState<(PostItem | null)[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageInfo, setPageInfo] = useState<PageInfo>(
    initialPageInfo ?? {
      hasPreviousPage: false,
      hasNextPage: false,
      startCursor: null,
      endCursor: null,
    },
  );
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const tFront = useTranslations("news.front");
  const tVertical = useTranslations("news.vertical");

  const handleLoadMore = useCallback(async () => {
    if (!pageInfo.hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      const cursor = currentCursor || pageInfo.endCursor;
      const params = new URLSearchParams({ limit: "13" });
      if (cursor) params.set("cursor", cursor);
      params.set("category", category);

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

      if (response.pageInfo) {
        setPageInfo({
          hasPreviousPage: response.pageInfo.hasPreviousPage,
          hasNextPage: response.pageInfo.hasNextPage,
          startCursor: response.pageInfo.startCursor ?? null,
          endCursor: response.pageInfo.endCursor ?? null,
        });
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    pageInfo.hasNextPage,
    pageInfo.endCursor,
    isLoadingMore,
    currentCursor,
    category,
  ]);

  useEffect(() => {
    setPosts(latestPosts || []);

    const lastPost =
      latestPosts?.length > 0 ? latestPosts[latestPosts.length - 1] : null;
    if (lastPost?.cursor) {
      setCurrentCursor(lastPost.cursor);
    }
  }, [latestPosts]);

  return (
    <ErrorBoundary>
      <div className="bg-default pb-16">
        <NewsMasthead
          activeSlug={categorySlug}
          navItems={navItems}
          tagline={tVertical("tagline", { category })}
        />

        <div className="flex flex-col gap-10 pt-8">
          {campaign && <CampaignHero campaign={campaign} />}

          <section className="max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-0">
            <div className="mb-8 border-b border-border pb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {tVertical("eyebrow")}
              </span>
              <h1 className="mt-2 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
                {category}
              </h1>
              <p className="mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
                {tVertical("description", { category })}
              </p>
            </div>

            {posts.length > 0 && (
              <div className="flex flex-col divide-y divide-border">
                {posts.map(
                  (post) =>
                    post && (
                      <div key={post.id} className="py-8 first:pt-0">
                        <PostCard post={post} variant="horizontal" />
                      </div>
                    ),
                )}
              </div>
            )}

            <LoadMoreStatus
              isLoading={isLoadingMore}
              hasMore={pageInfo.hasNextPage}
              onLoadMore={handleLoadMore}
              loadingText={tFront("loadMore.loading")}
              noMoreText={tFront("loadMore.complete")}
            />
          </section>
        </div>
      </div>
    </ErrorBoundary>
  );
}
