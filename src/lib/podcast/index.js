export default class PodcastApi {
  static HEADERS = {
    Authorization: `Bearer ${process.env.SIMPLECAST_API_KEY}`,
  };

  static async getEpisodeBySlug(slug) {
    if (!process.env.SIMPLECAST_API_KEY) {
      console.warn("SIMPLECAST_API_KEY is not set. Returning dummy data.");
      return {
        episode: {
          id: "dummy-id",
          title: "Dummy Episode",
          description: "This is a dummy episode description.",
          slug: slug,
          published_at: "2024-01-01T00:00:00Z",
          audio_file_url: "https://example.com/dummy.mp3",
          podcast: {
            href: "https://api.simplecast.com/podcasts/dummy-podcast-id",
            title: "Dummy Podcast",
            status: "published",
            image_url: "https://example.com/dummy-podcast-cover.jpg",
            id: "dummy-podcast-id",
            episodes: { count: 10 },
          },
          dashboard_link: "https://example.com/dummy-dashboard-link",
          duration: 1800,
          audio_status: "transcoded",
          audio_file: {
            url: "https://example.com/dummy.mp3",
            size: 44774820,
          },
          status: "published",
          days_since_release: 2,
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
  }) {
    if (!process.env.SIMPLECAST_API_KEY) {
      console.warn("SIMPLECAST_API_KEY is not set. Returning dummy data.");
      return {
        episodes: [
          {
            id: "dummy-episode-1",
            title: "Dummy Episode 1",
            description: "Description for dummy episode 1",
            slug: "dummy-episode-1",
            published_at: "2024-05-28T02:00:00-07:00",
            audio_file_url: "https://example.com/dummy1.mp3",
            duration: 2798,
            podcast: {
              href: "https://api.simplecast.com/podcasts/dummy-podcast-id",
              title: "Dummy Podcast",
              status: "published",
              image_url: "https://example.com/dummy-podcast-cover.jpg",
              id: "dummy-podcast-id",
              episodes: { count: 10 },
            },
          },
          {
            id: "dummy-episode-2",
            title: "Dummy Episode 2",
            description: "Description for dummy episode 2",
            slug: "dummy-episode-2",
            published_at: "2024-05-21T02:00:00-07:00",
            audio_file_url: "https://example.com/dummy2.mp3",
            duration: 2407,
            podcast: {
              href: "https://api.simplecast.com/podcasts/dummy-podcast-id",
              title: "Dummy Podcast",
              status: "published",
              image_url: "https://example.com/dummy-podcast-cover.jpg",
              id: "dummy-podcast-id",
              episodes: { count: 10 },
            },
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

    const { pages, collection } = await response.json();

    return {
      episodes: collection,
      hasMore: pages.current < pages.total,
    };
  }
}
