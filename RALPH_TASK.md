---
task: Production-Grade Self-Hosted Tina CMS
test_command: "cd apps/media && pnpm dev"
completion_criteria:
  - Google OAuth authentication restricted to @solana.org users
  - TinaCMS local database using Upstash Redis for indexing
  - GitHub API integration for content persistence on staging branch
  - Secure draft mode preview system implemented
  - Deployment process updated to remove TinaCloud dependencies
max_iterations: 50
---

# Task: Production-Grade Self-Hosted Tina CMS

## Overview

Implement a secure, self-hosted Tina CMS backend for `apps/media`, replacing
TinaCloud and incorporating all security, operational, and UX considerations.
This will allow Solana Foundation content editors to manage content securely via
GitHub and Upstash Redis, moving away from third-party hosting for the CMS data
layer.

## Requirements

### Functional Requirements

1. **Secure Authentication**
   - Implement Google OAuth using Auth.js v5 (NextAuth).
   - Restrict access to `@solana.org` emails and specified whitelisted users.
   - Protect `/admin/*` and `/api/tina/*` routes using JWT-based sessions.

2. **Content Persistence**
   - Use the GitHub API to commit content changes directly to the `staging`
     branch.
   - Support standard CRUD operations for posts, podcasts, and other CMS
     collections.
   - Handle media uploads by saving to `public/uploads/` and committing them to
     the repository.

3. **Data Indexing**
   - Implement a local data layer using Upstash Redis (via
     `upstash-redis-level`).
   - Support full content indexing from the filesystem for local development and
     build steps.
   - Support incremental re-indexing via GitHub webhooks for production
     environments.

4. **Draft & Preview Mode**
   - Implement Next.js Draft Mode for real-time content previews.
   - Use secure, signed tokens (PREVIEW_SECRET) to protect draft access.
   - Provide a "Preview" button in the Tina Admin interface.

### Non-Functional Requirements

- **Compatibility**: Must work with Next.js 15 App Router.
- **Security**: Mandatory email verification and domain restriction for all
  editor access.
- **Performance**: High-speed GraphQL queries served from the Redis index.
- **Resilience**: Graceful fallbacks to static content if the CMS backend is
  unreachable.

## Constraints

- Framework: **Next.js 15**
- Auth: **Auth.js v5** with npm package `tinacms/authjs` bridge
- Storage: **GitHub API** (@octokit/rest)
- Indexing: **Upstash Redis** (REST API)
- Branching: Target **staging** branch for all CMS-driven commits

## Success Criteria

### Phase 0: Dependencies & Config

1. [x] Install required packages: `next-auth`, `tinacms/authjs`,
       `@upstash/redis`, `upstash-redis-level`, `@octokit/rest`
2. [x] Update `.env.example` with all self-hosted environment variables
3. [x] Update `turbo.json` globalEnv (Remove TinaCloud vars, add
       Auth/Redis/GitHub vars)
4. [x] Update `package.json` scripts for `dev`, `build`, and `db:init`

### Phase 1: Authentication & Security

5. [x] Create `apps/media/auth.ts` with Google OAuth and @solana.org restriction
6. [x] Implement `api/auth/[...nextauth]` routes
7. [x] Protect `/admin` and `/api/tina` in `middleware.ts`
8. [x] Create login UI at `app/admin/login/page.tsx`

### Phase 2: Tina Data Layer

9. [x] Implement `tina/database.ts` (TinaLevelClient + Redis/Filesystem)
10. [x] Implement `tina/github-provider.ts` for GitHub API persistence
11. [x] Update `tina/config.tsx` to use self-hosted GQL and Auth provider
12. [x] Create `db:init` script for content indexing

### Phase 3: API & GraphQL

13. [x] Create `/api/tina/gql` route for handling CMS queries/mutations
14. [x] Implement `/api/tina/[...paths]` for media and schema handling
15. [x] Implement mutation-level authentication
16. [x] Create `/api/tina/webhook` for GitHub re-indexing
17. [x] Implement custom media handler for Git-backed uploads

### Phase 4: Preview & Draft Mode

18. [x] Implement `/api/draft` and `/api/draft/disable` routes
19. [x] Update page components to support `draftMode().isEnabled`
20. [x] Add "Preview" button to Tina Admin edit interface

### Phase 5: Build & Operations

21. [ ] Update `scripts/build.sh` to include database warm-up
22. [ ] Update `README.md`, `DEPLOYMENT.md`, and `MIGRATION.md`
23. [ ] Complete end-to-end verification of the editor workflow

## Technical Notes

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           apps/media                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐            │
│  │   /admin     │────▶│  Auth.js v5  │────▶│ Google OAuth │            │
│  │   (TinaCMS)  │     │  (auth.ts)   │     │ (@solana.org)│            │
│  └──────────────┘     └──────────────┘     └──────────────┘            │
│         │                                                                │
│         ▼                                                                │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐            │
│  │ /api/tina/gql│────▶│ Tina Database│────▶│ Upstash Redis│            │
│  │  (GraphQL)   │     │ (database.ts)│     │ (indexing)   │            │
│  └──────────────┘     └──────────────┘     └──────────────┘            │
│         │                                                                │
│         ▼                                                                │
│  ┌──────────────┐     ┌──────────────┐                                  │
│  │ GitHubProvider────▶│ GitHub API   │──▶ staging branch               │
│  │ (mutations)  │     │ (@octokit)   │                                  │
│  └──────────────┘     └──────────────┘                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Environment Variables

| Variable                       | Description                                  |
| :----------------------------- | :------------------------------------------- |
| `AUTH_SECRET`                  | Auth.js v5 secret (openssl rand -base64 32)  |
| `AUTH_GOOGLE_ID`               | Google Cloud Console Client ID               |
| `AUTH_GOOGLE_SECRET`           | Google Cloud Console Client Secret           |
| `AUTH_WHITELIST`               | Comma-separated list of extra allowed emails |
| `KV_REST_API_URL`              | Upstash Redis REST URL                       |
| `KV_REST_API_TOKEN`            | Upstash Redis REST Token                     |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub PAT with `repo` scope                 |
| `GITHUB_REPO_OWNER`            | `solana-foundation`                          |
| `GITHUB_REPO_NAME`             | `solana-com`                                 |
| `GITHUB_BRANCH`                | `staging`                                    |
| `PREVIEW_SECRET`               | Secret for Next.js Draft Mode tokens         |

## Example Commands

```bash
# Initialize local database and index all markdown files
pnpm db:init

# Run the media app with self-hosted Tina
cd apps/media && pnpm dev

# Build the app (includes indexing step)
cd apps/media && pnpm build
```

## Ralph Instructions

When working on this task:

1. Read `.ralph/progress.md` to see what's been done
2. Check `.ralph/guardrails.md` for signs to follow
3. Work on the next incomplete criterion from the checklist above
4. Update `.ralph/progress.md` with your progress
5. Commit your changes with descriptive messages
6. Run tests frequently to verify progress
7. When ALL criteria are met (all `[ ]` → `[x]`), output:
   `<ralph>COMPLETE</ralph>`
8. If stuck on the same issue 3+ times, output: `<ralph>GUTTER</ralph>`
