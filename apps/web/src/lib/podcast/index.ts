import { PodcastEpisode } from "@/types/media";

export default class PodcastApi {
  static HEADERS: Record<string, string> = {
    Authorization: `Bearer ${process.env.SIMPLECAST_API_KEY}`,
  };

  static async getEpisodeBySlug(
    slug: string,
  ): Promise<{ episode: PodcastEpisode }> {
    if (!process.env.SIMPLECAST_API_KEY) {
      console.warn("SIMPLECAST_API_KEY is not set. Returning dummy data.");
      return {
        episode: {
          id: "dummy-id",
          recordingId: "dummy-recording-id",
          podcastSlug: slug,
          title: "Dummy Episode",
          description: "This is a dummy episode description.",
          publishedDate: "2024-01-01T00:00:00Z",
          duration: 1800,
          audioUrl: "https://example.com/dummy.mp3",
          thumbnailUrl: "https://example.com/dummy-thumbnail.jpg",
          status: "ready",
        },
      };
    }

    const request = new Request("https://api.simplecast.com/episodes/search", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        ...PodcastApi.HEADERS,
      }),
      body: JSON.stringify({
        url: `https://podcast.solana.com/episodes/${slug}`,
      }),
    });

    const response = await fetch(request);
    const episode = await response.json();

    return {
      episode,
    };
  }

  static async getEpisodes({
    limit = 15,
    offset = 0,
    query = "",
    sort = "desc",
  }: {
    limit?: number;
    offset?: number;
    query?: string;
    sort?: string;
  }): Promise<{ episodes: PodcastEpisode[]; hasMore: boolean }> {
    if (!process.env.SIMPLECAST_API_KEY) {
      console.warn("SIMPLECAST_API_KEY is not set. Returning dummy data.");
      return {
        episodes: [
          {
            id: "dummy-episode-1",
            recordingId: "dummy-recording-1",
            podcastSlug: "solana-podcast",
            title: "Dummy Episode 1",
            description: "Description for dummy episode 1",
            publishedDate: "2024-05-28T02:00:00-07:00",
            duration: 2798,
            audioUrl: "https://example.com/dummy1.mp3",
            thumbnailUrl: "https://example.com/dummy-thumbnail.jpg",
            status: "ready",
          },
          {
            id: "dummy-episode-2",
            recordingId: "dummy-recording-2",
            podcastSlug: "solana-podcast",
            title: "Dummy Episode 2",
            description: "Description for dummy episode 2",
            publishedDate: "2024-05-21T02:00:00-07:00",
            duration: 2407,
            audioUrl: "https://example.com/dummy2.mp3",
            thumbnailUrl: "https://example.com/dummy-thumbnail.jpg",
            status: "ready",
          },
        ],
        hasMore: false,
      };
    }

    const response = await fetch(
      [
        `https://api.simplecast.com/podcasts/${process.env.SIMPLECAST_PODCAST_ID}`,
        `/episodes?status=published`,
        `&limit=${limit}&offset=${offset}&search=${query}&sort=${sort}`,
      ].join(""),
      {
        headers: PodcastApi.HEADERS,
      },
    );

    const { pages, collection } = (await response.json()) as {
      pages: { current: number; total: number };
      collection: PodcastEpisode[];
    };

    return {
      episodes: collection,
      hasMore: pages.current < pages.total,
    };
  }
}
