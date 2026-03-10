## 1. Configuration & Utilities

- [x] 1.1 Create `lib/auth/config.ts` — parse and export auth env vars (`AUTH_JWT_SECRET`, `AUTH_ALLOWED_EMAILS`, `SENDGRID_API_KEY`, `AUTH_FROM_EMAIL`), export `isAuthEnabled()` helper and `getAllowedEmails()` (case-insensitive comparison)
- [x] 1.2 Create `lib/auth/jwt.ts` — JWT sign and verify functions using `jose` (Edge-compatible, no Node.js crypto dependency). Sign with `AUTH_JWT_SECRET`, payload includes `sub` (email), `iat`, `exp` (7 days)
- [x] 1.3 Create `lib/auth/verify-token.ts` — stateless code verification: `createVerifyToken(email, code)` returns HMAC-signed token, `validateVerifyToken(token, email, code)` checks signature and 10-min expiry
- [x] 1.4 Install `jose` package (`pnpm add jose --filter solana-com-media`) for Edge-compatible JWT operations

## 2. Auth API Routes

- [x] 2.1 Create `app/api/auth/send-code/route.ts` — POST handler: validate email against allowlist, generate 6-digit code, send via SendGrid REST API, set `keystatic_verify` cookie with signed token
- [x] 2.2 Create `app/api/auth/verify-code/route.ts` — POST handler: read `keystatic_verify` cookie, validate code, issue `keystatic_session` JWT cookie (HTTP-only, Secure, SameSite=Lax, 7-day expiry), clear verify cookie. Also sets `keystatic-gh-access-token` cookie with GitHub PAT.
- [x] 2.3 Create `app/api/auth/logout/route.ts` — POST handler: clear `keystatic_session` and `keystatic-gh-access-token` cookies, return redirect to `/keystatic/login`

## 3. Login Page UI

- [x] 3.1 Create `app/keystatic/login/page.tsx` — client component with two-step form: email entry → code entry. Calls send-code and verify-code APIs. On success, redirects to `/keystatic`. Displays error messages on failure. Styled with Tailwind, consistent with Solana Media branding.

## 4. Middleware Integration

- [x] 4.1 Update `middleware.ts` — add JWT verification for `/keystatic` routes (except `/keystatic/login`): redirect to `/keystatic/login` if cookie missing/invalid. Add 401 response for `/api/keystatic/*` routes if unauthenticated. Skip auth entirely if `isAuthEnabled()` returns false. Allow `/api/auth/*` routes through without checks.

## 5. Keystatic GitHub Storage (Staging Branch)

- [x] 5.1 Update `keystatic.config.tsx` — configure GitHub storage to target the `staging` branch. Remove `branchPrefix` so edits commit directly to `staging`. Use `KEYSTATIC_GITHUB_TOKEN` env var for authentication. Keep local fallback when `KEYSTATIC_LOCAL=true` or token is not set.
- [x] 5.2 Update `app/api/keystatic/[...params]/route.ts` — Keystatic route handler unchanged (auth enforced in middleware). On login, `keystatic-gh-access-token` cookie is set with the PAT so Keystatic can authenticate GitHub API calls.

## 6. GitHub & Vercel Setup

- [ ] 6.1 Create `staging` branch from `main` on GitHub (if not exists)
- [ ] 6.2 Create a fine-grained GitHub PAT with `contents:write` scope on `solana-foundation/solana-com` — store as `KEYSTATIC_GITHUB_TOKEN` (note: Keystatic uses GitHub REST API, not SSH, so a PAT is needed rather than a deploy key)
- [ ] 6.3 Add env vars to Vercel project (`solana-com-media`): `AUTH_JWT_SECRET`, `AUTH_ALLOWED_EMAILS`, `SENDGRID_API_KEY`, `AUTH_FROM_EMAIL`, `KEYSTATIC_GITHUB_TOKEN`
- [ ] 6.4 Verify Vercel auto-deploys the `staging` branch (Vercel deploys all branches by default — confirm preview URL works)

## 7. Environment & Documentation

- [x] 7.1 Add new env vars to `turbo.json` env configuration if needed: `AUTH_JWT_SECRET`, `AUTH_ALLOWED_EMAILS`, `SENDGRID_API_KEY`, `AUTH_FROM_EMAIL`, `KEYSTATIC_GITHUB_TOKEN`
- [x] 7.2 Document env vars in `.env.example` or equivalent for local development reference

## 8. Verification

- [ ] 8.1 Manual test: with auth env vars unset, verify Keystatic admin is accessible without login (dev fallback)
- [ ] 8.2 Manual test: with auth env vars set, verify unauthenticated access to `/keystatic` redirects to login page
- [ ] 8.3 Manual test: complete full login flow — enter email, receive code, enter code, access Keystatic admin
- [ ] 8.4 Manual test: verify logout clears session and redirects to login
- [ ] 8.5 Manual test: save a post in Keystatic and verify it commits to the `staging` branch on GitHub
- [ ] 8.6 Manual test: verify Vercel staging deployment updates with the new content
- [x] 8.7 Verify `pnpm build` succeeds with no type errors
