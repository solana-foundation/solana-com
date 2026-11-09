import { Image as ImageIcon } from "@boxicons/react/Image";
import { MediaThumbnail } from "./MediaThumbnail";
import { VideoModalTrigger } from "./VideoModal";
import { getPlaylistVideoItems } from "./playlist-to-chapters";
import {
  isPlaceholderHref,
  videoItemListSchema,
  type VideoItem,
} from "./video-schema";

export type ProjectCard = VideoItem;

/**
 * Use this for a set of independent, unordered items — projects, demos,
 * anything without a meaningful watch order. For a sequential course or
 * roadmap, use VideoChapterList instead, which numbers its entries.
 *
 * Accepts either a static `projects` array or a `playlistId` (see
 * VideoChapterList for the same tradeoff between a hand-curated list and a
 * playlist as the source of truth).
 */
export async function ProjectCardGrid({
  projects,
  playlistId,
  playlistLimit,
  modal = false,
}: {
  projects?: ProjectCard[];
  playlistId?: string;
  playlistLimit?: number;
  /** Open videos in an autoplaying modal instead of a new tab. */
  modal?: boolean;
}) {
  const items = playlistId
    ? await getPlaylistVideoItems(playlistId, playlistLimit)
    : videoItemListSchema.parse(projects ?? []);

  return (
    <div className="not-prose grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((project, i) => {
        const placeholder = isPlaceholderHref(project.href);
        const content = (
          <>
            <MediaThumbnail
              href={project.href}
              placeholderIcon={<ImageIcon className="size-6" />}
            />
            {project.duration ? (
              <span className="text-xs font-medium tracking-wide text-fd-muted-foreground uppercase">
                {project.duration}
              </span>
            ) : null}
            <span
              className={`font-semibold leading-snug${placeholder ? "" : " group-hover:underline"}`}
            >
              {project.title}
            </span>
            {project.subtext ? (
              <span className="text-sm text-fd-muted-foreground">
                {project.subtext}
              </span>
            ) : null}
          </>
        );

        if (placeholder) {
          return (
            <div
              key={`placeholder-${i}`}
              className="flex flex-col gap-3"
              aria-disabled="true"
            >
              {content}
            </div>
          );
        }

        if (modal) {
          return (
            <VideoModalTrigger
              key={project.href}
              href={project.href!}
              title={project.title}
              className="group flex flex-col gap-3"
            >
              {content}
            </VideoModalTrigger>
          );
        }

        return (
          <a
            key={project.href}
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col gap-3"
          >
            {content}
          </a>
        );
      })}
    </div>
  );
}
