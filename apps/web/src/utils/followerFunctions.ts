import * as cheerio from "cheerio";
import cachedFetch from "node-fetch-cache";
import { unstable_cache } from "next/cache";

const ytBaseURL = "https://www.googleapis.com/youtube/v3/";

const scrapeUrlForTag = async (url: string, tagName: string) => {
  const siteData = await cachedFetch(url)
    .then((res) => res.text())
    .catch((err) => {
      console.log(err);
    });

  if (siteData) {
    const $ = cheerio.load(siteData, null, false);
    const result = $(tagName);
    return result;
  }
  return "";
};

// Cache only validated counts; a failed refresh must not replace a good value.
const scrapeMeetupMemberCount = unstable_cache(
  async (): Promise<number> => {
    const response = await fetch("https://www.meetup.com/topics/solana/", {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      throw new Error(`Meetup returned ${response.status}`);
    }

    const $ = cheerio.load(await response.text());
    const pageData = $("script#__NEXT_DATA__").text();
    if (!pageData) throw new Error("Meetup topic data was not found");

    const data = JSON.parse(pageData) as {
      props?: {
        pageProps?: {
          country?: string;
          topic?: {
            urlkey?: string;
            countryStats?: { memberCount?: unknown };
          };
        };
      };
    };
    const pageProps = data?.props?.pageProps;
    if (pageProps?.country !== "" || pageProps.topic?.urlkey !== "solana") {
      throw new Error("Meetup topic or worldwide scope did not match");
    }
    const count = pageProps.topic.countryStats?.memberCount;
    if (
      typeof count !== "number" ||
      !Number.isSafeInteger(count) ||
      count < 0
    ) {
      throw new Error("Meetup member count was invalid");
    }
    return count;
  },
  ["meetup-solana-member-count-v1"],
  { revalidate: 3600 },
);

const getYoutubeSubscriberCount = async (): Promise<number> => {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  try {
    const response = await fetch(
      `${ytBaseURL}channels?part=statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } } as RequestInit,
    );

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      items?: Array<{ statistics?: { subscriberCount?: string } }>;
    };

    if (data.items && data.items.length > 0) {
      return parseInt(data.items[0].statistics?.subscriberCount ?? "0", 10);
    }

    throw new Error("Channel statistics not found");
  } catch (error) {
    console.error(
      "Error getting subscriber count:",
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
};

const getStableCoins = async (): Promise<number> => {
  const url = "https://api.circle.com/v1/stablecoins";
  const options: RequestInit = {
    method: "GET",
    headers: { Accept: "application/json" },
  };

  try {
    const jsonData = await cachedFetch(url, options);
    const stableCoins = (await jsonData.json()) as {
      data: Array<{ chains: Array<{ chain: string; amount: number }> }>;
    };
    const chainData = stableCoins.data[0].chains;
    let solAmount = 0;
    for (const chain of chainData) {
      if (chain.chain === "SOL") {
        solAmount = chain.amount;
        break;
      }
    }
    return solAmount;
  } catch (err) {
    throw new Error(`Request failed: ${err}`);
  }
};

const getGHStargazers = async (): Promise<number> => {
  const res = await cachedFetch(
    "https://api.github.com/repos/solana-foundation/solana-com",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );
  const jsonData = (await res.json()) as { stargazers_count?: number };
  return jsonData?.stargazers_count || 0;
};

export type YTVideoItem = {
  id?: string;
  snippet: {
    thumbnails: Record<string, { url: string } | undefined>;
    title: string;
    description?: string;
    playlistId?: string;
    resourceId?: { videoId?: string };
  };
  contentDetails: { videoId: string };
};

const getYTVideos = async (
  maxVideos = 50,
  playlistId?: string,
  channelId = process.env.YOUTUBE_CHANNEL_ID,
): Promise<YTVideoItem[]> => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY is not set. Returning dummy data.");
    return [
      {
        snippet: {
          title: "Solana Changelog",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin iaculis libero et quam egestas, et molestie neque dignissim.",
          playlistId: "PLilwLeBwGuK5-Qri7Pg9zd-Vvhz9kX2-R",
          resourceId: {
            videoId: "UQy6nDI1RlU",
          },
          thumbnails: {},
        },
        contentDetails: {
          videoId: "UQy6nDI1RlU",
        },
      },
    ];
  }

  const pageSize = Math.min(50, maxVideos);
  const videos: YTVideoItem[] = [];
  let videoResp: Response | undefined;

  // Playlist videos
  if (playlistId) {
    videoResp = await fetch(
      `${ytBaseURL}playlistItems?part=snippet%2CcontentDetails%2Cstatus&maxResults=${pageSize}&playlistId=${playlistId}&key=${apiKey}`,
      { next: { revalidate: 3600 } } as RequestInit,
    );
    // Channel videos
  } else {
    const channelResp = await fetch(
      `${ytBaseURL}channels?part=contentDetails&id=${channelId}&key=${apiKey}`,
      { next: { revalidate: 3600 } } as RequestInit,
    );

    const channelData = (await channelResp.json()) as {
      items?: Array<{
        contentDetails?: { relatedPlaylists?: { uploads?: string } };
      }>;
    };

    if (channelData) {
      const uploadsId =
        channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

      videoResp = await fetch(
        `${ytBaseURL}playlistItems?part=snippet%2CcontentDetails%2Cstatus&maxResults=${pageSize}&playlistId=${uploadsId}&key=${apiKey}`,
        { next: { revalidate: 3600 } } as RequestInit,
      );
    }
  }

  if (!videoResp) return videos;

  const videosData = (await videoResp.json()) as {
    error?: { message: string };
    items?: YTVideoItem[];
  };

  if (!videosData.error) {
    // No thumbnails usually means the video has been deleted from a list
    videos.push(
      ...(videosData?.items?.filter(
        (item) => Object.keys(item.snippet.thumbnails).length,
      ) || []),
    );
  } else {
    console.error(videosData.error.message);
  }

  return videos;
};

export {
  scrapeUrlForTag,
  scrapeMeetupMemberCount,
  getYoutubeSubscriberCount,
  getStableCoins,
  getGHStargazers,
  getYTVideos,
};
