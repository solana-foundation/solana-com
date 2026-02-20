# Capability: TinaCMS Self-Hosted Admin

Self-hosted content management with Git-based draft/publish workflow.

## ADDED Requirements

### Requirement: Self-Hosted Backend Infrastructure

The system SHALL implement the required TinaCMS self-hosted backend components per [Tina manual setup docs](https://tina.io/docs/self-hosted/manual-setup).

#### Scenario: Database adapter configuration

- **WHEN** the application starts in production
- **THEN** it SHALL connect to Vercel KV using `KV_REST_API_URL` and `KV_REST_API_TOKEN`
- **AND** use the Redis adapter for content indexing

#### Scenario: Local development mode

- **WHEN** `TINA_PUBLIC_IS_LOCAL` is set to `"true"`
- **THEN** the system SHALL use local filesystem storage instead of Vercel KV
- **AND** TinaCMS operates in local mode without external dependencies

#### Scenario: Backend API route

- **WHEN** the TinaCMS admin makes GraphQL requests
- **THEN** they SHALL be handled by `/api/tina/gql` endpoint
- **AND** the endpoint uses `TinaNodeBackend` from `@tinacms/datalayer`

#### Scenario: Content API URL override

- **WHEN** TinaCMS config is loaded
- **THEN** `contentApiUrlOverride` SHALL be set to `/api/tina/gql`
- **AND** the admin UI connects to the self-hosted backend instead of Tina Cloud

#### Scenario: Git provider configuration

- **WHEN** content is saved in production
- **THEN** it SHALL be committed to GitHub via `tinacms-gitprovider-github`
- **AND** use `GITHUB_PERSONAL_ACCESS_TOKEN` for authentication

#### Scenario: Server-side content queries

- **WHEN** content is queried during SSR/SSG
- **THEN** it SHALL use the generated `databaseClient` for direct database access
- **AND** not require API requests to Tina Cloud

### Requirement: Magic Link Authentication

The admin panel SHALL use email-based magic link authentication with JWT session tokens.

#### Scenario: Unauthenticated user visits admin

- **WHEN** a user navigates to `/admin/*` without a valid JWT session cookie
- **THEN** they are redirected to `/admin/login`

#### Scenario: User requests magic link

- **WHEN** a user enters their email on the login page
- **AND** the email exists in the `ADMIN_WHITELIST` environment variable
- **THEN** a magic link is sent to that email via SendGrid
- **AND** a confirmation message is displayed

#### Scenario: Non-whitelisted email rejected

- **WHEN** a user enters an email NOT in `ADMIN_WHITELIST`
- **THEN** no email is sent
- **AND** a generic "check your email" message is displayed (no information leak)

#### Scenario: Magic link clicked

- **WHEN** a user clicks the magic link within its validity period (15 minutes)
- **THEN** a JWT session token is generated
- **AND** the token is stored in an HTTP-only secure cookie
- **AND** the user is redirected to `/admin`

#### Scenario: Expired magic link

- **WHEN** a user clicks a magic link after expiration
- **THEN** they are redirected to `/admin/login` with an error message
- **AND** they must request a new link

#### Scenario: Valid JWT session

- **WHEN** a user navigates to `/admin/*` with a valid JWT cookie
- **THEN** access is granted without re-authentication

#### Scenario: JWT token expiration

- **WHEN** a JWT token expires (24 hours default)
- **THEN** the user is redirected to `/admin/login` on next request

#### Scenario: Logout

- **WHEN** a user clicks "Logout" in the admin
- **THEN** the JWT cookie is cleared
- **AND** they are redirected to `/admin/login`

#### Scenario: TinaNodeBackend auth integration

- **WHEN** the TinaCMS admin makes authenticated API requests
- **THEN** the custom auth adapter SHALL validate the JWT session cookie
- **AND** authorize the request if the session is valid
- **AND** reject the request with 401 if the session is invalid or missing

### Requirement: Whitelist Configuration

The system SHALL restrict admin access to pre-approved email addresses.

#### Scenario: Whitelist from environment

- **WHEN** the application starts
- **THEN** it SHALL read `ADMIN_WHITELIST` as a comma-separated list of emails

#### Scenario: Multiple whitelisted users

- **WHEN** `ADMIN_WHITELIST=alice@example.com,bob@example.com`
- **THEN** both alice@example.com and bob@example.com can request magic links

### Requirement: Draft Branch Creation

The system SHALL create a Git branch for draft content when an editor starts editing.

#### Scenario: Create draft for new content

- **WHEN** an editor clicks "New Draft" for a content type
- **THEN** a new branch is created with naming pattern `draft/[collection]/[slug]`
- **AND** the editor is redirected to the content editor on that branch
- **AND** the content file exists only on the draft branch (not on main)

#### Scenario: Draft-only content indicator

- **WHEN** viewing content that exists only on the draft branch (not yet published)
- **THEN** the admin UI SHALL display a "Draft only - not yet published" badge
- **AND** the content is visible in Vercel preview deployments for the draft branch
- **AND** the content does not appear in production until published

#### Scenario: Create draft for existing content

- **WHEN** an editor clicks "Edit" on published content
- **THEN** a new branch is created from `main` containing the current content
- **AND** the editor can modify the content without affecting the published version

### Requirement: Draft Saving

The system SHALL commit content changes to the draft branch on save.

#### Scenario: Save draft content

- **WHEN** an editor clicks "Save Draft" in the admin UI
- **THEN** the current content is committed to the draft branch via GitHub API
- **AND** a success confirmation is displayed

#### Scenario: Auto-save prevention of data loss

- **WHEN** content is modified in the editor
- **THEN** changes are held in memory until explicitly saved
- **AND** the UI indicates unsaved changes exist

### Requirement: One-Click Publish

The system SHALL merge draft branches to main when the editor clicks "Publish".

#### Scenario: Publish draft content

- **WHEN** an editor clicks "Publish" on a draft
- **THEN** a pull request is created from the draft branch to `main`
- **AND** the pull request is automatically merged (squash)
- **AND** the draft branch is deleted after successful merge
- **AND** the editor is notified of successful publication

#### Scenario: Publish with merge conflict

- **WHEN** an editor clicks "Publish" but the draft branch has conflicts with `main`
- **THEN** the merge fails gracefully
- **AND** the editor is notified of the conflict
- **AND** the draft branch is preserved for manual resolution

### Requirement: Draft Management

The system SHALL allow editors to view and manage existing drafts.

#### Scenario: List all drafts

- **WHEN** an editor views the drafts panel
- **THEN** all branches matching `draft/*` pattern are listed
- **AND** each draft shows the content title, last modified date, and branch name

#### Scenario: Switch between drafts

- **WHEN** an editor selects a different draft from the list
- **THEN** the editor loads the content from that draft branch
- **AND** TinaCMS local GraphQL reflects the branch content

#### Scenario: Discard draft

- **WHEN** an editor clicks "Discard Draft"
- **THEN** a confirmation dialog SHALL appear warning that changes will be permanently deleted
- **AND** if the editor confirms, the draft branch is deleted via GitHub API
- **AND** the editor is redirected to the content list
- **AND** if the editor cancels, no action is taken
- **AND** any unpublished changes are permanently lost

### Requirement: Local Mode Enforcement

The system SHALL operate entirely in TinaCMS local mode without cloud dependencies.

#### Scenario: No cloud configuration required

- **WHEN** the application is deployed
- **THEN** it SHALL NOT require `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, or TinaCMS Cloud connection

#### Scenario: Content stored in filesystem

- **WHEN** content is saved via the admin
- **THEN** it is written to the local filesystem under `content/` directory
- **AND** synced to GitHub via API calls

### Requirement: GitHub Integration

The system SHALL integrate with GitHub API for all Git operations.

#### Scenario: GitHub authentication

- **WHEN** the application performs Git operations
- **THEN** it SHALL authenticate using `GITHUB_TOKEN` environment variable

#### Scenario: Repository configuration

- **WHEN** Git operations are performed
- **THEN** they target the repository specified by `GITHUB_OWNER` and `GITHUB_REPO` environment variables
