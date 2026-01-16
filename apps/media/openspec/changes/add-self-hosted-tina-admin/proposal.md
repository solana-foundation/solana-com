# Change: Self-Hosted TinaCMS Admin with GitHub Workflow

## Why

The current TinaCMS setup supports cloud-based content management, but for full editorial control and cost-effective self-hosting, a Git-native workflow is preferred. This approach uses GitHub branches as the draft/publish mechanism, allowing editors to work on content without cloud dependencies while leveraging existing CI/CD infrastructure for publishing.

## What Changes

- **Self-hosted backend infrastructure**: Vercel KV database adapter + TinaNodeBackend API route
- **Magic link authentication**: Email-based login with JWT sessions via SendGrid
- **Whitelist access control**: Only pre-approved emails in `ADMIN_WHITELIST` can access admin
- **Branch-based drafts**: Content edits happen on feature branches (draft state)
- **One-click publish**: Merge to main triggers deployment (published state)
- **GitHub integration**: PR creation and merge functionality from within the admin via `tinacms-gitprovider-github`
- **Remove TinaCMS Cloud dependency**: Fully self-hosted with Vercel KV for content indexing

## Impact

- Affected specs: `tina-admin` (new capability)
- Affected code:
  - `tina/database.ts` - Vercel KV adapter + GitHub git provider (new)
  - `tina/config.tsx` - Add `contentApiUrlOverride`, remove cloud config
  - `app/api/tina/[...routes]/route.ts` - TinaNodeBackend API endpoint (new)
  - `app/admin/login/` - Login page and magic link flow (new)
  - `app/admin/auth/callback/` - Token validation and session creation (new)
  - `lib/auth.ts` - JWT utilities + TinaNodeBackend auth adapter (new)
  - `lib/email.ts` - SendGrid integration (new)
  - `lib/github.ts` - GitHub API integration (new)
  - `middleware.ts` - JWT validation for admin routes
  - Environment variables:
    - Add: `KV_REST_API_URL`, `KV_REST_API_TOKEN` (Vercel KV)
    - Add: `GITHUB_PERSONAL_ACCESS_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`
    - Add: `ADMIN_WHITELIST`, `JWT_SECRET`, `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`
    - Add: `TINA_PUBLIC_IS_LOCAL` (dev only)
    - Remove: `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, `TINA_SEARCH_INDEXER_TOKEN`

## Benefits

- No recurring TinaCMS Cloud costs (Vercel KV has generous free tier)
- Full control over content workflow
- Git history as audit trail
- Preview deployments per branch (already supported by Vercel)
- Tighter Vercel integration (KV, deployments, env vars)
