"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayerOptional } from "./player-context";
import { trackPodcastPlay, trackPodcastPause } from "@/lib/podcast-analytics";
import { cn } from "@/lib/utils";
import type { PodcastEpisode } from "@/lib/podcast-types";

interface AudioPlayerProps {
  episode?: PodcastEpisode;
  podcastTitle?: string;
  podcastSlug?: string;
  url?: string;
  title?: string;
  className?: string;
  sticky?: boolean;
}

export const AudioPlayer = ({
  episode,
  podcastTitle,
  podcastSlug,
  url: _url,
  title,
  className,
  sticky = false,
}: AudioPlayerProps) => {
  const globalPlayer = usePlayerOptional();
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  // Determine if this player's episode is the one playing globally
  const displayTitle = title || episode?.title || "Untitled";
  const isGlobalEpisode =
    globalPlayer?.currentEpisode?.id === episode?.id && episode?.id;
  const isPlaying = isGlobalEpisode ? globalPlayer!.isPlaying : false;
  const progress = isGlobalEpisode ? globalPlayer!.progress : 0;
  const duration = isGlobalEpisode ? globalPlayer!.duration : 0;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return "0:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = useCallback(() => {
    if (!globalPlayer) return;

    if (episode) {
      const eventParams = {
        episode_title: episode.title,
        episode_id: episode.id,
        podcast_title: podcastTitle,
        podcast_slug: podcastSlug,
      };

      if (isGlobalEpisode) {
        if (isPlaying) {
          trackPodcastPause(eventParams);
        } else {
          trackPodcastPlay(eventParams);
        }
        globalPlayer.togglePlayPause();
      } else {
        trackPodcastPlay(eventParams);
        globalPlayer.play(episode, podcastTitle, podcastSlug);
      }
    }
  }, [
    globalPlayer,
    episode,
    isGlobalEpisode,
    isPlaying,
    podcastTitle,
    podcastSlug,
  ]);

  const handleSkipBackward = useCallback(() => {
    if (isGlobalEpisode && globalPlayer) {
      globalPlayer.skipBackward(15);
    }
  }, [isGlobalEpisode, globalPlayer]);

  const handleSkipForward = useCallback(() => {
    if (isGlobalEpisode && globalPlayer) {
      globalPlayer.skipForward(30);
    }
  }, [isGlobalEpisode, globalPlayer]);

  const handlePlaybackRateChange = useCallback(() => {
    if (!isGlobalEpisode || !globalPlayer) return;
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(globalPlayer.playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    globalPlayer.setPlaybackRate(rates[nextIndex] ?? 1);
  }, [isGlobalEpisode, globalPlayer]);

  const getProgressFromPosition = useCallback((clientX: number) => {
    if (!progressBarRef.current) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDragging || !isGlobalEpisode || !globalPlayer) return;
      const fraction = getProgressFromPosition(e.clientX);
      globalPlayer.seek(fraction);
    },
    [isDragging, isGlobalEpisode, globalPlayer, getProgressFromPosition],
  );

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      setDragProgress(getProgressFromPosition(e.clientX));
    },
    [getProgressFromPosition],
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent) => {
      setDragProgress(getProgressFromPosition(e.clientX));
    };

    const handleUp = (e: MouseEvent) => {
      const fraction = getProgressFromPosition(e.clientX);
      setIsDragging(false);
      if (isGlobalEpisode && globalPlayer) {
        globalPlayer.seek(fraction);
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging, isGlobalEpisode, globalPlayer, getProgressFromPosition]);

  // Keyboard shortcuts scoped to the player container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGlobalEpisode || !globalPlayer) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          globalPlayer.togglePlayPause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          globalPlayer.skipBackward(15);
          break;
        case "ArrowRight":
          e.preventDefault();
          globalPlayer.skipForward(30);
          break;
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [isGlobalEpisode, globalPlayer]);

  const displayProgress = isDragging ? dragProgress : progress;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={cn(
        "w-full border border-white/10 bg-card p-4 shadow-lg focus:outline-none",
        sticky &&
          "sticky top-4 z-10 backdrop-blur-xl bg-card/95 shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        className,
      )}
    >
      {/* Title */}
      <h3 className="mb-3 text-base font-semibold text-foreground truncate">
        {displayTitle}
      </h3>

      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        className="group relative mb-3 h-1.5 cursor-pointer rounded-full bg-white/10"
        onClick={handleSeek}
      >
        <div
          className="h-full rounded-full bg-primary"
          style={{
            width: `${displayProgress * 100}%`,
            transition: isDragging ? "none" : "width 0.1s linear",
          }}
        />
        <div
          className="absolute top-1/2 size-3.5 cursor-grab rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
          style={{
            left: `${displayProgress * 100}%`,
            transform: "translate(-50%, -50%)",
            transition: isDragging ? "none" : "left 0.1s linear, opacity 0.2s",
            opacity: isDragging ? 1 : undefined,
          }}
          onMouseDown={handleDragStart}
        />
      </div>

      {/* Time Display */}
      <div className="mb-3 flex justify-between text-xs tabular-nums text-muted-foreground">
        <span>{formatTime(displayProgress * duration)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSkipBackward}
            disabled={!isGlobalEpisode}
            className="size-8"
            aria-label="Skip backward 15 seconds"
          >
            <SkipBack className="size-4" />
          </Button>

          <Button
            variant="default"
            size="icon"
            onClick={handlePlayPause}
            disabled={!globalPlayer}
            className="size-10"
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
            onClick={handleSkipForward}
            disabled={!isGlobalEpisode}
            className="size-8"
            aria-label="Skip forward 30 seconds"
          >
            <SkipForward className="size-4" />
          </Button>
        </div>

        {/* Playback Speed */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePlaybackRateChange}
          disabled={!isGlobalEpisode}
          className="h-7 px-2 text-xs font-medium"
        >
          {isGlobalEpisode ? globalPlayer!.playbackRate : 1}x
        </Button>

        {/* Volume (desktop) */}
        <div className="hidden items-center gap-1.5 sm:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => isGlobalEpisode && globalPlayer?.toggleMute()}
            disabled={!isGlobalEpisode}
            className="size-8"
            aria-label={
              isGlobalEpisode && globalPlayer?.isMuted ? "Unmute" : "Mute"
            }
          >
            {isGlobalEpisode && globalPlayer?.isMuted ? (
              <VolumeX className="size-4" />
            ) : (
              <Volume2 className="size-4" />
            )}
          </Button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={
              isGlobalEpisode
                ? globalPlayer?.isMuted
                  ? 0
                  : (globalPlayer?.volume ?? 0.8)
                : 0.8
            }
            onChange={(e) =>
              isGlobalEpisode &&
              globalPlayer?.setVolume(parseFloat(e.target.value))
            }
            disabled={!isGlobalEpisode}
            className="w-16 accent-primary"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
};
