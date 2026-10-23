"use client";

import { memo } from "react";
import { YoutubeIFrame } from "../../Youtube";
import { VideoModalTrigger } from "../../VideoModal";
import { MediaThumbnail } from "../../MediaThumbnail";
import { Play } from "@boxicons/react/Play";
import videoStyles from "./MarkdownVideo.module.scss";

type ComponentProps = {
  children?: React.ReactNode;
  url: string;
  width?: number;
  height?: number;
  /** Show a thumbnail that opens the video in an autoplaying modal. */
  modal?: boolean;
};

export const MarkdownEmbed = memo(
  ({
    url,
    width = undefined,
    height = undefined,
    modal = false,
  }: ComponentProps) => {
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

    // youtube embeds
    else if (
      new RegExp(/^(https:\/\/)?(www.)?(youtube.com|youtu.be)\//gi).test(url)
    ) {
      const videoId = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|.*[?&]v=))([^?&]+)/,
      )?.[1];
      if (videoId && modal) return <YouTubeModalEmbed videoId={videoId} />;
      if (videoId) return <YouTubeEmbed videoId={videoId} />;
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

const YouTubeModalEmbed = ({ videoId }: { videoId: string }) => {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  return (
    <VideoModalTrigger
      href={url}
      title="Video"
      className="group relative block"
    >
      <MediaThumbnail
        href={url}
        placeholderIcon={<Play className="size-6" />}
      />
      <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 transition group-hover:scale-110">
        <Play fill="white" className="size-8" />
      </span>
    </VideoModalTrigger>
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
