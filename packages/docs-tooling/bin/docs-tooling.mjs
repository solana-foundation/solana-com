#!/usr/bin/env node
// Thin launcher so `pnpm exec docs-tooling <command>` works from anywhere in
// the workspace, running the TypeScript sources with tsx.
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const tsxCli = require.resolve("tsx/cli");
const result = spawnSync(
  process.execPath,
  [tsxCli, path.join(here, "..", "src", "cli.ts"), ...process.argv.slice(2)],
  { stdio: "inherit" },
);
process.exit(result.status ?? 1);
