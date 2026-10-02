"use client";

import { memo } from "react";
import { YoutubeIFrame, getYoutubePlaylistId } from "../../Youtube";
import videoStyles from "./MarkdownVideo.module.scss";

type ComponentProps = {
  children?: React.ReactNode;
  url: string;
  width?: number;
  height?: number;
};

export const MarkdownEmbed = memo(
  ({ url, width = undefined, height = undefined }: ComponentProps) => {
    if (!url) return null;

    // quietly fail on invalid width or height (when provided)
    if (
      (!!width && typeof width !== "number") ||
      (!!height && typeof height !== "number")
    )
      return null;

    // whimsical embeds
    if (
      new RegExp(
        /^(https:\/\/)?whimsical.com\/embed\/(?:[a-zA-Z0-9-]+-)?([a-km-zA-HJ-NP-Z1-9]{16,22})/gi,
      ).test(url)
    ) {
      return (
        <WhimsicalEmbed src={url} width={width || 380} height={height || 180} />
      );
    }

    // youtube embeds (single video or a whole playlist)
    else if (
      new RegExp(/^(https:\/\/)?(www.)?(youtube.com|youtu.be)\//gi).test(url)
    ) {
      const videoId = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|.*[?&]v=))([^?&]+)/,
      )?.[1];
      if (videoId) return <YouTubeEmbed videoId={videoId} />;

      // Checked after videoId: a "watch?v=...&list=..." URL should still
      // embed as the single video, not the whole playlist.
      const playlistId = getYoutubePlaylistId(url);
      if (playlistId) return <YouTubePlaylistEmbed playlistId={playlistId} />;
    }

    // default return with no element
    return <>{url}</>;
  },
);

const WhimsicalEmbed = (props: {
  src: string;
  width: number;
  height: number;
}) => {
  return (
    <iframe
      src={props.src}
      width={props.width}
      height={props.height || 200}
    ></iframe>
  );
};

const YouTubeEmbed = ({ videoId }: { videoId: string }) => {
  return (
    <div className={videoStyles["markdown-renderer-video"]}>
      <YoutubeIFrame
        url={`https://www.youtube.com/watch?v=${videoId}`}
        loaded={true}
      />
    </div>
  );
};

// No single thumbnail exists for a playlist, so this skips YoutubeIFrame's
// lazy thumbnail-first phase and embeds directly — the same behavior the
// hand-written playlist iframes elsewhere in the docs used, just through
// one shared component (and youtube-nocookie.com) instead of duplicated
// raw <iframe> markup.
const YouTubePlaylistEmbed = ({ playlistId }: { playlistId: string }) => {
  return (
    <div className={videoStyles["markdown-renderer-video"]}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}`}
        title="YouTube playlist"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};
