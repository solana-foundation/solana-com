"use client";
import React, { useCallback, useMemo, useEffect, useState } from "react";
import { PageInfo } from "@/tina/__generated__/types";
import ErrorBoundary from "@/components/error-boundary";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { LinkItem } from "@/lib/link-types";
import { LinkCard } from "@/components/link/link-card";
import LoadMoreStatus from "@/components/ui/load-more-status";
import { fetchLatestLinks } from "@/lib/link-data";
import uniqBy from "lodash/uniqBy";

interface LinksClientPageProps {
  latestLinks: LinkItem[];
  featuredLinks: LinkItem[];
  initialPageInfo?: PageInfo;
}

export default function LinksClientPage(props: LinksClientPageProps) {
  const { latestLinks, featuredLinks, initialPageInfo } = props;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const [links, setLinks] = useState<LinkItem[]>(latestLinks);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageInfo, setPageInfo] = useState(
    initialPageInfo ?? {
      hasPreviousPage: false,
      hasNextPage: false,
      startCursor: null,
      endCursor: null,
    }
  );
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);

  // Load more links
  const handleLoadMore = useCallback(async () => {
    if (!pageInfo.hasPreviousPage || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      const response = await fetchLatestLinks({
        limit: 12,
        cursor: currentCursor || pageInfo.startCursor || undefined,
      });

      const newLinks = response.links;

      if (newLinks.length > 0) {
        setLinks((prev) => uniqBy([...prev, ...newLinks], "id"));

        const lastLink = newLinks[newLinks.length - 1];
        if (lastLink?.cursor) {
          setCurrentCursor(lastLink.cursor);
        }
      }

      setPageInfo(response.pageInfo);
    } catch (error) {
      console.error("Failed to load more links:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    pageInfo.hasPreviousPage,
    pageInfo.startCursor,
    isLoadingMore,
    currentCursor,
  ]);

  // Set initial cursor
  useEffect(() => {
    const lastLink = latestLinks[latestLinks.length - 1];
    if (lastLink?.cursor) {
      setCurrentCursor(lastLink.cursor);
    }
  }, [latestLinks]);

  // Get unique categories and types from all links
  const { allCategories, allTypes } = useMemo(() => {
    const categorySet = new Set<string>();
    const typeSet = new Set<string>();

    links.forEach((link) => {
      link.categories?.forEach(
        (category) => category && categorySet.add(category)
      );
      if (link.linkType) typeSet.add(link.linkType);
    });

    return {
      allCategories: Array.from(categorySet).sort(),
      allTypes: Array.from(typeSet).sort(),
    };
  }, [links]);

  // Filter links based on selected category and type
  const filteredLinks = useMemo(() => {
    let result = links;

    if (selectedCategory) {
      result = result.filter((link) =>
        link.categories?.includes(selectedCategory)
      );
    }

    if (selectedType) {
      result = result.filter((link) => link.linkType === selectedType);
    }

    return result;
  }, [links, selectedCategory, selectedType]);

  const typeLabels: Record<string, string> = {
    article: "Articles",
    tweet: "Tweets",
    video: "Videos",
    github: "GitHub",
    other: "Other",
  };

  return (
    <ErrorBoundary>
      <Section>
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Links</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Curated links to articles, tweets, videos, and more from across
              the Solana ecosystem.
            </p>
          </div>

          {/* Featured Links */}
          {featuredLinks.length > 0 && (
            <div className="max-w-6xl mx-auto w-full px-4 md:px-6 lg:px-0">
              <h2 className="text-2xl font-semibold mb-6">Featured</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredLinks.map((link) => (
                  <LinkCard key={link.id} link={link} />
                ))}
              </div>
            </div>
          )}

          {/* Filters and Links List */}
          <div className="px-4 md:px-6 lg:px-0">
            {/* Filters */}
            <div className="flex flex-col gap-4 max-w-6xl mx-auto w-full mb-8">
              {/* Type Filter */}
              {allTypes.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Type:
                  </span>
                  <Button
                    variant={selectedType === null ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setSelectedType(null)}
                  >
                    All
                  </Button>
                  {allTypes.map((type) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setSelectedType(type)}
                    >
                      {typeLabels[type] || type}
                    </Button>
                  ))}
                </div>
              )}

              {/* Category Filter */}
              {allCategories.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Category:
                  </span>
                  <Button
                    variant={
                      selectedCategory === null ? "default" : "secondary"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
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
            </div>

            {/* Links Grid */}
            {filteredLinks.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
                {filteredLinks.map((link) => (
                  <LinkCard key={link.id} link={link} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredLinks.length === 0 &&
              (selectedCategory || selectedType) && (
                <div className="text-center py-12 max-w-6xl mx-auto w-full">
                  <p className="text-muted-foreground">
                    No links found matching your filters.
                  </p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedType(null);
                    }}
                    className="mt-2"
                  >
                    Clear filters
                  </Button>
                </div>
              )}

            {/* No links at all */}
            {links.length === 0 && (
              <div className="text-center py-12 max-w-6xl mx-auto w-full">
                <p className="text-muted-foreground">
                  No links available yet. Check back soon!
                </p>
              </div>
            )}

            <LoadMoreStatus
              isLoading={isLoadingMore}
              hasMore={pageInfo.hasPreviousPage}
              onLoadMore={handleLoadMore}
              loadingText="Loading more links..."
              noMoreText="No more links to load"
            />
          </div>
        </div>
      </Section>
    </ErrorBoundary>
  );
}
