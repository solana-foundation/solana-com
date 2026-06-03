// simple strings for the content record groups
export const RECORD_GROUPS = {
  cookbook: "cookbook",
  guides: "guides",
  docs: "docs",
  rpc: "docs/rpc",
} as const;

/**
 * the highest markdown heading size to include when generating a TOC
 *  (e.g. `3` results in "h1, h2, h3" to be displayed)
 */
export const TOC_HEADING_SIZE = 3;

/**
 * Define some common content values
 */
export const YT_PLAYLIST_CHANGELOG = "PLilwLeBwGuK5-Qri7Pg9zd-Vvhz9kX2-R";
