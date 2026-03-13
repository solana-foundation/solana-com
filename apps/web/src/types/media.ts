export type PostItem = {
  id: string;
  published: string;
  title: string;
  tags: string[];
  categories: string[];
  url: string;
  description: string;
  heroImage: string | null | undefined;
  author: {
    name: string;
    avatar: string | null | undefined;
  };
  cursor?: string;
};

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
