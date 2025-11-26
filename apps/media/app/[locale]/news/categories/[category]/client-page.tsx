"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PageInfo } from "@/tina/__generated__/types";
import ErrorBoundary from "@/components/error-boundary";
import { Section } from "@/components/layout/section";
import { PostItem } from "@/lib/post-types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PostCard } from "@/components/post/post-card";
import LoadMoreStatus from "@/components/ui/load-more-status";
import uniqBy from "lodash/uniqBy";
import { fetchLatestPosts } from "@/lib/post-data";

interface CategoryPostsClientPageProps {
  category: string;
  latestPosts: PostItem[];
  initialPageInfo?: PageInfo;
}

export default function CategoryPostsClientPage(
  props: CategoryPostsClientPageProps
) {
  const { category, latestPosts } = props;
  const [posts, setPosts] = useState<(PostItem | null)[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageInfo, setPageInfo] = useState(props.initialPageInfo);
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);

  // Load more posts
  const handleLoadMore = useCallback(async () => {
    if (!pageInfo.hasPreviousPage || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      const response = await fetchLatestPosts({
        limit: 13,
        cursor: currentCursor || pageInfo.startCursor || undefined,
        category: category,
      });

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
      setPageInfo(response.pageInfo);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    pageInfo.hasPreviousPage,
    pageInfo.startCursor,
    isLoadingMore,
    currentCursor,
    category,
  ]);

  // Extract regular posts from postsData
  useEffect(() => {
    // Remove featured post from latest posts if it exists
    setPosts(latestPosts || []);

    // Set the cursor from the last (oldest) post edge
    const lastPost = latestPosts[latestPosts.length - 1];
    if (lastPost?.cursor) {
      setCurrentCursor(lastPost.cursor);
    }
  }, [latestPosts]);

  return (
    <ErrorBoundary>
      <Section>
        <div className="flex flex-col gap-16 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-8">
          {/* Back Navigation */}
          <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
            <Link href="/news">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to News</span>
            </Link>
          </Button>

          {/* Title */}
          <h1 className="text-4xl font-bold leading-[1.05] md:text-6xl">
            {category}
          </h1>

          {/* Posts */}
          <div className="flex flex-col gap-6">
            {posts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(
                  (post) => post && <PostCard key={post.id} post={post} />
                )}
              </div>
            )}

            {/* Load More */}
            <LoadMoreStatus
              isLoading={isLoadingMore}
              hasMore={pageInfo.hasPreviousPage}
              onLoadMore={handleLoadMore}
              loadingText="Loading more posts..."
              noMoreText="No more posts to load"
            />
          </div>
        </div>
      </Section>
    </ErrorBoundary>
  );
}
