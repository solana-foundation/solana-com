---
name: youtube-to-links
description: Import a YouTube video or full playlist into apps/media/content/links/ as Keystatic MDX entries. Use when the user gives a YouTube URL and asks to add it (or all videos in it) to the media app's links collection. Channel-aware: videos from the Solana Foundation channel (@SolanaFndn) get tagged automatically.
---

# YouTube → apps/media/content/links

Turn a YouTube URL into one MDX file per video under
`apps/media/content/links/`, matching the schema in
`apps/media/keystatic.config.tsx` and the formatting of existing entries like
`apps/media/content/links/catherine-gu-sdp-interview-fireblocks.mdx`.

## When to use

The user provides a YouTube URL (single video, short, or playlist) and asks to
import / add / save it to the links collection.

- `youtube.com/watch?v=…`, `youtu.be/…`, `youtube.com/shorts/…` → one MDX
- `youtube.com/playlist?list=…` → one MDX per video in the playlist

## How to use

Run the helper script. It reads `YOUTUBE_DATA_API_KEY` (or `YOUTUBE_API_KEY`)
from the environment, falling back to `apps/media/.env.local`:

```bash
python3 skills/youtube-to-links/import_youtube.py "<youtube-url>"
```

Multiple URLs are accepted and de-duped. Existing files (matched by slug) are
left untouched, so re-runs are safe.

## What gets written

Frontmatter mirrors the existing `links` schema:

```yaml
---
title: "<video title>"
url: "https://www.youtube.com/watch?v=<id>"
linkType: video
description: >
  <video title>
source: "YouTube"
publishedAt: <video publishedAt, ISO 8601 with ms>
tags: # only when channel is Solana (@SolanaFndn)
  - tag: solana-foundation
featured: false
---
<video title>
```

Fixed values (per the project owner):

- `source: "YouTube"`
- `linkType: video`
- `featured: false`
- `description` and MDX body are the video title (matches the Catherine Gu
  example). No category is added by default — fill in via Keystatic if needed.

## Channel → tag mapping

| Channel                                                       | Tag applied         |
| ------------------------------------------------------------- | ------------------- |
| Solana (`@SolanaFndn`, channel id `UC9AdQPUe4BdVJ8M9X7wxHUA`) | `solana-foundation` |

Add new mappings in `import_youtube.py` (`is_solana_foundation` /
`SOLANA_CHANNEL_*` constants) if more channels need tagging later.

## Slug

The slug matches Keystatic's behavior (lowercase, non-alphanumerics → `-`,
trimmed and truncated to 80 chars) so the filename matches what Keystatic would
have generated had the entry been authored in the CMS.

## After running

- The script prints `written` / `skipped` for each video and a final summary.
- Spot-check one of the generated files against
  `apps/media/content/links/catherine-gu-sdp-interview-fireblocks.mdx`.
- If you want categories or extra tags, add them in Keystatic — the script
  leaves both empty by default (except the channel-based tag above).
