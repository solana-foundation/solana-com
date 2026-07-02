# Solana.com "nd" Design System Reference

Extracted from the homepage (`apps/web/src/app/[locale]/home.tsx`) and the
tokenization solution page
(`apps/web/src/app/[locale]/solutions/tokenization/`). These two pages are the
canonical precedents — when in doubt, open them and copy their patterns.

## Figma source of truth

The design system lives in Figma: **Solana — UI/UX System**
(`https://www.figma.com/design/CjeDmGL4lGH4Z7MlXd36iX/Solana---UI-UX-System`,
"Homepage ✅" canvas, node `937-791`). When the Figma MCP server is available,
read designs from there rather than guessing. The Figma variables map 1:1 to
code:

- Designs come in three canvases — **390 / 768 / 1920** — which map to the
  code's **base / `md:` / `xl:`** tiers. Desktop frames are 1920 wide but
  content sits in a centered `section-widthController` of **1440**
  (`global/section-maxWidth`) = `max-w-screen-2xl`.
- Color variables share names with the `nd-*` Tailwind tokens: `midEmText` →
  `nd-mid-em-text`, `border-light` → `nd-border-light`, `highlight-lavendar` →
  `nd-highlight-lavendar`, `CTA`/`onCTA-highEmText` → `nd-cta`/
  `nd-on-cta-high-em-text`, etc. Same hex values.
- Type variables `text-headings/{2xl,l,m,s}` and `textbody/{xl,l,m,s}` match the
  `nd-heading-*` / `nd-body-*` classes per canvas (e.g. heading-2xl is 40/44 →
  56/56 → 88/88 across the three canvases — exactly `nd-heading-2xl`).
- Weight variables: `heading-weight` Medium, `heading-weight-thinned` Light (the
  mixed-weight headline span), `body-weight` Regular, `body-weight-emphasized`
  Medium (hero subtitles, card titles).
- Layout variables: `section-hPadding` 20/32/40 (= Container
  `px-5 md:px-8 xl:px-10`), `section-vPadding` 64/108/160 (hero/explainer
  rhythm), `section-gap` 44/—/80, `gaps/xs` 8, `gaps/xl` 32/40/40, `gaps/4xl`
  32/40/64, `hero-height` 1080 (tablet) / 1200 (desktop).

## Design language in one paragraph

Black canvas, white text, lots of air. Sections are full-bleed and separated by
1px hairline dividers at ~12% white opacity. Typography is Diatype
(`font-brand`) at medium weight with aggressively tight negative tracking that
scales with size; headlines mix `font-medium` and `font-light` spans for
emphasis contrast. One accent color per page (lavender, blue, gold, orange,
green, or lime) used sparingly — text selection, scroll-highlight, small
details. Buttons are white pills on black. Imagery is webp, card-led, with
rounded-xl corners. Motion is subtle: staggered fade-in-up on scroll, animated
WebGL backgrounds (UnicornScene) in heroes with static webp fallbacks.

## Color tokens (`apps/web/tailwind.config.js`)

Always use tokens, never raw hex (exception: a page accent passed as a prop,
e.g. `highlightColor="#CA9FF5"`).

| Token                    | Value       | Use                                |
| ------------------------ | ----------- | ---------------------------------- |
| `nd-bg`                  | `#000000`   | Page background                    |
| `nd-high-em-text`        | `#FFFFFF`   | Headings, primary text             |
| `nd-mid-em-text`         | `#ABABBA`   | Subtitles, secondary text          |
| `nd-mid-em-text-alpha`   | `#FFFFFFA3` | Secondary text on imagery          |
| `nd-cta` / `nd-primary`  | `#FFFFFF`   | Button background                  |
| `nd-on-cta-high-em-text` | `#000000`   | Button label                       |
| `nd-primary-hovered`     | `#FFFFFFE5` | Button hover                       |
| `nd-border-light`        | `#ECE4FD1F` | Dividers, default hairlines        |
| `nd-border-prominent`    | `#ECE4FD33` | Emphasized borders                 |
| `nd-border-hovered`      | `#ECE4FD52` | Border hover state                 |
| `nd-highlight-lavendar`  | `#CA9FF5`   | Page accent (tokenization uses it) |
| `nd-highlight-blue`      | `#6693F7`   | Page accent                        |
| `nd-highlight-gold`      | `#FFC526`   | Page accent                        |
| `nd-highlight-orange`    | `#F48252`   | Page accent                        |
| `nd-highlight-green`     | `#55E9AB`   | Page accent                        |
| `nd-highlight-lime`      | `#CFF15E`   | Page accent                        |

`solana-purple` → `solana-green` gradient stops exist for brand-gradient moments
only; don't use them as UI colors.

## Typography (`apps/web/src/app/globals.css`)

Font: `font-brand` (Diatype). Mono accent: `font-brand-mono` (DSemi). Apply the
prebuilt responsive classes — each bundles size, leading, and tracking across
base/`md:`/`xl:`:

| Class            | base / md / xl px | Use                              |
| ---------------- | ----------------- | -------------------------------- |
| `nd-heading-2xl` | 40 / 56 / 88      | Hero `h1` only                   |
| `nd-heading-xl`  | 40 / 48 / 80      | Oversized section heading        |
| `nd-heading-l`   | 32 / 40 / 64      | Standard section `h2`            |
| `nd-heading-l-a` | 28 / 40 / 48      | Alternate section heading        |
| `nd-heading-m`   | 18 / 32 / 36      | Sub-section heading              |
| `nd-heading-s`   | 16 / 24 / 24      | Card titles                      |
| `nd-heading-xs`  | 16 / 18 / 22      | Small card titles, link titles   |
| `nd-body-2xl`    | 20 / 32 / 32      | Explainer paragraph (`WhatIsIt`) |
| `nd-body-xl`     | 18 / 24 / 24      | Hero subtitle, section subtitle  |
| `nd-body-l`      | 16 / 18 / 20      | Lede body                        |
| `nd-body-m`      | 16 / 18 / 18      | Default body, button labels      |
| `nd-body-s`      | 14 / 16           | Captions, meta (date/location)   |
| `nd-body-xs`     | 12 / 14           | Fine print, eyebrows             |

Patterns:

- Subtitles pair `nd-body-xl` with `text-nd-mid-em-text` and **medium weight**
  (`font-medium`) — in Figma, hero subtitles and card titles use
  `body-weight-emphasized`; plain body copy stays Regular.
- Mixed-weight headlines: pass copy through `t.rich` with a `light` tag →
  `<span className="font-light">…</span>` (see tokenization's `WhatIsIt` and
  `LatestNews` titles). Headings are `font-medium` by default.
- Hero stat values: large, `uppercase`, `font-light`, `leading-none`.

## Layout & spacing

- **Breakpoints**: mobile-first triplet — base, `md:` (768), `xl:` (1280).
  `2xl:` is 1440 and used only for max-width/carousel offsets. Style all three
  tiers; skipping `md:` is the most common review bug.
- **Container**: `@/component-library/container` →
  `max-w-screen-2xl w-full mx-auto px-5 md:px-8 xl:px-10`. Sections are
  full-bleed (`<section>` spans the viewport; inner content is contained).
- **Vertical rhythm**: standard content sections `py-10`; hero and explainer
  sections breathe much more: `py-[64px] md:py-[112px] xl:py-[160px]` (Figma
  `global/section-vPadding`: 64/108/160 — code rounds tablet to 112).
- **Dividers between every section**: `<Divider />` —
  `apps/web/src/component-library/divider.tsx` (uses `nd-border-light`) or
  `components/solutions/divider.v2.tsx` (`border-white/10`). Props:
  `hideOnMobile`, `hideOnTablet`, `hideOnDesktop`.
- **Decor bands**: full-width blurred imagery with `mix-blend-plus-lighter`
  between sections (`components/index/decor.tsx`,
  `components/solutions/decor.v2.tsx` takes an `imageSrc`). Use once or twice
  per page.
- **Stat grids**: cells divided by hairlines (`border-white/15`), 2-col on
  mobile, up to 4-col on `xl`, icon top / value+label bottom,
  `animate-fade-in-up` staggered by `index * 0.1s` behind
  `useIntersectionObserver`.
- **Cards**: `rounded-xl`, image-led, `px-1` gutter inside carousels.

## Buttons

Pill-shaped (`rounded-full` / `rounded-[800px]`), white-on-black primary.

- New-design button: `apps/web/src/component-library/button.tsx` — variants
  `cta` (white pill + black circular arrow chip), `primary`, `secondary`
  (white/8% fill), `tertiary` (hairline outline); sizes `xl`/`l`/`m`.
- Shadcn-style `@/app/components/ui/button` also appears in precedents (e.g.
  `CardCarouselSection` CTA uses `variant="secondary-outline" rounded`; hero
  CTAs use `rounded-full bg-white text-black hover:!bg-white/90`).
- Icon-in-button pattern: small circular chip in the inverse color (see the
  download arrow in `SolutionHero`).
- **Paired CTAs** (current Figma hero): primary white pill + outline pill
  (`border-nd-border-prominent`, white label) side by side with `gap-3`. Both
  `px-[24px] py-[12px]`, label `nd-body-m` medium with `tracking-[-0.18px]`.
- **Glass treatment** (Figma `button-glass`): for buttons sitting on imagery —
  `backdrop-blur-[6px]` plus layered inner shadows (`#FFFFFF14` 0/-3/10,
  `#ECE4FD14` 0/-1, `#ECE4FD3D` 0/1). Use only over photographic/animated
  backgrounds, not on flat black.

## Backgrounds & motion

- **UnicornScene** (`unicornstudio-react`): hero/footer WebGL backgrounds. Props
  used in precedents: `jsonFilePath`, `fps={30}`, `lazyLoad`, `production`,
  absolute-inset positioning, and a static webp `placeholder` with
  `showPlaceholderOnError` / `showPlaceholderWhileLoading`. Always ship the webp
  fallback. Import with `dynamic(..., { ssr: false })`.
- **Scroll reveals**: `animate-fade-in-up` + `useIntersectionObserver`
  (`threshold: 0.2, triggerOnce: true`), `animationDelay` staggered ~100ms.
- **Scroll text highlight**: `useScrollTextHighlight` with the page accent (see
  `WhatIsIt`).
- **Per-page selection color**:
  `<SelectionColor selectionColor=accent selectionTextColor="#000000" />` from
  `@/component-library/selection-color`.

## Workspace packages (`packages/`)

Every page integrates with these. Always import via the workspace alias, never
by relative path across package/app boundaries. Both UI packages are included in
each app's Tailwind `content` globs, so `nd-*` tokens and `nd-heading-*` /
`nd-body-*` classes work inside them.

### `@workspace/ui` (`packages/ui`) — cross-app Radix primitives

Subpath exports: `@workspace/ui/button`, `/dialog`, `/accordion`, `/input`,
`/visually-hidden`, `/not-found-page`, `/utils` (the `cn` helper). Use these for
accessible interaction primitives (modals, accordions, form inputs). New
cross-app primitives go here.

### `@solana-com/ui-chrome` (`packages/ui-chrome`) — site chrome

Header (with nav section configs), Footer, `ThemeProvider`, `InkeepChatButton`,
newsletter modal, cookie-consent banner, language selector, sitewide top alert,
persistent podcast player. These mount in each app's root layout — **pages never
import or re-create chrome**. What pages _do_ import:

- `@solana-com/ui-chrome/icons` — the shared icon set (`TokenIcon`, `CoinsIcon`,
  `LedgerIcon`, `StepsIcon`, `ChartIcon`, `GlobeIcon`, `WalletIcon`,
  `UsersIcon`, `PulseIcon`, `MoneyIcon`, `ClockIcon`, etc. — see
  `packages/ui-chrome/src/assets/icons/index.ts`). First choice for hero-stat
  and feature icons.
- `@solana-com/ui-chrome/link` — locale-aware `Link` for internal navigation.
- `@solana-com/ui-chrome/url-config` — canonical cross-app URLs (web ↔ docs ↔
  media); use instead of hardcoding `https://solana.com/...`.
- `@solana-com/ui-chrome/hooks` — shared hooks.

If a new page needs a nav entry, that's a change to the `header-list.*.tsx`
configs in this package, not to the page.

### `@workspace/i18n` (`packages/i18n`) — locales, routing, messages

- `@workspace/i18n/config` — the 20 supported locales; all routes live under
  `[locale]`.
- `@workspace/i18n/routing` — `getAlternates(path, locale)` for
  `generateMetadata`.
- `packages/i18n/messages/web/<locale>/common.json` — message catalogs; new page
  copy goes in `web/en/common.json` under a page namespace and is loaded
  automatically via `loadMergedMessages` (`apps/web/src/i18n/request.ts`).

### `@workspace/config-eslint` / `@workspace/config-typescript`

Shared lint and strict-mode TS configs — already applied to apps/web. No
integration work needed; just expect `pnpm lint` and strict TypeScript to gate
anything you write.

## Component inventory

### `apps/web/src/component-library/` — shared, long-lived (reuse first)

`badge`, `big-banner-card` (full-width news banner), `big-video-card`, `button`,
`card-carousel-section` (title + subtitle + CTA + arrows + swipeable carousel —
the workhorse for any card row), `carousel`, `columns`, `company-stats-card`,
`container`, `divider`, `icon-button`, `logos`, `marquee`, `place-media-card`
(image + title + date + location, for events), `responsive-box`,
`selection-color`, `stats-grid`, `video-modal` (`VideoPlayerModal` — mount once
per page), `video`.

### `apps/web/src/components/solutions/*.v2.tsx` — solution-page archetypes

`hero.v2` (`SolutionHero`: title/subtitle/CTA/stats/download card/bg),
`what-is-it.v2`, `projects.v2`, `products.v2`, `video-grid.v2`,
`single-video.v2`, `latest-news.v2`, `report.v2` (`SolutionReport` closing CTA),
`performance.v2`, `logos.v2`, `divider.v2`, `decor.v2`, `EmailModal`. **Never
use the non-`.v2` siblings for new work.**

### `apps/web/src/components/index/` — homepage-specific

`hero`, `performance`, `projects`, `community`, `whats-up`, `get-started`,
`decor`, `transactions-stat`. Reuse the pattern; if a homepage section is needed
elsewhere, promote it to `component-library` rather than importing across page
folders.

### Icons

`@solana-com/ui-chrome/icons` (e.g. `TokenIcon`, `CoinsIcon`, `LedgerIcon`,
`StepsIcon`), `*.inline.svg` imports for one-off SVGs, Lucide for utility glyphs
(arrows, download).

## Page skeletons

### Server wrapper — `app/[locale]/<path>/page.tsx`

```tsx
import { MyPage } from "./my-page";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  // fetch news/events/videos here (server-side)
  return <MyPage news={news} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("myPage");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: getAlternates("/<path>", locale),
  };
}
```

### Client page — `app/[locale]/<path>/<name>.tsx`

```tsx
"use client";

import { useTranslations } from "next-intl";
import { SolutionHero } from "@/components/solutions/hero.v2";
import { WhatIsIt } from "@/components/solutions/what-is-it.v2";
import { Divider } from "@/components/solutions/divider.v2";
import { SelectionColor } from "@/component-library/selection-color";
import { LOGOS, PRODUCTS } from "@/data/solutions/my-page";

const ACCENT = "#CA9FF5"; // one nd-highlight-* value per page

export function MyPage({ news }: { news: NewsItem[] }) {
  const t = useTranslations();
  return (
    <>
      <SelectionColor selectionColor={ACCENT} selectionTextColor="#000000" />
      <div className="bg-black">
        <SolutionHero
          title={t("myPage.hero.title")}
          subtitle={t("myPage.hero.subtitle")}
          stats={stats}
          bgJsonFilePath="/src/img/solutions/my-page/hero-bg.json"
        />
        <Divider />
        <WhatIsIt
          title={t.rich("myPage.features.title", {
            light: (chunks) => <span className="font-light">{chunks}</span>,
          })}
          description={t("myPage.features.description")}
          highlightColor={ACCENT}
        />
        {/* …more sections, each separated by <Divider /> */}
      </div>
    </>
  );
}
```

### Supporting files

- Data: `apps/web/src/data/solutions/<page>.ts` (export `LOGOS`, `PRODUCTS`,
  `VIDEOS`, `PROJECTS`, query constants — follow
  `src/data/solutions/tokenization.ts`).
- Copy: `packages/i18n/messages/web/en/common.json`, namespaced per page (follow
  the `"icm"` namespace shape: `meta`, `hero`, `features`, `projects`,
  `products`, `news`, `cta`).
- Images: `apps/web/public/src/img/solutions/<page>/`, webp.
