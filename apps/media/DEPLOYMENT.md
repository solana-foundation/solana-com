# Media App Deployment Guide

This guide explains how to deploy the `@solana-com-media` app to Vercel as a separate deployment from the main `@solana-com/web` app.

## Architecture

The Solana website uses a **multi-app monorepo architecture**:

- **apps/web** - Main website (solana.com) deployed to Vercel
- **apps/media** - Media/news app deployed separately to `solana-com-media.vercel.app`

When users visit `solana.com/news/*` or `solana.com/podcasts/*`, Next.js rewrites proxy the requests to the media app's Vercel deployment. Users always access the site through `solana.com`.

## Local Development

### Running Both Apps

1. **Terminal 1 - Main Web App (Port 3000):**

   ```bash
   cd ~/solana-com
   pnpm --filter @solana-com/web dev
   ```

2. **Terminal 2 - Media App (Port 3002):**

   ```bash
   cd ~/solana-com
   pnpm --filter @solana-com-media dev
   ```

3. **Access the apps:**
   - Main site: http://localhost:3000
   - Media app direct: http://localhost:3002/news or http://localhost:3002/podcasts
   - Media via web proxy: http://localhost:3000/news or http://localhost:3000/podcasts (proxies to 3002)

## Vercel Deployment Setup

### Initial Setup (One-Time)

1. **Link the Media App to Vercel:**

   ```bash
   cd apps/media
   vercel link
   ```

   Select:
   - Scope: `solana-foundation`
   - Link to existing project: `media`
   - Or create a new project if needed

2. **Configure Vercel Project Settings:**

   In the Vercel dashboard (https://vercel.com/solana-foundation/media):
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/media`
   - **Build Command:** `cd ../.. && pnpm install && pnpm --filter @solana-com-media build`
   - **Output Directory:** `.next`
   - **Install Command:** `pnpm install`

3. **Set Environment Variables:**

   Add these in Vercel dashboard → Settings → Environment Variables:

   ```bash
   # Keystatic Configuration
   KEYSTATIC_GITHUB_CLIENT_ID=your_client_id
   KEYSTATIC_GITHUB_CLIENT_SECRET=your_client_secret
   KEYSTATIC_SECRET=your_random_secret

   # Or use local mode
   KEYSTATIC_LOCAL=true

   # Vercel (auto-set)
   VERCEL_ENV=production
   VERCEL_URL=solana-com-media.vercel.app
   ```

### Deploying Updates

Once linked, deployments happen automatically:

```bash
# From monorepo root or apps/media directory
git add .
git commit -m "Update media content"
git push origin main
```

Vercel will automatically:

1. Detect changes to `apps/media/`
2. Build the media app using the monorepo setup
3. Deploy to `solana-com-media.vercel.app`
4. The main web app will proxy `/news/*` and `/podcasts/*` requests to this deployment

### Manual Deploy (if needed)

```bash
cd apps/media
vercel --prod
```

## How the Proxy Works

### Development (NODE_ENV=development)

```
solana.com/news
  ↓ (Next.js rewrite)
http://localhost:3002/news
```

### Production

```
solana.com/news
  ↓ (Next.js rewrite)
https://solana-com-media.vercel.app/news
```

The rewrite is configured in `apps/web/rewrites-redirects.mjs`:

```javascript
import { MEDIA_APP_URL } from "./apps-urls";

// Rewrites for new routes
{
  source: "/news",
  destination: `${MEDIA_APP_URL}/news`,
  locale: false,
},
{
  source: "/news/:path*",
  destination: `${MEDIA_APP_URL}/news/:path*`,
  locale: false,
},
{
  source: "/podcasts",
  destination: `${MEDIA_APP_URL}/podcasts`,
  locale: false,
},
{
  source: "/podcasts/:path*",
  destination: `${MEDIA_APP_URL}/podcasts/:path*`,
  locale: false,
}
```

## Vercel Project Configuration

The `vercel.json` in this directory configures:

```json
{
  "buildCommand": "cd ../.. && pnpm install && pnpm --filter @solana-com-media build",
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "outputDirectory": ".next"
}
```

This ensures Vercel:

1. Navigates to the monorepo root
2. Installs all dependencies
3. Builds only the media app using Turbo's filtering
4. Outputs to the standard Next.js `.next` directory

## Header Navigation

The shared header (`@solana-com/ui-chrome`) uses `NEXT_PUBLIC_APP_NAME` to
determine link behavior. For the media app:

- Links to `/news/*` and `/podcasts/*` use Next.js Link (client navigation)
- Links to other routes use `<a>` tags (full page load back through the proxy)

Since all apps are behind `solana.com` via rewrites, links stay as relative
paths—no URL rewriting needed.

## Troubleshooting

### Issue: 404 on solana.com/news or solana.com/podcasts

**Solution:** Check that:

1. Media app is deployed successfully to `solana-com-media.vercel.app`
2. The rewrite URL in `apps/web/rewrites-redirects.mjs` matches the actual deployment URL
3. The media app is accessible directly at `https://solana-com-media.vercel.app/news` or `https://solana-com-media.vercel.app/podcasts`

### Issue: Changes not deploying

**Solution:**

1. Check Vercel dashboard for build logs
2. Ensure the root directory is set to `apps/media`
3. Verify environment variables are set correctly
4. Try manual deploy: `cd apps/media && vercel --prod`

### Issue: Build fails on Vercel

**Solution:**

1. Check that `pnpm` is available (Vercel auto-detects from `pnpm-lock.yaml`)
2. Verify workspace packages are building correctly
3. Check Turbo cache isn't causing issues
4. Review build logs for specific errors

### Issue: Media app works locally but not in production

**Solution:**

1. Check that environment variables are set in Vercel
2. Verify the build command includes the monorepo setup
3. Ensure all workspace dependencies are properly installed
4. Check that the `vercel.json` build command is correct

## Domain Configuration (Optional)

If you want a custom domain:

1. Add domain in Vercel dashboard → Settings → Domains
2. Set up domain env `NEXT_PUBLIC_MEDIA_APP_URL` for the main app `apps/web` and/or configure the rewrite in `apps/web/apps-urls.js`:

   ```javascript
   const vercelMediaUrl = `https://${withRelatedProject({
     projectName: "prj_123",
     defaultHost: "solana-com-media.vercel.app", // your custom domain
   })}`;
   ```

   Note: Update all rewrite destinations to use the new domain.

## Related Files

- `apps/web/rewrites-redirects.mjs` - Rewrite configuration
- `apps/media/vercel.json` - Vercel project configuration
- `apps/media/package.json` - Build scripts and dependencies
- `packages/ui-chrome/src/url-config.ts` - Header link routing logic
- `turbo.json` - Monorepo task configuration
