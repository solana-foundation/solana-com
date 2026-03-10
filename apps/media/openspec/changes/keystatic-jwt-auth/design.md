## Context

The Keystatic admin UI at `/keystatic` currently authenticates via GitHub OAuth in production. This requires all content editors to have GitHub accounts and access to the repository. The team wants a simpler email-based auth flow where authorized users receive a login code via SendGrid, which is verified and exchanged for a JWT session token.

Content edits must be persisted to GitHub on a `staging` branch so that Vercel can deploy a live preview. Keystatic's built-in GitHub storage mode handles the Git operations, but instead of GitHub OAuth for auth, we'll use a deploy key (or fine-grained personal access token) for write access.

Currently:

- `keystatic.config.tsx` switches between local and GitHub storage based on env vars
- `middleware.ts` passes `/keystatic` routes through without auth checks
- `/api/keystatic/[...params]/route.ts` uses Keystatic's built-in route handler
- GitHub OAuth is used for both user authentication AND Git operations

## Goals / Non-Goals

**Goals:**

- Email-based login using one-time codes sent via SendGrid
- JWT session tokens stored in HTTP-only cookies
- Allowlist of authorized emails via `AUTH_ALLOWED_EMAILS` env variable
- Protect all Keystatic admin routes and API routes behind auth
- Clean login page UI consistent with the Solana Media brand
- Keystatic writes edits to `staging` branch on GitHub via deploy key
- Vercel auto-deploys `staging` branch for draft content previews
- Edits are pushed continuously as editors save (Keystatic's default GitHub behavior)

**Non-Goals:**

- Role-based access control (all authenticated users have full CMS access)
- Self-registration or invite flows
- Password-based authentication
- Refresh token rotation (single JWT with reasonable expiry)
- Rate limiting on login attempts (can be added later)
- PR-based workflow (edits go directly to `staging`, not via PRs)
- Merging `staging` into `main` automatically (manual promotion)

## Decisions

### 1. JWT stored in HTTP-only cookie

**Choice**: Store the JWT in an HTTP-only, secure, SameSite=Lax cookie named `keystatic_session`.

**Why**: HTTP-only cookies prevent XSS token theft. SameSite=Lax allows the cookie to be sent on navigations to the Keystatic admin. No client-side token management needed.

**Alternative considered**: localStorage/sessionStorage — rejected due to XSS vulnerability and need for client-side auth header injection.

### 2. Login code flow (not magic link)

**Choice**: Send a 6-digit numeric code via SendGrid that the user enters on the login page. Code expires after 10 minutes and is single-use.

**Why**: Simpler to implement than magic links (no callback URL routing needed). Works well across email clients. Familiar UX pattern.

**Alternative considered**: Magic link with signed URL — rejected for complexity and edge cases with email client link prefetching.

### 3. Stateless code verification

**Choice**: Use a signed verification token. When user requests a code, we:

1. Generate a 6-digit code
2. Send it via SendGrid
3. Store a signed hash of `email + code + expiresAt` in an HTTP-only cookie (`keystatic_verify`)
4. On verification, hash the submitted `email + code` and compare against the cookie

**Why**: Fully stateless — works perfectly with Vercel serverless. No database or in-memory store needed.

### 4. SendGrid via REST API (fetch)

**Choice**: Use the SendGrid v3 REST API directly with `fetch()` rather than the `@sendgrid/mail` package.

**Why**: Avoids adding a dependency for a single API call. The SendGrid mail send endpoint is straightforward. Keeps the bundle small.

### 5. Keystatic GitHub storage targeting `staging` branch

**Choice**: Configure Keystatic in GitHub storage mode with:

- `repo`: `solana-foundation/solana-com`
- `pathPrefix`: `apps/media`
- `branchPrefix`: removed (edits go directly to `staging`)
- Authentication via `KEYSTATIC_GITHUB_TOKEN` env var (deploy key or fine-grained PAT)

**Why**: Keystatic's GitHub storage mode already handles creating commits and pushing to branches. By setting the target branch to `staging`, all content edits are persisted to GitHub automatically. The deploy key provides write access without requiring individual GitHub accounts.

**How it works**:

- Keystatic's client-side reads a `keystatic-gh-access-token` cookie for GitHub API auth
- On successful email login, we set this cookie with the value of `KEYSTATIC_GITHUB_TOKEN` (a fine-grained PAT with `contents: write` scope on the repo)
- Keystatic then uses this token for all GitHub API calls (reading/writing content)
- On logout, we clear both the session JWT and the GitHub token cookie
- Note: Despite the env var name, this must be a GitHub PAT (not an SSH deploy key) because Keystatic uses the GitHub REST API, not git SSH

**Alternative considered**: Local storage + custom Git push — rejected because Keystatic already has robust GitHub storage mode that handles commits, conflict resolution, and branch management.

### 6. Decoupled auth from Git operations

**Choice**: User authentication (email + JWT) is completely separate from Git operations (deploy key). The JWT gates access to the admin UI. The deploy key authenticates Git pushes to GitHub.

**Why**: Clean separation of concerns. Editors don't need GitHub accounts. The deploy key is a system-level credential, not tied to any user.

### 7. Vercel staging deployment

**Choice**: Configure Vercel to deploy the `staging` branch. This provides a live preview URL for draft content.

**Why**: Vercel natively deploys all branches with preview URLs. The `staging` branch deployment shows the latest content edits. Editors can share the staging URL for review before content is promoted to `main`.

### 8. File structure

```
app/
  keystatic/
    login/
      page.tsx           # Login page (enter email → enter code → authenticated)
  api/
    auth/
      send-code/
        route.ts         # POST: validate email, send code via SendGrid
      verify-code/
        route.ts         # POST: verify code, issue JWT cookie
      logout/
        route.ts         # POST: clear JWT cookie
lib/
  auth/
    jwt.ts               # JWT sign/verify utilities
    verify-token.ts      # Stateless code verification (sign/verify code hash)
    config.ts            # Auth configuration (parse env vars)
```

## Risks / Trade-offs

- **[Stateless code verification]** → Code hash in cookie means someone with cookie access could potentially brute-force the 6-digit code offline. Mitigated by: HMAC signing with server secret, 10-min expiry, and limiting verification attempts (3 max per code request).

- **[Single JWT secret]** → If `AUTH_JWT_SECRET` is compromised, all sessions are compromised. Mitigated by: standard secret rotation practices, reasonable token expiry (7 days).

- **[No rate limiting]** → Login endpoint could be abused to send emails. Mitigated by: only sending to allowlisted emails, can add rate limiting as a follow-up.

- **[SendGrid dependency]** → If SendGrid is down, no one can log in. Acceptable for admin-only access with low frequency.

- **[Deploy key scope]** → The deploy key has write access to the entire repo, not just `apps/media`. Mitigated by: Keystatic's `pathPrefix` limits writes to `apps/media`; deploy keys are scoped to a single repo.

- **[Staging branch divergence]** → The `staging` branch may diverge significantly from `main`. Mitigated by: regular promotion of content from `staging` to `main` (manual process, out of scope for this change).

- **[Single staging branch]** → All editors share one `staging` branch, so concurrent edits could conflict. Mitigated by: Keystatic handles Git merges internally; low editor concurrency expected.
