type YTThumbnail = { url: string };
type YTVideo = {
  snippet?: {
    thumbnails?: Record<string, YTThumbnail | undefined>;
    [key: string]: unknown;
  };
};

/**
 * Available resolutions in YouTube thumbnails object from largest to smallest.
 */
const YT_THUMBNAIL_RESOLUTION_PREFERENCE = [
  "maxres",
  "standard",
  "high",
  "medium",
  "default",
] as const;

/**
 * Loops through the list of available YouTube thumbnail resolutions
 * & returns the highest available one's URL.
 *
 * @param video
 * @returns {string}
 */
export const getMaximalThumbnailResolutionUrl = (video: YTVideo): string => {
  const thumbnails = video?.snippet?.thumbnails;
  for (const resolution of YT_THUMBNAIL_RESOLUTION_PREFERENCE) {
    if (thumbnails?.[resolution]) return thumbnails[resolution]!.url;
  }
  return "";
};
