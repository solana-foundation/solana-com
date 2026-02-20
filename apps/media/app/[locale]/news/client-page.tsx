"use client";
import React, { useCallback, useMemo, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ErrorBoundary from "@/components/error-boundary";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { SocialShare } from "@/components/ui/social-share";
import { PostItem, PageInfo } from "@/lib/post-types";
import { PostCard } from "@/components/post/post-card";
import LoadMoreStatus from "@/components/ui/load-more-status";
import uniqBy from "lodash/uniqBy";

const DEFAULT_PAGE_INFO: PageInfo = {
  hasPreviousPage: false,
  hasNextPage: false,
  startCursor: null,
  endCursor: null,
};

interface PostsClientPageProps {
  featuredPost: PostItem | null;
  latestPosts: PostItem[];
  initialPageInfo?: PageInfo;
}

export default function PostsClientPage(props: PostsClientPageProps) {
  const { featuredPost, latestPosts, initialPageInfo } = props;
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );

  const [posts, setPosts] = useState<(PostItem | null)[]>(latestPosts);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageInfo, setPageInfo] = useState(
    initialPageInfo ?? DEFAULT_PAGE_INFO
  );
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);

  // Load more posts via API
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
        // Append older posts to the end
        setPosts((prev) => uniqBy([...prev, ...newPosts], "id"));

        // Update the cursor to the last (oldest) edge
        const lastEdge = newPosts[newPosts.length - 1];
        if (lastEdge?.cursor) {
          setCurrentCursor(lastEdge.cursor);
        }
      }

      // Always update pageInfo to track pagination state
      setPageInfo(response.pageInfo ?? DEFAULT_PAGE_INFO);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [pageInfo.hasNextPage, pageInfo.endCursor, isLoadingMore, currentCursor]);

  // Extract regular posts from postsData
  useEffect(() => {
    // Remove featured post from latest posts if it exists
    setPosts(
      featuredPost
        ? latestPosts?.filter((post) => post?.id !== featuredPost?.id) || []
        : latestPosts || []
    );

    // Set the cursor from the last (oldest) post edge
    const lastPost = latestPosts[latestPosts.length - 1];
    if (lastPost?.cursor) {
      setCurrentCursor(lastPost.cursor);
    }
  }, [latestPosts, featuredPost]);

  // Get unique categories from all posts
  const allCategories = useMemo(() => {
    const categorySet = new Set<string>();
    posts.forEach((post) => {
      post?.categories?.forEach(
        (category: string) => category && categorySet.add(category)
      );
    });
    return Array.from(categorySet).sort();
  }, [posts]);

  // Filter posts based on selected category
  const filteredPosts = useMemo(() => {
    if (!selectedCategory) {
      return posts;
    }
    return posts.filter((post) => post?.categories?.includes(selectedCategory));
  }, [posts, selectedCategory]);

  // const handleCopyLink = useCallback(() => {
  //   if (
  //     !featuredPost ||
  //     typeof window === "undefined" ||
  //     !navigator.clipboard
  //   ) {
  //     return;
  //   }

  //   const articleUrl = `${window.location.origin}${featuredPost.url}`;
  //   navigator.clipboard.writeText(articleUrl).catch(() => {
  //     /* no-op */
  //   });
  // }, [featuredPost]);

  return (
    <ErrorBoundary>
      <Section>
        <div className="flex flex-col gap-16">
          {featuredPost && (
            <div className="relative w-full overflow-hidden bg-[#070b14] text-white shadow-[0_60px_120px_-60px_rgba(7,12,28,0.9)] p-6 md:p-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_0%_0%,rgba(82,158,255,0.25),transparent_55%),radial-gradient(90%_90%_at_100%_0%,rgba(25,237,152,0.15),transparent_60%),radial-gradient(80%_80%_at_50%_100%,rgba(153,69,255,0.15),transparent_75%)]" />
              <div className="relative z-10 flex flex-col gap-12 lg:flex-row lg:items-center max-w-6xl mx-auto">
                <div className="flex flex-1 flex-col gap-8">
                  <span className="text-xs font-base uppercase tracking-widest text-sky-300/80">
                    Solana News | Updates from the Solana ecosystem
                  </span>
                  <h3 className="text-4xl font-bold leading-[1.05] md:text-6xl">
                    <Link
                      href={featuredPost.url}
                      className="no-underline hover:no-underline text-inherit"
                    >
                      {featuredPost.title}
                    </Link>
                  </h3>

                  <div className="flex flex-col gap-6">
                    <SocialShare
                      url={`${typeof window !== "undefined" ? window.location.origin : ""}${featuredPost.url}`}
                      title={featuredPost.title}
                      variant="dark"
                    />

                    <p className="text-sm font-medium uppercase tracking-[0.35em] text-white/60">
                      {featuredPost.published}
                    </p>
                  </div>

                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="group inline-flex w-fit items-center rounded-full border border-white/40 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:border-white/70 hover:bg-white/10"
                  >
                    <Link href={featuredPost.url}>
                      <span>Read</span>
                      <span className="flex size-9 items-center justify-center">
                        <ArrowUpRight className="size-5" />
                      </span>
                    </Link>
                  </Button>
                </div>

                {featuredPost.heroImage && (
                  <div className="flex flex-1 lg:justify-end">
                    <div className="relative aspect-5/3 w-full lg:max-w-[520px]">
                      <div className="relative h-full w-full overflow-hidden">
                        <Image
                          src={featuredPost.heroImage}
                          alt={featuredPost.title}
                          fill
                          priority
                          sizes="(min-width: 1024px) 520px, (min-width: 768px) 60vw, 90vw"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="px-4 md:px-6 lg:px-0">
            {/* Category Filter Button Group */}
            {allCategories.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 max-w-6xl mx-auto w-full mb-6">
                <span className="text-sm font-medium text-muted-foreground">
                  Filter by category:
                </span>
                <Button
                  variant={selectedCategory === null ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="capitalize"
                >
                  All
                </Button>
                {allCategories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "secondary"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}

            {filteredPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
                {filteredPosts.map(
                  (post) => post && <PostCard key={post.id} post={post} />
                )}
              </div>
            )}

            {/* Show message when no posts match the filter */}
            {filteredPosts.length === 0 && selectedCategory && (
              <div className="text-center py-12 max-w-6xl mx-auto w-full">
                <p className="text-muted-foreground">
                  No posts found for &quot;{selectedCategory}&quot; category.
                </p>
              </div>
            )}

            {/* Only show LoadMoreStatus when there are posts and no category filter is active */}
            {posts.length > 0 && !selectedCategory && (
              <LoadMoreStatus
                isLoading={isLoadingMore}
                hasMore={pageInfo.hasNextPage}
                onLoadMore={handleLoadMore}
                loadingText="Loading more posts..."
                noMoreText="No more posts to load"
              />
            )}
          </div>
        </div>
      </Section>
    </ErrorBoundary>
  );
}
