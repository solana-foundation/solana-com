"use client";

import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { getYoutubeVideoId } from "./Youtube";

/**
 * Renders `children` as a button that opens the YouTube video at `href` in a
 * modal and autoplays it. The iframe only mounts while the modal is open, so
 * closing it also stops playback. Falls back to a plain link if `href` isn't
 * a recognizable YouTube URL.
 */
export function VideoModalTrigger({
  href,
  title,
  className,
  children,
}: {
  href: string;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  let id: string;
  try {
    id = getYoutubeVideoId(href);
  } catch {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={`${className ?? ""} w-full cursor-pointer border-none bg-transparent p-0 text-left`}
      >
        {children}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="w-full max-w-5xl overflow-hidden border-0 bg-black p-0 shadow-xl md:rounded-2xl"
          showClose={false}
        >
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">
            Playing video: {title}. Press escape to close.
          </DialogDescription>
          <div className="relative aspect-video w-full">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
