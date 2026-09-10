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
string and run `pnpm prisma:deploy` as part of the release process.
