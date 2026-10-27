# ECO-859: RPC directory research and source audit

Research checked 27 October 2026. This is an editorial working record, not an
endorsement or a performance comparison. Reachability was checked with an HTTP
HEAD request following redirects; a 200 response does not prove a provider's
plans, clusters, or service quality. Provider capability and listing criteria
still need content-owner review before badges are published.

## Builder jobs and baseline

The page needs to help a builder (1) pick local, public, or production access;
(2) identify official shared endpoints and their limits; (3) find a provider and
know what to verify. The checked-in `/rpc` is one Markdown block with an H1,
lengthy advice, official endpoint URLs mixed with vendor free tiers, duplicated
provider links, and no search. A browser walkthrough at 375px and 1440px found
no page-wide overflow, but the narrow view wraps endpoint strings and provider
links into a long, scan-heavy column. Keyboard visitors can reach links but
cannot narrow the list; there is no live result count or empty state. The old
copy cites obsolete `getProgramAccount`, `getSignaturesForAddress2`,
`getConfirmedBlock`, and the moved test validator guide. No analytics or builder
feedback was available; no usage claim is made.

The public [current page](https://solana.com/rpc) and source were available. The
requested Vercel preview redirected unauthenticated requests to login and could
not be visually inspected in this session. Authorized preview comparison remains
a review item. The public [home](https://solana.com/) and
[wallets directory](https://solana.com/wallets), alongside their checked-in
components, informed the page structure. Home uses large type, dark fields,
sparse green/purple accents, and distinct sections. Wallets uses a concise hero,
category choices, search, counts, reset, and card links, with mobile stacking.
The current wallets implementation uses SCSS; this branch requires Tailwind for
the RPC surface. Shared `@workspace/ui/landing` offers general sections, but the
directory needs its own accessible search and endpoint rows. A static provider
list avoids a wallet-style grid/list toggle with no comparison benefit.

## External benchmarks and guidance

| Live primary source                                                                                                | Useful pattern and job                                                                                                                        | Tradeoff / decision                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [Arbitrum RPC endpoints and providers](https://developer.arbitrum.io/arbitrum-essentials/reference/node-providers) | Separates official endpoints from third-party providers and states public endpoint limitations. Helps identify the correct starting endpoint. | Dense table is effective for reference docs but too much for an orientation page. Borrow the separation and caveat.                           |
| [ChainList](https://chainlist.org/)                                                                                | Search narrows network records; testnet choice is explicit. Helps a user find the right network.                                              | EVM wallet connection and chain IDs do not fit Solana RPC selection. Borrow search, reject wallet-connection UI.                              |
| [Alchemy RPC benchmarks](https://www.alchemy.com/benchmarks)                                                       | Region and method controls show why measured RPC performance depends on workload. Helps frame evaluation.                                     | It is vendor-operated and cannot provide neutral scores for this directory. Borrow the idea of testing from user regions; publish no ranking. |
| [WCAG 2.2](https://www.w3.org/TR/wcag/)                                                                            | Visible focus, labels, and accessible status changes help keyboard and assistive technology users use search and copy controls.               | Apply semantic controls, focus rings, and live count; avoid custom filter widgets.                                                            |

Current Solana facts: [RPC overview](https://solana.com/docs/rpc),
[cluster endpoints](https://solana.com/docs/references/clusters),
[provider selection](https://solana.com/docs/rpc/providers),
[production readiness](https://solana.com/docs/tools/production-readiness), and
[local setup](https://solana.com/docs/intro/installation/dependencies). The
current cluster docs use `https://api.mainnet.solana.com`; the old page used
`api.mainnet-beta.solana.com`. Public endpoints are rate limited and have no
production SLA. Surfpool is documented for local development. The provider guide
advises testing methods, history, load, regions, reliability, access, cost, and
fallback.

## Concepts and decision

| Concept                                                                                 | Builder-task fit                                         | Solana fit / neutrality                                   | Mobile / access                                           | Cost                  | Decision                                             |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- | --------------------- | ---------------------------------------------------- |
| A. Reference table first: endpoint matrix followed by dense provider capability columns | Good for known requirements, weaker orientation          | Neutral only if every capability is verified              | Wide columns and unknown values make 320px difficult      | High editorial upkeep | Reject for this release                              |
| B. Guided paths + official endpoint panel + alphabetical searchable provider cards      | Clear for local/public/production and provider discovery | Uses site's type/color; no ranking or unverifiable badges | Stacks into one column, labeled search, copyable URLs     | Moderate              | Selected                                             |
| C. Ambitious interactive request path with live region/latency comparison               | Could teach app → RPC → cluster and selection            | Live metrics would need neutral measurement policy        | Motion/data loading add complexity; reduced motion needed | High                  | Keep a static three-stage diagram, drop live metrics |

Concept A desktop: `hero → endpoint table → provider capability table → guide`;
mobile: `hero → endpoint cards → horizontally dense provider rows`. Concept B
desktop:
`hero + request-path diagram → three path cards → endpoint rows → search/cards → checklist`;
mobile:
`hero → stacked path cards → wrapping endpoint rows → search → single-column cards → checklist`.
Concept C desktop:
`interactive request path + region controls → benchmark map → providers`;
mobile: `stepper → metric cards → providers`. The provider discovery flow in B
is: choose production path → read provider list caveat → search a name → open
its human-facing page → consult evaluation guide. Alphabetical ordering is
deterministic and neutral.

## Task-based heuristic review and revision

No target builder or content owner was reachable in this session, so this is a
documented heuristic walkthrough rather than user testing. First pass through B
showed a likely confusion: provider cards with badges copied from the legacy
“free” and “private” groups could imply verified plans and clusters. Revision:
remove capability badges and filters until each offering has a current provider
source and editorial approval. A second confusion: an endpoint and a provider
card both looked like places to click. Revision: official endpoints occupy a
separate copyable panel; provider cards open human-facing pages. A third: the
Foundation Server Program appeared in the private provider list. Revision: keep
it out of the provider directory. The follow-up page revision removed the
delegation program section at the requester’s direction.

After revision, local task resolves at the local setup card; public task
resolves at three official URLs plus the rate-limit/no-SLA caveat; production
task resolves at searchable provider names plus the evaluation checklist and
provider guide. The revised route selector and request diagram described below
now replace the static diagram while keeping these three task outcomes and
source constraints. The implementation should be checked at 320px and desktop,
with keyboard and at least one non-English locale before release. This review
finds the paths, but cannot establish real-user success.

## Provider and source audit

Old sections use D=Devnet free list, M=Mainnet free list, P=Private list. The
old group is inventory provenance, **not** evidence of a current offering.
Unless stated otherwise, the destination is also the only current source used
for the card's name/link; no cluster, price, access model, SLA, or speed is
displayed. Checked 27 October 2026 by following redirects with `curl -L -I`.
HTTP codes can differ from browser GET responses.

| Entry                     | Old section(s) and old URL                                                   | Result and canonical human-facing destination                                                                                 | Directory decision                                      |
| ------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Alchemy                   | P `alchemy.com/solana`                                                       | 200; [Solana page](https://www.alchemy.com/solana)                                                                            | Include                                                 |
| Ankr                      | D `rpc.ankr.com/solana_devnet`; M `rpc.ankr.com/solana`; P `ankr.com`        | API URLs returned 403/404; [Solana RPC page](https://www.ankr.com/rpc/solana/) 200                                            | Include landing page                                    |
| Blockdaemon               | M `blockdaemon.com/protocols/solana`; P `blockdaemon.com/marketplace/solana` | first redirects 200 to [network page](https://www.blockdaemon.com/networks); second 404                                       | Include network page; verify Solana offering with owner |
| Chainflow                 | P `chainflow.io/contact/`                                                    | 200 [contact page](https://chainflow.io/contact/)                                                                             | Include; verify current offering                        |
| Chainstack                | D, M, P `chainstack.com/build-better-with-solana/`                           | 200 [Solana page](https://chainstack.com/build-better-with-solana/)                                                           | Include once                                            |
| Digital Energy            | P `rpc.digital-energy.io`                                                    | raw RPC URL 401; [human-facing landing](https://rpc-landing.digital-energy.io/) 200                                           | Include landing page; verify listing review             |
| Figment                   | P `datahub.figment.io/sign_up?service=solana`                                | connection failed (000)                                                                                                       | Hold for owner review; no broken card                   |
| FluxRPC                   | M, P `fluxrpc.com`                                                           | 200 [home](https://fluxrpc.com/)                                                                                              | Include once                                            |
| GenesysGo                 | P `genesysgo.com`                                                            | connection failed (000)                                                                                                       | Hold for owner review; no broken card                   |
| GetBlock                  | M, P `getblock.io/nodes/sol/`                                                | 200 [Solana page](https://getblock.io/nodes/sol/)                                                                             | Include once                                            |
| Helius                    | D, M, P `helius.dev/solana-rpc-nodes`                                        | 200 [Solana page](https://www.helius.dev/solana-rpc-nodes)                                                                    | Include once                                            |
| InstantNodes              | M, P `instantnodes.io`                                                       | redirects to unrelated `gavangtvttbdl.tv`                                                                                     | Hold for owner review; no unsafe card                   |
| NOWNodes                  | P `nownodes.io/nodes/solana-sol`                                             | 200 [Solana page](https://nownodes.io/nodes/solana-sol)                                                                       | Include                                                 |
| OrbitFlare                | D, M, P `orbitflare.com`                                                     | 200 [home](https://orbitflare.com/)                                                                                           | Include once; verify offering                           |
| Quicknode                 | D, M, P `quicknode.com/chains/sol`                                           | 200 redirect to [Solana page](https://www.quicknode.com/chains/solana); x402 docs link 200                                    | Include once, no x402 badge                             |
| Solana Vibe Station       | M, P `solanavibestation.com`                                                 | 200 [home](https://solanavibestation.com/)                                                                                    | Include once; verify offering                           |
| Syndica                   | M, P `syndica.io`                                                            | 200 [home](https://syndica.io/)                                                                                               | Include once                                            |
| Triton / RPC Pool         | P `triton.one`                                                               | 200 [home](https://triton.one/)                                                                                               | Include                                                 |
| Foundation Server Program | P `solana.org/delegation-program`                                            | 200 [program page](https://solana.org/delegation-program)                                                                     | Excluded from the redesigned page                       |
| Official Mainnet          | M `api.mainnet-beta.solana.com`                                              | old endpoint 200; [current cluster reference](https://solana.com/docs/references/clusters) documents `api.mainnet.solana.com` | Official endpoint panel                                 |
| Official Devnet           | D `api.devnet.solana.com`                                                    | 200; [cluster reference](https://solana.com/docs/references/clusters)                                                         | Official endpoint panel                                 |
| Official Testnet          | Testnet `api.testnet.solana.com`                                             | 200; [cluster reference](https://solana.com/docs/references/clusters)                                                         | Official endpoint panel                                 |

The old x402 links (`quicknode.com/docs/build-with-ai/x402-payments`,
`agents.digital-energy.io`) are ancillary product links, not provider
destinations. The first responded 200; the second 403. Neither is represented as
an offering badge.

## Maintenance and release notes

English route copy lives in `packages/i18n/messages/web/en/common.json` under
`rpc.directory`; `apps/web/src/app/[locale]/rpc/providers.ts` owns neutral URL
records. The i18n merge provides English fallback for new keys in other locales;
existing translated `rpc.content` remains in catalogs for editorial migration.
Translation owners should add `rpc.directory` keys before declaring the new
design localized. For a provider submission, check the repo's
`apps/web/CONTRIBUTING.md` criteria, verify its human-facing destination and
current Solana offering with the content owner, update the source audit, then
add a record. The sourced feature ledger below records current evidence for
filter tags. Review each source before changing tags, and treat missing tags as
unknown.

Release comparison: the new design keeps the current URL and metadata mechanism,
replaces the Markdown document with task paths, an official endpoint panel, and
a provider directory. It extends home typography and wallets search/count/reset;
the route-controlled Three.js request diagram is the RPC-specific extension.
Local Playwright walkthroughs at 320px and 1440px in English and 375px in
Spanish found a visible H1, no horizontal overflow, and no page errors. Hydrated
search reduced 15 cards to one and updated `?q=Helius`; reset restored 15.
Clipboard copying returned the Devnet URL when browser clipboard permission was
granted. The requested Vercel preview returned a login redirect in a fresh
browser context; authorized preview comparison, content-owner review of held
entries and uncertain offerings, and deployed visual QA remain for PR review.

## Design revision after reference review

The first implementation followed the old `/rpc` visual system too closely. The
current home page and `/solutions/tokenization` are the reference surfaces for
the newer system. Claude drafted the second design brief from those references,
the issue requirements, and this provider audit; implementation and source
checks were then performed in this repo. The brief chose a route switcher:
Local, Public, and Production tabs drive the hero CTA, an explanatory panel, a
route caption, and a Three.js scene.

The hero now uses the new design's black ground, Diatype heading and light
second line, white pill CTA, muted copy, hairline dividers, and a single green
accent. The active request travels from app to RPC endpoint. Local shows the app
and validator within one machine boundary; Public shows other apps sharing an
official endpoint; Production shows a provider and a separate fallback. A white
RPC-to-cluster link gives context without suggesting that an app's RPC request
is forwarded directly to the cluster. No traffic, latency, price, or quality
metrics are implied. The scene keeps one WebGL context across path changes,
renders during finite animations or pointer movement, and disposes geometry,
materials, and textures on unmount. Mobile uses an equivalent SVG, as do desktop
clients with Save-Data or unavailable WebGL; reduced-motion clients see the
route without packet animation.

The render approach follows Three.js guidance on
[screen-space line width](https://threejs.org/docs/pages/LineMaterial.html),
[rendering on demand](https://threejs.org/manual/pages/rendering-on-demand.html),
[responsive canvas sizing](https://threejs.org/manual/pages/responsive.html),
and
[disposing GPU resources](https://threejs.org/manual/pages/how-to-dispose-of-objects.html).

Official endpoints remain separate from the neutral, alphabetical 15-provider
grid. Search and path changes preserve each other's URL parameters. The
delegation program section has been removed at the requester’s direction. Copy
controls report success or failure. At 1440px and 320px the route strip, CTA,
and diagrams were checked in Chromium; the desktop test confirmed a WebGL canvas
and mobile confirmed SVG without horizontal overflow. This visual revision does
not alter provider sources or the held-entry decisions above.

## Feature evidence for directory filters

Checked 27 October 2026 against current first-party Solana product pages,
documentation, plans, and terms. All 33 distinct feature evidence URLs responded
with HTTP 200 after redirects in a HEAD check that day. A filter match means a
provider documents that capability somewhere in its offering. It does **not**
mean every plan or cluster includes it. An absent tag means no sufficiently
current, specific source was found; it does not mean the provider lacks the
capability. The published URLs in `provider-features.ts` are the source of truth
for the cards and comparison view.

| Provider            | Sourced features                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Limits and review notes                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Alchemy             | [Free plan](https://www.alchemy.com/solana), [WebSocket](https://www.alchemy.com/docs/reference/solana-subscription-api-endpoints), [Yellowstone gRPC](https://www.alchemy.com/docs/reference/yellowstone-grpc-api-overview), [Historical data](https://www.alchemy.com/blog/how-alchemy-built-the-fastest-archival-methods-on-solana), [Extended APIs](https://www.alchemy.com/docs/reference/feature-support-by-chain)                                                                                                 | Account Archive for historical account state requires a paid plan.                   |
| Ankr                | [Free plan](https://www.ankr.com/docs/whats-new/), [WebSocket](https://www.ankr.com/docs/rpc-service/pricing/)                                                                                                                                                                                                                                                                                                                                                                                                           | Solana docs describe about 16 hours of transaction history; no history tag.          |
| Blockdaemon         | [Dedicated nodes](https://www.blockdaemon.com/networks), [WebSocket](https://docs.blockdaemon.com/reference/rpc-websocket), [Historical data](https://docs.blockdaemon.com/docs/historical-data)                                                                                                                                                                                                                                                                                                                         | A free test key is not an ongoing plan; no Solana gRPC source was found.             |
| Chainflow           | None confirmed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Project-specific contact offering; no current feature claims were verified.          |
| Chainstack          | [Free plan](https://chainstack.com/build-better-with-solana/), [Dedicated nodes](https://chainstack.com/build-better-with-solana/), [WebSocket](https://chainstack.com/build-better-with-solana/), [Yellowstone gRPC](https://chainstack.com/build-better-with-solana/), [Historical data](https://chainstack.com/archive-data/)                                                                                                                                                                                         | Features vary by plan; archive is a separate product.                                |
| Digital Energy      | [Historical data](https://digital-energy.io/)                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Dedicated bare metal describes operator infrastructure, not isolated customer nodes. |
| FluxRPC             | [Free plan](https://fluxrpc.com/), [WebSocket](https://fluxrpc.com/docs), [Yellowstone gRPC](https://fluxrpc.com/docs)                                                                                                                                                                                                                                                                                                                                                                                                   | Solana history is recent-only; its Fogo history product is separate.                 |
| GetBlock            | [Free plan](https://getblock.io/nodes/sol/), [Dedicated nodes](https://getblock.io/pricing/), [WebSocket](https://getblock.io/nodes/sol/), [Yellowstone gRPC](https://getblock.io/pricing/), [Historical data](https://getblock.io/blog/getblock-dev-update-april-2025/)                                                                                                                                                                                                                                                 | Archive access is not established for its free plan.                                 |
| Helius              | [Free plan](https://www.helius.dev/pricing), [Dedicated nodes](https://www.helius.dev/pricing), [WebSocket](https://www.helius.dev/blog/laserstream-websockets), [Yellowstone gRPC](https://www.helius.dev/pricing), [Historical data](https://www.helius.dev/solana-rpc-nodes), [Extended APIs](https://www.helius.dev/solana-rpc-nodes)                                                                                                                                                                                | Streaming, archive and dedicated options vary by plan.                               |
| NOWNodes            | [WebSocket](https://nownodes.io/nodes/solana-sol), [Dedicated nodes](https://nownodes.io/nodes/solana-sol), [Free trial](https://nownodes.io/nodes/solana-sol), [Multiple regions](https://nownodes.io/nodes/solana-sol), [Published SLA](https://nownodes.io/nodes/solana-sol)                                                                                                                                                                                                                                          | Archive sources conflict; platform gRPC is not confirmed for Solana.                 |
| OrbitFlare          | [WebSocket](https://orbitflare.com/products/rpc-nodes), [Historical data](https://orbitflare.com/products/rpc-nodes), [Free plan](https://orbitflare.com/products/rpc-nodes), [Multiple regions](https://orbitflare.com/products/rpc-nodes), [Published SLA](https://orbitflare.com/products/rpc-nodes), [Yellowstone gRPC](https://orbitflare.com/products/rpc-nodes), [Dedicated nodes](https://orbitflare.com/products/dedicated-nodes), [Extended APIs](https://orbitflare.com/)                                     | SLA and gRPC availability depend on plan and cluster.                                |
| Quicknode           | [WebSocket](https://www.quicknode.com/docs/solana/api-overview), [Historical data](https://www.quicknode.com/docs/solana/api-overview), [Yellowstone gRPC](https://www.quicknode.com/docs/solana/api-overview), [Dedicated nodes](https://www.quicknode.com/chains/solana), [Published SLA](https://www.quicknode.com/chains/solana), [Free trial](https://www.quicknode.com/chains/solana), [Extended APIs](https://www.quicknode.com/docs/solana/add-ons), [Multiple regions](https://www.quicknode.com/chains/solana) | The trial is one month; gRPC, history and dedicated terms vary by plan.              |
| Solana Vibe Station | [WebSocket](https://solanavibestation.com/services), [Free plan](https://solanavibestation.com/services), [Multiple regions](https://solanavibestation.com/services), [Historical data](https://solanavibestation.com/services), [Yellowstone gRPC](https://solanavibestation.com/services), [Dedicated nodes](https://solanavibestation.com/pricing), [Extended APIs](https://solanavibestation.com/services), [Published SLA](https://solanavibestation.com/sla)                                                       | History begins at block 297,562,244; SLA terms say 99.9% monthly.                    |
| Syndica             | None confirmed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Current pages did not provide enough verifiable feature detail.                      |
| Triton / RPC Pool   | [WebSocket](https://www.triton.one/chains/solana), [Yellowstone gRPC](https://www.triton.one/chains/solana), [Dedicated nodes](https://www.triton.one/chains/solana), [Multiple regions](https://www.triton.one/chains/solana), [Historical data](https://triton.one/), [Extended APIs](https://www.triton.one/chains/solana)                                                                                                                                                                                            | Old Faithful historical gRPC is private beta; no free plan was verified.             |

Conflict checks that affect filtering:

- Ankr's Solana docs describe about 16 hours of transaction history. Its generic
  archive plan table does not establish Solana archive support, so Ankr is not
  tagged for historical data.
- FluxRPC's Solana docs say recent data only; its historical transaction and
  block product currently applies to Fogo. It is not tagged for Solana history.
- NOWNodes' archive product says Solana is coming soon while other pages imply
  archive access. It is not tagged for history pending a consistent source.
- Quicknode and NOWNodes have time-limited free offers. They are tagged as
  trials, not ongoing free plans.
- Solana Vibe Station's SLA terms set a 99.9% monthly target; its services page
  advertises 99.99%. The UI links the terms and publishes no percentage. Its
  historical range starts at block 297,562,244, so the tag does not imply full
  history from genesis.
- Syndica's current first-party pages did not expose enough product detail to
  verify feature tags. It remains listed for provider discovery with features
  marked not yet sourced.

The feature list and checked date require a content review cadence; provider
plans, API support and terms can change. The comparison view is an evidence
ledger, not a recommendation or performance ranking.

## Filter refinement

The directory groups the same nine evidence-backed feature IDs into Streaming,
Data, Access, and Reliability. Labels now say **Extended APIs** and **Dedicated
nodes**; the `?f=` feature IDs and their first-party source URLs are unchanged.
Filters intersect: a matching provider needs a published source for every
selected feature. The interface can also disclose providers without a source for
one or more selected features. Those entries remain explicitly unknown, not
unsupported. The trial filter stays separate from an ongoing free plan.

Claude reviewed the filter taxonomy and two rounds of desktop/mobile captures.
The final UI puts search, filter choices, the evidence rule, result count, and
comparison link in one sequence. Provider source notes were rewritten as
reader-facing facts, and card-chip browser tooltips were removed; the source
links and checked dates remain in the comparison table.

## Best-in-class review

A second benchmark pass on 27 October 2026 compared the page with
[ethereum.org nodes as a service](https://ethereum.org/en/developers/docs/nodes-and-clients/nodes-as-a-service/),
[Arbitrum node providers](https://docs.arbitrum.io/build-decentralized-apps/reference/node-providers),
[Base node providers](https://docs.base.org/base-chain/tools/node-providers),
[Chainlist](https://chainlist.org/), [caniuse](https://caniuse.com/), and
[Stripe's get-started paths](https://docs.stripe.com/get-started), plus Baymard
research on
[applied filters](https://baymard.com/research-articles/how-to-design-applied-filters)
and
[comparison tools](https://baymard.com/research-articles/user-friendly-comparison-tools)
and NN/g on
[comparison tables](https://www.nngroup.com/articles/comparison-tables/) and
[cards](https://www.nngroup.com/articles/cards-component/). Rankings, scores,
featured blocks, and tracked outbound links were rejected for neutrality.

Changes adopted:

- Each path lists what it is for and what to keep in mind. Public-path cautions
  quote the cluster reference.
- Endpoint rows state each cluster's documented purpose. The shared per-IP
  limits from the
  [cluster reference](https://solana.com/docs/references/clusters) sit beside
  them with the 429 / Retry-After note, followed by a copyable Devnet
  `getHealth` request (curl and `@solana/kit`) with its expected response.
- Provider cards show all nine features in fixed positions, documented or not,
  instead of only sourced chips, and drop the reviewer-facing descriptions in
  favour of the destination host. Below `md`, cards collapse to one line of
  documented features to keep the single-column list short.
- A table view (`?view=table`) shows every provider against every feature. Each
  check links to its source; a dash means no source was found.
- Filters have in-place definitions, applied-filter chips appear at every width,
  and the empty state offers per-feature removal with its resulting count.
- Comparison rows are grouped by Streaming, Data, Access, and Reliability, with
  a "Show differences only" toggle.
- The directory links to the listing criteria in `apps/web/CONTRIBUTING.md` for
  listing and correction requests.

The `nd-*` type classes in `globals.css` reset vertical margins after Tailwind
utilities, so spacing on those elements uses `!mt-*`.
