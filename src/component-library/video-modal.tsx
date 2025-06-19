import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { useState, useEffect } from "react";

const OPEN_VIDEO_EVENT = "open-video-player" as const;

export interface VideoSource {
  platform: "youtube" | "vimeo";
  id: string;
  title?: string;
  autoplay?: boolean;
}

export function openVideoPlayer(source: VideoSource) {
  window.dispatchEvent(
    new CustomEvent(OPEN_VIDEO_EVENT, {
      detail: { ...source, autoplay: source.autoplay ?? true },
    }),
  );
}

export interface VideoTriggerProps extends VideoSource {
  children?: React.ReactNode;
  className?: string;
  autoplay?: boolean;
}

export const VideoTrigger = React.forwardRef<
  HTMLButtonElement,
  VideoTriggerProps
>(({ children, className = "", autoplay = true, ...source }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => openVideoPlayer({ ...source, autoplay })}
      className={
        "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground transition hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 " +
        className
      }
    >
      {children ?? "Play video"}
    </button>
  );
});
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

  const getEmbedUrl = (src: VideoSource): string => {
    const { platform, id, autoplay } = src;
    if (platform === "youtube") {
      return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=${autoplay ? 1 : 0}`;
    }
    // Vimeo
    return `https://player.vimeo.com/video/${id}?autoplay=${autoplay ? 1 : 0}&title=0&byline=0&portrait=0`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-full max-w-5xl overflow-hidden border-0 bg-black p-0 shadow-xl md:rounded-2xl"
        showClose={false}
      >
        {video && (
          <div className="relative w-full pb-[56.25%]">
            <DialogTitle className="sr-only">
              {video.title || "Video player"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {video.title
                ? `Playing video: ${video.title}`
                : "Video player modal. Press escape to close."}
            </DialogDescription>
            <iframe
              key={`${video.platform}-${video.id}`}
              src={getEmbedUrl(video)}
              title={video.title || "Video player"}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
