# Contributing a Podcast to Solana.com

This guide covers everything you need to get your podcast listed on
[solana.com/podcasts](https://solana.com/podcasts) — from production standards
to the technical submission process.

---

## What We're Looking For

Solana.com features podcasts that serve the Solana ecosystem with original,
well-produced content. We look for:

- **Relevance** — consistent focus on Solana, its ecosystem, builders, or
  adjacent crypto/web3 topics
- **Track record** — at least 10 published episodes with a consistent release
  cadence
- **Production quality** — clean audio, competent editing, and professional
  presentation (details below)
- **Active status** — regular new episodes, not a show that published three
  episodes and went quiet

We feature both Solana Foundation-produced shows and independent community
podcasts.

---

## Production Quality Standards

Your podcast doesn't need a studio budget, but it does need to sound like
someone cares. Listeners in 2026 have zero patience for bad audio — it's the
fastest way to lose an audience and it reflects poorly on the ecosystem.

### Audio

- **Format**: AAC (M4A/MP4) is preferred over MP3. Apple recommends AAC for
  better quality at lower bitrates. If using MP3, encode at 128kbps or higher
  for mono, 256kbps for stereo.
- **Sample rate**: 44.1kHz
- **Loudness**: Target **-16 LUFS** integrated loudness with a true peak no
  higher than **-1 dBFS**. This is Apple's standard and the safe target for
  cross-platform distribution. Spotify normalizes to -14 LUFS, but mastering to
  -16 LUFS ensures your show sounds right everywhere without clipping.
- **Noise floor**: Keep background noise below -60 dB. Use a noise gate or
  AI-powered noise removal (tools like Adobe Podcast, Descript, or Auphonic
  handle this well).
- **Room treatment**: Record in a treated or naturally dead room. Avoid reverb,
  echo, and mechanical noise (fans, HVAC). A closet full of clothes beats an
  empty conference room.
- **Microphones**: Use a dedicated microphone — USB condensers (Blue Yeti, Rode
  NT-USB) are fine for getting started; dynamic mics (Shure SM7B, Rode PodMic)
  are better for untreated rooms. Do not use laptop mics, AirPods, or phone
  speakers.
- **Remote guests**: Ask guests to use headphones and a decent mic. If their
  audio is unusable, consider recording locally on their end (tools like
  Riverside, SquadCast, or Zencastr record each participant locally) and syncing
  in post.

### Editing

- Remove long silences, false starts, and filler where it improves flow — but
  don't over-edit into something robotic
- Level-match all speakers so nobody is dramatically louder or quieter
- Add a brief intro/outro for brand consistency
- If you use music or sound effects, keep them tasteful and properly licensed

### Video (Optional but Recommended)

Video podcasting is now standard practice. If you record video:

- **Resolution**: 1080p minimum, 4K preferred
- **Framing**: Head and shoulders, good lighting, clean background
- **Platform**: Publish to YouTube as a podcast (YouTube supports RSS-ingested
  podcast episodes natively)

---

## Distribution & RSS

Your podcast **must have a public RSS feed**. This is non-negotiable — it's how
episodes appear on solana.com.

### How RSS Works

Your podcast host generates an RSS feed URL. Every time you publish an episode,
the host updates the feed. Solana.com reads this feed to pull in your episode
metadata, audio URLs, descriptions, and artwork automatically.

### Recommended Hosting Platforms

Use a dedicated podcast host — don't self-host your RSS feed. These platforms
handle storage, bandwidth, analytics, and automatic distribution to all major
directories:

| Platform                 | Tier       | Notes                                                              |
| ------------------------ | ---------- | ------------------------------------------------------------------ |
| **Transistor**           | Paid       | Clean analytics, multi-show support, used by many Solana podcasts  |
| **Buzzsprout**           | Free/Paid  | Beginner-friendly, strong guided setup                             |
| **RSS.com**              | Free/Paid  | Unlimited episodes on free tier, audio-to-video YouTube conversion |
| **Megaphone**            | Enterprise | For larger operations, advanced ad insertion                       |
| **Spotify for Creators** | Free       | Unlimited uploads, but limited analytics and portability           |
| **Simplecast**           | Paid       | Advanced analytics, enterprise features                            |
| **Podbean**              | Free/Paid  | Built-in listener community, solid free tier                       |

### Directory Submissions

Submit your RSS feed to all major directories. Your hosting platform usually
automates this, but verify you're listed on:

- **Apple Podcasts** — the largest directory; submit via
  [Apple Podcasts Connect](https://podcasters.apple.com)
- **Spotify** — submit via [Spotify for Creators](https://creators.spotify.com)
  (or automatic if hosting there)
- **YouTube Music** — submit via [YouTube Studio](https://studio.youtube.com)
  podcast settings
- **Amazon Music / Audible** — submit via
  [Amazon Music for Podcasters](https://podcasters.amazon.com)
- **Pocket Casts, Overcast, Castro** — these index from Apple Podcasts
  automatically

The more directories you're in, the better. At minimum, we expect Apple Podcasts
and Spotify listings with valid URLs.

### RSS Feed Requirements

Your feed must include:

- `<itunes:image>` — show artwork (see artwork specs below)
- `<itunes:author>` — host or publisher name
- `<itunes:category>` — relevant category (typically "Technology")
- Per-episode: `<enclosure>` with audio URL, `<itunes:duration>`, `<pubDate>`,
  and `<description>` or `<content:encoded>`

---

## Artwork

### Show Cover Art

- **Dimensions**: 3000 x 3000 pixels (square, 1:1 aspect ratio)
- **Format**: JPEG or PNG
- **Color space**: RGB (not CMYK)
- **File size**: Under 512KB
- **Resolution**: 72 DPI
- **Design considerations**:
  - Must be legible at 55px thumbnail size (how it appears in most podcast apps)
  - Avoid small text, fine details, or thin lines that disappear at small sizes
  - Test against both light and dark backgrounds — over 80% of users are on dark
    mode
  - Do not include episode numbers on show-level artwork
  - Do not use Apple's podcast icon or any trademarked app icons

For the solana.com listing, we'll resize your cover art to 600x600 for display.
Submit the full 3000x3000 source file.

### Episode Art (Optional)

If your episodes have individual artwork, the same specs apply. Episode art
overrides show art in most podcast apps and can help episodes stand out in
feeds.

---

## Submission Checklist

When you're ready to submit, you'll need to provide:

### Required

- [ ] **Podcast name**
- [ ] **Description** — 1-2 paragraphs describing the show, its focus, and who
      it's for
- [ ] **Cover art** — 3000x3000 JPEG or PNG (we'll resize for the site)
- [ ] **RSS feed URL** — a publicly accessible RSS feed with valid episodes
- [ ] **Spotify URL** — e.g., `https://open.spotify.com/show/...`
- [ ] **Apple Podcasts URL** — e.g., `https://podcasts.apple.com/...`
- [ ] **Category** — one of: `community`, `ecosystem`, `developers`, `defi`,
      `payments`, `consumer`, `finance`, `institutions`, `upgrades`
- [ ] **Host name(s)** — display names for each host
- [ ] **Host avatar(s)** — square photo per host, at least 200x200
- [ ] **Host Twitter/X URL(s)** — public profile link per host
- [ ] **Release frequency** — e.g., Weekly, Bi-weekly, Monthly

### Optional

- [ ] **YouTube URL** — channel or playlist URL
- [ ] **Host bio(s)** — 1-2 sentences per host

---

## How It Works on solana.com

Once your podcast is added:

1. **Episodes are pulled automatically** from your RSS feed every 30 minutes
2. **Episode audio plays directly** on solana.com via a built-in player — no
   redirect required
3. **Subscribe buttons** link out to your Apple Podcasts, Spotify, YouTube, and
   RSS feed
4. **Your show appears** on the [/podcasts](https://solana.com/podcasts) listing
   page with cover art, description, host info, and episode count
5. **Each episode gets its own page** with full description, playback, and
   sharing metadata

You don't need to do anything after the initial setup. New episodes show up
automatically as long as your RSS feed is active.

---

## Submitting

Open an issue or pull request on the
[solana-com repository](https://github.com/solana-foundation/solana-com) with
the materials from the checklist above. If you're comfortable with the codebase,
you can submit a PR directly — see the technical details below.

### File Structure

A podcast submission consists of:

```
apps/media/
├── content/
│   ├── podcasts/
│   │   └── your-podcast-slug.mdx        # Podcast metadata + description
│   └── authors/
│       └── host-name.mdx                # One per host
└── public/
    └── uploads/
        ├── podcasts/
        │   └── your-podcast-slug/
        │       └── cover.jpg             # 600x600 cover (resized from 3000x3000)
        └── authors/
            └── host-name.jpg             # Host avatar
```

### Podcast File Format

```mdx
---
title: Your Podcast Name
coverImage: /uploads/podcasts/your-podcast-slug/cover.jpg
status: active
category: ecosystem
featured: false
displayOrder: 99
hosts:
  - host: host-slug
spotifyUrl: "https://open.spotify.com/show/..."
applePodcastsUrl: "https://podcasts.apple.com/us/podcast/..."
youtubeUrl: "https://www.youtube.com/@..."
rssFeedUrl: "https://feeds.example.com/your-show"
releaseFrequency: Weekly
firstEpisodeDate: "2025-01-01"
---

Your podcast description here. This supports **bold**, _italic_, and
[links](https://example.com).
```

### Author File Format

```mdx
---
name: Host Name
avatar: /uploads/authors/host-name.jpg
twitterUrl: https://x.com/handle
---

A brief bio of the host and their connection to the Solana ecosystem.
```

---

## Questions?

Reach out via a GitHub issue on the
[solana-com repository](https://github.com/solana-foundation/solana-com).
