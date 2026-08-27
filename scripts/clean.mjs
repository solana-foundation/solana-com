import { opendir, rm } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const cleanRoot = process.argv[2]
  ? resolve(process.cwd(), process.argv[2])
  : repoRoot;

const cleanRootFromRepo = relative(repoRoot, cleanRoot);

if (
  cleanRootFromRepo === ".." ||
  cleanRootFromRepo.startsWith(`..${sep}`) ||
  isAbsolute(cleanRootFromRepo)
) {
  throw new Error(`Clean target must be inside the repository: ${cleanRoot}`);
}

const generatedDirectoryNames = new Set([
  ".next",
  ".source",
  ".turbo",
  "coverage",
  "dist",
  "node_modules",
  "playwright-report",
  "test-results",
]);

async function cleanDirectory(directory) {
  const entries = await opendir(directory);

  for await (const entry of entries) {
    if (entry.name === ".git") {
      continue;
    }

    const entryPath = join(directory, entry.name);

    if (generatedDirectoryNames.has(entry.name)) {
      await rm(entryPath, {
        force: true,
        maxRetries: 3,
        recursive: true,
        retryDelay: 100,
      });
      console.log(`Removed ${relative(repoRoot, entryPath)}`);
      continue;
    }

    if (entry.isDirectory()) {
      await cleanDirectory(entryPath);
    }
  }
}

await cleanDirectory(cleanRoot);
