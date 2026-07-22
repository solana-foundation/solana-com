# WSOP Partnership — solana.com Delivery Plan

**Owner:** Ezra (design + build) **Requested by:** Lauren (WSOP partnership)
**Key date:** August 4, 2026 — WSOP: Solana Edition live stream. Page live by
~Aug 1.

## Phase 1 — WSOP Partnership Page (priority)

**Route:** `apps/web/src/app/[locale]/wsop/` — evergreen URL
(`solana.com/wsop`), built on the existing campaign-page pattern (`art-basel`,
`playgg`, `epoch1000`). English-only at launch.

**Page structure** (maps 1:1 to Lauren's doc):

1. **Hero — The Partnership**
   - H1: "Solana is upping the ante on the World Series of Poker" + body copy
     from doc.
2. **Solana Buy-Ins / MoonPay**
   - Benefits block (zero fees, instant, borderless, pay in SOL/USDC/USDT).
   - Numbered "how it works" steps.
   - CTAs: WSOP LIVE app store badges (App Store + Google Play), link to
     `solana.com/wallets`.
3. **WSOP: Solana Edition**
   - Event details block (Aug 4, Horseshoe Las Vegas, $100k prize pool, lineup,
     Jamie Gold hosting).
   - **Live stream hosted directly on the page** when it goes live Aug 4
     (YouTube embed); reverts to recap/VOD after.
   - Pre-event CTA: follow @Solana on X.
4. **Solana Ambassadors**
   - Bios: Jamie Gold, Michael Mizrachi, Alex Foxen, Kristen Foxen — photo + 3–4
     lines each.
   - Solana Story episodes as YouTube embeds (not direct video uploads).
5. **YouTube content carousel**
   - Powered by the Media Links engine (`apps/media/content/links`,
     `linkType: video`) — carousel of WSOP/poker video content, grows as the
     campaign produces more.
6. **Get started with Solana strip** (page footer section)
   - Wallet CTA (`solana.com/wallets`) + link to the Poker Player's Guide once
     it ships (Phase 2).

**Ongoing updates / ownership:**

- Regular WSOP campaign content flows through the news engine (media `links` +
  `posts` collections) rather than page edits — the page surfaces it via the
  carousel/feed, so routine updates need no code changes.
- Structural page changes (new campaigns, post-event recap, new ambassadors) are
  code PRs owned by Ezra.

**Build process:**

- Design handled in-house as part of the build (solana.com design system; use
  Figma-exported assets directly if campaign creative exists).
- Branch + Vercel preview URL shared with Lauren for iteration.
- QA at all breakpoints via Playwright before ship.
- Post-Aug 4: v1.1 pass — event section becomes recap, stream embed becomes VOD.

## Phase 2 — "A Poker Player's Guide to Crypto" (later)

- Ships as a **blog post** in `apps/media` (TinaCMS `posts` collection).
- Blocked on Lauren's trimmed-down draft — no action until it lands.
- On publish: link it from the partnership page's Get Started strip.

## Open questions for Lauren (blocking items marked ⛔)

1. ⛔ **Approvals:** who signs off on WSOP/Caesars marks, MoonPay co-branding,
   and ambassador names/likenesses? Is there a partner review step before
   launch?
2. ⛔ **App store links** for WSOP LIVE, and confirmation the Solana/MoonPay
   payment option is live in the app today (if not, buy-in section gets "coming
   to WSOP Paradise" framing).
3. ⛔ **Assets:** ambassador photos with usage rights, WSOP + MoonPay logos, any
   existing campaign creative (Figma/exports).
4. **Solana Story episodes:** do they exist yet / when do they land? (YouTube
   links needed for ambassador section.)
5. **Announcement timing:** any press/social moment or embargo the page must be
   live for, possibly earlier than Aug 4?
6. **Campaign calendar:** what's coming after Aug 4 (WSOP Paradise dates,
   campaigns, ambassador activations) so page sections can slot new content in.

## Timeline

| When       | What                                                                                      |
| ---------- | ----------------------------------------------------------------------------------------- |
| This week  | Lauren answers open questions; assets start flowing; route scaffolded, preview URL shared |
| ~Jul 27–31 | Build + iterate on preview with Lauren                                                    |
| ~Aug 1     | Page live at solana.com/wsop                                                              |
| Aug 4      | Live stream embedded on page                                                              |
| Aug 5+     | v1.1 recap pass; ongoing content via news engine                                          |
| Later      | Phase 2 blog post when trimmed draft arrives                                              |
