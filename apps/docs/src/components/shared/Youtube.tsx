import { memo } from "react";
import Loader from "@@/public/src/img/icons/Loader.inline.svg";

function getYoutubeVideoId(url: string) {
  const match = url.match(/[=/]([\w\d_-]{10,12})/);
  if (!match) {
    throw new Error(`${url} is not a YouTube URL or regex couldn't find id`);
  }
  return match[1];
}

function getYoutubeThumbnail(id: string) {
  return `https://i.ytimg.com/vi_webp/${id}/maxresdefault.webp`;
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
          <Loader className="spinner-icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
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
