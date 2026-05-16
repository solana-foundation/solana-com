export interface PodcastPlayerEpisode {
  id: string;
  slug: string;
  podcastSlug: string;
  title: string;
  audioUrl: string;
  thumbnailUrl?: string;
}

export interface PodcastPlayerState {
  currentEpisode: PodcastPlayerEpisode | null;
  podcastTitle: string | null;
  podcastSlug: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
}

export type PodcastPlayerCommand =
  | {
      type: "play";
      episode: PodcastPlayerEpisode;
      podcastTitle?: string;
      podcastSlug?: string;
    }
  | { type: "pause" }
  | { type: "toggle-play-pause" }
  | { type: "seek"; fraction: number }
  | { type: "skip-forward"; seconds?: number }
  | { type: "skip-backward"; seconds?: number }
  | { type: "set-volume"; volume: number }
  | { type: "toggle-mute" }
  | { type: "set-playback-rate"; rate: number }
  | { type: "dismiss" };
