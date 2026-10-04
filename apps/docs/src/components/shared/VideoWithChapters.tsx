"use client";

import { useState } from "react";

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
 * One long YouTube video with a scrollable chapter list beside it. The video
 * takes two thirds of the width; the chapter panel takes the remaining third
 * and always matches the video's height, scrolling when the list is longer.
 * Clicking a chapter restarts the player at that timestamp and autoplays.
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
  const [autoplay, setAutoplay] = useState(false);
  const start = chapters[active]?.start ?? 0;

  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* The video sets the row height; the panel is absolutely positioned
          inside its cell so it stretches to match and scrolls. */}
      <div className="relative order-2 min-h-64 overflow-hidden rounded-lg border border-fd-border lg:order-1 lg:col-span-1 lg:min-h-0">
        <ol className="absolute inset-0 overflow-y-auto">
          {chapters.map((chapter, i) => (
            <li key={chapter.start}>
              <button
                type="button"
                onClick={() => {
                  setActive(i);
                  setAutoplay(true);
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
      <div className="order-1 aspect-video overflow-hidden rounded-lg lg:order-2 lg:col-span-2">
        <iframe
          key={`${active}-${autoplay}`}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?start=${start}&autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}
