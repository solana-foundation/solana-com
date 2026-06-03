/* eslint-disable turbo/no-undeclared-env-vars */
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2).filter((arg) => arg !== "--");
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);
const MAX_FILE_SIZE_BYTES = 1.5 * 1024 * 1024;
const MAX_WIDTH = 2400;
const repoRoot = process.env.INIT_CWD
  ? path.resolve(process.env.INIT_CWD)
  : process.cwd();

if (args.length === 0) {
  process.exit(0);
}

const failures = [];

function resolveInputPath(inputPath) {
  const candidates = [
    path.resolve(inputPath),
    path.resolve(repoRoot, inputPath),
  ];

  for (const candidate of candidates) {
    if (fsSync.existsSync(candidate)) {
      return candidate;
    }
  }

  return path.resolve(inputPath);
}

for (const inputPath of args) {
  const absolutePath = resolveInputPath(inputPath);
  const extension = path.extname(absolutePath).toLowerCase();

  if (!fsSync.existsSync(absolutePath)) {
    continue;
  }

  if (!IMAGE_EXTENSIONS.has(extension)) {
    continue;
  }

  const stats = await fs.stat(absolutePath);
  const metadata = await sharp(absolutePath).metadata();
  const reasons = [];

  if (stats.size > MAX_FILE_SIZE_BYTES) {
    reasons.push(
      `size ${(stats.size / (1024 * 1024)).toFixed(2)} MB exceeds 1.50 MB`,
    );
  }

  if ((metadata.width ?? 0) > MAX_WIDTH) {
    reasons.push(`width ${metadata.width}px exceeds ${MAX_WIDTH}px`);
  }

  if (
    (extension === ".png" || extension === ".jpg" || extension === ".jpeg") &&
    (stats.size > 300 * 1024 || (metadata.width ?? 0) > 1600)
  ) {
    reasons.push(
      `use a modern web format for large raster assets (${extension})`,
    );
  }

  if (reasons.length > 0) {
    failures.push({ path: inputPath, reasons });
  }
}

if (failures.length > 0) {
  console.error("Image checks failed:\n");

  for (const failure of failures) {
    console.error(`- ${failure.path}`);
    for (const reason of failure.reasons) {
      console.error(`  - ${reason}`);
    }
  }

  console.error("\nFix with:");
  console.error(
    `pnpm media:optimize-images -- ${failures.map((failure) => `"${failure.path}"`).join(" ")}`,
  );
  process.exit(1);
}
