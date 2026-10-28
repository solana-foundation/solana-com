import { Fragment } from "react";
import { PlayCircle } from "@boxicons/react/PlayCircle";
import { MediaThumbnail } from "./MediaThumbnail";
import { VideoModalTrigger } from "./VideoModal";
import { getPlaylistVideoItems } from "./playlist-to-chapters";
import {
  isPlaceholderHref,
  videoItemListSchema,
  type VideoItem,
} from "./video-schema";

export type VideoChapter = VideoItem;

function formatTimestamp(href?: string) {
  const seconds = Number(href?.match(/[?&](?:t|start)=(\d+)/)?.[1] ?? 0);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${h}:${pad(m)}:${pad(s)}`;
}

/**
 * Use this for content that has a meaningful watch order — a course or
 * roadmap series where each item builds on the last. For a set of
 * independent, unordered items, use ProjectCardGrid instead.
 *
 * Pass either a static `chapters` array (for a hand-curated, annotated
 * list — e.g. with per-chapter `subtext`) or a `playlistId` to render a
 * real YouTube playlist's contents directly, so the playlist itself stays
 * the source of truth instead of a hand-transcribed copy. If both are
 * omitted or the playlist fetch fails, nothing renders.
 */
export async function VideoChapterList({
  chapters,
  playlistId,
  playlistLimit,
  label,
  modal = false,
  timestamps = false,
}: {
  chapters?: VideoChapter[];
  playlistId?: string;
  playlistLimit?: number;
  label?: string;
  /** Open videos in an autoplaying modal instead of a new tab. */
  modal?: boolean;
  /**
   * For chapters that are timestamps within one video (hrefs like
   * `...?t=498`): show the start time instead of a repeated thumbnail.
   */
  timestamps?: boolean;
}) {
  const items = playlistId
    ? await getPlaylistVideoItems(playlistId, playlistLimit)
    : videoItemListSchema.parse(chapters ?? []);

  return (
    <div className="not-prose flex flex-col gap-6">
      {items.map((chapter, i) => {
        const row = (() => {
          const placeholder = isPlaceholderHref(chapter.href);
          const rowClassName = `group -mx-2 flex items-center gap-4 rounded-lg p-2${
            placeholder ? "" : " hover:bg-fd-accent/50"
          }`;

          const content = (
            <>
              {timestamps ? (
                <span className="w-20 shrink-0 font-mono text-sm tabular-nums text-fd-muted-foreground">
                  {formatTimestamp(chapter.href)}
                </span>
              ) : (
                <div className="w-28 shrink-0 sm:w-36">
                  <MediaThumbnail
                    href={chapter.href}
                    placeholderIcon={<PlayCircle className="size-6" />}
                  />
                </div>
              )}
              <div className="flex flex-col gap-1">
                {label || chapter.duration ? (
                  <span className="text-xs font-medium tracking-wide text-fd-muted-foreground uppercase">
                    {label ? `${label} ${i + 1}` : null}
                    {label && chapter.duration ? " · " : null}
                    {chapter.duration}
                  </span>
                ) : null}
                <span
                  className={`font-semibold leading-snug${placeholder ? "" : " group-hover:underline"}`}
                >
                  {chapter.title}
                </span>
                {chapter.subtext ? (
                  <span className="text-sm text-fd-muted-foreground">
                    {chapter.subtext}
                  </span>
                ) : null}
              </div>
            </>
          );

          if (placeholder) {
            return (
              <div
                key={`placeholder-${i}`}
                className={rowClassName}
                aria-disabled="true"
              >
                {content}
              </div>
            );
          }

          if (modal) {
            return (
              <VideoModalTrigger
                key={chapter.href}
                href={chapter.href!}
                title={chapter.title}
                className={rowClassName}
              >
                {content}
              </VideoModalTrigger>
            );
          }

          return (
            <a
              key={chapter.href}
              href={chapter.href}
              target="_blank"
              rel="noreferrer"
              className={rowClassName}
            >
              {content}
            </a>
          );
        })();

        return (
          <Fragment key={chapter.href ?? `chapter-${i}`}>
            {chapter.section ? (
              <div className="-mb-2 border-t border-fd-border pt-4 text-xs font-semibold tracking-wide text-fd-muted-foreground uppercase first:border-t-0 first:pt-0">
                {chapter.section}
              </div>
            ) : null}
            {row}
          </Fragment>
        );
      })}
    </div>
  );
}
