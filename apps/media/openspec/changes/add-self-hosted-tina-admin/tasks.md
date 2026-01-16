# Tasks: Self-Hosted TinaCMS Admin with GitHub Workflow

## 1. Magic Link Authentication

- [ ] 1.1 Add environment variables (`ADMIN_WHITELIST`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`)
- [ ] 1.2 Install `jose` package for JWT handling
- [ ] 1.3 Create `lib/auth.ts` with JWT utilities (createMagicLinkToken, createSessionToken, verifyToken)
- [ ] 1.4 Create `lib/email.ts` with SendGrid magic link email function
- [ ] 1.5 Add SendGrid environment variables (`SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`)
- [ ] 1.6 Create `/admin/login/page.tsx` with email input form
- [ ] 1.7 Create `/admin/login/actions.ts` with sendMagicLink server action
- [ ] 1.8 Create `/admin/auth/callback/route.ts` to validate token and set JWT cookie
- [ ] 1.9 Create `/admin/logout/route.ts` to clear JWT cookie
- [ ] 1.10 Update `middleware.ts` to validate JWT cookie for `/admin/*` routes
- [ ] 1.11 Add logout button to admin UI
- [ ] 1.12 Test magic link flow end-to-end

## 2. GitHub Integration

- [ ] 2.1 Add GitHub environment variables (`GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`)
- [ ] 2.2 Create `lib/github.ts` with GitHub API client functions
- [ ] 2.3 Implement `createDraftBranch(collection, slug)` function
- [ ] 2.4 Implement `commitContent(branch, filePath, content)` function
- [ ] 2.5 Implement `createPullRequest(branch, title)` function
- [ ] 2.6 Implement `mergePullRequest(prNumber)` function
- [ ] 2.7 Implement `deleteBranch(branch)` function
- [ ] 2.8 Implement `listDraftBranches()` function
- [ ] 2.9 Add error handling and rate limit awareness

## 3. Server Actions

- [ ] 3.1 Create `app/admin/actions.ts` for admin server actions
- [ ] 3.2 Implement `saveDraft` action (commits to current branch)
- [ ] 3.3 Implement `publishContent` action (create PR, merge, delete branch)
- [ ] 3.4 Implement `createNewDraft` action (creates branch, redirects to editor)
- [ ] 3.5 Implement `discardDraft` action (deletes branch without merge)
- [ ] 3.6 Implement `listDrafts` action (returns all draft branches)

## 4. Admin UI Customization

- [ ] 4.1 Create custom TinaCMS plugin for workflow UI (`tina/plugins/workflow.tsx`)
- [ ] 4.2 Add draft status indicator component showing current branch
- [ ] 4.3 Add "Save Draft" button that triggers commit action
- [ ] 4.4 Add "Publish" button with confirmation dialog
- [ ] 4.5 Add "Discard Draft" button with confirmation
- [ ] 4.6 Create draft selector/switcher component
- [ ] 4.7 Add loading states and error handling to UI
- [ ] 4.8 Register plugin in TinaCMS config

## 5. TinaCMS Configuration Updates

- [ ] 5.1 Update `tina/config.tsx` to enforce local mode
- [ ] 5.2 Remove cloud-specific configuration (clientId, token, branch)
- [ ] 5.3 Remove search indexer configuration
- [ ] 5.4 Update build scripts to remove cloud dependencies
- [ ] 5.5 Update `.env.example` with new variables, remove old ones

## 6. Testing and Validation

- [ ] 6.1 Test full workflow: create draft → edit → save → publish
- [ ] 6.2 Test error scenarios (network failure, merge conflict)
- [ ] 6.3 Test magic link authentication (valid/invalid emails, expired tokens)
- [ ] 6.4 Test JWT session expiration and renewal
- [ ] 6.5 Verify Vercel preview deployments work with draft branches
- [ ] 6.6 Test on staging environment before production

## 7. Documentation

- [ ] 7.1 Update project README with new admin setup instructions
- [ ] 7.2 Document environment variables in `.env.example`
- [ ] 7.3 Create editor guide for draft/publish workflow
