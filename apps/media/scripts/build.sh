#!/bin/bash
# Build script for self-hosted Tina CMS
# Includes database warm-up and dynamic branch configuration

set -e

# Get the branch name from Vercel environment variable or git
if [ -n "$VERCEL_GIT_COMMIT_REF" ]; then
  BRANCH="$VERCEL_GIT_COMMIT_REF"
elif [ -n "$VERCEL_GIT_COMMIT_SHA" ]; then
  # Fallback: try to get branch from git
  BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
else
  # Fallback: use git to get current branch
  BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
fi

# Export the branch for the build process
export NEXT_PUBLIC_TINA_BRANCH="$BRANCH"

echo "============================================"
echo "  Solana Media Build"
echo "============================================"
echo ""
echo "Branch: $BRANCH"
echo "Mode: ${TINA_PUBLIC_IS_LOCAL:-production}"
echo ""

# Step 1: Build Tina admin and generate types
echo "[1/3] Building Tina CMS..."
if [ "$BRANCH" != "main" ]; then
  echo "      Non-main branch detected, skipping cloud schema checks"
  pnpm tinacms build --skip-search-index --skip-cloud-checks
else
  # For main branch, run full schema validation
  pnpm tinacms build --skip-search-index
fi

# Step 2: Database warm-up (index content to Redis if in production mode)
echo ""
echo "[2/3] Database warm-up..."
if [ "$TINA_PUBLIC_IS_LOCAL" = "true" ]; then
  echo "      Skipping database indexing (local mode)"
else
  if [ -n "$KV_REST_API_URL" ] && [ -n "$KV_REST_API_TOKEN" ]; then
    echo "      Indexing content to Redis..."
    pnpm db:init || echo "      Warning: Database indexing failed, continuing build..."
  else
    echo "      Skipping database indexing (Redis not configured)"
  fi
fi

# Step 3: Build Next.js application
echo ""
echo "[3/3] Building Next.js application..."
pnpm next build

echo ""
echo "============================================"
echo "  Build complete!"
echo "============================================"
