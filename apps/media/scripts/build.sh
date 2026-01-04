#!/bin/bash
# Build script that dynamically sets NEXT_PUBLIC_TINA_BRANCH based on the current branch

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

echo "Building with NEXT_PUBLIC_TINA_BRANCH=$BRANCH"

# For non-main branches, skip cloud checks to allow building with schema changes
# that haven't been synced to the remote yet
if [ "$BRANCH" != "main" ]; then
  echo "Non-main branch detected, skipping cloud schema checks"
  pnpm tinacms build --skip-search-index --skip-cloud-checks && pnpm next build
else
  # For main branch, run full schema validation
  pnpm tinacms build --skip-search-index && pnpm next build
fi
