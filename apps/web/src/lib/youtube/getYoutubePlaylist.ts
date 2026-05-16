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
      next: { revalidate: 3600 },
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
 * Fetches videos from a playlist, handling pagination automatically
 * @param playlistId - The YouTube playlist ID
 * @param limit - Optional limit on the number of videos to fetch. If not provided, fetches all videos.
 * @returns Promise with playlist items (up to the limit if specified)
 */
async function getAllPlaylistItems(
  playlistId: string,
  limit?: number,
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

    // Calculate how many items we still need
    const remainingLimit = limit ? limit - allItems.length : undefined;

    // If we have a limit and we've reached it, stop fetching
    if (limit !== undefined && allItems.length >= limit) {
      break;
    }

    // Adjust the request limit to avoid fetching more than needed
    const requestLimit = remainingLimit
      ? Math.min(remainingLimit, 50)
      : undefined;

    const result = await getYoutubePlaylist(playlistId, {
      pageToken: nextPageToken,
      limit: requestLimit,
    });

    allItems.push(...result.items);
    nextPageToken = result.pagination.nextPageToken;
    hasMore = !!nextPageToken;

    // Stop if we've reached the requested limit
    if (limit !== undefined && allItems.length >= limit) {
      hasMore = false;
    }

    // Stop if we've fetched all available items
    if (allItems.length >= result.pagination.totalCount) {
      hasMore = false;
      allItems = allItems.slice(0, result.pagination.totalCount);
    }
  }

  // Filter out deleted/private videos and apply limit
  const filteredItems = allItems.filter(
    (item) =>
      item.snippet?.title !== "Deleted video" &&
      item.snippet?.title !== "Private video",
  );

  // Apply limit after filtering (in case some items were filtered out)
  if (limit !== undefined) {
    return filteredItems.slice(0, limit);
  }

  return filteredItems;
}

const getAllPlaylistItemsCached = cache(getAllPlaylistItems);

export { getAllPlaylistItemsCached as getAllPlaylistItems };
