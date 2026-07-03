"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ErrorBoundary from "@/components/error-boundary";
import { CampaignHero } from "@/components/news/campaign-hero";
import { NewsMasthead } from "@/components/news/news-masthead";
import { PostCard } from "@/components/post/post-card";
import { Button } from "@/components/ui/button";
import LoadMoreStatus from "@/components/ui/load-more-status";
import type { NewsCampaign } from "@/lib/news-campaign";
import type { PageInfo, PostItem } from "@/lib/post-types";
import { ArrowUpRight } from "lucide-react";
import uniqBy from "lodash/uniqBy";

const DEFAULT_PAGE_INFO: PageInfo = {
  hasPreviousPage: false,
  hasNextPage: false,
  startCursor: null,
  endCursor: null,
};

interface PostsClientPageProps {
  campaign?: NewsCampaign | null;
  featuredPost: PostItem | null;
  latestPosts: PostItem[];
  initialPageInfo?: PageInfo;
}

function isPost(post: PostItem | null): post is PostItem {
  return Boolean(post);
}

function getPostsWithoutFeatured(
  latestPosts: PostItem[],
  featuredPost: PostItem | null,
): PostItem[] {
  return featuredPost
    ? latestPosts.filter((post) => post?.id !== featuredPost.id)
    : latestPosts;
}

export default function PostsClientPage({
  campaign,
  featuredPost,
  latestPosts,
  initialPageInfo,
}: PostsClientPageProps) {
  const [posts, setPosts] = useState<(PostItem | null)[]>(() =>
    getPostsWithoutFeatured(latestPosts, featuredPost),
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageInfo, setPageInfo] = useState(
    initialPageInfo ?? DEFAULT_PAGE_INFO,
  );
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);

  const handleLoadMore = useCallback(async () => {
    if (!pageInfo?.hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      const cursor = currentCursor || pageInfo.endCursor;
      const params = new URLSearchParams({ limit: "13" });
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
    setPosts(getPostsWithoutFeatured(latestPosts || [], featuredPost));

    const lastPost = latestPosts[latestPosts.length - 1];
    if (lastPost?.cursor) {
      setCurrentCursor(lastPost.cursor);
    }
  }, [latestPosts, featuredPost]);

  const visiblePosts = useMemo(() => posts.filter(isPost), [posts]);
  const topStories = visiblePosts.slice(0, 4);
  const latestStories = visiblePosts.slice(4);

  return (
    <ErrorBoundary>
      <div className="bg-default pb-16">
        <NewsMasthead />

        <div className="flex flex-col gap-12 pt-8">
          {campaign && <CampaignHero campaign={campaign} />}

          {featuredPost && (
            <section
              aria-labelledby="lead-story-title"
              className="max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-0"
            >
              <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
                <div className="flex flex-col gap-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Lead story
                  </span>
                  <h1
                    id="lead-story-title"
                    className="text-4xl font-bold leading-[1.05] md:text-6xl"
                  >
                    <Link
                      href={featuredPost.url}
                      className="no-underline hover:no-underline text-inherit"
                    >
                      {featuredPost.title}
                    </Link>
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <p className="font-medium">{featuredPost.published}</p>
                    {featuredPost.categories[0] && (
                      <span>{featuredPost.categories[0]}</span>
                    )}
                  </div>

                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="group inline-flex w-fit items-center gap-2"
                  >
                    <Link href={featuredPost.url}>
                      <span>Read story</span>
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </Button>
                </div>

                {featuredPost.heroImage && (
                  <div className="relative aspect-5/3 w-full overflow-hidden border border-border">
                    <Image
                      src={featuredPost.heroImage}
                      alt={featuredPost.title}
                      fill
                      priority
                      sizes="(min-width: 1024px) 420px, (min-width: 768px) 60vw, 90vw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          {topStories.length > 0 && (
            <section
              aria-labelledby="top-stories-title"
              className="max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-0"
            >
              <div className="mb-6 border-b border-border pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Top stories
                </span>
                <h2
                  id="top-stories-title"
                  className="mt-1 text-2xl font-semibold"
                >
                  What to know now
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {topStories.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          <section
            aria-labelledby="latest-updates-title"
            className="max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-0"
          >
            <div className="mb-6 border-b border-border pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Latest
              </span>
              <h2
                id="latest-updates-title"
                className="mt-1 text-2xl font-semibold"
              >
                Latest updates
              </h2>
            </div>

            {latestStories.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {latestStories.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="py-8 text-sm text-muted-foreground">
                More stories will appear here as they are published.
              </div>
            )}

            {posts.length > 0 && (
              <LoadMoreStatus
                isLoading={isLoadingMore}
                hasMore={pageInfo.hasNextPage}
                onLoadMore={handleLoadMore}
                loadingText="Loading more posts..."
                noMoreText="No more posts to load"
              />
            )}
          </section>
        </div>
      </div>
    </ErrorBoundary>
  );
}
