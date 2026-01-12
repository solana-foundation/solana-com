# Media App Deployment Guide

This guide explains how to deploy the `@solana-com-media` app with self-hosted TinaCMS to Vercel.

## Architecture

The Solana website uses a **multi-app monorepo architecture**:

- **apps/web** - Main website (solana.com) deployed to Vercel
- **apps/media** - Media/news app with self-hosted TinaCMS

### Self-Hosted TinaCMS Components

1. **Authentication**: NextAuth with Google OAuth (restricted to @solana.org)
2. **Database**: Upstash Redis for content indexing
3. **Persistence**: GitHub API for committing content changes
4. **Preview**: Next.js Draft Mode for content previews

## Prerequisites

Before deploying, you need:

1. **Google OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `https://your-domain.vercel.app/api/auth/callback/google`
     - `http://localhost:3002/api/auth/callback/google` (for development)

2. **Upstash Redis Database**
   - Create a database at [Upstash Console](https://console.upstash.com)
   - Copy the REST API URL and Token

3. **GitHub Personal Access Token**
   - Create a PAT with `repo` scope at [GitHub Settings](https://github.com/settings/tokens)
   - This allows the CMS to commit content changes

## Environment Variables

### Required for Production

```bash
# Authentication
AUTH_SECRET=                    # openssl rand -base64 32
AUTH_GOOGLE_ID=                 # Google OAuth Client ID
AUTH_GOOGLE_SECRET=             # Google OAuth Client Secret
AUTH_WHITELIST=                 # Optional: extra allowed emails

# Upstash Redis
KV_REST_API_URL=                # Upstash REST URL
KV_REST_API_TOKEN=              # Upstash REST Token

# GitHub API
GITHUB_PERSONAL_ACCESS_TOKEN=   # PAT with repo scope
GITHUB_REPO_OWNER=solana-foundation
GITHUB_REPO_NAME=solana-com
GITHUB_BRANCH=staging

# Preview
PREVIEW_SECRET=                 # openssl rand -base64 32

# Cross-app Navigation
NEXT_PUBLIC_MAIN_SITE_URL=https://solana.com

# Mode (set to false for production)
TINA_PUBLIC_IS_LOCAL=false
```

### Optional

```bash
# GitHub Webhook (for automatic re-indexing)
GITHUB_WEBHOOK_SECRET=          # For webhook signature verification
```

## Vercel Deployment Setup

### 1. Link to Vercel

```bash
cd apps/media
vercel link
```

Select:

- Scope: `solana-foundation`
- Link to existing project: `media` (or create new)

### 2. Configure Project Settings

In Vercel Dashboard → Settings:

- **Framework Preset:** Next.js
- **Root Directory:** `apps/media`
- **Build Command:** `cd ../.. && pnpm install && pnpm --filter @solana-com-media build`
- **Output Directory:** `.next`
- **Install Command:** `pnpm install`

### 3. Set Environment Variables

Add all required variables in Vercel Dashboard → Settings → Environment Variables.

### 4. Deploy

```bash
# From apps/media directory
vercel --prod
```

Or push to your repository - Vercel will auto-deploy.

## GitHub Webhook Setup (Optional)

For automatic content re-indexing when changes are pushed:

1. Go to your GitHub repository Settings → Webhooks
2. Add webhook:
   - **Payload URL:** `https://your-domain.vercel.app/api/tina/webhook`
   - **Content type:** `application/json`
   - **Secret:** Same as `GITHUB_WEBHOOK_SECRET`
   - **Events:** Just the `push` event

## Build Process

The build script (`scripts/build.sh`) performs:

1. **Tina Build**: Generates admin UI and GraphQL types
2. **Database Warm-up**: Indexes content to Redis (production only)
3. **Next.js Build**: Builds the application

```bash
# Full production build
pnpm build

# Local build (skip Redis indexing)
TINA_PUBLIC_IS_LOCAL=true pnpm build
```

## Post-Deployment Checklist

- [ ] Verify `/admin` redirects to `/admin/login`
- [ ] Confirm Google OAuth login works for @solana.org users
- [ ] Test content editing and saving
- [ ] Verify preview mode works (Ctrl+Shift+P in admin)
- [ ] Check that content changes appear on the frontend

## Troubleshooting

### Issue: Authentication fails

**Solutions:**

1. Verify `AUTH_SECRET` is set and matches between deployments
2. Check Google OAuth redirect URIs include your deployment URL
3. Ensure `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are correct

### Issue: Content not saving

**Solutions:**

1. Verify `GITHUB_PERSONAL_ACCESS_TOKEN` has `repo` scope
2. Check `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME`, `GITHUB_BRANCH` are correct
3. Ensure the PAT has access to the repository

### Issue: GraphQL queries fail

**Solutions:**

1. Verify Redis credentials (`KV_REST_API_URL`, `KV_REST_API_TOKEN`)
2. Run `pnpm db:init` to re-index content
3. Check Redis dashboard for connection issues

### Issue: Preview not working

**Solutions:**

1. Verify `PREVIEW_SECRET` is set
2. Check that draft mode cookies are being set
3. Ensure the preview URL includes a valid signed token

### Issue: 403 on CMS routes

**Solutions:**

1. Ensure you're logged in with a @solana.org email
2. Check `AUTH_WHITELIST` if using non-@solana.org email
3. Verify middleware is not blocking the request

## Local Development with Production Config

To test the full self-hosted setup locally:

```bash
# Copy production env vars (sanitize secrets!)
cp .env.production .env.local

# Set local mode to false
# TINA_PUBLIC_IS_LOCAL=false

# Run the app
pnpm dev:self-hosted
```

## Security Considerations

1. **Never commit secrets** - Use environment variables
2. **Rotate tokens regularly** - Especially `GITHUB_PERSONAL_ACCESS_TOKEN`
3. **Limit OAuth scopes** - Google OAuth should only request email/profile
4. **Use webhook secrets** - Verify GitHub webhook signatures
5. **Monitor access logs** - Watch for unauthorized access attempts

## Related Files

- `auth.ts` - NextAuth configuration
- `middleware.ts` - Route protection
- `tina/database.ts` - Database configuration
- `tina/github-provider.ts` - GitHub API integration
- `tina/config.tsx` - TinaCMS configuration
- `scripts/build.sh` - Build script
- `scripts/db-init.ts` - Database indexing
