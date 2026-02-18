# Design: Self-Hosted TinaCMS Admin with GitHub Workflow

## Context

TinaCMS supports two modes: cloud-based (with Tina Cloud) and self-hosted. The current setup uses Tina Cloud for production with local mode enabled for development. This design establishes a fully self-hosted approach using Git branches for content workflow, eliminating cloud dependencies while maintaining the editing experience.

**Self-Hosted Infrastructure Components (per Tina docs):**

1. **Git Provider** - GitHub via `tinacms-gitprovider-github` (handles content storage and version control)
2. **Database Adapter** - Vercel KV (powered by Upstash Redis) (indexes content for GraphQL queries)
3. **Auth Provider** - Custom magic link (integrates with TinaNodeBackend)

**Stakeholders:**

- Content editors (primary users of admin)
- Developers (maintaining the system)
- DevOps (deployment infrastructure)

## Goals / Non-Goals

**Goals:**

- Self-hosted admin with no external CMS dependencies
- Simple draft/publish workflow using Git branches
- One-click publish from admin UI
- Magic link authentication with email whitelist
- Preserve existing TinaCMS editing experience

**Non-Goals:**

- Multi-user collaboration features (beyond Git)
- Complex approval workflows
- Real-time collaborative editing
- Role-based permissions (single admin role only)
- Content scheduling (publish immediately only)

## Decisions

### 1. Authentication: Magic Link with JWT

**Decision:** Use email-based magic link authentication with JWT session tokens.

**Rationale:**

- No passwords to remember or manage
- Email verification ensures only whitelisted users can access
- JWT provides stateless session management
- More secure than basic auth (no credentials in every request)
- Better UX for occasional users

**Flow:**

```
1. User visits /admin → Redirect to /admin/login (no JWT cookie)
2. User enters email → Check against ADMIN_WHITELIST
3. If whitelisted → SendGrid sends magic link with signed token
4. User clicks link → /admin/auth/callback validates token
5. Valid token → Generate JWT, set HTTP-only cookie, redirect to /admin
6. Subsequent requests → Middleware validates JWT cookie
```

**Implementation:**

```typescript
// lib/auth.ts
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createMagicLinkToken(email: string): Promise<string> {
  return new SignJWT({ email, type: "magic-link" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(JWT_SECRET);
}

export async function createSessionToken(email: string): Promise<string> {
  return new SignJWT({ email, type: "session" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{ email: string }> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return { email: payload.email as string };
}
```

```typescript
// middleware.ts
if (
  pathname.startsWith("/admin") &&
  !pathname.startsWith("/admin/login") &&
  !pathname.startsWith("/admin/auth")
) {
  const sessionCookie = request.cookies.get("admin_session");
  if (!sessionCookie || !(await isValidSession(sessionCookie.value))) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}
```

**Security best practices:**

- Magic link tokens expire in 15 minutes
- JWT session tokens expire in 24 hours
- HTTP-only cookies (not accessible via JavaScript)
- Secure flag (HTTPS only in production)
- SameSite=Lax (CSRF protection)
- No email enumeration (same response for valid/invalid emails)

**Alternatives considered:**

- Basic auth - Less secure, poor UX, credentials sent with every request
- OAuth (GitHub) - Requires GitHub account, overkill for email whitelist
- NextAuth.js - Heavy dependency for simple magic link flow
- Passwordless libraries - Additional dependencies not needed

### 2. Draft Workflow: Git Branches

**Decision:** Use Git branches as draft containers with GitHub API for management.

**Workflow:**

1. Editor clicks "New Draft" → Creates branch `draft/[content-slug]`
2. Edits saved → Commits to draft branch automatically
3. Editor clicks "Publish" → Creates PR and auto-merges to main
4. Vercel deploys main → Content is live

**Rationale:**

- Leverages existing Git infrastructure
- Branch = isolated workspace for changes
- PRs provide audit trail
- Vercel preview deployments work out of the box

**Branch naming convention:**

- `draft/posts/[slug]` - Post drafts
- `draft/podcasts/[slug]` - Podcast drafts
- `draft/[collection]/[slug]` - Other content types

### 3. GitHub Integration: REST API via Server Actions

**Decision:** Use GitHub REST API via Next.js Server Actions for Git operations.

**Operations needed:**

- Create branch from main
- Commit file changes
- Create pull request
- Merge pull request (squash)
- Delete branch after merge

**Implementation:**

```typescript
// lib/github.ts
export async function createDraftBranch(slug: string): Promise<string>;
export async function commitContent(
  branch: string,
  path: string,
  content: string
): Promise<void>;
export async function publishDraft(branch: string): Promise<void>;
```

**Alternatives considered:**

- Git CLI via server - Requires Git installation, security concerns
- Octokit SDK - Heavy dependency for simple operations
- Simple-git - Similar to CLI approach

### 4. TinaCMS Backend Infrastructure

**Decision:** Implement required self-hosted backend with database adapter and API routes.

Per the [Tina self-hosted manual setup docs](https://tina.io/docs/self-hosted/manual-setup), self-hosting requires:

#### 4.1 Database Adapter: Vercel KV

**Rationale:** Required for production - indexes content for GraphQL queries. Local filesystem only works in development. Vercel KV is powered by Upstash Redis and integrates seamlessly with Vercel deployments.

**New file: `tina/database.ts`**

```typescript
import { createDatabase, GitHubProvider } from "@tinacms/datalayer";
import { createClient } from "@vercel/kv";
import { RedisLevel } from "upstash-redis-level";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  "main";

// Vercel KV client (uses Upstash Redis under the hood)
const kvClient = createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export default isLocal
  ? createDatabase({ gitProvider: new GitHubProvider({...}), databaseAdapter: new LocalDatabase() })
  : createDatabase({
      gitProvider: new GitHubProvider({
        repo: process.env.GITHUB_REPO!,
        owner: process.env.GITHUB_OWNER!,
        token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
        branch,
      }),
      databaseAdapter: new RedisLevel({ redis: kvClient }),
    });
```

#### 4.2 Backend API Route

**New file: `app/api/tina/[...routes]/route.ts`**

```typescript
import { TinaNodeBackend } from "@tinacms/datalayer";
import databaseClient from "../../../../tina/__generated__/databaseClient";

const backend = TinaNodeBackend({
  authentication: customMagicLinkAuth(), // Integrate with our auth
  databaseClient,
});

export const POST = backend;
export const GET = backend;
```

#### 4.3 Config Update: contentApiUrlOverride

**Changes to `tina/config.tsx`:**

```typescript
export default defineConfig({
  contentApiUrlOverride: "/api/tina/gql", // REQUIRED for self-hosted
  // ... rest of config
});
```

- Remove `clientId`, `token` from cloud config
- Remove search indexer (cloud feature)
- Add `contentApiUrlOverride` pointing to self-hosted API

**Data flow:**

```
Admin UI → /api/tina/gql → TinaNodeBackend → Database Adapter → GitHub API
```

#### 4.4 Content Querying: databaseClient

For server-side content queries (getStaticProps, RSC), use generated `databaseClient`:

```typescript
import { databaseClient } from "../tina/__generated__/databaseClient";
const results = await databaseClient.queries.postConnection();
```

### 5. Admin UI Extensions

**Decision:** Add custom pages to TinaCMS admin for workflow actions.

**New UI elements:**

- Draft status indicator (branch name, last commit)
- "Save Draft" button (commits to branch)
- "Publish" button (creates PR, merges, returns to main)
- Branch selector for viewing existing drafts

**Integration approach:**

- TinaCMS supports custom pages via `admin` config
- Use React components with Server Actions for GitHub calls

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Admin User                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   /admin/login                               │
│              (Email input form)                              │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│   ADMIN_WHITELIST       │     │    SendGrid API             │
│   (Email validation)    │     │    (Magic link email)       │
└─────────────────────────┘     └─────────────────────────────┘
                                              │
                                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   /admin/auth/callback                       │
│          (Validate token, set JWT cookie)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js Middleware                         │
│                   (JWT Cookie Validation)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    TinaCMS Admin UI                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Content Edit │  │ Draft Status │  │  Publish Btn │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│   TinaCMS Local GraphQL │     │    Server Actions           │
│   (File Operations)     │     │    (GitHub API)             │
└─────────────────────────┘     └─────────────────────────────┘
              │                               │
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│   Local File System     │     │    GitHub Repository        │
│   (content/*.mdx)       │     │    (branches, PRs)          │
└─────────────────────────┘     └─────────────────────────────┘
                                              │
                                              ▼
                              ┌─────────────────────────────┐
                              │    Vercel Deployment        │
                              │    (main branch = prod)     │
                              └─────────────────────────────┘
```

## Risks / Trade-offs

| Risk                       | Impact                               | Mitigation                                    |
| -------------------------- | ------------------------------------ | --------------------------------------------- |
| GitHub API rate limits     | High volume editing could hit limits | Batch commits, cache branch info              |
| Merge conflicts            | Multiple drafts editing same file    | One draft per content item, warn on conflicts |
| Lost work on browser close | Unsaved changes lost                 | Auto-save to branch on edit                   |
| SendGrid delivery issues   | Users can't log in                   | Implement retry, show clear error messages    |
| JWT secret compromise      | Session hijacking                    | Rotate secret, short expiration times         |
| Magic link forwarded       | Unauthorized access                  | 15-minute expiration, single-use tokens       |

## Migration Plan

1. **Phase 1: Add magic link auth** - Login page, SendGrid integration, JWT sessions
2. **Phase 2: Add GitHub integration** - Server actions for Git ops
3. **Phase 3: Add workflow UI** - Draft/publish buttons
4. **Phase 4: Remove cloud config** - Disable Tina Cloud
5. **Phase 5: Update documentation** - Editor guide

**Rollback:** Re-enable Tina Cloud by restoring environment variables.

## Environment Variables

```bash
# === Development Mode ===
TINA_PUBLIC_IS_LOCAL=true  # Set to 'true' for local dev only, omit in production

# === Admin Authentication ===
ADMIN_WHITELIST=editor@solana.com,admin@solana.com
JWT_SECRET=random-32-char-secret-here
NEXT_PUBLIC_APP_URL=https://solana-com-media.vercel.app

# === SendGrid (Magic Links) ===
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@solana.com

# === GitHub Integration (Git Provider) ===
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxxxxxx  # Note: Tina uses this name
GITHUB_OWNER=solana-foundation
GITHUB_REPO=solana-com
GITHUB_BRANCH=main  # Or use VERCEL_GIT_COMMIT_REF

# === Vercel KV (Database Adapter) ===
# Auto-populated when you link a Vercel KV store to your project
KV_REST_API_URL=https://xxxx.kv.vercel-storage.com
KV_REST_API_TOKEN=xxxxxxxxxxxx

# === Remove these (Tina Cloud) ===
# NEXT_PUBLIC_TINA_CLIENT_ID
# TINA_TOKEN
# NEXT_PUBLIC_TINA_BRANCH
# TINA_SEARCH_INDEXER_TOKEN
```

## Resolved Questions

### 1. Branch Cleanup After Publish

**Decision:** Auto-delete draft branches immediately after successful merge.

**Rationale:**

- Git commit history is preserved after merge (the branch itself adds no historical value)
- GitHub PRs retain the full diff and branch reference even after deletion
- Prevents branch accumulation and keeps the repository clean
- Editors can still view the change history via PR links

### 2. Discarding Unpublished Drafts

**Decision:** Allow discarding drafts with a confirmation dialog.

**Rationale:**

- Essential for abandoning work that shouldn't be published
- Confirmation prevents accidental deletion of work-in-progress
- Without this, abandoned branches would accumulate indefinitely

**UX Flow:**

```
Editor clicks "Discard Draft" → Confirmation modal appears:
  "This will permanently delete all unpublished changes. This cannot be undone."
  [Cancel] [Discard]
→ On confirm: Delete branch via GitHub API, redirect to content list
```

### 3. Draft-Only Content (New Posts)

**Decision:** Branch-scoped editing - new content exists only on the draft branch until published.

**Rationale:**

- Simplest mental model: draft branch = workspace, main = published
- No placeholder files or metadata tracking needed
- Consistent with how Git branching naturally works

**Behavior:**

- New content created on `draft/[collection]/[slug]` branch
- File does not exist on `main` until merge
- Admin UI shows "Draft only - not yet published" badge for new content
- Publishing (merge to main) makes the file appear in production build
- Vercel preview deployments show new content on draft branch URLs
