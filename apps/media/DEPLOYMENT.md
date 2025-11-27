# Media App Deployment Guide

This guide explains how to deploy the `@solana-com-media` app to Vercel as a separate deployment from the main `@solana-com/web` app.

## Architecture

The Solana website uses a **multi-app monorepo architecture**:

- **apps/web** - Main website (solana.com) deployed to Vercel
- **apps/media** - Media/news app deployed separately to `solana-com-media.vercel.app`

When users visit `solana.com/news/*` or `solana.com/podcasts/*`, Next.js rewrites proxy the requests to the media app's Vercel deployment.

## Local Development

### Running Both Apps

1. **Terminal 1 - Main Web App (Port 3000):**

   ```bash
   cd ~/solana-com
   pnpm --filter @solana-com/web dev
   ```

2. **Terminal 2 - Media App (Port 3001):**

   ```bash
   cd ~/solana-com
   pnpm --filter @solana-com-media dev
   ```

3. **Access the apps:**
   - Main site: http://localhost:3000
   - Media app direct: http://localhost:3001/news or http://localhost:3001/podcasts
   - Media via web proxy: http://localhost:3000/news or http://localhost:3000/podcasts (proxies to 3001)

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
   # TinaCMS Configuration
   NEXT_PUBLIC_TINA_CLIENT_ID=your_client_id
   TINA_TOKEN=your_token
   NEXT_PUBLIC_TINA_BRANCH=main
   TINA_SEARCH_INDEXER_TOKEN=your_indexer_token

   # Or use local mode
   TINA_PUBLIC_IS_LOCAL=true

   # Cross-app navigation (REQUIRED for production)
   NEXT_PUBLIC_MAIN_SITE_URL=https://solana.com

   # Vercel (auto-set)
   VERCEL_ENV=production
   VERCEL_URL=solana-com-media.vercel.app
   ```

## Environment Variables

### Required for Production

#### `NEXT_PUBLIC_MAIN_SITE_URL`

**This environment variable is REQUIRED for production deployments.**

This must be set to the main Solana.com site URL to ensure header and footer navigation links correctly route to the main site for non-media routes (like `/developers`, `/docs`, `/learn`, etc.).

**Why it's needed:**

The media app uses the shared `@solana-com/ui-chrome` package for header and footer components. These components include navigation links to various sections of solana.com. When deployed separately, the media app needs to know where to point these links.

Without this variable:

- Links to `/developers`, `/docs`, `/learn`, etc. will try to route within the media app
- These routes don't exist in the media app, resulting in 404 errors

**Configuration by environment:**

- **Production:** `https://solana.com`
- **Preview/Staging:** Your main site preview URL (e.g., `https://solana-com-git-preview.vercel.app`)
- **Local Development:** `http://localhost:3000` (if web app runs on port 3000)

**How it works:**

The `url-config.ts` helper in `@solana-com/ui-chrome` checks this variable:

- If set: All relative links in header/footer are prefixed with this URL (except `/news` and `/podcasts`)
- If not set: Links use Next.js routing (appropriate for main site deployment)

This allows the same header/footer components to work correctly in both:

1. The main site (where all routes exist)
2. The media app (where only `/news` and `/podcasts` exist)

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
http://localhost:3001/news
```

### Production

```
solana.com/news
  ↓ (Next.js rewrite)
https://solana-com-media.vercel.app/news
```

The rewrite is configured in `apps/web/rewrites-redirects.mjs`:

```javascript
const mediaUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://solana-com-media.vercel.app";

// Rewrites for new routes
{
  source: "/news",
  destination: `${mediaUrl}/news`,
  locale: false,
},
{
  source: "/news/:path*",
  destination: `${mediaUrl}/news/:path*`,
  locale: false,
},
{
  source: "/podcasts",
  destination: `${mediaUrl}/podcasts`,
  locale: false,
},
{
  source: "/podcasts/:path*",
  destination: `${mediaUrl}/podcasts/:path*`,
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
2. Update the rewrite URL in `apps/web/rewrites-redirects.mjs`:

   ```javascript
   const mediaUrl =
     process.env.NODE_ENV === "development"
       ? "http://localhost:3001"
       : "https://media.solana.com"; // your custom domain
   ```

   Note: Update all rewrite destinations to use the new domain.

## Related Files

- `apps/web/rewrites-redirects.mjs` - Rewrite configuration
- `apps/media/vercel.json` - Vercel project configuration
- `apps/media/package.json` - Build scripts and dependencies
- `turbo.json` - Monorepo task configuration
