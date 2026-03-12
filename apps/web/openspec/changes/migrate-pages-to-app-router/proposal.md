# Change: Migrate Pages Router to App Router

## Why

The web app still has ~65 pages under `apps/web/src/pages/[locale]/` using the
legacy Next.js Pages Router. Migrating them to `apps/web/src/app/[locale]/`
(App Router) unifies routing, enables React Server Components, improves
performance, and removes the dual-router complexity.

## What Changes

- **Migrate all remaining pages** from `pages/[locale]/` to `app/[locale]/`
  using the established migration pattern (server `page.tsx` + client component)
- **Use `migrate-page` and `create-page` skills** to assist each migration
- **Manual verification** after each page migration (visual check + build)
- **Rename original files** with `_m_` prefix as backup after migration
- **Remove `404.js`** (replaced by App Router `not-found.tsx` already in place)

## Impact

- Affected specs: `page-migration` (new capability)
- Affected code:
  - `apps/web/src/pages/[locale]/*.{js,jsx,tsx}` - All files migrated out
  - `apps/web/src/pages/[locale]/{community,developers,events,hackathon,nftshowdown,solutions}/` - Subdirectories migrated
  - `apps/web/src/app/[locale]/` - New page directories created
- No user-facing route changes (all URLs remain the same)

## Already Migrated (skip these)

These pages already exist in `app/[locale]/` and should NOT be re-migrated:

- `/` (index) → `app/[locale]/page.tsx`
- `/environment` → `app/[locale]/environment/page.tsx`
- `/wallets` → `app/[locale]/wallets/page.tsx`
- `/privacyhack` → `app/[locale]/privacyhack/page.tsx`
- `/universities` → `app/[locale]/universities/page.tsx`
- `/universities/hackathon-fall-2025` → `app/[locale]/universities/hackathon-fall-2025/page.tsx`
- `/x402` → `app/[locale]/x402/page.tsx`
- `/x402/hackathon` → `app/[locale]/x402/hackathon/page.tsx`
- `/x402/what-is-x402` → `app/[locale]/x402/what-is-x402/page.tsx`

## Migration Strategy

1. Migrate pages one at a time (or in small batches by section)
2. Use `migrate-page` skill for each page to automate the conversion
3. Manually verify each migrated page in the browser
4. Rename the original pages file with `_m_` prefix after successful migration
5. Run `pnpm build` periodically to catch issues early
6. Group related pages (e.g., all `/solutions/*`) into phases

## Pages to Migrate

See `tasks.md` for the full ordered checklist.
