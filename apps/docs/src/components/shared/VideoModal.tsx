"use client";

import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/app/components/ui/dialog";

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
]);
const VIDEO_ID = /^[\w-]{11}$/;

/**
 * Strictly parses a single-video YouTube URL into its id and start time.
 * Returns null for other hosts, playlists, channels, or anything else
 * without a valid 11-character video id, so callers can fall back to a
 * plain link instead of opening a broken player.
 */
function parseYoutubeVideo(href: string) {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (!YOUTUBE_HOSTS.has(url.hostname)) return null;

  const parts = url.pathname.split("/").filter(Boolean);
  const id =
    url.hostname === "youtu.be"
      ? parts[0]
      : parts[0] === "watch"
        ? url.searchParams.get("v")
        : parts[0] === "embed" || parts[0] === "shorts"
          ? parts[1]
          : null;
  if (!id || !VIDEO_ID.test(id)) return null;

  // Timestamped links (?t=498 or ?start=498) open at that second.
  const t = url.searchParams.get("t") ?? url.searchParams.get("start");
  const start = t && /^\d+$/.test(t) ? Number(t) : 0;
  return { id, start };
}

/**
 * Renders `children` as a button that opens the YouTube video at `href` in a
 * modal and autoplays it. The iframe only mounts while the modal is open, so
 * closing it also stops playback. Falls back to a plain link if `href` isn't
 * a recognizable YouTube URL.
 */
export function VideoModalTrigger({
  href,
  title,
  className,
  children,
}: {
  href: string;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const video = parseYoutubeVideo(href);
  if (!video) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }
  const { id, start } = video;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={`${className ?? ""} w-full cursor-pointer border-none bg-transparent p-0 text-left`}
      >
        {children}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="w-full max-w-5xl overflow-hidden border-0 bg-black p-0 shadow-xl md:rounded-2xl"
          showClose={false}
        >
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">
            Playing video: {title}. Press escape to close.
          </DialogDescription>
          <div className="relative aspect-video w-full">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1${start ? `&start=${start}` : ""}`}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
