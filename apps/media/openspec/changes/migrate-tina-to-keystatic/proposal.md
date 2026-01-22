# Change: Migrate from TinaCMS to Keystatic CMS

## Why

TinaCMS requires complex self-hosted infrastructure including Redis/Vercel KV for caching, custom magic-link authentication, GitHub branch-based workflow management, and generated GraphQL clients. Keystatic offers a simpler architecture with built-in GitHub authentication, file-based storage, native Markdoc support, and no external database dependencies while maintaining the same Git-based content workflow.

## What Changes

### Removals (TinaCMS)

- **Configuration**: Remove `tina/` directory including `config.tsx`, `database.ts`, and all collection definitions
- **Generated Files**: Remove `tina/__generated__/` directory with GraphQL client, types, and schema files
- **Custom Auth**: Remove entire magic-link authentication system:
  - `lib/auth.ts` (token creation/verification, session management)
  - `lib/email.ts` (SendGrid magic link emails)
  - `app/admin/login/` routes and components
  - `app/admin/auth/callback/` route
  - `app/admin/logout/` route
  - `app/admin/api/drafts/` route
  - `CustomAuthProvider` class
- **GitHub Workflow**: Remove `lib/github.ts` (draft branch creation, PR management, branch merging for TinaCMS workflow)
- **Plugins**: Remove `tina/plugins/workflow.tsx` (draft/publish workflow, PR creation)
- **Custom Fields**: Remove `tina/fields/color.tsx` (color picker component)
- **API Routes**: Remove `app/api/tina/[...routes]/route.ts`
- **Scripts**: Remove TinaCMS-specific npm scripts (`tinacms dev`, `tinacms build`)
- **Dependencies**: Remove TinaCMS packages:
  - `tinacms`
  - `@tinacms/datalayer`
  - `@tinacms/auth`
  - `tinacms-gitprovider-github`
  - `redis-level` (Upstash adapter)
  - `@sendgrid/mail` (no longer needed for auth)
- **Environment Variables**: Remove TinaCMS-specific env vars:
  - `TINA_PUBLIC_IS_LOCAL`
  - `NEXT_PUBLIC_TINA_CLIENT_ID`
  - `TINA_TOKEN`
  - `JWT_SECRET`
  - `ADMIN_WHITELIST`
  - `SENDGRID_API_KEY`
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`

### Additions (Keystatic)

- **Configuration**: Add `keystatic.config.tsx` with all collections mapped:
  - `posts` - Blog posts with SEO, categories, tags, authors
  - `podcasts` - Podcast shows with hosts, RSS feeds, distribution links
  - `authors` - Author profiles with avatars
  - `categories` - Content categories
  - `tags` - Content tags
  - `ctas` - Call-to-action blocks
  - `switchbacks` - Content switchback components
  - `links` - External link references
  - `global` - Global settings singleton
- **Admin Routes**: Add Keystatic admin UI:
  - `app/keystatic/keystatic.tsx` (admin UI component)
  - `app/keystatic/layout.tsx` (admin layout)
  - `app/keystatic/[[...params]]/page.tsx` (catch-all route)
  - `app/api/keystatic/[...params]/route.ts` (API handler)
- **Reader API**: Add `lib/reader.ts` for content fetching
- **Content Components**: Add Markdoc component blocks:
  - BlockQuote, DateTime, NewsletterSignup
  - VideoBlock, Gallery, StatsBlock
  - Footnotes, Superscript, Tweet, Iframe
- **Dependencies**: Add Keystatic packages:
  - `@keystatic/core`
  - `@keystatic/next`
  - `@markdoc/markdoc`
- **Environment Variables**: Add Keystatic GitHub mode env vars:
  - `KEYSTATIC_GITHUB_CLIENT_ID`
  - `KEYSTATIC_GITHUB_CLIENT_SECRET`
  - `KEYSTATIC_SECRET`
  - `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`

### Migrations

- **Content Format**: Create TSX migration script to convert existing MDX files to Markdoc (.mdoc) format
  - Transform JSX component syntax to Markdoc tag syntax
  - Preserve YAML frontmatter structure
  - Handle rich-text field conversions
- **Data Fetching**: Replace TinaCMS GraphQL client with Keystatic Reader API
- **Middleware**: Update `middleware.ts` to handle `/keystatic` routes instead of `/admin`

### Preserved Functionality

- **i18n**: Maintain multi-language support via `next-intl` and `@workspace/i18n`
- **Rendering**: Keep all existing layouts, components, and UI unchanged
- **Content**: All existing posts, podcasts, authors, categories, tags preserved
- **SEO**: Maintain SEO metadata structure and rendering
- **RSS**: Keep podcast RSS feed integration
- **Routes**: Preserve `/news` and `/podcasts` public routes

## Impact

- **Affected specs**: `content-management` (new capability spec)
- **Affected code**:
  - `tina/` - Complete removal
  - `lib/auth.ts`, `lib/email.ts`, `lib/github.ts` - Remove (TinaCMS auth/workflow)
  - `app/admin/` - Replace with `app/keystatic/`
  - `app/api/tina/` - Replace with `app/api/keystatic/`
  - `lib/post-data.ts`, `lib/podcast-data.ts`, `lib/link-data.ts`, `lib/category-data.ts` - Refactor to use Reader API
  - `middleware.ts` - Update route handling
  - `package.json` - Update dependencies
  - `.env*` - Update environment variables
- **Breaking changes**: Admin URL changes from `/admin` to `/keystatic`
- **Migration required**: MDX to Markdoc content conversion (manual execution)
