# Tina-News to Solana.com Turbo Migration

This document summarizes the migration of the tina-news application into the solana-com turbo monorepo as `apps/media`.

## What Changed

### 1. Turbo Repo Integration

- **Location**: Moved from standalone `~/tina-news` to `~/solana-com/apps/media`
- **Package Name**: Changed to `@solana-com-media`
- **Dependencies**: Now uses workspace packages:
  - `@workspace/i18n` for internationalization
  - `@workspace/config-typescript` for TypeScript configuration
  - `@solana-com/ui-chrome` for header and footer components
- **Catalog Versions**: Aligned Next.js and React versions with monorepo catalog

### 2. i18n Integration

- **Middleware**: Added `src/middleware.ts` to handle locale routing
- **i18n Config**: Created `src/i18n/request.ts` for next-intl setup
- **Locale Messages**: Added `public/locales/en/common.json` for translations
- **Route Structure**: All routes now prefixed with locale (e.g., `/en/news`)
- **Admin Exclusion**: `/admin` path bypasses i18n middleware for TinaCMS

### 3. App Directory Restructure

```
app/
  └── [locale]/
      ├── layout.tsx
      ├── page.tsx
      ├── news/
      │   ├── [...urlSegments]/
      │   ├── client-page.tsx
      │   └── page.tsx
      ├── podcasts/
      │   ├── [podcastSlug]/
      │   │   ├── episodes/
      │   │   │   └── [episodeId]/
      │   │   ├── client-page.tsx
      │   │   └── page.tsx
      │   ├── client-page.tsx
      │   └── page.tsx
      └── [...urlSegments]/
```

### 4. Header & Footer Replacement

- **Before**: Custom header/footer in `components/layout/nav/`
- **After**: Using `@solana-com/ui-chrome` Header and Footer components
- **Deleted**:
  - `components/layout/nav/header.tsx`
  - `components/layout/nav/footer.tsx`
  - `components/layout/layout.tsx`
- **Updated**: Created new `app/[locale]/layout.tsx` with ui-chrome components

### 5. Layout Changes

The new layout structure:

```tsx
<NextIntlClientProvider>
  <ThemeProvider>
    <LayoutProvider>
      <VideoDialogProvider>
        <Header /> {/* from ui-chrome */}
        <main>{children}</main>
        <Footer /> {/* from ui-chrome */}
      </VideoDialogProvider>
    </LayoutProvider>
  </ThemeProvider>
</NextIntlClientProvider>
```

### 6. Page Updates

All page components updated to:

- Remove `Layout` wrapper (now handled globally)
- Add `locale` to params type
- Use `pathsWithLocales()` in `generateStaticParams()` for i18n static generation
- Update episode URL construction to include locale prefix

### 7. TinaCMS Configuration

- **Admin Path**: Remains at `/admin` (no locale prefix)
- **basePath**: Updated to empty string (was using nextConfig.basePath)
- **Content**: All content remains in `content/` directory unchanged
- **Environment Variables**: Added to `turbo.json` global env:
  - `NEXT_PUBLIC_TINA_CLIENT_ID`
  - `NEXT_PUBLIC_TINA_BRANCH`
  - `TINA_TOKEN`
  - `TINA_SEARCH_INDEXER_TOKEN`
  - `TINA_PUBLIC_IS_LOCAL`

### 8. Configuration Files

- **tsconfig.json**: Extends `@workspace/config-typescript/nextjs.json`
- **next.config.ts**: Integrated `next-intl` plugin and TinaCMS
- **postcss.config.js**: Kept Tailwind CSS v4 configuration
- **eslint.config.mjs**: Maintained MDX and Prettier plugins
- **.prettierrc**: Preserved formatting rules

## URL Structure

### Development

- Frontend: `http://localhost:3000`
- With locale: `http://localhost:3000/en/news`
- Admin: `http://localhost:3000/admin` (no locale)

### Production

- English (default): `solana.com/news`
- Other locales: `solana.com/<lang>/news` (e.g., `solana.com/es/news`)
- Podcasts: `solana.com/<lang>/podcasts`
- Admin: `solana.com/admin`

## Routes

All routes now support i18n:

- `/<locale>/` - Redirects to `/<locale>/news`
- `/<locale>/news` - News articles listing
- `/<locale>/news/:slug` - Individual article
- `/<locale>/podcasts` - Podcasts listing
- `/<locale>/podcasts/:podcast` - Podcast show page
- `/<locale>/podcasts/:podcast/episodes/:id` - Individual episode
- `/admin` - TinaCMS admin panel (no locale)

## Static Generation

All pages use Next.js static generation with ISR:

- Articles: `revalidate: 300` (5 minutes)
- Podcasts: `revalidate: 1800` (30 minutes)
- Static params generated for all supported locales (currently just `en`)

## Breaking Changes

1. **Import Paths**: All imports using `@/` remain unchanged
2. **Layout Component**: No longer used in page files
3. **Routes**: All routes now require locale prefix (except `/admin`)
4. **Environment**: Must be run from turbo monorepo context

## Running the App

### From Monorepo Root

```bash
pnpm install
pnpm --filter @solana-com-media dev
```

### From Media App Directory

```bash
cd apps/media
pnpm dev
```

## Next Steps

1. Install dependencies: `pnpm install` (from monorepo root)
2. Set up environment variables in `apps/media/.env`
3. Run `pnpm --filter @solana-com-media dev`
4. Test all routes with locale prefix
5. Verify TinaCMS admin panel at `/admin`
6. Add additional locale translations to `public/locales/`
7. Consider removing the original `tina-news/` directory after verification

## Rollback Plan

If migration needs to be rolled back:

1. The original `tina-news/` directory remains unchanged
2. Remove `apps/media/` directory
3. Remove TinaCMS env vars from `turbo.json`
4. Run `pnpm install` to clean up workspace

## Additional Notes

- All TinaCMS content (posts, podcasts, authors, etc.) copied unchanged
- Fonts, assets, and uploads copied to media app
- Prisma and scripts directories included if they existed
- Layout context preserved for backward compatibility
- Video dialog and Tailwind indicator remain functional

---

# Migration to Self-Hosted TinaCMS

This section documents the migration from TinaCMS Cloud to a self-hosted solution.

## Why Self-Hosted?

1. **Full control** over authentication and data
2. **Cost savings** - no TinaCMS Cloud subscription needed
3. **Security** - content stays within Solana Foundation infrastructure
4. **Customization** - full control over the CMS behavior

## What Changed

### Authentication

- **Before**: TinaCMS Cloud authentication
- **After**: Google OAuth via NextAuth, restricted to @solana.org emails
- **Files Added**:
  - `auth.ts` - NextAuth configuration
  - `app/api/auth/[...nextauth]/route.ts` - Auth API routes
  - `app/admin/login/page.tsx` - Custom login page
  - `middleware.ts` - Updated to protect /admin and /api/tina

### Database

- **Before**: TinaCMS Cloud database
- **After**: Upstash Redis for indexing + GitHub API for persistence
- **Files Added**:
  - `tina/database.ts` - Database configuration
  - `tina/github-provider.ts` - GitHub API integration
  - `scripts/db-init.ts` - Content indexing script

### API Routes

- **Before**: TinaCMS Cloud API
- **After**: Self-hosted API routes
- **Files Added**:
  - `app/api/tina/gql/route.ts` - GraphQL endpoint
  - `app/api/tina/[...paths]/route.ts` - Media and schema handling
  - `app/api/tina/webhook/route.ts` - GitHub webhook for re-indexing

### Preview Mode

- **Before**: TinaCMS Cloud preview
- **After**: Next.js Draft Mode with signed tokens
- **Files Added**:
  - `app/api/draft/route.ts` - Enable preview
  - `app/api/draft/disable/route.ts` - Disable preview
  - `components/DraftModeIndicator.tsx` - Preview banner
  - `lib/draft-mode.ts` - Draft mode utilities
  - `tina/preview-plugin.ts` - Preview functionality in admin

### Environment Variables

**Removed** (TinaCMS Cloud):

- `NEXT_PUBLIC_TINA_CLIENT_ID`
- `TINA_TOKEN`
- `TINA_SEARCH_INDEXER_TOKEN`

**Added** (Self-Hosted):

- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_WHITELIST`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `GITHUB_PERSONAL_ACCESS_TOKEN`
- `GITHUB_REPO_OWNER`
- `GITHUB_REPO_NAME`
- `GITHUB_BRANCH`
- `GITHUB_WEBHOOK_SECRET`
- `PREVIEW_SECRET`

### Build Process

- **Before**: `tinacms build` with cloud sync
- **After**: `tinacms build` (local only) + database warm-up + Next.js build
- **Files Updated**:
  - `scripts/build.sh` - Added database warm-up step
  - `package.json` - Added `db:init` and `dev:self-hosted` scripts

## Migration Steps

1. **Set up external services**:
   - Create Upstash Redis database
   - Create Google OAuth credentials
   - Create GitHub Personal Access Token

2. **Update environment variables**:
   - Remove TinaCMS Cloud variables
   - Add self-hosted variables (see `.env.example`)

3. **Initialize database**:

   ```bash
   pnpm db:init
   ```

4. **Test locally**:

   ```bash
   TINA_PUBLIC_IS_LOCAL=false pnpm dev:self-hosted
   ```

5. **Deploy to Vercel**:
   - Update environment variables in Vercel dashboard
   - Deploy with `vercel --prod`

6. **Set up GitHub webhook** (optional):
   - Add webhook pointing to `/api/tina/webhook`
   - Configure for `push` events

## Rollback to TinaCMS Cloud

If needed, rollback by:

1. Restore TinaCMS Cloud environment variables
2. Revert `tina/config.tsx` to use cloud endpoints
3. Remove self-hosted API routes
4. Remove auth-related files
5. Restore original middleware

## Security Notes

- All CMS routes require authentication
- Only @solana.org emails have access (configurable whitelist)
- GitHub PAT should have minimal permissions (repo scope only)
- Rotate secrets regularly
- Use webhook signatures in production
