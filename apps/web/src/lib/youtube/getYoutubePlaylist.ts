import { cache } from "react";
import {
  GetPlaylistOptions,
  YouTubePlaylistItem,
  YouTubePlaylistResponse,
  YoutubePlaylistData,
} from "./types";

/**
 * Fetches playlist data from YouTube Data API v3
 * @param playlistId - The YouTube playlist ID (e.g., "PLrAXtmRdnEQy6nKXYTKxEOENtctrCACVt")
 * @param options - Optional configuration
 * @returns Promise with playlist data including videos
 */
async function getYoutubePlaylist(
  playlistId: string,
  options: GetPlaylistOptions = {},
): Promise<YoutubePlaylistData> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Youtube API Key is required. Get one from https://console.cloud.google.com/apis/credentials",
    );
  }

  if (!playlistId) {
    throw new Error("Playlist ID is required");
  }

  const {
    limit = Math.min(options.limit ?? 50, 50),
    pageToken,
    part = ["snippet", "contentDetails"],
  } = options;

  // Build the API URL
  const baseUrl = "https://www.googleapis.com/youtube/v3/playlistItems";
  const params = new URLSearchParams({
    part: part.join(","),
    playlistId,
    maxResults: limit.toString(),
    key: apiKey,
  });

  if (pageToken) {
    params.append("pageToken", pageToken);
  }

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `YouTube API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ""}`,
      );
    }

    const data = (await response.json()) as YouTubePlaylistResponse;

    return {
      items: data.items || [],
      pagination: {
        totalPages: Math.ceil(data.pageInfo.totalResults / limit),
        totalCount: data.pageInfo.totalResults,
        nextPageToken: data.nextPageToken,
        prevPageToken: data.prevPageToken,
      },
    };
  } catch (error) {
    console.error("Error fetching YouTube playlist:", error);
    throw error;
  }
}

/**
 * Fetches all videos from a playlist, handling pagination automatically
 * @param playlistId - The YouTube playlist ID
 * @param options - Optional configuration
 * @returns Promise with all playlist items
 */
async function getAllPlaylistItems(
  playlistId: string,
): Promise<YouTubePlaylistItem[]> {
  let allItems: YouTubePlaylistItem[] = [];
  let nextPageToken: string | undefined = undefined;
  let hasMore = true;
  let iterationCount = 0;
  const MAX_ITERATIONS = 100; // Safety limit (50 items/page * 100 = 5000 max items)

  while (hasMore) {
    if (++iterationCount > MAX_ITERATIONS) {
      console.warn(
        `Reached maximum iteration limit (${MAX_ITERATIONS}) for playlist ${playlistId}`,
      );
      break;
    }

    const result = await getYoutubePlaylist(playlistId, {
      pageToken: nextPageToken,
    });

    allItems.push(...result.items);
    nextPageToken = result.pagination.nextPageToken;
    hasMore = !!nextPageToken;

    if (allItems.length >= result.pagination.totalCount) {
      hasMore = false;
      allItems = allItems.slice(0, result.pagination.totalCount);
    }
  }

  return allItems.filter(
    (item) =>
      item.snippet?.title !== "Deleted video" &&
      item.snippet?.title !== "Private video",
  );
}

const getAllPlaylistItemsCached = cache(getAllPlaylistItems);

export { getAllPlaylistItemsCached as getAllPlaylistItems };
