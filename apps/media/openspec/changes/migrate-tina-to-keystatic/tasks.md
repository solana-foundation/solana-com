# Tasks: TinaCMS to Keystatic Migration

> **Important:** During implementation, commits are allowed but **do not push to remote**. All changes should remain local until the migration is fully tested and approved.

## 1. Add Keystatic Dependencies

- [ ] 1.1 Add `@keystatic/core` package
- [ ] 1.2 Add `@keystatic/next` package
- [ ] 1.3 Add `@markdoc/markdoc` package
- [ ] 1.4 Run `pnpm install` to install dependencies

## 2. Create Keystatic Configuration

- [ ] 2.1 Create `keystatic.config.tsx` at project root
- [ ] 2.2 Configure storage mode (local for dev, GitHub for production)
- [ ] 2.3 Define `posts` collection schema with all fields:
  - SEO object (title, description, noIndex, noFollow, openGraph, twitter)
  - title (slug field)
  - heroImage
  - description (markdoc)
  - author (relationship to authors)
  - date (datetime)
  - categories (array of relationships)
  - tags (array of relationships)
  - body (markdoc with components)
  - cta (relationship)
  - switchback (relationship)
- [ ] 2.4 Define `podcasts` collection schema with all fields:
  - title (slug field)
  - slug
  - description (markdoc)
  - coverImage
  - riversideProjectId, riversideStudioId
  - category (relationship)
  - tags (string array)
  - featured (checkbox)
  - displayOrder (number)
  - status (select: active/archived/coming-soon)
  - hosts (array of author relationships)
  - applePodcastsUrl, spotifyUrl, rssFeedUrl
  - releaseFrequency
  - firstEpisodeDate (datetime)
- [ ] 2.5 Define `authors` collection schema (name, avatar)
- [ ] 2.6 Define `categories` collection schema (name)
- [ ] 2.7 Define `tags` collection schema (name)
- [ ] 2.8 Define `ctas` collection schema (title, eyebrow, headline, description, button, className)
- [ ] 2.9 Define `switchbacks` collection schema (title, image, eyebrow, headline, body, buttons)
- [ ] 2.10 Define `links` collection schema (title, url, linkType, description, thumbnailImage, source, publishedAt, categories, tags, featured)
- [ ] 2.11 Define `global` singleton schema (theme: color, darkMode)

## 3. Create Markdoc Component Blocks

- [ ] 3.1 Create `lib/keystatic/components.tsx` file
- [ ] 3.2 Implement `blockquote` block (children, authorName)
- [ ] 3.3 Implement `datetime` block (format: utc/iso/local)
- [ ] 3.4 Implement `newslettersignup` block (children, placeholder, buttonText, disclaimer)
- [ ] 3.5 Implement `video` block (matching videoBlockSchema)
- [ ] 3.6 Implement `gallery` block (matching galleryBlockSchema)
- [ ] 3.7 Implement `stats` block (matching statsBlockSchema)
- [ ] 3.8 Implement `footnotes` block (footnotes)
- [ ] 3.9 Implement `sup` block (children)
- [ ] 3.10 Implement `tweet` block (id)
- [ ] 3.11 Implement `iframe` block (src, width, height, allow)
- [ ] 3.12 Export `componentBlocks` object
- [ ] 3.13 Create `markdocConfig` with `fields.markdoc.createMarkdocConfig()`

## 4. Create Keystatic Admin Routes

- [ ] 4.1 Create `app/keystatic/keystatic.tsx` (client component with `makePage`)
- [ ] 4.2 Create `app/keystatic/layout.tsx` (admin layout wrapper)
- [ ] 4.3 Create `app/keystatic/[[...params]]/page.tsx` (catch-all page)
- [ ] 4.4 Create `app/api/keystatic/[...params]/route.ts` (API handler with `makeRouteHandler`)

## 5. Create Reader API

- [ ] 5.1 Create `lib/reader.ts` with `createReader()` initialization
- [ ] 5.2 Export typed reader instance

## 6. Create Migration Script

- [ ] 6.1 Create `scripts/migrate-mdx-to-markdoc.tsx` file
- [ ] 6.2 Implement file discovery (find all .mdx files in content/)
- [ ] 6.3 Implement frontmatter parsing (YAML extraction)
- [ ] 6.4 Implement JSX-to-Markdoc conversion:
  - `<BlockQuote>` → `{% blockquote %}`
  - `<DateTime>` → `{% datetime %}`
  - `<NewsletterSignup>` → `{% newslettersignup %}`
  - `<VideoBlock>` → `{% video %}`
  - `<Gallery>` → `{% gallery %}`
  - `<StatsBlock>` → `{% stats %}`
  - `<footnotes>` → `{% footnotes %}`
  - `<sup>` → `{% sup %}`
  - `<tweet>` → `{% tweet %}`
  - `<iframe>` → `{% iframe %}`
- [ ] 6.5 Implement rich-text to markdoc conversion
- [ ] 6.6 Implement image folder reorganization:
  - Scan existing `/uploads/` directory structure
  - Reorganize folders to match Keystatic's expected directory structure
  - Preserve content-type sub-folders (posts/, podcasts/, authors/, links/) to prevent filename collisions
  - Map old paths to new paths for reference updates
- [ ] 6.7 Update image path references in frontmatter and content:
  - Update heroImage, coverImage, avatar paths
  - Update any inline image references in body content
  - Update SEO image paths (ogImage, twitterImage)
- [ ] 6.8 Implement file output (write .mdoc alongside .mdx)
- [ ] 6.9 Implement conversion report generation:
  - List all converted files
  - List all image path changes
  - Flag any images requiring manual attention
  - Report any conversion issues or warnings
- [ ] 6.10 Add script to package.json: `"migrate:content": "tsx scripts/migrate-mdx-to-markdoc.tsx"`

## 7. Update Data Fetching Layer

- [ ] 7.1 Create `lib/markdoc-renderer.ts` utility for transforming Markdoc content to React
- [ ] 7.2 Refactor `lib/post-data.ts`:
  - Replace TinaCMS GraphQL client with Keystatic Reader API
  - Update `fetchLatestPosts()` and `fetchFeaturedPost()` to use `reader.collections.posts`
  - Maintain `PostItem` return type for downstream compatibility
- [ ] 7.3 Refactor `lib/post-utils.ts`:
  - Update `transformPost()` to handle Keystatic entry format
  - Add Markdoc body content transformation
- [ ] 7.4 Refactor `lib/podcast-data.ts`:
  - Replace TinaCMS GraphQL client with Keystatic Reader API
  - Update `fetchAllPodcasts()` and `fetchPodcastBySlug()` to use `reader.collections.podcasts`
  - Maintain `PodcastShow` return type for downstream compatibility
- [ ] 7.5 Refactor `lib/link-data.ts`:
  - Replace TinaCMS GraphQL client with Keystatic Reader API
  - Update `fetchLatestLinks()`, `fetchFeaturedLinks()`, `fetchLinksByTag()` to use `reader.collections.links`
  - Maintain `LinkItem` return type for downstream compatibility
- [ ] 7.6 Refactor `lib/category-data.ts`:
  - Replace TinaCMS GraphQL client with Keystatic Reader API
  - Update `fetchCategoryByPath()` to use `reader.collections.categories`
  - Maintain `CategoryItem` return type for downstream compatibility

## 8. Update Middleware

- [ ] 8.1 Update `middleware.ts` to handle `/keystatic` routes
- [ ] 8.2 Skip i18n routing for `/keystatic` paths
- [ ] 8.3 Add redirect from `/admin` to `/keystatic` (optional, for backwards compat)

## 9. Update Environment Variables

- [ ] 9.1 Add `KEYSTATIC_GITHUB_CLIENT_ID` to .env.example
- [ ] 9.2 Add `KEYSTATIC_GITHUB_CLIENT_SECRET` to .env.example
- [ ] 9.3 Add `KEYSTATIC_SECRET` to .env.example
- [ ] 9.4 Add `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` to .env.example
- [ ] 9.5 Document GitHub App setup process in README or separate doc

## 10. Execute Content Migration

- [ ] 10.1 Run migration script: `pnpm migrate:content`
- [ ] 10.2 Review conversion report for issues
- [ ] 10.3 Manually fix any flagged conversion problems
- [ ] 10.4 Test content rendering for sample posts
- [ ] 10.5 Test content rendering for sample podcasts
- [ ] 10.6 Verify all component blocks render correctly

## 11. Integration Testing

- [ ] 11.1 Test Keystatic admin UI loads at `/keystatic`
- [ ] 11.2 Test GitHub authentication flow
- [ ] 11.3 Test creating a new post
- [ ] 11.4 Test editing an existing post
- [ ] 11.5 Test creating a new podcast
- [ ] 11.6 Test editing an existing podcast
- [ ] 11.7 Test `/news` page renders correctly
- [ ] 11.8 Test `/news/[slug]` pages render correctly
- [ ] 11.9 Test `/podcasts` page renders correctly
- [ ] 11.10 Test `/podcasts/[slug]` pages render correctly
- [ ] 11.11 Test i18n routing still works
- [ ] 11.12 Test image uploads and display

## 12. Remove TinaCMS Code

- [ ] 12.1 Remove `tina/` directory entirely
- [ ] 12.2 Remove `lib/auth.ts` (magic-link authentication)
- [ ] 12.3 Remove `lib/email.ts` (SendGrid magic link emails)
- [ ] 12.4 Remove `lib/github.ts` (draft branch/PR workflow for TinaCMS)
- [ ] 12.5 Remove `app/admin/` directory entirely
- [ ] 12.6 Remove `app/api/tina/` directory
- [ ] 12.7 Remove TinaCMS-related middleware code

## 13. Remove TinaCMS Dependencies

- [ ] 13.1 Remove `tinacms` from package.json
- [ ] 13.2 Remove `@tinacms/datalayer` from package.json
- [ ] 13.3 Remove `@tinacms/auth` from package.json
- [ ] 13.4 Remove `tinacms-gitprovider-github` from package.json
- [ ] 13.5 Remove `redis-level` from package.json
- [ ] 13.6 Remove `@sendgrid/mail` from package.json
- [ ] 13.7 Run `pnpm install` to clean up lockfile

## 14. Update Scripts

- [ ] 14.1 Update `dev` script (remove `tinacms dev -c`)
- [ ] 14.2 Update `build` script (remove TinaCMS build steps)
- [ ] 14.3 Remove `build-local` script or update for Keystatic
- [ ] 14.4 Remove `build-public` script or update for Keystatic
- [ ] 14.5 Update `start` script (remove `tinacms build`)

## 15. Cleanup and Documentation

- [ ] 15.1 Remove old `.mdx` files after confirming `.mdoc` works (optional, can keep for reference)
- [ ] 15.2 Update `openspec/project.md` to reflect Keystatic instead of TinaCMS
- [ ] 15.3 Remove obsolete environment variables from .env files
- [ ] 15.4 Update any internal documentation referencing `/admin`
- [ ] 15.5 Create GitHub App for production and configure env vars in Vercel

## 16. Final Local Verification

- [ ] 16.1 Run full build: `pnpm build`
- [ ] 16.2 Run lint: `pnpm lint`
- [ ] 16.3 Test production build locally
- [ ] 16.4 Test admin UI locally at `/keystatic`
- [ ] 16.5 Test content rendering locally (news, podcasts)
- [ ] 16.6 Verify all commits are local (do not push)

## 17. Deployment (Post-Approval)

> **Note:** These tasks are performed only after migration is reviewed and approved.

- [ ] 17.1 Push changes to remote
- [ ] 17.2 Deploy to preview environment
- [ ] 17.3 Test admin UI in preview environment
- [ ] 17.4 Test content rendering in preview environment
