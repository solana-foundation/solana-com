"use client";

import { useState, type ReactNode } from "react";
import { getYoutubeThumbnail, getYoutubeVideoId } from "./Youtube";
import { isPlaceholderHref } from "./video-schema";

export function MediaThumbnail({
  href,
  placeholderIcon,
}: {
  href?: string;
  placeholderIcon: ReactNode;
}) {
  const [quality, setQuality] = useState<"max" | "high" | "failed">("max");

  if (href && !isPlaceholderHref(href) && quality !== "failed") {
    try {
      const id = getYoutubeVideoId(href);
      return (
        <img
          src={getYoutubeThumbnail(id, quality)}
          alt=""
          className="aspect-video w-full rounded-md object-cover"
          onError={() => {
            // maxresdefault isn't generated for every video — drop to the
            // always-present hqdefault before giving up on a thumbnail.
            setQuality((current) => (current === "max" ? "high" : "failed"));
          }}
        />
      );
    } catch {
      // Not a recognizable YouTube URL yet — fall through to the placeholder.
    }
  }

  return (
    <div className="flex aspect-video w-full items-center justify-center rounded-md border border-dashed border-fd-border bg-fd-secondary/40 text-fd-muted-foreground">
      {placeholderIcon}
    </div>
  );
}
