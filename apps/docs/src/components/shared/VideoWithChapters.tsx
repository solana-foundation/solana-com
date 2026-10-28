"use client";

import { useState } from "react";
import { Play } from "@boxicons/react/Play";
import { PlayCircle } from "@boxicons/react/PlayCircle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { MediaThumbnail } from "./MediaThumbnail";

export type TimedChapter = {
  title: string;
  /** Start time in seconds. */
  start: number;
};

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${h}:${pad(m)}:${pad(s)}`;
}

/**
 * One long YouTube video with a scrollable chapter list beside it. The
 * thumbnail takes 70% of the width; the chapter panel takes the
 * remaining 30% and always matches its height, scrolling when the list is
 * longer. Pressing play, or clicking a chapter, opens the video in an
 * autoplaying modal at that timestamp. The iframe only mounts while the modal
 * is open, so closing it stops playback.
 */
export function VideoWithChapters({
  videoId,
  title,
  chapters,
}: {
  videoId: string;
  title: string;
  chapters: TimedChapter[];
}) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const start = chapters[active]?.start ?? 0;

  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-4 lg:grid-cols-[3fr_7fr]">
      {/* The video sets the row height; the panel is absolutely positioned
          inside its cell so it stretches to match and scrolls. */}
      <div className="relative order-2 min-h-64 overflow-hidden rounded-lg border border-fd-border lg:order-1 lg:min-h-0">
        <ol className="absolute inset-0 overflow-y-auto">
          {chapters.map((chapter, i) => (
            <li key={chapter.start}>
              <button
                type="button"
                onClick={() => {
                  setActive(i);
                  setOpen(true);
                }}
                aria-current={i === active ? "true" : undefined}
                className={`flex w-full cursor-pointer items-baseline gap-3 border-none px-4 py-2.5 text-left text-sm transition-colors hover:bg-fd-accent/50 ${
                  i === active ? "bg-fd-accent" : "bg-transparent"
                }`}
              >
                <span className="w-16 shrink-0 font-mono text-xs tabular-nums text-fd-muted-foreground">
                  {formatTime(chapter.start)}
                </span>
                <span className="font-medium leading-snug">
                  {chapter.title}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="relative order-1 aspect-video overflow-hidden rounded-lg lg:order-2">
        <MediaThumbnail
          href={`https://youtu.be/${videoId}`}
          placeholderIcon={<PlayCircle className="size-6" />}
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Play ${title}`}
          aria-haspopup="dialog"
          className="absolute inset-0 flex cursor-pointer items-center justify-center border-none bg-transparent p-0"
        >
          <span className="flex h-12 w-[68px] items-center justify-center rounded-xl bg-red-600 text-white transition-colors hover:bg-red-500">
            <Play className="size-7" aria-hidden />
          </span>
        </button>
      </div>
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
              key={active}
              src={`https://www.youtube-nocookie.com/embed/${videoId}?start=${start}&autoplay=1&rel=0&modestbranding=1`}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
