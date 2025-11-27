"use client";
import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
} from "react";
import { Link } from "@workspace/i18n/routing";
import Image from "next/image";
import { format } from "date-fns";
import { TinaMarkdown, TinaMarkdownContent } from "tinacms/dist/rich-text";
import {
  PageInfo,
  PostConnectionEdges,
  PostConnectionQuery,
} from "@/tina/__generated__/types";
import ErrorBoundary from "@/components/error-boundary";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { SocialShare } from "@/components/ui/social-share";
import client from "@/tina/__generated__/client";

interface ClientPostProps {
  featuredPostData: PostConnectionQuery;
  postsData: PostConnectionQuery;
  initialPageInfo: PageInfo;
}

type PostItem = {
  id: string;
  published: string;
  title: string;
  tags: string[];
  categories: string[];
  url: string;
  description: TinaMarkdownContent;
  heroImage: string | null | undefined;
  author: {
    name: string;
    avatar: string | null | undefined;
  };
};

export default function PostsClientPage(props: ClientPostProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );

  const [featuredPost, setFeaturedPost] = useState<PostItem | null>(null);
  const [posts, setPosts] = useState<(PostItem | null)[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageInfo, setPageInfo] = useState(props.initialPageInfo);
  const [loadedPostIds, setLoadedPostIds] = useState<Set<string>>(new Set());
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = useCallback(async () => {
    if (!pageInfo.hasPreviousPage || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const morePostsResponse = await client.queries.postConnection({
        last: 13,
        sort: "date",
        before: currentCursor || pageInfo.startCursor,
      });

      const newPostEdges = morePostsResponse.data.postConnection.edges || [];
      const newPosts = newPostEdges.map((edge) =>
        transformPost(edge as PostConnectionEdges)
      );

      // Filter out duplicates and featured post
      const uniqueNewPosts = newPosts.filter(
        (post) => post?.id && !loadedPostIds.has(post.id)
      );

      console.log(
        `Loaded ${newPosts.length} posts, ${uniqueNewPosts.length} are unique`
      );

      if (uniqueNewPosts.length > 0) {
        // Append older posts to the end
        setPosts((prev) => [...prev, ...uniqueNewPosts]);

        // Update the cursor to the last (oldest) edge
        const lastEdge = newPostEdges[newPostEdges.length - 1];
        if (lastEdge?.cursor) {
          setCurrentCursor(lastEdge.cursor);
        }

        // Update loaded IDs
        setLoadedPostIds((prev) => {
          const updated = new Set(prev);
          uniqueNewPosts.forEach((post) => {
            if (post?.id) updated.add(post.id);
          });
          return updated;
        });
      }

      // Always update pageInfo to track pagination state
      setPageInfo(morePostsResponse.data.postConnection.pageInfo);
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
    loadedPostIds,
  ]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Trigger load more when sentinel is visible and conditions are met
        if (
          entry.isIntersecting &&
          pageInfo.hasPreviousPage &&
          !isLoadingMore
        ) {
          handleLoadMore();
        }
      },
      {
        root: null, // viewport
        rootMargin: "200px", // Start loading 200px before reaching the sentinel
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [pageInfo.hasPreviousPage, isLoadingMore, handleLoadMore]); // Add handleLoadMore here

  // Extract featured post from featuredPostData
  useEffect(() => {
    if (!props.featuredPostData) return;
    const featuredPostEdge = props.featuredPostData?.postConnection.edges?.[0];
    const transformedFeaturedPost =
      featuredPostEdge &&
      transformPost(featuredPostEdge as PostConnectionEdges);
    setFeaturedPost(transformedFeaturedPost || null);
  }, [props.featuredPostData]);

  // Extract regular posts from postsData
  useEffect(() => {
    const postEdges = props.postsData?.postConnection.edges ?? [];

    // Transform all posts first
    const transformedPosts =
      postEdges &&
      postEdges
        .map((postData) => transformPost(postData as PostConnectionEdges))
        .filter((post) => post?.id !== featuredPost?.id);

    // Deduplicate posts by ID using a Map
    const uniquePostsMap = new Map<string, PostItem>();
    transformedPosts.forEach((post) => {
      if (post?.id) {
        uniquePostsMap.set(post.id, post);
      }
    });

    const uniquePosts = Array.from(uniquePostsMap.values());

    setPosts(uniquePosts || []);

    // Set the cursor from the last (oldest) post edge
    const lastEdge = postEdges[postEdges.length - 1];
    if (lastEdge?.cursor) {
      setCurrentCursor(lastEdge.cursor);
    }

    // Track initial post IDs (now deduplicated)
    const initialIds = new Set(
      uniquePosts.map((post) => post?.id).filter(Boolean) as string[]
    );
    if (featuredPost?.id) {
      initialIds.add(featuredPost.id);
    }
    setLoadedPostIds(initialIds);
  }, [props.postsData, featuredPost]);

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

  const handleCopyLink = useCallback(() => {
    if (
      !featuredPost ||
      typeof window === "undefined" ||
      !navigator.clipboard
    ) {
      return;
    }

    const articleUrl = `${window.location.origin}${featuredPost.url}`;
    navigator.clipboard.writeText(articleUrl).catch(() => {
      /* no-op */
    });
  }, [featuredPost]);

  return (
    <ErrorBoundary>
      <Section>
        <div className="flex flex-col gap-16">
          {featuredPost && (
            <div className="relative w-full overflow-hidden bg-[#070b14] text-white shadow-[0_60px_120px_-60px_rgba(7,12,28,0.9)] p-6 md:p-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_0%_0%,rgba(82,158,255,0.25),transparent_55%),radial-gradient(90%_90%_at_100%_0%,rgba(25,237,152,0.15),transparent_60%),radial-gradient(80%_80%_at_50%_100%,rgba(153,69,255,0.15),transparent_75%)]" />
              <div className="relative z-10 flex flex-col gap-12 lg:flex-row lg:items-center max-w-6xl mx-auto">
                <div className="flex flex-1 flex-col gap-8">
                  <span className="text-xs font-base uppercase tracking-[0.1em] text-sky-300/80">
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
                    <div className="relative aspect-[5/3] w-full lg:max-w-[520px]">
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
              <div className="flex flex-wrap items-center gap-3 max-w-6xl mx-auto w-full">
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
                  (post) =>
                    post && (
                      <Link
                        key={post.id}
                        href={post.url}
                        className="flex flex-col gap-4 group hover:opacity-80 transition-all cursor-pointer pb-6 border-b border-border"
                      >
                        {post?.heroImage && (
                          <div className="relative aspect-video w-full overflow-hidden">
                            <Image
                              src={post?.heroImage}
                              alt={post?.title}
                              fill
                              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {post.published}
                          </span>
                          {post.tags?.map(
                            (tag: string) =>
                              tag && (
                                <Badge
                                  key={`${post.id}-${tag}`}
                                  variant="outline"
                                >
                                  {tag}
                                </Badge>
                              )
                          )}
                        </div>
                        <h3 className="text-xl font-semibold group-hover:underline">
                          {post.title}
                        </h3>
                        <div className="text-muted-foreground flex-grow">
                          <TinaMarkdown content={post.description} />
                        </div>
                        <span className="inline-flex items-center gap-2 text-sm font-medium group-hover:underline w-fit">
                          Read article
                          <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                      </Link>
                    )
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

            <div
              ref={sentinelRef}
              className="w-full mt-6 mx-auto max-w-6xl flex justify-center"
            >
              {isLoadingMore && (
                <div className="flex items-center gap-2 text-muted-foreground py-4">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Loading more posts...</span>
                </div>
              )}
              {!pageInfo.hasPreviousPage && (
                <p className="text-muted-foreground py-4">
                  No more posts to load
                </p>
              )}
            </div>
          </div>
        </div>
      </Section>
    </ErrorBoundary>
  );
}

// Helper function to transform post data
function transformPost(postData: PostConnectionEdges): PostItem | null {
  const post = postData?.node;
  if (!post) return null;

  const date = post.date ? new Date(post.date) : null;
  const formattedDate =
    date && !Number.isNaN(date.getTime()) ? format(date, "dd MMM yyyy") : "";

  return {
    id: post.id,
    published: formattedDate,
    title: post.title,
    tags: post.tags?.map((tag) => tag?.tag?.name),
    categories:
      post.categories?.map((category) => category?.category?.name) || [],
    url: `/news/${post._sys.breadcrumbs.join("/")}`,
    description: post.description,
    heroImage:
      post.heroImage || "/media-assets/uploads/posts/default-blog.webp",
    author: {
      name: post.author?.name || "Solana Foundation",
      avatar: post.author?.avatar,
    },
  } as PostItem;
}
