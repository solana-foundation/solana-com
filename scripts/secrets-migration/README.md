# Vercel Redeploy

This directory now exists for one purpose only:

- redeploy a selected Vercel project after Doppler has already synced secrets
- run a basic smoke test against the production URL

It does not manage secrets, export secrets, or push secrets into Vercel.

## Operating Model

- Doppler is the source of truth
- Doppler's native Vercel integration populates Vercel environment variables
- GitHub Actions redeploys the affected Vercel project
- `VERCEL_TOKEN` is the only required GitHub Actions secret

## Managed Projects

The project list lives in
[`projects.solana-apps.json`](./projects.solana-apps.json). Each entry only
defines:

- `vercel_project`
- `smoke_urls`

Current projects:

- `solana-com`
- `solana-com-docs`
- `solana-com-media`
- `templates`
- `solana-com-accelerate`
- `solana-com-breakpoint-2`

## GitHub Workflow

Workflow file:

- [`.github/workflows/secrets-rollout.yml`](../../.github/workflows/secrets-rollout.yml)

What it does:

1. selects one Vercel project
2. redeploys the current production deployment
3. waits for the new deployment to reach `READY`
4. runs the configured smoke URLs until one passes

Required GitHub Actions secret:

- `VERCEL_TOKEN`

## Local Usage

Redeploy one project:

```bash
export PROJECT_FILTER=solana-com
./scripts/secrets-migration/redeploy-from-vercel.sh
```

Redeploy all configured projects sequentially:

```bash
./scripts/secrets-migration/redeploy-from-vercel.sh
```

## When To Use This

Use it after:

- rotating a secret in Doppler
- confirming Doppler synced the new value into Vercel
- wanting the app to pick up the new Vercel environment variables

Do not use this directory to manage Doppler itself. That is already handled by
the Doppler -> Vercel integration.
