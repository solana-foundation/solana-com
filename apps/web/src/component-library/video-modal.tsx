/**
 * Video Modal System
 *
 * @description
 * Provides a modal system for playing YouTube and Vimeo videos.
 *
 * @usage
 * 1. Place <VideoPlayerModal /> once at the root of your app (e.g. in _app.tsx or a layout).
 * 2. Use the <VideoTrigger /> component anywhere to render a button that opens the modal:
 *
 *    <VideoTrigger platform="youtube" id="dQw4w9WgXcQ" title="Demo Video">
 *      Watch Demo
 *    </VideoTrigger>
 *
 *    // Or for Vimeo:
 *    <VideoTrigger platform="vimeo" id="123456789" title="Vimeo Example" />
 *
 * 3. To open the modal programmatically, call:
 *
 *    openVideoPlayer({ platform: "youtube", id: "dQw4w9WgXcQ", title: "Demo" });
 *
 * @remarks
 * The modal supports YouTube and Vimeo. The `autoplay` prop is optional (defaults to true).
 */

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@@/src/app/components/ui/dialog";
import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { Video, VideoProps } from "./video";

const OPEN_VIDEO_EVENT = "open-video-player" as const;

export interface VideoSource extends VideoProps {}

export function openVideoPlayer(source: VideoSource) {
  window.dispatchEvent(
    new CustomEvent(OPEN_VIDEO_EVENT, {
      detail: { ...source, autoplay: source.autoplay ?? true },
    }),
  );
}

export interface VideoTriggerProps {
  platform: "youtube" | "vimeo";
  id: string;
  title?: string;
  bgColorClass: string; // e.g. "bg-purple-600/90"
  className?: string;
  iconClassName?: string;
  autoplay?: boolean;
  mode?: "icon" | "button" | "icon-cover";
  children?: React.ReactNode;
}

export const VideoTrigger = React.forwardRef<
  HTMLButtonElement,
  VideoTriggerProps
>(
  (
    {
      platform,
      id,
      title,
      bgColorClass,
      className,
      iconClassName,
      autoplay = true,
      mode = "icon",
      children,
    },
    ref,
  ) => {
    if (mode === "button") {
      return (
        <button
          ref={ref}
          type="button"
          aria-label={title}
          tabIndex={0}
          className={`${className ?? ""} border-none bg-none z-10 cursor-pointer`}
          onClick={() => openVideoPlayer({ platform, id, title, autoplay })}
        >
          {children}
        </button>
      );
    }
    if (mode === "icon-cover") {
      return (
        <div
          className="absolute inset-0 z-10 group cursor-pointer"
          role="button"
          onClick={() => openVideoPlayer({ platform, id, title, autoplay })}
        >
          <button
            ref={ref}
            type="button"
            aria-label={title}
            tabIndex={0}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 ${bgColorClass} ${className ?? ""} rounded-full flex items-center justify-center transition group-hover:scale-110`}
          >
            <Play
              fill="white"
              strokeWidth={0}
              className={`w-8 h-8 ${iconClassName ?? ""}`}
            />
          </button>
        </div>
      );
    }
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => openVideoPlayer({ platform, id, title, autoplay })}
        aria-label={title}
        tabIndex={0}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 ${bgColorClass} ${className ?? ""} rounded-full flex items-center justify-center transition group-hover:scale-110 z-10`}
      >
        <Play
          fill="white"
          strokeWidth={0}
          className={`w-8 h-8 ${iconClassName ?? ""}`}
        />
      </button>
    );
  },
);
VideoTrigger.displayName = "VideoTrigger";

export function VideoPlayerModal() {
  const [open, setOpen] = useState(false);
  const [video, setVideo] = useState<VideoSource | null>(null);

  useEffect(() => {
    function handleOpen(e: Event) {
      const detail = (e as CustomEvent<VideoSource>).detail;
      setVideo(detail);
      setOpen(true);
    }

    window.addEventListener(OPEN_VIDEO_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_VIDEO_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => setVideo(null), 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-full max-w-5xl overflow-hidden border-0 bg-black p-0 shadow-xl md:rounded-2xl"
        showClose={false}
      >
        {video && (
          <div className="relative w-full">
            <DialogTitle className="sr-only">
              {video.title || "Video player"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {video.title
                ? `Playing video: ${video.title}`
                : "Video player modal. Press escape to close."}
            </DialogDescription>
            <Video
              key={`${video.platform}-${video.id}`}
              id={video.id}
              title={video.title || "Video player"}
              aspectRatio={video.aspectRatio}
              autoplay={video.autoplay}
              privacyMode={video.privacyMode}
              startTime={video.startTime}
              platform={video.platform}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
