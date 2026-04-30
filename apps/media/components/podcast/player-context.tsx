"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_PODCAST_PLAYER_STATE,
  dispatchPodcastPlayerCommand,
  readPodcastPlayerState,
  subscribeToPodcastPlayerState,
} from "@solana-com/ui-chrome";
import type { PodcastPlayerEpisode } from "@solana-com/ui-chrome";
import type { PodcastEpisode } from "@/lib/podcast-types";

interface PlayerContextValue {
  currentEpisode: PodcastEpisode | null;
  podcastTitle: string | null;
  podcastSlug: string | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  play: (
    _episode: PodcastEpisode,
    _podcastTitle?: string,
    _podcastSlug?: string,
  ) => void;
  pause: () => void;
  togglePlayPause: () => void;
  seek: (_fraction: number) => void;
  skipForward: (_seconds?: number) => void;
  skipBackward: (_seconds?: number) => void;
  setVolume: (_volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (_rate: number) => void;
  setProgress: (_progress: number) => void;
  setDuration: (_duration: number) => void;
  dismiss: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

function toPlayerEpisode(episode: PodcastEpisode): PodcastPlayerEpisode {
  return {
    id: episode.id,
    slug: episode.slug,
    podcastSlug: episode.podcastSlug,
    title: episode.title,
    audioUrl: episode.audioUrl,
    thumbnailUrl: episode.thumbnailUrl,
  };
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(DEFAULT_PODCAST_PLAYER_STATE);

  useEffect(() => {
    setState(readPodcastPlayerState());
    return subscribeToPodcastPlayerState(setState);
  }, []);

  const play = useCallback(
    (episode: PodcastEpisode, podcastTitle?: string, podcastSlug?: string) => {
      dispatchPodcastPlayerCommand({
        type: "play",
        episode: toPlayerEpisode(episode),
        podcastTitle,
        podcastSlug: podcastSlug ?? episode.podcastSlug,
      });
    },
    [],
  );

  const pause = useCallback(() => {
    dispatchPodcastPlayerCommand({ type: "pause" });
  }, []);

  const togglePlayPause = useCallback(() => {
    dispatchPodcastPlayerCommand({ type: "toggle-play-pause" });
  }, []);

  const seek = useCallback((fraction: number) => {
    dispatchPodcastPlayerCommand({ type: "seek", fraction });
  }, []);

  const skipForward = useCallback((seconds: number = 30) => {
    dispatchPodcastPlayerCommand({ type: "skip-forward", seconds });
  }, []);

  const skipBackward = useCallback((seconds: number = 15) => {
    dispatchPodcastPlayerCommand({ type: "skip-backward", seconds });
  }, []);

  const setVolume = useCallback((volume: number) => {
    dispatchPodcastPlayerCommand({ type: "set-volume", volume });
  }, []);

  const toggleMute = useCallback(() => {
    dispatchPodcastPlayerCommand({ type: "toggle-mute" });
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    dispatchPodcastPlayerCommand({ type: "set-playback-rate", rate });
  }, []);

  const dismiss = useCallback(() => {
    dispatchPodcastPlayerCommand({ type: "dismiss" });
  }, []);

  const value = useMemo<PlayerContextValue>(
    () => ({
      currentEpisode: (state.currentEpisode as PodcastEpisode | null) ?? null,
      podcastTitle: state.podcastTitle,
      podcastSlug: state.podcastSlug,
      isPlaying: state.isPlaying,
      progress:
        state.duration > 0
          ? Math.min(1, state.currentTime / state.duration)
          : 0,
      duration: state.duration,
      volume: state.volume,
      isMuted: state.isMuted,
      playbackRate: state.playbackRate,
      play,
      pause,
      togglePlayPause,
      seek,
      skipForward,
      skipBackward,
      setVolume,
      toggleMute,
      setPlaybackRate,
      setProgress: () => {},
      setDuration: () => {},
      dismiss,
    }),
    [
      dismiss,
      pause,
      play,
      seek,
      setPlaybackRate,
      setVolume,
      skipBackward,
      skipForward,
      state.currentEpisode,
      state.currentTime,
      state.duration,
      state.isMuted,
      state.isPlaying,
      state.playbackRate,
      state.podcastSlug,
      state.podcastTitle,
      state.volume,
      toggleMute,
      togglePlayPause,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
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
