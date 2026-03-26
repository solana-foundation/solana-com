"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import type { PodcastEpisode } from "@/lib/podcast-types";

interface PlayerState {
  currentEpisode: PodcastEpisode | null;
  podcastTitle: string | null;
  podcastSlug: string | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
}

interface PlayerContextValue extends PlayerState {
  play: (
    episode: PodcastEpisode,
    podcastTitle?: string,
    podcastSlug?: string,
  ) => void;
  pause: () => void;
  togglePlayPause: () => void;
  seek: (fraction: number) => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  dismiss: () => void;
  playerRef: React.RefObject<any>;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    currentEpisode: null,
    podcastTitle: null,
    podcastSlug: null,
    isPlaying: false,
    progress: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    playbackRate: 1,
  });

  const playerRef = useRef<any>(null);

  const play = useCallback(
    (episode: PodcastEpisode, podcastTitle?: string, podcastSlug?: string) => {
      setState((prev) => {
        const isSameEpisode = prev.currentEpisode?.id === episode.id;
        return {
          ...prev,
          currentEpisode: episode,
          podcastTitle: podcastTitle ?? prev.podcastTitle,
          podcastSlug: podcastSlug ?? prev.podcastSlug,
          isPlaying: true,
          // Reset progress only if switching episodes
          ...(isSameEpisode ? {} : { progress: 0, duration: 0 }),
        };
      });
    },
    [],
  );

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const togglePlayPause = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const seek = useCallback((fraction: number) => {
    setState((prev) => {
      const newTime = fraction * prev.duration;
      if (playerRef.current) {
        playerRef.current.seekTo(newTime, "seconds");
      }
      return { ...prev, progress: fraction };
    });
  }, []);

  const skipForward = useCallback((seconds: number = 30) => {
    if (playerRef.current) {
      const current = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(current + seconds, "seconds");
    }
  }, []);

  const skipBackward = useCallback((seconds: number = 15) => {
    if (playerRef.current) {
      const current = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(Math.max(0, current - seconds), "seconds");
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    setState((prev) => ({
      ...prev,
      volume,
      isMuted: volume === 0 ? true : false,
    }));
  }, []);

  const toggleMute = useCallback(() => {
    setState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    setState((prev) => ({ ...prev, playbackRate: rate }));
  }, []);

  const setProgress = useCallback((progress: number) => {
    setState((prev) => ({ ...prev, progress }));
  }, []);

  const setDuration = useCallback((duration: number) => {
    setState((prev) => ({ ...prev, duration }));
  }, []);

  const dismiss = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentEpisode: null,
      podcastTitle: null,
      podcastSlug: null,
      isPlaying: false,
      progress: 0,
      duration: 0,
    }));
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        play,
        pause,
        togglePlayPause,
        seek,
        skipForward,
        skipBackward,
        setVolume,
        toggleMute,
        setPlaybackRate,
        setProgress,
        setDuration,
        dismiss,
        playerRef,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}

export function usePlayerOptional() {
  return useContext(PlayerContext);
}
