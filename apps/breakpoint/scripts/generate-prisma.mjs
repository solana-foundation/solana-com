import { spawnSync } from "node:child_process";

// Prisma only needs a syntactically valid datasource URL to generate the
// client. Local and preview builds do not connect to the database, so provide
// one when the deployment has no database credentials.
const result = spawnSync("pnpm", ["run", "prisma:generate"], {
  shell: process.platform === "win32",
  stdio: "inherit",
  env: {
    ...process.env,
    POSTGRES_URL:
      process.env.POSTGRES_URL ??
      "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
});

process.exit(result.status ?? 1);
