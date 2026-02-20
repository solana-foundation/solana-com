# Design: TinaCMS to Keystatic Migration

## Context

The media app currently uses a self-hosted TinaCMS setup with:

- GitHub as the Git provider for content storage
- Vercel KV (Redis) for caching/database layer
- Custom magic-link authentication with email whitelisting
- Branch-based draft workflow with PR creation
- Generated GraphQL client for content queries
- MDX format with JSX component templates

This architecture requires maintaining multiple external services (SendGrid for emails, Vercel KV for caching) and custom authentication code. Keystatic provides a simpler alternative with built-in GitHub OAuth, file-based storage, and native Markdoc support.

**Stakeholders:**

- Content editors (admin users)
- Developers maintaining the codebase
- End users consuming content (no impact expected)

## Goals / Non-Goals

**Goals:**

- Simplify CMS infrastructure by removing Redis/KV dependency
- Remove custom authentication code in favor of built-in GitHub OAuth
- Maintain all existing content types and field structures
- Preserve identical frontend rendering (news, podcasts)
- Keep i18n functionality intact
- Provide migration script for content format conversion

**Non-Goals:**

- Changing the public URL structure (`/news`, `/podcasts`)
- Modifying the visual design or layout
- Adding new content types or fields
- Implementing a new authentication method beyond Keystatic's built-in GitHub OAuth
- Automatic migration execution (manual conversion preferred)

## Decisions

### Decision 1: Use Keystatic's GitHub Mode for Production

**What:** Configure Keystatic with `storage: { kind: 'github' }` for production deployments.

**Why:**

- Built-in GitHub OAuth eliminates need for custom auth code
- Content changes create commits directly to repository
- Branch-based editing available via `branchPrefix` option
- Repository collaborators with write access can use admin UI
- No external database (Redis/KV) required

**Alternatives considered:**

- Local mode only: Would require separate deployment for content editing
- Cloud CMS (Contentful, Sanity): Higher cost, vendor lock-in, migration complexity

### Decision 2: Convert Content from MDX to Markdoc Format

**What:** Migrate existing `.mdx` content files to `.mdoc` (Markdoc) format.

**Why:**

- Keystatic's `markdoc` field is more capable than the deprecated `document` field
- Markdoc provides better control over component rendering
- Cleaner syntax (`{% tag /%}` vs `<Component />`)
- Better validation and error handling

**Format mapping:**

```
MDX:     <BlockQuote authorName="John">Quote text</BlockQuote>
Markdoc: {% blockquote authorName="John" %}Quote text{% /blockquote %}
```

**Alternatives considered:**

- Keep MDX format: Keystatic supports MDX but Markdoc is recommended
- Convert to JSON: Would lose readability benefits of markdown

### Decision 3: Field Type Mappings

**TinaCMS → Keystatic field mappings:**

| TinaCMS              | Keystatic                          | Notes                              |
| -------------------- | ---------------------------------- | ---------------------------------- |
| `string`             | `fields.text()`                    | Basic text input                   |
| `string` (textarea)  | `fields.text({ multiline: true })` | Multi-line text                    |
| `string` (options)   | `fields.select()`                  | Dropdown selection                 |
| `boolean`            | `fields.checkbox()`                | Boolean toggle                     |
| `number`             | `fields.number()`                  | Numeric input                      |
| `datetime`           | `fields.datetime()`                | Date/time picker                   |
| `image`              | `fields.image()`                   | Image upload with directory config |
| `reference`          | `fields.relationship()`            | Collection reference               |
| `object`             | `fields.object()`                  | Nested fields                      |
| `object` (list)      | `fields.array()`                   | Repeatable fields                  |
| `rich-text`          | `fields.markdoc()`                 | Rich text with components          |
| `rich-text` (isBody) | `format: { contentField: 'body' }` | Main content field                 |

### Decision 4: Collection Structure Preservation

**What:** Mirror TinaCMS collection structure in Keystatic config.

**Collections to migrate (9 total):**

1. `posts` → `posts` (content/posts/\*.mdoc)
2. `podcasts` → `podcasts` (content/podcasts/\*.mdoc)
3. `authors` → `authors` (content/authors/\*.mdoc)
4. `categories` → `categories` (content/categories/\*.mdoc)
5. `tags` → `tags` (content/tags/\*.mdoc)
6. `ctas` → `ctas` (content/ctas/\*.mdoc)
7. `switchbacks` → `switchbacks` (content/switchbacks/\*.mdoc)
8. `links` → `links` (content/links/\*.mdoc)
9. `global` → `global` singleton (content/global/index.json)

**Path configuration:**

```typescript
posts: collection({
  label: "Blog Posts",
  slugField: "title",
  path: "content/posts/*",
  format: { contentField: "body" },
  // ...
});
```

### Decision 5: Admin Route Structure

**What:** Replace `/admin` with `/keystatic` for admin UI access.

**Routes:**

```
/keystatic                    → Admin dashboard
/keystatic/collection/posts   → Posts listing
/keystatic/collection/posts/item/[slug] → Edit post
/api/keystatic/[...params]    → API handler
```

**Why:** Keystatic conventions use `/keystatic` path. Changing would require custom routing.

### Decision 6: Content Component Blocks

**What:** Define Markdoc component blocks matching TinaCMS templates.

**Components to implement:**

```typescript
export const componentBlocks = {
  blockquote: block({
    label: "Block Quote",
    schema: {
      authorName: fields.text({ label: "Author" }),
    },
    // ContentView for admin preview
  }),
  datetime: block({
    /* ... */
  }),
  newslettersignup: block({
    /* ... */
  }),
  video: block({
    /* ... */
  }),
  gallery: block({
    /* ... */
  }),
  stats: block({
    /* ... */
  }),
  footnotes: block({
    /* ... */
  }),
  sup: block({
    /* ... */
  }),
  tweet: block({
    /* ... */
  }),
  iframe: block({
    /* ... */
  }),
};
```

### Decision 7: Reader API Integration

**What:** Replace TinaCMS GraphQL client with Keystatic Reader API.

**Current (TinaCMS):**

```typescript
import { client } from "@/tina/__generated__/client";
const result = await client.queries.post({ relativePath: `${slug}.mdx` });
```

**New (Keystatic):**

```typescript
import { reader } from "@/lib/reader";
const post = await reader.collections.posts.read(slug);
const { node } = await post.body();
```

**Data transformation:**

- Posts: Map reader output to existing `PostItem` type
- Podcasts: Map reader output to existing `PodcastItem` type
- Maintain API compatibility for existing components

### Decision 8: Migration Script Approach

**What:** Create a standalone TSX script for MDX to Markdoc conversion.

**Script responsibilities:**

1. Read all `.mdx` files from content directories
2. Parse YAML frontmatter (preserve as-is)
3. Convert JSX components to Markdoc tags
4. Handle rich-text field conversions
5. Output `.mdoc` files to same directory structure
6. Generate conversion report with any manual fixes needed

**Why TSX:**

- Type safety for parsing/transforming content
- Can run with `tsx` or `ts-node`
- Access to existing project types

**Manual execution rationale:**

- One-time migration, not ongoing process
- Allows review of conversion results
- Can handle edge cases manually

## Risks / Trade-offs

### Risk 1: Content Format Conversion Errors

**Risk:** JSX-to-Markdoc conversion may not handle all edge cases.
**Mitigation:**

- Generate detailed conversion report
- Flag complex JSX patterns for manual review
- Test rendering of converted content before going live

### Risk 2: Admin URL Change

**Risk:** Bookmarks and documentation referencing `/admin` will break.
**Mitigation:**

- Add redirect from `/admin` to `/keystatic` in middleware
- Update internal documentation
- Notify content editors of change

### Risk 3: GitHub OAuth vs Magic Link

**Risk:** Users previously authenticated via email may not have GitHub accounts.
**Mitigation:**

- All current admin users are developers with GitHub access
- GitHub OAuth is simpler than maintaining SendGrid integration

### Risk 4: Markdoc Rendering Differences

**Risk:** Markdoc may render content differently than MDX.
**Mitigation:**

- Test all component blocks with sample content
- Keep existing React components, only change invocation syntax
- Visual regression testing before deployment

## Migration Plan

### Phase 1: Preparation

1. Add Keystatic dependencies to package.json
2. Create `keystatic.config.tsx` with all collections
3. Create Reader API helpers (`lib/reader.ts`)
4. Create Markdoc component blocks
5. Add Keystatic admin routes

### Phase 2: Content Migration

1. Run MDX-to-Markdoc conversion script
2. Review conversion report, fix flagged issues
3. Test content rendering with new Reader API
4. Verify all posts and podcasts render correctly

### Phase 3: Integration

1. Update data fetching in `lib/post-data.ts` and `lib/podcast-data.ts`
2. Update middleware for `/keystatic` routes
3. Remove TinaCMS configuration and code
4. Remove unused dependencies
5. Update environment variables

### Phase 4: Cleanup

1. Remove `tina/` directory
2. Remove custom auth code (`lib/auth.ts`, `lib/email.ts`)
3. Remove TinaCMS admin routes
4. Update project.md documentation
5. Delete old `.mdx` files after confirming `.mdoc` works

### Rollback

If critical issues discovered:

1. Revert to previous commit (TinaCMS still functional)
2. Content files unchanged until Phase 4
3. Both CMS configs can coexist temporarily for testing

## Open Questions (Resolved)

1. **Branch editing:** Should we configure `branchPrefix` for draft editing, or use direct commits to main?
   - **Recommendation:** Start with direct commits; add branch workflow later if needed
   - **Decision:** Use direct commits to main. Branch-based workflow can be added post-migration if needed.

2. **Content preview:** Should we implement preview URLs for draft content?
   - **Recommendation:** Defer to post-migration enhancement
   - **Decision:** Yes, defer to post-migration. Focus on core migration first.

3. **Image migration:** Are existing image paths in `/uploads/` compatible with Keystatic?
   - **Investigation needed:** Test image field configuration with existing paths
   - **Decision:** Create image folder reorganization as part of the MDX-to-Markdoc migration script. The script will:
     - Reorganize image folders to match Keystatic's expected directory structure
     - Preserve content-type sub-folders (posts/, podcasts/, authors/, links/) to prevent filename collisions
     - Update image path references in the converted `.mdoc` files
     - Generate a report of any images that need manual attention
