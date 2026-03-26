"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Link } from "@workspace/i18n/routing";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { usePlayer } from "./player-context";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/podcast-utils";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export function PersistentMiniPlayer() {
  const player = usePlayer();
  const {
    currentEpisode,
    podcastTitle,
    podcastSlug,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    playbackRate,
    togglePlayPause,
    skipForward,
    skipBackward,
    setProgress,
    setDuration,
    toggleMute,
    dismiss,
    playerRef,
  } = player;

  const isDragging = React.useRef(false);
  const progressBarRef = React.useRef<HTMLDivElement>(null);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration === 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const fraction = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    player.seek(fraction);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return "0:00";
    return formatDuration(seconds);
  };

  return (
    <>
      {/* Hidden ReactPlayer — always mounted when episode exists */}
      {currentEpisode && (
        <div className="hidden">
          <ReactPlayer
            ref={playerRef}
            url={currentEpisode.audioUrl}
            playing={isPlaying}
            volume={isMuted ? 0 : volume}
            playbackRate={playbackRate}
            onDuration={setDuration}
            onProgress={(state) => {
              if (!isDragging.current) {
                setProgress(state.played);
              }
            }}
            onEnded={() => player.pause()}
            width="0"
            height="0"
            config={{ file: { forceAudio: true } }}
          />
        </div>
      )}

      {/* Mini Player Bar */}
      <AnimatePresence>
        {currentEpisode && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-card/95 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.4)]"
          >
            {/* Progress bar at top of mini player */}
            <div
              ref={progressBarRef}
              className="group relative h-1 w-full cursor-pointer bg-white/10 transition-all hover:h-1.5"
              onClick={handleProgressBarClick}
            >
              <div
                className="h-full bg-primary transition-[width] duration-100 ease-linear"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 md:gap-4 md:px-6">
              {/* Episode thumbnail / podcast cover */}
              <Link
                href={`/podcasts/${podcastSlug}/episodes/${currentEpisode.id}`}
                className="relative hidden size-10 flex-shrink-0 overflow-hidden rounded sm:block"
              >
                {currentEpisode.thumbnailUrl ? (
                  <Image
                    src={currentEpisode.thumbnailUrl}
                    alt={currentEpisode.title}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/20">
                    <Play className="size-4 text-primary/60" />
                  </div>
                )}
              </Link>

              {/* Track info */}
              <div className="min-w-0 flex-1">
                <Link
                  href={`/podcasts/${podcastSlug}/episodes/${currentEpisode.id}`}
                  className="block truncate text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {currentEpisode.title}
                </Link>
                {podcastTitle && (
                  <Link
                    href={`/podcasts/${podcastSlug}`}
                    className="block truncate text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {podcastTitle}
                  </Link>
                )}
              </div>

              {/* Time */}
              <span className="hidden text-xs tabular-nums text-muted-foreground md:block">
                {formatTime(progress * duration)} / {formatTime(duration)}
              </span>

              {/* Controls */}
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => skipBackward()}
                  className="hidden size-8 sm:flex"
                  aria-label="Skip back 15 seconds"
                >
                  <SkipBack className="size-3.5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlayPause}
                  className="size-9"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="size-4" />
                  ) : (
                    <Play className="size-4 ml-0.5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => skipForward()}
                  className="hidden size-8 sm:flex"
                  aria-label="Skip forward 30 seconds"
                >
                  <SkipForward className="size-3.5" />
                </Button>
              </div>

              {/* Volume (desktop) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="hidden size-8 lg:flex"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="size-3.5" />
                ) : (
                  <Volume2 className="size-3.5" />
                )}
              </Button>

              {/* Dismiss */}
              <Button
                variant="ghost"
                size="icon"
                onClick={dismiss}
                className="size-8"
                aria-label="Close player"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
