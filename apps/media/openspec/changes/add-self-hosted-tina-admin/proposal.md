# Change: Self-Hosted TinaCMS Admin with GitHub Workflow

## Why

The current TinaCMS setup supports cloud-based content management, but for full editorial control and cost-effective self-hosting, a Git-native workflow is preferred. This approach uses GitHub branches as the draft/publish mechanism, allowing editors to work on content without cloud dependencies while leveraging existing CI/CD infrastructure for publishing.

## What Changes

- **Magic link authentication**: Email-based login with JWT sessions via SendGrid
- **Whitelist access control**: Only pre-approved emails in `ADMIN_WHITELIST` can access admin
- **Branch-based drafts**: Content edits happen on feature branches (draft state)
- **One-click publish**: Merge to main triggers deployment (published state)
- **GitHub integration**: PR creation and merge functionality from within the admin
- **Remove TinaCMS Cloud dependency**: Fully self-hosted with local file system

## Impact

- Affected specs: `tina-admin` (new capability)
- Affected code:
  - `tina/config.tsx` - Remove cloud configuration
  - `app/admin/login/` - Login page and magic link flow (new)
  - `app/admin/auth/callback/` - Token validation and session creation (new)
  - `lib/auth.ts` - JWT utilities (new)
  - `lib/email.ts` - SendGrid integration (new)
  - `lib/github.ts` - GitHub API integration (new)
  - `middleware.ts` - JWT validation for admin routes
  - Environment variables - Add whitelist, JWT secret, SendGrid keys, GitHub token

## Benefits

- No recurring TinaCMS Cloud costs
- Full control over content workflow
- Git history as audit trail
- Preview deployments per branch (already supported by Vercel)
- Simpler infrastructure with fewer external dependencies
