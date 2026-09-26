import { memo } from "react";
import { LoaderLines } from "@boxicons/react/LoaderLines";

export function getYoutubeVideoId(url: string) {
  const match = url.match(/[=/]([\w\d_-]{10,12})/);
  if (!match) {
    throw new Error(`${url} is not a YouTube URL or regex couldn't find id`);
  }
  return match[1];
}

/**
 * A playlist ID (e.g. `?list=PL...`) can run much longer than a video ID, so
 * it needs its own pattern rather than reusing getYoutubeVideoId's
 * length-capped heuristic (which would silently truncate it).
 */
export function getYoutubePlaylistId(url: string) {
  return url.match(/[?&]list=([\w-]+)/)?.[1] ?? null;
}

/**
 * `maxresdefault` isn't generated for every upload (older or unusually
 * encoded videos may not have one), which renders as a broken image with no
 * warning. Callers should fall back to `"high"` (always present) on error.
 */
export function getYoutubeThumbnail(
  id: string,
  quality: "max" | "high" = "max",
) {
  return quality === "max"
    ? `https://i.ytimg.com/vi_webp/${id}/maxresdefault.webp`
    : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

function getYoutubeEmbedUrl(id: string, { autoplay }: { autoplay: boolean }) {
  return `https://www.youtube-nocookie.com/embed/${id}?controls=1&amp;autoplay=${autoplay}&amp;mute=1&amp;autohide=1&amp;modestbranding=1&amp;iv_load_policy=3&amp;rel=0`;
}

export const YoutubeIFrame = memo(function YoutubeIFrame({
  url,
  loaded,
  autoplay = false,
  enabled = true,
  onLoad,
}: {
  url: string;
  loaded?: boolean;
  autoplay?: boolean;
  enabled?: boolean;
  onLoad?: () => void;
}) {
  const id = getYoutubeVideoId(url);
  const thumbUrl = getYoutubeThumbnail(id);
  const embedYoutubeUrl = getYoutubeEmbedUrl(id, { autoplay });

  return (
    <>
      <link rel="preload" href={thumbUrl} as="image" />
      <link rel="preconnect" href="https://www.youtube-nocookie.com" />
      <link rel="preconnect" href="https://www.google.com" />
      <link rel="preconnect" href="https://static.doubleclick.net" />
      <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
      {!loaded && (
        <div className="relative">
          <img src={thumbUrl} alt="" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoaderLines className="animate-spin" aria-hidden="true" />
          </span>
        </div>
      )}
      {enabled && (
        <iframe
          src={embedYoutubeUrl}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Youtube video"
          className="youtube-embed"
          style={{ visibility: loaded ? "visible" : "hidden" }}
          onLoad={onLoad}
        ></iframe>
      )}
    </>
  );
});
