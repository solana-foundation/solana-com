import { PlayCircle } from "@boxicons/react/PlayCircle";
import { MediaThumbnail } from "./MediaThumbnail";
import { getPlaylistVideoItems } from "./playlist-to-chapters";
import {
  isPlaceholderHref,
  videoItemListSchema,
  type VideoItem,
} from "./video-schema";

export type VideoChapter = VideoItem;

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
}: {
  chapters?: VideoChapter[];
  playlistId?: string;
  playlistLimit?: number;
  label?: string;
}) {
  const items = playlistId
    ? await getPlaylistVideoItems(playlistId, playlistLimit)
    : videoItemListSchema.parse(chapters ?? []);

  return (
    <div className="not-prose flex flex-col gap-6">
      {items.map((chapter, i) => {
        const placeholder = isPlaceholderHref(chapter.href);
        const rowClassName = `group -mx-2 flex items-center gap-4 rounded-lg p-2${
          placeholder ? "" : " hover:bg-fd-accent/50"
        }`;

        const content = (
          <>
            <div className="w-28 shrink-0 sm:w-36">
              <MediaThumbnail
                href={chapter.href}
                placeholderIcon={<PlayCircle className="size-6" />}
              />
            </div>
            <div className="flex flex-col gap-1">
              {label ? (
                <span className="text-xs font-medium tracking-wide text-fd-muted-foreground uppercase">
                  {label} {i + 1}
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
      })}
    </div>
  );
}
