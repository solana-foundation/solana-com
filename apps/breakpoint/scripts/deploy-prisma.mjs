import { spawnSync } from "node:child_process";

// Production deployments own schema promotion. Local and preview builds remain
// database-free so contributors can build the event site without credentials.
if (process.env.VERCEL_ENV !== "production") process.exit(0);

if (!process.env.POSTGRES_URL) {
  console.error(
    "POSTGRES_URL is required for a production Breakpoint deployment.",
  );
  process.exit(1);
}

const result = spawnSync("pnpm", ["run", "prisma:deploy"], {
  shell: process.platform === "win32",
  stdio: "inherit",
});

process.exit(result.status ?? 1);
