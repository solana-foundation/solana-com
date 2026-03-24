import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2).filter((arg) => arg !== "--");
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);
const TEXT_EXTENSIONS = new Set([
  ".md",
  ".mdx",
  ".json",
  ".yml",
  ".yaml",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
]);
const MEDIA_CONTENT_ROOT = path.resolve("content");
const MEDIA_PUBLIC_ROOT = path.resolve("public");
const MAX_WIDTH = 2000;
const repoRoot = process.env.INIT_CWD
  ? path.resolve(process.env.INIT_CWD)
  : process.cwd();

if (args.length === 0) {
  console.error("Usage: node scripts/optimize-images.mjs <image-path> [...]");
  process.exit(1);
}

const toPosix = (value) => value.split(path.sep).join("/");

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

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(fullPath);
      }

      return fullPath;
    }),
  );

  return files.flat();
}

async function updateReferences(oldAbsolutePath, newAbsolutePath) {
  if (oldAbsolutePath === newAbsolutePath) {
    return 0;
  }

  const replacements = [];
  const oldContentRelativePath = toPosix(
    path.relative(MEDIA_CONTENT_ROOT, oldAbsolutePath),
  );
  const newContentRelativePath = toPosix(
    path.relative(MEDIA_CONTENT_ROOT, newAbsolutePath),
  );

  if (!oldContentRelativePath.startsWith("..")) {
    replacements.push(
      [oldContentRelativePath, newContentRelativePath],
      [encodeURI(oldContentRelativePath), encodeURI(newContentRelativePath)],
      [path.basename(oldAbsolutePath), path.basename(newAbsolutePath)],
      [
        encodeURIComponent(path.basename(oldAbsolutePath)),
        encodeURIComponent(path.basename(newAbsolutePath)),
      ],
    );
  }

  const oldPublicRelativePath = toPosix(
    path.relative(MEDIA_PUBLIC_ROOT, oldAbsolutePath),
  );
  const newPublicRelativePath = toPosix(
    path.relative(MEDIA_PUBLIC_ROOT, newAbsolutePath),
  );

  if (!oldPublicRelativePath.startsWith("..")) {
    replacements.push(
      [`/${oldPublicRelativePath}`, `/${newPublicRelativePath}`],
      [
        encodeURI(`/${oldPublicRelativePath}`),
        encodeURI(`/${newPublicRelativePath}`),
      ],
    );
  }

  let updatedFiles = 0;
  const contentFiles = await walk(MEDIA_CONTENT_ROOT);

  for (const filePath of contentFiles) {
    if (!TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase())) {
      continue;
    }

    const original = await fs.readFile(filePath, "utf8");
    let next = original;

    for (const [from, to] of replacements) {
      next = next.replaceAll(from, to);
    }

    if (next !== original) {
      await fs.writeFile(filePath, next);
      updatedFiles += 1;
    }
  }

  return updatedFiles;
}

async function optimizeImage(inputPath) {
  const absoluteInputPath = resolveInputPath(inputPath);
  const extension = path.extname(absoluteInputPath).toLowerCase();

  if (!IMAGE_EXTENSIONS.has(extension)) {
    console.log(`skip ${inputPath} (unsupported format)`);
    return;
  }

  const originalStats = await fs.stat(absoluteInputPath);
  const metadata = await sharp(absoluteInputPath).metadata();
  const hasAlpha = Boolean(metadata.hasAlpha);
  const targetExtension = extension === ".avif" ? ".avif" : ".webp";
  const outputPath =
    extension === targetExtension
      ? absoluteInputPath
      : path.join(
          path.dirname(absoluteInputPath),
          `${path.basename(absoluteInputPath, extension)}${targetExtension}`,
        );

  let pipeline = sharp(absoluteInputPath).rotate();
  if ((metadata.width ?? 0) > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  const transformed = await (
    targetExtension === ".avif"
      ? pipeline.avif({ quality: 60, effort: 6 })
      : pipeline.webp({
          quality: hasAlpha ? 90 : 82,
          alphaQuality: 95,
          effort: 6,
        })
  ).toBuffer();

  const optimizedWidth = Math.min(metadata.width ?? MAX_WIDTH, MAX_WIDTH);

  await fs.writeFile(outputPath, transformed);

  if (outputPath !== absoluteInputPath) {
    await fs.unlink(absoluteInputPath);
  }

  const updatedRefs = await updateReferences(absoluteInputPath, outputPath);
  const originalKb = (originalStats.size / 1024).toFixed(1);
  const optimizedKb = (transformed.byteLength / 1024).toFixed(1);

  console.log(
    `${toPosix(path.relative(process.cwd(), absoluteInputPath))} -> ${toPosix(path.relative(process.cwd(), outputPath))} (${originalKb} KB -> ${optimizedKb} KB, width ${metadata.width} -> ${optimizedWidth}, refs ${updatedRefs})`,
  );
}

for (const inputPath of args) {
  await optimizeImage(inputPath);
}
