# Content Management System Specification

## ADDED Requirements

### Requirement: Keystatic CMS Configuration

The system SHALL provide content management through Keystatic CMS with collections for posts, podcasts, authors, categories, tags, CTAs, switchbacks, and links.

#### Scenario: Collections defined in config

- **WHEN** the Keystatic configuration is loaded
- **THEN** all nine collections SHALL be available: posts, podcasts, authors, categories, tags, ctas, switchbacks, links, and global singleton

#### Scenario: Collection paths match content directories

- **WHEN** a collection is configured
- **THEN** the path SHALL map to `content/{collection}/*` directory

#### Scenario: Slug field configuration

- **WHEN** a collection entry is created
- **THEN** the slug SHALL be generated from the title field

### Requirement: Keystatic Admin UI

The system SHALL provide a web-based admin interface for content management at the `/keystatic` route.

#### Scenario: Admin UI accessible

- **WHEN** an authenticated user navigates to `/keystatic`
- **THEN** the Keystatic admin dashboard SHALL be displayed

#### Scenario: Collection editing

- **WHEN** a user navigates to `/keystatic/collection/{name}`
- **THEN** a list of entries for that collection SHALL be displayed

#### Scenario: Entry editing

- **WHEN** a user navigates to `/keystatic/collection/{name}/item/{slug}`
- **THEN** the entry edit form SHALL be displayed with all configured fields

### Requirement: GitHub Authentication

The system SHALL authenticate admin users via GitHub OAuth using Keystatic's built-in GitHub mode.

#### Scenario: Unauthenticated access

- **WHEN** an unauthenticated user accesses `/keystatic`
- **THEN** the user SHALL be prompted to authenticate with GitHub

#### Scenario: Successful authentication

- **WHEN** a user completes GitHub OAuth
- **THEN** the user SHALL have access to the admin UI if they have write access to the repository

#### Scenario: Unauthorized user

- **WHEN** a user without repository write access attempts to authenticate
- **THEN** access to the admin UI SHALL be denied

### Requirement: Keystatic API Routes

The system SHALL provide API routes for Keystatic CMS operations at `/api/keystatic/[...params]`.

#### Scenario: API route handler

- **WHEN** the Keystatic admin UI makes API requests
- **THEN** the route handler SHALL process read, write, and delete operations

#### Scenario: GET and POST methods

- **WHEN** API requests are made
- **THEN** both GET and POST methods SHALL be supported

### Requirement: Content Reader API

The system SHALL provide a Reader API for fetching content from Keystatic collections in server components and API routes.

#### Scenario: Reader initialization

- **WHEN** the reader module is imported
- **THEN** a configured reader instance SHALL be available with access to all collections

#### Scenario: Fetch all entries

- **WHEN** `reader.collections.{name}.all()` is called
- **THEN** all entries in the collection SHALL be returned with slug and entry data

#### Scenario: Fetch single entry

- **WHEN** `reader.collections.{name}.read(slug)` is called
- **THEN** the entry with matching slug SHALL be returned or null if not found

#### Scenario: List slugs

- **WHEN** `reader.collections.{name}.list()` is called
- **THEN** an array of all entry slugs SHALL be returned

### Requirement: Markdoc Content Format

The system SHALL store content in Markdoc (.mdoc) format with YAML frontmatter.

#### Scenario: File format

- **WHEN** a content entry is saved
- **THEN** the file SHALL be saved with `.mdoc` extension

#### Scenario: Frontmatter preservation

- **WHEN** content is saved
- **THEN** YAML frontmatter SHALL contain all non-body fields

#### Scenario: Content field

- **WHEN** a collection has `format: { contentField: 'body' }`
- **THEN** the body content SHALL be stored as Markdoc below the frontmatter

### Requirement: Markdoc Component Blocks

The system SHALL support custom Markdoc component blocks for rich content editing.

#### Scenario: BlockQuote component

- **WHEN** a BlockQuote is inserted in content
- **THEN** the Markdoc syntax `{% blockquote authorName="..." %}...{% /blockquote %}` SHALL be used

#### Scenario: Video component

- **WHEN** a Video block is inserted
- **THEN** the Markdoc syntax `{% video src="..." /%}` SHALL be used

#### Scenario: Tweet component

- **WHEN** a Tweet embed is inserted
- **THEN** the Markdoc syntax `{% tweet id="..." /%}` SHALL be used

#### Scenario: Gallery component

- **WHEN** a Gallery is inserted
- **THEN** the Markdoc syntax `{% gallery images=[...] /%}` SHALL be used

#### Scenario: Admin preview

- **WHEN** a component block is used in the admin editor
- **THEN** a visual preview SHALL be displayed via ContentView

### Requirement: Post Collection Schema

The system SHALL define a posts collection with fields for SEO, title, heroImage, description, author, date, categories, tags, body, cta, and switchback.

#### Scenario: Required fields

- **WHEN** a post is created
- **THEN** title SHALL be required

#### Scenario: SEO object

- **WHEN** SEO fields are edited
- **THEN** the seo object SHALL contain title, description, noIndex, noFollow, openGraph, and twitter sub-objects

#### Scenario: Author reference

- **WHEN** an author is selected
- **THEN** the field SHALL reference the authors collection via relationship field

#### Scenario: Categories array

- **WHEN** categories are selected
- **THEN** multiple category references SHALL be stored in an array

#### Scenario: Tags array

- **WHEN** tags are selected
- **THEN** multiple tag references SHALL be stored in an array

#### Scenario: Body content

- **WHEN** post body is edited
- **THEN** Markdoc content with component blocks SHALL be supported

### Requirement: Podcast Collection Schema

The system SHALL define a podcasts collection with fields for title, slug, description, coverImage, riversideProjectId, riversideStudioId, category, tags, featured, displayOrder, status, hosts, applePodcastsUrl, spotifyUrl, rssFeedUrl, releaseFrequency, and firstEpisodeDate.

#### Scenario: Required fields

- **WHEN** a podcast is created
- **THEN** title, slug, coverImage, and status SHALL be required

#### Scenario: Status options

- **WHEN** status is selected
- **THEN** options SHALL be "active", "archived", or "coming-soon"

#### Scenario: Hosts array

- **WHEN** hosts are added
- **THEN** multiple author references SHALL be stored in an array

#### Scenario: Display order

- **WHEN** displayOrder is set
- **THEN** lower numbers SHALL appear first in listings

### Requirement: Migration Script

The system SHALL provide a TSX migration script to convert existing MDX content files to Markdoc format and reorganize image assets.

#### Scenario: Script execution

- **WHEN** the migration script is run
- **THEN** all MDX files in content directories SHALL be processed

#### Scenario: Frontmatter conversion

- **WHEN** an MDX file is converted
- **THEN** YAML frontmatter SHALL be preserved with updated image paths

#### Scenario: JSX to Markdoc

- **WHEN** JSX components are found in content
- **THEN** they SHALL be converted to equivalent Markdoc tag syntax

#### Scenario: Image folder reorganization

- **WHEN** the migration script processes images
- **THEN** image folders SHALL be reorganized to match Keystatic's expected directory structure while preserving content-type sub-folders (posts/, podcasts/, authors/, links/) to prevent filename collisions

#### Scenario: Image path updates

- **WHEN** image paths are found in frontmatter or content
- **THEN** they SHALL be updated to reference the new reorganized locations

#### Scenario: Conversion report

- **WHEN** migration completes
- **THEN** a report SHALL be generated listing converted files, image path changes, and any issues requiring manual review

#### Scenario: Output location

- **WHEN** files are converted
- **THEN** output SHALL be written alongside original files with `.mdoc` extension

## REMOVED Requirements

### Requirement: TinaCMS Configuration

**Reason:** Replaced by Keystatic CMS configuration.
**Migration:** Configure equivalent collections in `keystatic.config.tsx`.

### Requirement: TinaCMS GraphQL Client

**Reason:** Keystatic uses Reader API instead of GraphQL.
**Migration:** Replace GraphQL queries with Reader API calls.

### Requirement: TinaCMS Database Layer

**Reason:** Keystatic uses direct file storage, no database required.
**Migration:** Remove Redis/Vercel KV configuration.

### Requirement: Magic Link Authentication

**Reason:** Keystatic provides built-in GitHub OAuth authentication.
**Migration:** Remove custom auth code, configure Keystatic GitHub mode.

### Requirement: Draft Workflow Plugin

**Reason:** Keystatic handles branching natively via branchPrefix option.
**Migration:** Configure branchPrefix if branch-based editing needed.

### Requirement: GitHub Workflow Library

**Reason:** The `lib/github.ts` module provided draft branch creation, PR management, and merging for TinaCMS workflow. Keystatic handles Git operations internally.
**Migration:** Remove `lib/github.ts` entirely; Keystatic manages commits and branches via its built-in GitHub mode.

### Requirement: Admin Routes at /admin

**Reason:** Keystatic uses /keystatic convention.
**Migration:** Update bookmarks and add redirect from /admin to /keystatic.
