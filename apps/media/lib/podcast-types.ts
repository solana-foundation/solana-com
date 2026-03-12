import { ContentDocument } from "./post-types";

// Application Types

export interface PodcastHost {
  name: string;
  avatar?: string;
}

export interface PodcastShow {
  id: string;
  title: string;
  slug: string;
  description: string | ContentDocument;
  coverImage: string;
  category?: string;
  featured: boolean;
  tags?: string[];
  displayOrder: number;
  status: "active" | "archived" | "coming-soon";
  hosts: PodcastHost[];
  riversideProjectId?: string;
  riversideStudioId?: string;
  applePodcastsUrl?: string;
  spotifyUrl?: string;
  rssFeedUrl?: string;
  releaseFrequency?: string;
  firstEpisodeDate?: string;
  episodeCount?: number;
  latestEpisode?: PodcastEpisode;
}

export interface PodcastEpisode {
  id: string;
  recordingId: string;
  podcastSlug: string;
  title: string;
  description?: string;
  publishedDate: string;
  duration: number;
  audioUrl: string;
  thumbnailUrl?: string;
  status: "processing" | "ready" | "failed";
}

export interface AudioPlayerTrack {
  url: string;
  title: string;
  duration: number;
}

export interface PodcastCategory {
  name: string;
  slug: string;
  count: number;
}

export interface PodcastFilter {
  category?: string;
  status?: PodcastShow["status"];
  featured?: boolean;
}

// Helper Types

export interface PaginatedEpisodes {
  episodes: PodcastEpisode[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface PodcastWithEpisodes extends PodcastShow {
  episodes: PodcastEpisode[];
  hasMoreEpisodes: boolean;
}
