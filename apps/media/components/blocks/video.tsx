"use client";
import * as React from "react";
import dynamic from "next/dynamic";
// Video block type
type VideoBlockData = {
  background?: string;
  color?: string;
  url?: string;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  muted?: boolean;
};
import { Section } from "../layout/section";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export const Video = ({ data }: { data: VideoBlockData }) => {
  if (!data.url) {
    return null;
  }
  return (
    <Section
      background={data.background!}
      className={`aspect-video${data.color ? ` ${data.color}` : ""}`}
    >
      <ReactPlayer
        width="100%"
        height="100%"
        style={{ margin: "auto" }}
        playing={!!data.autoPlay}
        loop={!!data.loop}
        controls={data.controls || true}
        muted={data.muted || false}
        url={data.url}
      />
    </Section>
  );
};
