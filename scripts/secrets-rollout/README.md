# Secrets Rollout

This directory coordinates Vercel redeploys after Doppler has already synced
secret changes into Vercel.

It does not manage secrets, export secrets, or push secrets into Vercel.

## Operating Model

- Doppler is the source of truth for secret values.
- Doppler's native Vercel integration populates Vercel environment variables.
- A Doppler webhook or manual GitHub workflow run selects the affected Vercel
  project.
- GitHub Actions redeploys that project and smoke tests the production URL.
- `VERCEL_TOKEN` is the only required GitHub Actions secret.

Keep Doppler tokens, secret names, and secret values out of this repository and
out of GitHub Actions unless a future workflow genuinely needs them.

## Managed Projects

The project list lives in
[`projects.solana-apps.json`](./projects.solana-apps.json). Each entry only
defines:

- `doppler_project`
- `doppler_config`
- `vercel_project`
- `vercel_scope`
- `smoke_urls`

`doppler_project` and `doppler_config` are metadata used to map a Doppler
webhook payload to the Vercel project that should be redeployed. They are not
secret values.

## GitHub Workflow

Workflow file:

- [`.github/workflows/secrets-rollout.yml`](../../.github/workflows/secrets-rollout.yml)

What it does:

1. resolves a Vercel project from either a manual input or a Doppler dispatch
2. redeploys the current production deployment
3. waits for the new deployment to reach `READY`
4. runs the configured smoke URLs until one passes

Required GitHub Actions secret:

- `VERCEL_TOKEN`

## Doppler Webhook Shape

The workflow supports two repository dispatch shapes:

1. A direct custom dispatch payload:

```json
{
  "event_type": "doppler_secrets_update",
  "client_payload": {
    "vercel_project": "solana-com"
  }
}
```

2. A wrapped Doppler default payload, typically from a small webhook broker that
   verifies Doppler's signature before calling GitHub:

```json
{
  "event_type": "doppler_secrets_update",
  "client_payload": {
    "type": "config.secrets.update",
    "project": {
      "id": "solana-com",
      "name": "solana-com"
    },
    "config": {
      "name": "production"
    }
  }
}
```

Doppler supports signed webhooks. GitHub `repository_dispatch` does not verify
the Doppler signature itself, so use a broker if the webhook must rely on
Doppler's default signed payload.

## Local Usage

Redeploy one project:

```bash
export PROJECT_FILTER=solana-com
./scripts/secrets-rollout/redeploy-from-vercel.sh
```

Redeploy all configured projects sequentially:

```bash
./scripts/secrets-rollout/redeploy-from-vercel.sh
```

## When To Use This

Use it after:

- rotating a secret in Doppler
- confirming Doppler synced the new value into Vercel
- wanting the app to pick up the new Vercel environment variables

Do not use this directory to manage Doppler itself. That is already handled by
the Doppler -> Vercel integration.
