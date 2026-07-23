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
   - H1: Solana is upping the ante on the World Series of Poker
   - Body:

     The skills that make a great poker player are the skills that make a great
     trader. Reading the situation, sizing your bets, holding your nerve under
     pressure. Solana already leads crypto by giving traders the fastest,
     cheapest, most reliable way to move money. Now that same edge comes to
     poker.

     Poker tournament buy-ins started as cash at the cage. Then came slow,
     expensive wire transfers and high-interest credit card advances. The next
     step is free, borderless, instant: digital buy-ins and payouts, powered by
     Solana.

     No more customs declarations at the border. No more security escort to your
     car after a big session. No more refreshing your bank app for days waiting
     on a wire. At WSOP Paradise in the Bahamas, Solana is the fastest, cleanest
     way to get money in and out of play.

2. **Solana Buy-Ins / MoonPay**
   - H2: Fast and frictionless crypto buy-ins, powered by Solana and MoonPay
   - Lead-in: This summer in Las Vegas, WSOP players bought into tournaments
     with crypto for the first time, in seconds, through the WSOP LIVE app.
   - Benefits block:
     - Zero fees
     - Instant confirmation
     - Borderless
     - Straight from your crypto wallet: pay in SOL, USDC, or USDT
   - Next: crypto buy-ins and payouts come to WSOP Paradise in the Bahamas this
     December.
   - The Vegas buy-in window is closed. Treat the Vegas experience as a
     completed, real-world Solana use case; do not present the app links or
     payment flow as an active way to buy into the Vegas tournament.
   - WSOP LIVE reference links:
     - [App Store](https://apps.apple.com/us/app/wsop-live-wsop-official-app/id1660727059)
     - [Google Play](https://play.google.com/store/apps/details?id=com.nsus.wsopplus&hl=en)
3. **WSOP: Solana Edition**
   - H2: Crypto hits poker’s biggest stage for one night only
   - Lead-in: WSOP: Solana Edition (WSOP-S) is a live-streamed invitational
     poker tournament bringing some of crypto's biggest personalities to the
     bright lights of the WSOP feature table in Las Vegas, the same felt where
     champions are crowned.
   - Details block:
     - When: August 4th
     - Where: The WSOP feature table, Horseshoe Las Vegas
     - Watch: @Solana on X
     - Prize: $100,000 prize pool, plus a custom Solana WSOP bracelet for the
       winner
     - Featuring: Ansem, Banks, WendyO, Rasmr, MinhxDynasty, AshleyDCan,
       Solomon, Bangerz
     - Hosted by: 2006 WSOP Main Event Champion Jamie Gold
   - CTA: Follow @Solana on X for the full lineup and to watch the stream live.
4. **Solana Ambassadors**
   - H2: Introducing Solana’s Poker Ambassadors
   - Lead-in: Some of poker’s biggest names will represent Solana at the WSOP
     and beyond.
   - Each player treatment includes their name, photo, 3–4 lines of biography,
     and either a click-out to their Solana Story episode on YouTube or a direct
     upload of the video file on the page.
   - Jamie Gold: Winner of the 2006 WSOP Main Event, the largest in history at
     the time, for a record $12 million. Gold is one of poker's biggest
     personalities, and one of the defining figures of the WSOP's original ESPN
     era.
   - Michael Mizrachi: “The Grinder” is the 2025 WSOP Main Event champion,
     taking down the title for $10 million. He holds nine WSOP bracelets,
     including a record four victories in the $50,000 Poker Players
     Championship. In 2025 he was inducted into the Poker Hall of Fame, and his
     career earnings exceed $30 million.
   - Alex Foxen: One of the most dominant high-roller players of the modern era.
     Foxen has four WSOP bracelets and more than $58 million in live earnings,
     good for tenth on poker's all-time money list. He is the only player ever
     to win back-to-back Global Poker Index Player of the Year awards, in 2018
     and 2019.
   - Kristen Foxen: The most decorated woman in WSOP history, with six bracelets
     to her name. Foxen is also number one on the women’s all-time money list,
     with close to $20 million in live earnings, and a five-time GPI Female
     Player of the Year.
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
- Existing campaign assets are limited to basics such as OOH and itineraries.
  Use the
  [WSOP × Solana boards in the Foundation Design Library](https://www.figma.com/design/JbQD7idZT8gWScIuzwgUgc/Foundation-Design-Library--FKA--Self-Serve-Library---Shared-?node-id=8631-2&t=Ak4eXm7P2WzXnAen-1)
  as the starting point. WSOP brand guidelines have also been supplied and allow
  flexibility for creating logo lockups.
- Lauren and Niran provide final approval for WSOP/Caesars and MoonPay branding.
  No separate WSOP partner review is required.
- Branch + Vercel preview URL shared with Lauren for iteration.
- QA at all breakpoints via Playwright before ship.
- Post-Aug 4: v1.1 pass — event section becomes a recap with a link to the VOD.

## Phase 2 — "A Poker Player's Guide to Crypto" (later)

- Ships as a **blog post** in `apps/media` (TinaCMS `posts` collection).
- Blocked on Lauren's trimmed-down draft — no action until it lands.
- On publish: link it from the partnership page's Get Started strip.

## Inputs and dependencies

- **Vegas buy-ins — resolved:** Vegas tournament buy-ins are closed. Section 2
  documents the completed use case and points forward to WSOP Paradise in the
  Bahamas in December.
- **App links — received:** App Store and Google Play links are documented
  above, but must not imply that Vegas buy-ins remain available.
- **Brand approval — resolved:** Lauren and Niran can approve WSOP/Caesars and
  MoonPay branding. WSOP does not require a separate review.
- **Campaign creative — received:** basic campaign work is available in the
  linked Figma file, and WSOP brand guidelines have been supplied.
- ⛔ **Player and ambassador photos — pending:** Lauren is sourcing photos with
  usage rights.
- **MoonPay logo asset — pending confirmation:** Lauren's response did not
  identify a supplied MoonPay logo file; confirm the approved source before
  building the co-branded lockup.
- **Solana Story episodes — post-launch:** recording is scheduled for July 30–31
  in Las Vegas. Launch dates and episode links are not set, so build the
  ambassador section to accept the videos after the initial page launch.
- **Announcement timing — resolved:** no embargo. Player reveal videos are the
  first major channel announcement on August 3, followed by the game on
  August 4.
- **Post-event campaign calendar — pending:** Lauren will provide the plan for
  activity after August 4.

## Timeline

| When       | What                                                                                   |
| ---------- | -------------------------------------------------------------------------------------- |
| This week  | Route scaffolded; Figma and brand assets incorporated; preview URL shared              |
| ~Jul 27–31 | Build + iterate on preview with Lauren                                                 |
| Jul 30–31  | Solana Story episodes recorded in Las Vegas; publish dates to follow                   |
| ~Aug 1     | Page live at solana.com/wsop                                                           |
| Aug 3      | Player reveal videos; first major announcement on Solana channels                      |
| Aug 4      | WSOP-S live stream promoted via @Solana on X                                           |
| Aug 5+     | v1.1 recap pass; add Solana Story episodes when ready; ongoing content via news engine |
| Later      | Phase 2 blog post when trimmed draft arrives                                           |
