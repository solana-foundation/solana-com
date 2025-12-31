"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface VideoDialogContextProps {
  isVideoOpen: boolean;
  videoUrl: string | null;
  openVideo: (url: string) => void;
  closeVideo: () => void;
}

const VideoDialogContext = createContext<VideoDialogContextProps | undefined>(
  undefined
);

export const VideoDialogProvider = ({ children }: { children: ReactNode }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const openVideo = (url: string) => {
    setVideoUrl(url);
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setVideoUrl(null);
    setIsVideoOpen(false);
  };

  return (
    <VideoDialogContext.Provider
      value={{ isVideoOpen, videoUrl, openVideo, closeVideo }}
    >
      {children}
    </VideoDialogContext.Provider>
  );
};

export const useVideoDialog = () => {
  const context = useContext(VideoDialogContext);
  if (!context) {
    throw new Error("useVideoDialog must be used within a VideoDialogProvider");
  }
  return context;
};
