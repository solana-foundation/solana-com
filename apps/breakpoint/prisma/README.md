# Community Awards database

The nominations endpoint uses the Postgres database defined in
`docker-compose.yml`. It is deliberately separate from other local services and
listens on host port `54329`.

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

## Use the production database from local development

This connects the local app directly to the live Community Awards database.
Reading and submitting nominations locally reads and writes production data. You
need Google Cloud access to the `breakpoint-26-awards-db` project and the
`awards_app` database password from the team's approved secret store.

From `apps/breakpoint`, set the following value in the ignored `.env` file. Do
not add the real password to `.env.example` or commit it:

```dotenv
POSTGRES_URL=postgresql://awards_app:<password>@127.0.0.1:5432/breakpoint_awards?sslmode=require
```

In a separate terminal, authenticate with Google Cloud if necessary and keep an
IAP tunnel open:

```bash
gcloud auth login
gcloud compute start-iap-tunnel postgres-01 5432 \
  --local-host-port=127.0.0.1:5432 \
  --zone=us-central1-a \
  --project=breakpoint-26-awards-db
```

Then start the app without starting the local Docker database:

```bash
pnpm dev
```

Do not run `pnpm db:up`, `pnpm db:reset`, `pnpm prisma:migrate`, or
`pnpm prisma:deploy` while `.env` points at production. Those commands may run
schema migrations against the live database. When finished, stop the tunnel and
restore the local `POSTGRES_URL` from `.env.example` before using the local
database commands again.

Useful commands:

```bash
pnpm db:down   # stop the container, retaining its data volume
pnpm db:reset  # remove all local nominations and recreate the schema
pnpm prisma:migrate # create a new migration after editing schema.prisma
```

## Who are you here for map

The `/here-for` map shares this database, schema, and migration history. Its
tables use a `here_for_` prefix next to the `awards_` tables, and
`here_for_people.claimedById` points at `awards_users`, so the X sign-in reuses
the awards ballot. Do not point it at a separate database.

To fill the local map with synthetic people after `pnpm db:up`, run from
`apps/breakpoint`:

```bash
pnpm here-for:seed            # ~5,600 people and 15,000 adds, then a layout
pnpm here-for:seed --reset    # replace the seeded map and its seed-* users
pnpm here-for:layout          # recompute the layout snapshot only
```

The seed writes to whatever `POSTGRES_URL` points at. Only run it against the
local container.

For deployed environments, set `POSTGRES_URL` to the managed Postgres connection
string. Production Vercel builds run `pnpm prisma:deploy` before `next build`
and fail before deployment if the connection string is absent. Preview builds do
not migrate a database automatically.

## Voting release

Voting shares the nominations ballot cookie and `awards_users` table. The
`20261013000000_add_awards_votes` migration creates `awards_votes` with one
immutable vote per user and category. Preview builds do not migrate databases,
so deploy this migration to the preview database before exercising vote writes.

The reviewed ballot is defined in `src/content/awards-finalists.ts`. Each of the
12 category IDs has four distinct finalists with display names, X handles, and
local profile images in `public/assets/awards/finalists`. The route rejects
votes if the roster is incomplete. Update the ballot map and its images together
when the awards owner changes a finalist. Do not derive ballot options from live
nomination counts. Profile images were retrieved from the finalists' public X
profiles on October 20, 2026.

Set the UTC voting opening and closing times in `defaultVotingWindow` in
`src/lib/awards-campaign.ts`. Set the nominations opening time in
`defaultNominationsWindow`; its closing time follows the voting opening time.
Voting cannot open before nominations close, and closing must follow opening.
Submitted votes are final.

Before enabling the window in Production, verify the migration against the
target database and smoke test `/breakpoint/awards`,
`/[locale]/breakpoint/awards`, and `/breakpoint/api/votes` through the preview
rewrite. Check the pre-open boundary, one successful vote and refresh, duplicate
vote rejection, and the closed boundary. Confirm both desktop and mobile views.

## Production safeguards

Mutuals X sign-ins use `here_for_x_sessions` for server-enforced 30-day expiry
and logout revocation. Deploy the `20261026000000_here_for` migration before
serving the updated app; the production build's `prisma:deploy` step does this
automatically. Existing cookies from before this change require a fresh X
sign-in. OAuth request cookies expire after ten minutes. Expired session records
are removed when a new session is created. Fresh X sign-in binds each handle to
its stable X user ID. Profile writes check that binding inside the transaction;
the awards ballot remains the browser association.

The unreleased Mutuals tables, sessions, and ownership binding share one
migration. If a disposable local or preview database already applied an earlier
version of these migrations, recreate that database before applying the
consolidated history. Do not reset the production Awards database.

The nominations route requires these sensitive Vercel environment variables in
Production and Preview:

- `AWARDS_COOKIE_SECRET`: a unique 32+ character value used to sign the
  HTTP-only ballot cookie.
- `AWARDS_IP_HASH_SECRET`: a unique 32+ character value used to derive a
  pseudonymous network identifier for fraud review. New records do not store raw
  IP addresses.

Review the nomination and voting dates in `src/lib/awards-campaign.ts` before
opening the campaign. The API enforces those boundaries even when clients have
an existing ballot.

The `solana-com-breakpoint-2` Vercel project also needs WAF rate-limit rules
named `Limit Community Awards submission bursts`,
`Limit Community Awards hourly submissions`, and
`Limit Community Awards ballot reads`. The submission-rule IDs are enforced by
the API, so production fails closed if either is missing.

Add voting WAF rate-limit rules with IDs `breakpoint-awards-vote-burst` and
`breakpoint-awards-vote-hourly` before opening voting. Both are checked by the
vote API in Production; a missing rule fails closed. The existing ballot read
rule should also cover `/breakpoint/api/votes` GET requests. The burst check
uses the validated ballot ID as its rate-limit key so voters sharing a network
do not consume each other's burst allowance. The hourly check stays keyed by
network address, providing a cross-ballot abuse ceiling. The Production WAF
rules allow 120 burst checks per minute and 600 hourly checks per hour. Keep the
hourly ceiling high enough for voters on shared networks when adjusting these
rules.

## Production database operations

Vercel Fluid Compute and elastic concurrency are enabled for the Breakpoint
project. The awards API keeps one process-wide Prisma client per warm function
instance and forces its runtime pool to one database connection with a 10-second
pool timeout. Prisma migrations continue to use `POSTGRES_URL` directly and do
not inherit the runtime pool override. The PostgreSQL `awards_app` role is
capped at 80 concurrent sessions, leaving headroom under the server's
100-connection limit for migrations and administration.

The Compute Engine data disk `postgres-01-data` has the regional resource policy
`breakpoint-awards-postgres-daily-3d` attached. It creates one snapshot each day
at 03:00 UTC, stores snapshots in the US multi-region, and expires snapshots
after three days (approximately the latest three daily backups). Automatic
snapshots are retained if the source disk is deleted. PostgreSQL stores its data
under `/var/lib/postgresql` on this disk; the boot disk is not part of this
backup policy.
