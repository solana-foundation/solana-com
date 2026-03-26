"use client";

import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from "react-feather";
import { Link } from "./link";
import {
  clearPodcastPlayerState,
  DEFAULT_PODCAST_PLAYER_STATE,
  dispatchPodcastPlayerCommand,
  PODCAST_PLAYER_COMMAND_EVENT,
  readPodcastPlayerState,
  subscribeToPodcastPlayerState,
  writePodcastPlayerState,
} from "./podcast-player-store";
import type {
  PodcastPlayerCommand,
  PodcastPlayerState,
} from "./podcast-player-types";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0:00";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

async function syncPlayback(audio: HTMLAudioElement, isPlaying: boolean) {
  if (isPlaying) {
    try {
      await audio.play();
    } catch {
      writePodcastPlayerState({
        ...readPodcastPlayerState(),
        isPlaying: false,
      });
    }
    return;
  }

  audio.pause();
}

export function PersistentPodcastPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<PodcastPlayerState>(
    DEFAULT_PODCAST_PLAYER_STATE,
  );

  useEffect(() => {
    const nextState = readPodcastPlayerState();
    setState(nextState);
    return subscribeToPodcastPlayerState(setState);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentEpisode) {
      return;
    }

    audio.muted = state.isMuted;
    audio.volume = state.volume;
    audio.playbackRate = state.playbackRate;
    void syncPlayback(audio, state.isPlaying);
  }, [
    state.currentEpisode?.audioUrl,
    state.isMuted,
    state.isPlaying,
    state.playbackRate,
    state.volume,
  ]);

  useEffect(() => {
    const handleCommand = (event: Event) => {
      const audio = audioRef.current;
      const command = (event as CustomEvent<PodcastPlayerCommand>).detail;
      const currentState = readPodcastPlayerState();

      switch (command.type) {
        case "play": {
          const isSameEpisode =
            currentState.currentEpisode?.id === command.episode.id;

          writePodcastPlayerState({
            ...currentState,
            currentEpisode: command.episode,
            podcastTitle: command.podcastTitle ?? currentState.podcastTitle,
            podcastSlug:
              command.podcastSlug ??
              command.episode.podcastSlug ??
              currentState.podcastSlug,
            isPlaying: true,
            currentTime: isSameEpisode ? currentState.currentTime : 0,
            duration: isSameEpisode ? currentState.duration : 0,
          });
          return;
        }

        case "pause":
          writePodcastPlayerState({ ...currentState, isPlaying: false });
          return;

        case "toggle-play-pause":
          writePodcastPlayerState({
            ...currentState,
            isPlaying: !currentState.isPlaying,
          });
          return;

        case "seek": {
          if (!audio) return;
          const duration = audio.duration || currentState.duration;
          const nextTime = Math.max(
            0,
            Math.min(duration, command.fraction * duration),
          );
          audio.currentTime = nextTime;
          writePodcastPlayerState({
            ...currentState,
            currentTime: nextTime,
            duration: duration || currentState.duration,
          });
          return;
        }

        case "skip-forward": {
          if (!audio) return;
          const nextTime = Math.min(
            audio.duration || Number.MAX_SAFE_INTEGER,
            audio.currentTime + (command.seconds ?? 30),
          );
          audio.currentTime = nextTime;
          writePodcastPlayerState({
            ...currentState,
            currentTime: nextTime,
            duration: audio.duration || currentState.duration,
          });
          return;
        }

        case "skip-backward": {
          if (!audio) return;
          const nextTime = Math.max(
            0,
            audio.currentTime - (command.seconds ?? 15),
          );
          audio.currentTime = nextTime;
          writePodcastPlayerState({
            ...currentState,
            currentTime: nextTime,
            duration: audio.duration || currentState.duration,
          });
          return;
        }

        case "set-volume":
          writePodcastPlayerState({
            ...currentState,
            volume: command.volume,
            isMuted: command.volume === 0,
          });
          return;

        case "toggle-mute":
          writePodcastPlayerState({
            ...currentState,
            isMuted: !currentState.isMuted,
          });
          return;

        case "set-playback-rate":
          writePodcastPlayerState({
            ...currentState,
            playbackRate: command.rate,
          });
          return;

        case "dismiss":
          if (audio) {
            audio.pause();
            audio.removeAttribute("src");
            audio.load();
          }
          clearPodcastPlayerState();
          return;
      }
    };

    window.addEventListener(PODCAST_PLAYER_COMMAND_EVENT, handleCommand);
    return () => {
      window.removeEventListener(PODCAST_PLAYER_COMMAND_EVENT, handleCommand);
    };
  }, []);

  const currentEpisodePath =
    state.currentEpisode && state.podcastSlug
      ? `/podcasts/${state.podcastSlug}/episodes/${state.currentEpisode.id}`
      : null;
  const podcastPath = state.podcastSlug
    ? `/podcasts/${state.podcastSlug}`
    : null;
  const progress =
    state.duration > 0 ? Math.min(1, state.currentTime / state.duration) : 0;

  if (!state.currentEpisode) {
    return null;
  }

  return (
    <>
      <audio
        ref={audioRef}
        preload="metadata"
        src={state.currentEpisode.audioUrl}
        onLoadedMetadata={(event) => {
          const audio = event.currentTarget;
          const nextState = readPodcastPlayerState();
          if (
            Number.isFinite(nextState.currentTime) &&
            nextState.currentTime > 0 &&
            Math.abs(audio.currentTime - nextState.currentTime) > 1
          ) {
            audio.currentTime = Math.min(
              nextState.currentTime,
              audio.duration || nextState.currentTime,
            );
          }

          writePodcastPlayerState({
            ...nextState,
            duration: audio.duration || nextState.duration,
          });
        }}
        onTimeUpdate={(event) => {
          const audio = event.currentTarget;
          writePodcastPlayerState({
            ...readPodcastPlayerState(),
            currentTime: audio.currentTime,
            duration: audio.duration || readPodcastPlayerState().duration,
          });
        }}
        onEnded={() => {
          writePodcastPlayerState({
            ...readPodcastPlayerState(),
            isPlaying: false,
            currentTime: state.duration,
          });
        }}
      />

      <div className="fixed bottom-0 left-0 right-0 z-[70] border-t border-white/10 bg-black/90 text-white backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.4)]">
        <div className="relative h-1 w-full bg-white/10">
          <div
            className="h-full bg-[#14F195] transition-[width] duration-100 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 md:px-6">
          {currentEpisodePath ? (
            <Link
              href={currentEpisodePath}
              className="hidden size-10 overflow-hidden rounded bg-white/5 sm:block"
            >
              {state.currentEpisode.thumbnailUrl ? (
                <img
                  src={state.currentEpisode.thumbnailUrl}
                  alt={state.currentEpisode.title}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </Link>
          ) : null}

          <div className="min-w-0 flex-1">
            {currentEpisodePath ? (
              <Link
                href={currentEpisodePath}
                className="block truncate text-sm font-medium text-white transition-opacity hover:opacity-80"
              >
                {state.currentEpisode.title}
              </Link>
            ) : (
              <div className="truncate text-sm font-medium text-white">
                {state.currentEpisode.title}
              </div>
            )}

            {state.podcastTitle && podcastPath ? (
              <Link
                href={podcastPath}
                className="block truncate text-xs text-white/60 transition-opacity hover:text-white/80"
              >
                {state.podcastTitle}
              </Link>
            ) : null}
          </div>

          <div className="hidden text-xs tabular-nums text-white/60 md:block">
            {formatTime(state.currentTime)} / {formatTime(state.duration)}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                dispatchPodcastPlayerCommand({
                  type: "skip-backward",
                  seconds: 15,
                })
              }
              className="hidden size-8 items-center justify-center rounded-full transition-colors hover:bg-white/10 sm:flex"
              aria-label="Skip backward 15 seconds"
            >
              <SkipBack size={16} />
            </button>

            <button
              type="button"
              onClick={() =>
                dispatchPodcastPlayerCommand({ type: "toggle-play-pause" })
              }
              className="flex size-9 items-center justify-center rounded-full bg-white text-black transition-opacity hover:opacity-90"
              aria-label={state.isPlaying ? "Pause" : "Play"}
            >
              {state.isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <button
              type="button"
              onClick={() =>
                dispatchPodcastPlayerCommand({
                  type: "skip-forward",
                  seconds: 30,
                })
              }
              className="hidden size-8 items-center justify-center rounded-full transition-colors hover:bg-white/10 sm:flex"
              aria-label="Skip forward 30 seconds"
            >
              <SkipForward size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              dispatchPodcastPlayerCommand({ type: "toggle-mute" })
            }
            className="hidden size-8 items-center justify-center rounded-full transition-colors hover:bg-white/10 lg:flex"
            aria-label={state.isMuted ? "Unmute" : "Mute"}
          >
            {state.isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <div className="hidden items-center gap-2 lg:flex">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={state.isMuted ? 0 : state.volume}
              onChange={(event) =>
                dispatchPodcastPlayerCommand({
                  type: "set-volume",
                  volume: Number.parseFloat(event.target.value),
                })
              }
              className={classNames("w-20 accent-white")}
              aria-label="Volume"
            />
          </div>

          <button
            type="button"
            onClick={() => dispatchPodcastPlayerCommand({ type: "dismiss" })}
            className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-white/10"
            aria-label="Close player"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
