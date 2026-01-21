# Accelerate App Deployment Guide

This guide explains how to deploy the `apps/accelerate` app as a route under
`apps/web` in Vercel.

## Overview

The accelerate app is deployed as a separate Vercel project and proxied through
the main web app at `solana.com/accelerate`. This follows the same pattern as
the docs, media, and templates apps.

## Architecture

```
User visits: solana.com/accelerate
  ↓ (Next.js rewrite in web app)
https://solana-com-accelerate.vercel.app/accelerate
  ↓ (Next.js rewrite in accelerate app)
https://solana-com-accelerate.vercel.app/ (root)
```

## Configuration Changes (Already Complete)

The following configuration changes have been made:

### 1. Accelerate App Configuration (`apps/accelerate/next.config.ts`)

- ✅ Added `assetPrefix: "/accelerate-assets"` for static assets
- ✅ Added `NEXT_PUBLIC_APP_NAME: "accelerate"` environment variable
- ✅ Added rewrites to handle `/accelerate` routes (rewrites to root)
- ✅ Configured image path with asset prefix

### 2. Web App URL Configuration (`apps/web/apps-urls.js`)

- ✅ Added `ACCELERATE_APP_URL` with Vercel related project support
- ✅ Configured development URL: `http://localhost:3004`
- ✅ Configured production URL: Auto-detected via `@vercel/related-projects`

### 3. Web App Rewrites (`apps/web/rewrites-redirects.mjs`)

- ✅ Added asset rewrites for `/accelerate-assets/:path+`
- ✅ Added route rewrites for `/accelerate` and `/accelerate/:path*`
- ✅ Added locale-aware rewrites for `/:locale/accelerate`

### 4. Header Link Configuration (`packages/ui-chrome/src/url-config.ts`)

- ✅ Added internal routes pattern: `/^\/accelerate(?:\/|$)/`
- ✅ Links to `/accelerate/*` now use Next.js Link for client-side navigation

### 5. Environment Variables (`turbo.json`)

- ✅ Added `NEXT_PUBLIC_ACCELERATE_APP_URL` to `globalEnv`

### 6. Vercel Configuration (`apps/accelerate/vercel.json`)

- ✅ Created `vercel.json` with monorepo build settings

## Vercel Deployment Steps

### Step 1: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New Project**
3. Import your repository (if not already imported)
4. Configure the project:
   - **Project Name**: `solana-com-accelerate`
   - **Root Directory**: `apps/accelerate`
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: (auto-detected from `vercel.json`)
   - **Output Directory**: `.next` (auto-detected from `vercel.json`)
   - **Install Command**: `pnpm install` (auto-detected)

### Step 2: Configure Build Settings

The `vercel.json` file already contains the correct settings:

```json
{
  "buildCommand": "cd ../.. && pnpm install && pnpm --filter solana-com-accelerate build",
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "outputDirectory": ".next"
}
```

Vercel should auto-detect these, but verify in: **Settings → General → Build &
Development Settings**

### Step 3: Link as Related Project

1. Go to the **web app** project in Vercel (`solana-com` or similar)
2. Navigate to **Settings → Related Projects**
3. Click **Add Related Project**
4. Select `solana-com-accelerate` from the list
5. This enables `@vercel/related-projects` to auto-detect the deployment URL

### Step 4: Set Environment Variables

In the **accelerate app** Vercel project, add any required environment
variables:

**Settings → Environment Variables**

Common variables (if needed):

- `NEXT_PUBLIC_APP_NAME=accelerate` (already set in `next.config.ts`)
- Any other app-specific environment variables

### Step 5: Deploy

1. Push your changes to the repository
2. Vercel will automatically:
   - Build the accelerate app
   - Deploy to `solana-com-accelerate.vercel.app`
   - The web app will automatically proxy `/accelerate` requests

### Step 6: Verify Deployment

1. **Direct Access**: Visit
   `https://solana-com-accelerate.vercel.app/accelerate`
   - Should show the accelerate app homepage

2. **Proxied Access**: Visit `https://solana.com/accelerate`
   - Should show the same content, proxied through the web app

3. **Assets**: Check that CSS/JS load correctly
   - Assets should be served from `/accelerate-assets/_next/...`

## Development

### Local Development

1. **Start the accelerate app**:

   ```bash
   cd apps/accelerate
   pnpm dev
   ```

   Runs on `http://localhost:3004`

2. **Start the web app** (in a separate terminal):

   ```bash
   cd apps/web
   pnpm dev
   ```

   Runs on `http://localhost:3000`

3. **Access the app**:
   - Direct: `http://localhost:3004/accelerate` (rewrites to root)
   - Proxied: `http://localhost:3000/accelerate` (proxies to localhost:3004)

### Environment Variables

For local development, you can override the app URL:

```bash
# In apps/web
NEXT_PUBLIC_ACCELERATE_APP_URL=http://localhost:3004 pnpm dev
```

## Troubleshooting

### Issue: 404 on solana.com/accelerate

**Solutions:**

1. Verify the accelerate app is deployed:
   `https://solana-com-accelerate.vercel.app/accelerate`
2. Check that the web app has the accelerate app linked as a related project
3. Verify rewrites in `apps/web/rewrites-redirects.mjs` are correct
4. Check Vercel deployment logs for both projects

### Issue: Assets not loading (404 on CSS/JS)

**Solutions:**

1. Verify `assetPrefix: "/accelerate-assets"` is set in `next.config.ts`
2. Check that asset rewrites are in `apps/web/rewrites-redirects.mjs`
3. Ensure the accelerate app's `vercel.json` build command is correct
4. Clear browser cache and hard refresh

### Issue: Build fails on Vercel

**Solutions:**

1. Verify `pnpm` is available (Vercel auto-detects from `pnpm-lock.yaml`)
2. Check that workspace packages build correctly
3. Review build logs for specific errors
4. Ensure root directory is set to `apps/accelerate` in Vercel settings

### Issue: Changes not deploying

**Solutions:**

1. Check Vercel dashboard for build status
2. Verify the correct branch is connected
3. Try manual deploy: `cd apps/accelerate && vercel --prod`
4. Check that related project link is still active

## Related Documentation

- [Multi-App Architecture Guide](../../MULTI_APP_ARCHITECTURE.md) - General
  guide for adding new apps
- [Media App Deployment](../media/DEPLOYMENT.md) - Similar deployment pattern
- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos) - Vercel's monorepo
  documentation
