# App Topology

`src/index.ts` is the typed source of truth for the Solana.com apps' routing and
deployment topology. It defines app identities, workspace packages, local ports,
public route ownership, asset proxies, environment variables, and Vercel/Doppler
deployment metadata.

Use the root commands after changing the manifest:

```bash
pnpm topology:generate
pnpm topology:check
```

`topology:generate` updates the checked-in secrets-rollout project manifest.
`topology:check` validates that generated deployment data, package dev ports,
web proxy rewrites, middleware bypasses, and shared cross-app navigation still
agree with the typed manifest.
