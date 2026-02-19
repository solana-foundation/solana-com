# Tasks: Self-Hosted TinaCMS Admin with GitHub Workflow

## 0. Tina Self-Hosted Infrastructure (Required)

- [x] 0.1 Install required packages: `@tinacms/datalayer`, `tinacms-gitprovider-github`, `@vercel/kv`, `upstash-redis-level`
- [x] 0.2 Create Vercel KV store in Vercel dashboard and link to project
- [x] 0.3 Add Vercel KV env vars (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) - auto-populated when linked
- [x] 0.4 Add GitHub env vars (`GITHUB_PERSONAL_ACCESS_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`)
- [x] 0.5 Create `tina/database.ts` with Vercel KV adapter and GitHub provider
- [x] 0.6 Create `app/api/tina/[...routes]/route.ts` with TinaNodeBackend
- [x] 0.7 Update `tina/config.tsx` to add `contentApiUrlOverride: '/api/tina/gql'`
- [x] 0.8 Add `TINA_PUBLIC_IS_LOCAL=true` to `.env.example` for development
- [ ] 0.9 Update content queries to use `databaseClient` for server-side rendering

## 1. Magic Link Authentication

- [x] 1.1 Add environment variables (`ADMIN_WHITELIST`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`) to `.env.example`
- [x] 1.2 Install `jose` package for JWT handling
- [x] 1.3 Create `lib/auth.ts` with JWT utilities (createMagicLinkToken, createSessionToken, verifyToken)
- [x] 1.4 Create `lib/email.ts` with SendGrid magic link email function
- [x] 1.5 Add SendGrid environment variables (`SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`) to `.env.example`
- [x] 1.6 Create `/admin/login/page.tsx` with email input form
- [x] 1.7 Create `/admin/login/actions.ts` with sendMagicLink server action
- [x] 1.8 Create `/admin/auth/callback/route.ts` to validate token and set JWT cookie
- [x] 1.9 Create `/admin/logout/route.ts` to clear JWT cookie
- [x] 1.10 Update `middleware.ts` to validate JWT cookie for `/admin/*` routes
- [x] 1.11 Create custom auth adapter for TinaNodeBackend integration (bridge magic link JWT to Tina auth)
- [x] 1.12 Add logout button to admin UI (in workflow plugin)
- [x] 1.13 Test magic link flow end-to-end (JWT generation/validation verified)

## 2. GitHub Integration

- [x] 2.1 Verify GitHub environment variables are set (covered in section 0)
- [x] 2.2 Create `lib/github.ts` with GitHub API client functions
- [x] 2.3 Implement `createDraftBranch(collection, slug)` function
- [x] 2.4 Implement `commitContent(branch, filePath, content)` function
- [x] 2.5 Implement `createPullRequest(branch, title)` function
- [x] 2.6 Implement `mergePullRequest(prNumber)` function
- [x] 2.7 Implement `deleteBranch(branch)` function
- [x] 2.8 Implement `listDraftBranches()` function
- [x] 2.9 Add error handling and rate limit awareness

## 3. Server Actions

- [x] 3.1 Create `app/admin/actions.ts` for admin server actions
- [ ] 3.2 Implement `saveDraft` action (commits to current branch) - Note: TinaCMS handles saves via GitHubProvider
- [x] 3.3 Implement `publishContent` action (create PR, merge, delete branch)
- [x] 3.4 Implement `createNewDraft` action (creates branch, redirects to editor)
- [x] 3.5 Implement `discardDraft` action (deletes branch without merge)
- [x] 3.6 Implement `listDrafts` action (returns all draft branches)

## 4. Admin UI Customization

- [x] 4.1 Create custom TinaCMS plugin for workflow UI (`tina/plugins/workflow.tsx`)
- [x] 4.2 Add draft status indicator component showing current branch and "Draft only" badge for unpublished content
- [ ] 4.3 Add "Save Draft" button that triggers commit action - Note: TinaCMS has built-in save functionality
- [x] 4.4 Add "Publish" button with confirmation dialog
- [x] 4.5 Add "Discard Draft" button with confirmation
- [x] 4.6 Create draft selector/switcher component (Workflow screen shows all drafts)
- [x] 4.7 Add loading states and error handling to UI
- [x] 4.8 Register plugin in TinaCMS config

## 5. TinaCMS Configuration Updates

- [x] 5.1 Update `tina/config.tsx` with `contentApiUrlOverride` for self-hosted mode
- [x] 5.2 Remove cloud-specific configuration (clientId, token)
- [x] 5.3 Remove search indexer configuration
- [ ] 5.4 Update build scripts to remove cloud dependencies
- [x] 5.5 Update `.env.example` with new variables, remove old ones

## 6. Testing and Validation

- [ ] 6.1 Test full workflow: create draft → edit → save → publish
- [ ] 6.2 Test error scenarios (network failure, merge conflict)
- [ ] 6.3 Test magic link authentication (valid/invalid emails, expired tokens)
- [ ] 6.4 Test JWT session expiration and renewal
- [ ] 6.5 Verify Vercel preview deployments work with draft branches
- [ ] 6.6 Test on staging environment before production

## 7. Documentation

- [ ] 7.1 Update project README with new admin setup instructions
- [x] 7.2 Document environment variables in `.env.example`
- [ ] 7.3 Create editor guide for draft/publish workflow
