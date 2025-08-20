/**
 * Available resolutions in YouTube thumbnails object from largest to smallest.
 *
 * @type {string[]}
 */
const YT_THUMBNAIL_RESOLUTION_PREFERENCE = [
  "maxres",
  "standard",
  "high",
  "medium",
  "default",
];

/**
 * Loops through the list of available YouTube thumbnail resolutions
 * & returns the highest available one's URL.
 *
 * @param video
 * @returns {string|*}
 */
export const getMaximalThumbnailResolutionUrl = (video) => {
  const thumbnails = video?.snippet?.thumbnails;
  for (let resolution of YT_THUMBNAIL_RESOLUTION_PREFERENCE) {
    if (thumbnails?.[resolution]) return thumbnails[resolution].url;
  }
  return "";
};
