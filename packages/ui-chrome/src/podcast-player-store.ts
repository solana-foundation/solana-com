"use client";

import type {
  PodcastPlayerCommand,
  PodcastPlayerState,
} from "./podcast-player-types";

export const PODCAST_PLAYER_STORAGE_KEY = "solana:persistent-podcast-player";
export const PODCAST_PLAYER_STATE_EVENT =
  "solana:persistent-podcast-player:state";
export const PODCAST_PLAYER_COMMAND_EVENT =
  "solana:persistent-podcast-player:command";

export const DEFAULT_PODCAST_PLAYER_STATE: PodcastPlayerState = {
  currentEpisode: null,
  podcastTitle: null,
  podcastSlug: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  playbackRate: 1,
};

function canUseDOM() {
  return typeof window !== "undefined";
}

export function readPodcastPlayerState(): PodcastPlayerState {
  if (!canUseDOM()) {
    return DEFAULT_PODCAST_PLAYER_STATE;
  }

  try {
    const rawState = window.localStorage.getItem(PODCAST_PLAYER_STORAGE_KEY);
    if (!rawState) {
      return DEFAULT_PODCAST_PLAYER_STATE;
    }

    return {
      ...DEFAULT_PODCAST_PLAYER_STATE,
      ...JSON.parse(rawState),
    } as PodcastPlayerState;
  } catch {
    return DEFAULT_PODCAST_PLAYER_STATE;
  }
}

export function writePodcastPlayerState(state: PodcastPlayerState) {
  if (!canUseDOM()) {
    return;
  }

  window.localStorage.setItem(
    PODCAST_PLAYER_STORAGE_KEY,
    JSON.stringify(state),
  );
  window.dispatchEvent(
    new CustomEvent<PodcastPlayerState>(PODCAST_PLAYER_STATE_EVENT, {
      detail: state,
    }),
  );
}

export function clearPodcastPlayerState() {
  if (!canUseDOM()) {
    return;
  }

  window.localStorage.removeItem(PODCAST_PLAYER_STORAGE_KEY);
  window.dispatchEvent(
    new CustomEvent<PodcastPlayerState>(PODCAST_PLAYER_STATE_EVENT, {
      detail: DEFAULT_PODCAST_PLAYER_STATE,
    }),
  );
}

export function dispatchPodcastPlayerCommand(command: PodcastPlayerCommand) {
  if (!canUseDOM()) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<PodcastPlayerCommand>(PODCAST_PLAYER_COMMAND_EVENT, {
      detail: command,
    }),
  );
}

export function subscribeToPodcastPlayerState(
  callback: (state: PodcastPlayerState) => void,
) {
  if (!canUseDOM()) {
    return () => {};
  }

  const handleStateEvent = (event: Event) => {
    callback((event as CustomEvent<PodcastPlayerState>).detail);
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === PODCAST_PLAYER_STORAGE_KEY) {
      callback(readPodcastPlayerState());
    }
  };

  window.addEventListener(PODCAST_PLAYER_STATE_EVENT, handleStateEvent);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(PODCAST_PLAYER_STATE_EVENT, handleStateEvent);
    window.removeEventListener("storage", handleStorage);
  };
}
