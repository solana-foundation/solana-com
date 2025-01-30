"use client";

import { memo } from "react";
import { YoutubeIFrame } from "../../Youtube";
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
        /^(https:\/\/)?whimsical.com\/embed\/(?:[a-zA-Z0-9\-]+\-)?([a-km-zA-HJ-NP-Z1-9]{16,22})/gi,
      ).test(url)
    ) {
      return <WhimsicalEmbed src={url} width={width} height={height || 180} />;
    }

    // youtube embeds
    else if (
      new RegExp(/^(https:\/\/)?(www.)?(youtube.com|youtu.be)\//gi).test(url)
    ) {
      const videoId = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|.*[?&]v=))([^?&]+)/,
      )?.[1];
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

const YouTubeEmbed = ({ videoId }: { videoId: string }) => {
  return (
    <div className={videoStyles["markdown-renderer-video"]}>
      <YoutubeIFrame
        // @ts-ignore
        url={`https://www.youtube.com/watch?v=${videoId}`}
        loaded={true}
      />
    </div>
  );
};
