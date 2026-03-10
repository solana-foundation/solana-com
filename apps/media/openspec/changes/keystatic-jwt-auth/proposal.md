## Why

The Keystatic admin interface currently relies on GitHub OAuth for production authentication, which requires GitHub accounts for all content editors. We need a simpler, email-based authentication system using JWT tokens and SendGrid login codes so that authorized editors can access the CMS without GitHub credentials. Additionally, content edits need to be persisted to a `staging` branch on GitHub via a deploy key, with Vercel automatically deploying draft previews from that branch.

## What Changes

- Add a custom JWT-based authentication layer in front of the Keystatic admin routes
- Implement a SendGrid-powered email login flow that sends a one-time login code
- Add an email allowlist stored as a comma-separated environment variable (`AUTH_ALLOWED_EMAILS`)
- Create a login page UI at `/keystatic/login`
- Protect all `/keystatic` routes and `/api/keystatic` routes behind JWT verification
- Configure Keystatic to use GitHub storage mode targeting the `staging` branch, authenticated via a deploy key (not GitHub OAuth)
- Content edits are continuously pushed to the `staging` branch as editors save changes
- Vercel deploys the `staging` branch automatically, providing a live preview of draft content
- **BREAKING**: Removes dependency on GitHub OAuth (`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`) for user authentication — replaced by email-based JWT auth with deploy key for Git operations

## Capabilities

### New Capabilities

- `email-auth`: JWT authentication with SendGrid email-based login codes, including login page, code verification, token management, and session handling
- `auth-middleware`: Middleware and API route protection for Keystatic admin, verifying JWT tokens and redirecting unauthenticated users
- `github-staging`: Keystatic GitHub storage configured to push edits to the `staging` branch using a deploy key, with Vercel deploying staging previews

### Modified Capabilities

## Impact

- **New env variables**: `AUTH_ALLOWED_EMAILS` (comma-separated email allowlist), `AUTH_JWT_SECRET` (JWT signing key), `SENDGRID_API_KEY` (SendGrid API key), `AUTH_FROM_EMAIL` (sender email address), `KEYSTATIC_GITHUB_TOKEN` (deploy key or GitHub token for Git push access)
- **New dependencies**: `jose` (Edge-compatible JWT)
- **Modified files**: `middleware.ts` (add auth checks for `/keystatic` routes), `keystatic.config.tsx` (GitHub storage targeting `staging` branch with token auth), `app/api/keystatic/[...params]/route.ts` (auth verification)
- **New files**: Login page components, auth API routes (`/api/auth/send-code`, `/api/auth/verify-code`, `/api/auth/logout`), JWT utility library
- **GitHub**: Deploy key with write access added at `solana-foundation/solana-com`; `staging` branch created as the edit target
- **Vercel**: Configure `staging` branch deployment for draft previews
