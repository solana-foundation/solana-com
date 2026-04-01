# FAB Menu Redesign — Implementation Spec

## Design Concept: "Dark Observatory"

Opening the FAB feels like accessing mission control for the Solana ecosystem.
Deep black surfaces, Solana gradient accents as luminous highlights, monospace
stat readouts, glass-morphism depth. Institutional credibility meets developer
energy.

## Visual Design Decisions

### What changed from current

| Aspect           | Before                         | After                                     |
| ---------------- | ------------------------------ | ----------------------------------------- |
| Title            | "Get Started"                  | "Explore Solana"                          |
| Tabs             | Institution / User / Developer | Builder / Business / Consumer             |
| Tab style        | Large cards (full-width grid)  | Compact pill segment control              |
| Links per tab    | 4 numbered links               | 6 links in 2-column grid with icons       |
| Featured content | None                           | Hero card with CTA + stat callout per tab |
| Search           | None                           | Mini search bar at top                    |
| Promo            | None                           | API-driven promo banner at bottom         |
| Panel max-width  | 1280px                         | 900px (tighter, more panel-like)          |
| Panel bg         | Transparent (overlay only)     | Solid #0a0a0f with 1px gradient top edge  |
| Link style       | Numbered badges + text         | Icon + text + hover arrow (2-col grid)    |
| Close button     | Circle in overlay corner       | Inline square in panel header             |
| Footer           | None                           | "Powered by Solana" + links               |
| Stat callout     | None                           | Gradient monospace number per tab         |
| Section divider  | None                           | Monospace label + line                    |

### Design tokens

```
--sfab-bg:              #0a0a0f    (near-black, not pure black)
--sfab-surface:         rgba(255, 255, 255, 0.03)
--sfab-surface-hover:   rgba(255, 255, 255, 0.06)
--sfab-border:          rgba(255, 255, 255, 0.06)
--sfab-border-hover:    rgba(255, 255, 255, 0.12)
--sfab-text-primary:    #f0f0f2
--sfab-text-secondary:  rgba(255, 255, 255, 0.5)
--sfab-text-tertiary:   rgba(255, 255, 255, 0.3)
--sfab-accent-purple:   #9945FF
--sfab-accent-green:    #14F195
--sfab-accent-cyan:     #00C2FF
```

## New Data Types

```typescript
// Tab icons expanded
type TabIcon = "builder" | "business" | "consumer";

interface TabData {
  id: string;
  title: string;
  icon: TabIcon;
}

interface LinkData {
  title: string;
  href: string;
  icon?: string; // Icon key (resolved client-side from built-in set)
}

interface FeaturedData {
  label: string; // e.g. "Quick Start", "Network Dominance"
  title: string; // e.g. "Start building on Solana"
  ctaText: string; // e.g. "Quick Start Guide"
  ctaHref: string;
}

interface StatData {
  value: string; // e.g. "$12B+"
  label: string; // e.g. "Stablecoin supply"
}

interface PromoData {
  badge: string; // e.g. "Event"
  text: string; // e.g. "Solana Accelerate — Join the global builder summit"
  href: string;
}

interface MenuData {
  title: string; // "Explore Solana"
  tabs: TabData[];
  featured: Record<string, FeaturedData>; // Per-tab featured card
  stats: Record<string, StatData>; // Per-tab stat callout
  links: Record<string, LinkData[]>; // Per-tab links
  promo?: PromoData; // Optional promoted content
  searchUrl?: string; // Search redirect URL
}
```

## API Response Shape

```json
{
  "title": "Explore Solana",
  "tabs": [
    { "id": "builder", "title": "Builder", "icon": "builder" },
    { "id": "business", "title": "Business", "icon": "business" },
    { "id": "consumer", "title": "Consumer", "icon": "consumer" }
  ],
  "featured": {
    "builder": {
      "label": "Quick Start",
      "title": "Start building on Solana",
      "ctaText": "Quick Start Guide",
      "ctaHref": "/docs/intro/quick-start"
    },
    "business": {
      "label": "Network Dominance",
      "title": "The leading network for stablecoins & institutional finance",
      "ctaText": "Explore Solutions",
      "ctaHref": "/solutions/stablecoins"
    },
    "consumer": {
      "label": "Start Here",
      "title": "What is Solana?",
      "ctaText": "Learn the Basics",
      "ctaHref": "/learn/what-is-solana"
    }
  },
  "stats": {
    "builder": { "value": "4,000+", "label": "Active developers monthly" },
    "business": { "value": "$12B+", "label": "Stablecoin supply" },
    "consumer": { "value": "100M+", "label": "Active addresses" }
  },
  "links": {
    "builder": [
      { "title": "Documentation", "href": "/docs" },
      { "title": "RPC API", "href": "/docs/rpc" },
      { "title": "Templates", "href": "/developers/templates" },
      { "title": "Developer Hub", "href": "/developers" },
      { "title": "EVM to SVM", "href": "/developers/evm-to-svm" },
      { "title": "Hackathons & Events", "href": "/events" }
    ],
    "business": [
      { "title": "Stablecoins", "href": "/solutions/stablecoins" },
      { "title": "Tokenization", "href": "/solutions/tokenization" },
      {
        "title": "Institutional Payments",
        "href": "/solutions/institutional-payments"
      },
      { "title": "Enterprise", "href": "/solutions/enterprise" },
      {
        "title": "Financial Infrastructure",
        "href": "/solutions/financial-infrastructure"
      },
      { "title": "Real World Assets", "href": "/solutions/real-world-assets" }
    ],
    "consumer": [
      { "title": "Learn Solana", "href": "/learn" },
      { "title": "Get a Wallet", "href": "/wallets" },
      { "title": "Stake SOL", "href": "/staking" },
      {
        "title": "Explore DeFi",
        "href": "/learn/introduction-to-defi-on-solana"
      },
      { "title": "Events", "href": "/events" },
      { "title": "Community", "href": "/community" }
    ]
  },
  "promo": {
    "badge": "Event",
    "text": "Solana Accelerate — Join the global builder summit",
    "href": "/accelerate"
  },
  "searchUrl": "https://solana.com/search"
}
```

## Component Architecture

```
FabApp (fab-app.tsx) — unchanged orchestrator
├── FabButton (fab-button.tsx) — unchanged 48px button
└── ExplorePanel (explore-panel.tsx) — REPLACES GetStartedPanel
    ├── PanelHeader — brand + close button
    ├── SearchBar — mini search input
    ├── AudienceTabs — pill segment control (3 tabs)
    ├── TabContent — switches per active tab
    │   ├── FeaturedCard — hero with label + title + CTA
    │   ├── StatCard — gradient number + label
    │   ├── SectionDivider — monospace label + line
    │   └── LinkGrid — 2-column grid of icon links
    ├── PromoBanner — API-driven promoted content
    └── PanelFooter — "Powered by Solana" + links
```

## Panel Layout (CSS Grid)

### Desktop (768px+)

```
┌──────────────────────────────────────────────────┐
│  ⬢ Explore Solana                            [✕] │  ← header
├──────────────────────────────────────────────────┤
│  🔍 Search docs, guides & solutions...        /  │  ← search
├──────────────────────────────────────────────────┤
│  [ Builder ]  [ ▪ Business ▪ ]  [ Consumer ]     │  ← tabs (pill)
├──────────────────────────────────────────────────┤
│  ┌─────────────────────────────┐ ┌─────────────┐ │
│  │ NETWORK DOMINANCE           │ │             │ │
│  │ The leading network for     │ │   $12B+     │ │  ← featured + stat
│  │ stablecoins & institutional │ │  Stablecoin │ │
│  │ finance                     │ │   supply    │ │
│  │ [ Explore Solutions → ]     │ │             │ │
│  └─────────────────────────────┘ └─────────────┘ │
│  ── SOLUTIONS ──────────────────────────────────  │  ← divider
│  Stablecoins          │  Enterprise               │
│  Tokenization         │  Financial Infrastructure  │  ← 2-col links
│  Inst. Payments       │  Real World Assets         │
├──────────────────────────────────────────────────┤
│  EVENT │ Solana Accelerate — builder summit    →  │  ← promo
├──────────────────────────────────────────────────┤
│  ⬢ Powered by Solana          solana.com  Docs   │  ← footer
└──────────────────────────────────────────────────┘
```

### Mobile (<768px)

```
┌─────────────────────────┐
│         ─────           │  ← sheet handle
│  ⬢ Explore Solana  [✕]  │
│  🔍 Search docs...      │
│  [Builder][Biz][Consumer]│
│                         │
│  ┌─────────────────────┐│
│  │ QUICK START         ││
│  │ Start building...   ││
│  │ [Quick Start →]     ││
│  └─────────────────────┘│
│  4,000+ Active devs     │  ← stat inline
│                         │
│  ── RESOURCES ────────  │
│  Documentation        → │
│  RPC API              → │  ← single column
│  Templates            → │
│  Developer Hub        → │
│  EVM to SVM           → │
│  Hackathons & Events  → │
│                         │
│  EVENT │ Accelerate → │ │
│  ⬢ Powered by Solana   │
└─────────────────────────┘
```

## CORS Changes

Current: Only `*.solana.com` allowed Proposed: Allow any origin for GET requests
(public API)

```typescript
// Remove origin restriction, serve to all
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
};
```

## Search Integration

The search input redirects to Inkeep-powered search on solana.com:

```typescript
const handleSearch = (query: string) => {
  const url = `${data.searchUrl || "https://solana.com"}?search=${encodeURIComponent(query)}`;
  window.open(url, "_blank", "noopener");
};
```

On Enter key press, opens solana.com search in new tab. No embedded search
widget (keeps bundle under 10KB).

## Size Budget

| Component          | Est. gzip  |
| ------------------ | ---------- |
| Preact (bundled)   | ~3.5KB     |
| CSS styles         | ~2.5KB     |
| Panel + tabs logic | ~1.5KB     |
| Icons (inline SVG) | ~1.2KB     |
| Dialog + utils     | ~0.5KB     |
| Types + defaults   | ~0.3KB     |
| **Total**          | **~9.5KB** |

## Files to Change

1. `src/types.ts` — New MenuData shape with featured/stats/promo/searchUrl
2. `src/defaults.ts` — New default data matching new structure
3. `src/get-started-panel.tsx` → `src/explore-panel.tsx` — Complete rewrite
4. `src/styles.ts` — Complete CSS rewrite
5. `src/fab-app.tsx` — Import ExplorePanel instead of GetStartedPanel
6. `src/icons/` — Add new link-grid icons (doc, api, template, etc.)
7. `apps/web/src/app/api/fab-menu/route.ts` — New response shape, open CORS
8. `apps/web/src/data/index/data.ts` — New data structure

## Migration Notes

- The web component API (`<solana-fab-menu>`) is unchanged
- The React wrapper (`<SolanaFabMenu>`) is unchanged
- Only the panel content and data shape change
- Old API consumers will get the new shape — breaking change for any external
  API consumers (unlikely given CORS restriction)
- Default fallback data should match the new shape
