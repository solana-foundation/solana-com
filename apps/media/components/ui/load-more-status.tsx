"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface LoadMoreStatusProps {
  className?: string;
  isLoading?: boolean;
  hasMore?: boolean;
  loadingText?: React.ReactNode;
  noMoreText?: React.ReactNode;
  onLoadMore?: () => void;
  rootMargin?: string;
}

export default function LoadMoreStatus({
  className,
  isLoading,
  hasMore,
  loadingText,
  noMoreText,
  onLoadMore,
  rootMargin = "200px",
}: LoadMoreStatusProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  useEffect(() => {
    if (!onLoadMore) return;

    const sentinel = sentinelRef.current;

    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin,
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, isLoading, onLoadMore, rootMargin]);

  return (
    <div
      ref={sentinelRef}
      className={cn("w-full mx-auto max-w-6xl flex justify-center", className)}
    >
      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground py-4">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>{loadingText}</span>
        </div>
      )}
      {!hasMore && <p className="text-muted-foreground py-4">{noMoreText}</p>}
    </div>
  );
}
