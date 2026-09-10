# Community Awards database

The nominations endpoint uses the Postgres database defined in
`docker-compose.dev.yml`. It is deliberately separate from other local services
and listens on host port `54329`.

From `apps/breakpoint`, create an ignored local environment file and start the
database and migrations:

```bash
cp .env.example .env
pnpm db:up
pnpm dev
```

`POSTGRES_URL` in `.env.example` already points at the local container. Open
`/breakpoint/awards`, submit an X username, and refresh: the nomination is read
back from Postgres using the anonymous browser ID.

Useful commands:

```bash
pnpm db:down   # stop the container, retaining its data volume
pnpm db:reset  # remove all local nominations and recreate the schema
pnpm prisma:migrate # create a new migration after editing schema.prisma
```

For deployed environments, set `POSTGRES_URL` to the managed Postgres connection
string. Production Vercel builds run `pnpm prisma:deploy` before `next build`
and fail before deployment if the connection string is absent. Preview builds do
not migrate a database automatically.

## Production safeguards

The nominations route requires these sensitive Vercel environment variables in
Production and Preview:

- `AWARDS_COOKIE_SECRET`: a unique 32+ character value used to sign the
  HTTP-only ballot cookie.
- `AWARDS_IP_HASH_SECRET`: a unique 32+ character value used to derive a
  pseudonymous network identifier for fraud review. New records do not store raw
  IP addresses.

Configure `AWARDS_NOMINATIONS_OPENS_AT` and `AWARDS_NOMINATIONS_CLOSES_AT` as
ISO-8601 UTC timestamps before opening the campaign. The API enforces those
boundaries even when clients have an existing ballot.

The `solana-com-breakpoint-2` Vercel project also needs WAF rate-limit rules
named `Limit Community Awards submission bursts`,
`Limit Community Awards hourly submissions`, and
`Limit Community Awards ballot reads`. The submission-rule IDs are enforced by
the API, so production fails closed if either is missing.
