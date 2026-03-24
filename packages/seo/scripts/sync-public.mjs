import { dirname, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { syncPublicAssets } from "./sync-public-lib.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, "..");
const repoRoot = resolve(packageRoot, "..", "..");
const assetsDir = resolve(packageRoot, "assets");

const appFilter = process.argv[2];

await syncPublicAssets({ repoRoot, assetsDir, appFilter });
