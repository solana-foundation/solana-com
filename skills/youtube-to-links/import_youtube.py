#!/usr/bin/env python3
"""
Import a YouTube video or playlist into apps/media/content/links as MDX files.

Usage:
    python3 import_youtube.py <youtube-url> [<youtube-url> ...]

URL shapes accepted:
    https://www.youtube.com/watch?v=VIDEO_ID            -> single video
    https://youtu.be/VIDEO_ID                           -> single video
    https://www.youtube.com/watch?v=VIDEO_ID&list=...   -> single video (the v param wins)
    https://www.youtube.com/playlist?list=PLAYLIST_ID   -> every video in the playlist

Environment:
    YOUTUBE_DATA_API_KEY (or YOUTUBE_API_KEY) must be set. The script will try to
    auto-load apps/media/.env.local from the repo root if neither is exported.

Output:
    One .mdx file per video in apps/media/content/links/.
    Existing files (matched by slug) are skipped — re-run safely.
"""
from __future__ import annotations

import json
import os
import re
import sys
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
LINKS_DIR = REPO_ROOT / "apps" / "media" / "content" / "links"
MEDIA_ENV = REPO_ROOT / "apps" / "media" / ".env.local"

SOLANA_CHANNEL_ID = "UC9AdQPUe4BdVJ8M9X7wxHUA"  # @SolanaFndn
SOLANA_CHANNEL_TITLES = {"Solana"}


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def get_api_key() -> str:
    key = os.environ.get("YOUTUBE_DATA_API_KEY") or os.environ.get("YOUTUBE_API_KEY")
    if not key:
        load_env_file(MEDIA_ENV)
        key = os.environ.get("YOUTUBE_DATA_API_KEY") or os.environ.get("YOUTUBE_API_KEY")
    if not key:
        sys.stderr.write(
            "YOUTUBE_DATA_API_KEY (or YOUTUBE_API_KEY) must be set. "
            f"Checked env and {MEDIA_ENV}.\n"
        )
        sys.exit(1)
    return key


def api_get(path: str, **params: str) -> dict:
    params["key"] = get_api_key()
    url = f"https://www.googleapis.com/youtube/v3/{path}?{urllib.parse.urlencode(params)}"
    try:
        with urllib.request.urlopen(url) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        sys.stderr.write(f"YouTube API error: {e.code} {e.reason}\n{e.read().decode()}\n")
        sys.exit(1)


def parse_url(url: str) -> tuple[str, str]:
    """Return ('video', video_id) or ('playlist', playlist_id)."""
    parsed = urllib.parse.urlparse(url)
    host = parsed.netloc.lower()
    qs = urllib.parse.parse_qs(parsed.query)

    if host.endswith("youtu.be"):
        vid = parsed.path.lstrip("/")
        if vid:
            return ("video", vid)

    if "youtube.com" in host or "youtube-nocookie.com" in host:
        if parsed.path == "/playlist" and "list" in qs:
            return ("playlist", qs["list"][0])
        if "v" in qs:
            return ("video", qs["v"][0])
        if parsed.path.startswith("/shorts/"):
            return ("video", parsed.path.split("/")[2])
        if parsed.path.startswith("/embed/"):
            return ("video", parsed.path.split("/")[2])

    sys.stderr.write(f"Could not extract video or playlist id from URL: {url}\n")
    sys.exit(1)


def fetch_playlist_video_ids(playlist_id: str) -> list[str]:
    ids: list[str] = []
    page_token = ""
    while True:
        params = {"part": "contentDetails", "maxResults": "50", "playlistId": playlist_id}
        if page_token:
            params["pageToken"] = page_token
        data = api_get("playlistItems", **params)
        for item in data.get("items", []):
            vid = item.get("contentDetails", {}).get("videoId")
            if vid:
                ids.append(vid)
        page_token = data.get("nextPageToken") or ""
        if not page_token:
            break
    return ids


def fetch_videos(video_ids: list[str]) -> list[dict]:
    out: list[dict] = []
    for i in range(0, len(video_ids), 50):
        chunk = video_ids[i : i + 50]
        data = api_get("videos", part="snippet", id=",".join(chunk))
        out.extend(data.get("items", []))
    return out


def slugify(title: str, max_len: int = 80) -> str:
    """Slug matching the Keystatic style used elsewhere in content/links/."""
    s = unicodedata.normalize("NFKD", title)
    s = s.encode("ascii", "ignore").decode("ascii")
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = s.strip("-")
    if len(s) > max_len:
        s = s[:max_len].rstrip("-")
    return s


def is_solana_foundation(snippet: dict) -> bool:
    return (
        snippet.get("channelId") == SOLANA_CHANNEL_ID
        or snippet.get("channelTitle") in SOLANA_CHANNEL_TITLES
    )


def render_mdx(video: dict) -> str:
    snippet = video["snippet"]
    video_id = video["id"]
    title = snippet["title"]
    url = f"https://www.youtube.com/watch?v={video_id}"
    published = snippet.get("publishedAt", "")  # e.g. 2026-05-11T10:59:33Z
    # Keystatic stores datetimes with millisecond precision.
    if published.endswith("Z") and "." not in published:
        published = published[:-1] + ".000Z"

    lines = ["---"]
    lines.append(f'title: "{escape_yaml_dq(title)}"')
    lines.append(f'url: "{url}"')
    lines.append("linkType: video")
    lines.append("description: >")
    lines.append(f"  {title}")
    lines.append('source: "YouTube"')
    lines.append(f"publishedAt: {published}")
    if is_solana_foundation(snippet):
        lines.append("tags:")
        lines.append("  - tag: solana-foundation")
    lines.append("featured: false")
    lines.append("---")
    lines.append("")
    lines.append(title)
    lines.append("")
    return "\n".join(lines)


def escape_yaml_dq(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def write_video(video: dict) -> tuple[Path, str]:
    title = video["snippet"]["title"]
    slug = slugify(title)
    target = LINKS_DIR / f"{slug}.mdx"
    if target.exists():
        return target, "skipped"
    target.write_text(render_mdx(video))
    return target, "written"


def main() -> None:
    if len(sys.argv) < 2:
        sys.stderr.write(__doc__ or "")
        sys.exit(2)

    LINKS_DIR.mkdir(parents=True, exist_ok=True)

    video_ids: list[str] = []
    for url in sys.argv[1:]:
        kind, ident = parse_url(url)
        if kind == "video":
            video_ids.append(ident)
        else:
            video_ids.extend(fetch_playlist_video_ids(ident))

    # de-dupe while preserving order
    seen: set[str] = set()
    deduped = [v for v in video_ids if not (v in seen or seen.add(v))]

    videos = fetch_videos(deduped)
    print(f"Fetched {len(videos)} video(s)")
    written = skipped = 0
    for v in videos:
        path, status = write_video(v)
        rel = path.relative_to(REPO_ROOT)
        print(f"  {status}: {rel}")
        written += status == "written"
        skipped += status == "skipped"
    print(f"Done. {written} written, {skipped} skipped.")


if __name__ == "__main__":
    main()
