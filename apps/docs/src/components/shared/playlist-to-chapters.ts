import { getAllPlaylistItems } from "@@/src/lib/youtube/getYoutubePlaylist";
import type { VideoItem } from "./video-schema";

/**
 * Fetches a real YouTube playlist and maps it to the shape VideoChapterList
 * / ProjectCardGrid expect, so the playlist itself is the source of truth
 * instead of a hand-transcribed array. Requires YOUTUBE_API_KEY; mirrors
 * the fallback used on the main site's homepage (apps/web) — on any
 * failure (missing key, API error, network) this logs and returns an
 * empty list rather than failing the page build.
 */
export async function getPlaylistVideoItems(
  playlistId: string,
  limit?: number,
): Promise<VideoItem[]> {
  try {
    const items = await getAllPlaylistItems(playlistId, limit);
    return items.map((item) => ({
      title: item.snippet.title,
      href: `https://youtu.be/${item.snippet.resourceId.videoId}`,
    }));
  } catch (error) {
    console.error(`Failed to fetch YouTube playlist ${playlistId}:`, error);
    return [];
  }
}
