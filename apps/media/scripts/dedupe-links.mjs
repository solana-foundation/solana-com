import fs from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2).filter((arg) => arg !== "--");
const shouldApply = args.includes("--apply");
const LINKS_DIR = path.resolve("content/links");

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : null;
}

function getFrontmatterValue(frontmatter, fieldName) {
  const match = frontmatter.match(
    new RegExp(`^${fieldName}:\\s*(?:"([^"]*)"|'([^']*)'|(.+))$`, "m"),
  );

  return match?.[1] ?? match?.[2] ?? match?.[3]?.trim() ?? null;
}

function normalizeUrl(rawUrl) {
  const trimmed = rawUrl.trim();

  try {
    const url = new URL(trimmed);
    url.hash = "";

    if (
      (url.protocol === "https:" && url.port === "443") ||
      (url.protocol === "http:" && url.port === "80")
    ) {
      url.port = "";
    }

    url.hostname = url.hostname.toLowerCase();

    if (url.pathname !== "/") {
      url.pathname = url.pathname.replace(/\/+$/, "");
    }

    const filteredParams = [...url.searchParams.entries()]
      .filter(([key]) => !key.toLowerCase().startsWith("utm_"))
      .sort(([left], [right]) => left.localeCompare(right));

    url.search = "";
    for (const [key, value] of filteredParams) {
      url.searchParams.append(key, value);
    }

    return url.toString();
  } catch {
    return trimmed;
  }
}

function parsePublishedAt(rawValue) {
  if (!rawValue) {
    return null;
  }

  const date = new Date(rawValue);
  return Number.isNaN(date.getTime()) ? null : date;
}

function compareEntriesBySourcePriority(left, right) {
  const leftTime = left.publishedAtDate?.getTime() ?? Number.NEGATIVE_INFINITY;
  const rightTime =
    right.publishedAtDate?.getTime() ?? Number.NEGATIVE_INFINITY;

  if (leftTime !== rightTime) {
    return rightTime - leftTime;
  }

  return left.fileName.localeCompare(right.fileName);
}

function formatPublishedAt(entry) {
  return entry.publishedAtRaw ?? "missing";
}

async function readLinkEntries() {
  const fileNames = (await fs.readdir(LINKS_DIR))
    .filter((fileName) => fileName.endsWith(".mdx"))
    .sort();

  const entries = [];

  for (const fileName of fileNames) {
    const absolutePath = path.join(LINKS_DIR, fileName);
    const content = await fs.readFile(absolutePath, "utf8");
    const frontmatter = parseFrontmatter(content);

    if (!frontmatter) {
      console.warn(`skip ${fileName} (missing frontmatter)`);
      continue;
    }

    const rawUrl = getFrontmatterValue(frontmatter, "url");
    if (!rawUrl) {
      console.warn(`skip ${fileName} (missing url)`);
      continue;
    }

    const publishedAtRaw = getFrontmatterValue(frontmatter, "publishedAt");

    entries.push({
      absolutePath,
      fileName,
      rawUrl,
      normalizedUrl: normalizeUrl(rawUrl),
      publishedAtRaw,
      publishedAtDate: parsePublishedAt(publishedAtRaw),
    });
  }

  return entries;
}

function findDuplicateGroups(entries) {
  const byUrl = new Map();

  for (const entry of entries) {
    const existing = byUrl.get(entry.normalizedUrl) ?? [];
    existing.push(entry);
    byUrl.set(entry.normalizedUrl, existing);
  }

  return [...byUrl.values()]
    .filter((group) => group.length > 1)
    .map((group) => group.sort(compareEntriesBySourcePriority))
    .sort((left, right) => compareEntriesBySourcePriority(left[0], right[0]));
}

async function removeDuplicates(groups) {
  let removedCount = 0;

  for (const group of groups) {
    const [source, ...duplicates] = group;

    console.log(
      `keep ${source.fileName} (${formatPublishedAt(source)}) <- ${source.normalizedUrl}`,
    );

    for (const duplicate of duplicates) {
      await fs.unlink(duplicate.absolutePath);
      removedCount += 1;
      console.log(
        `remove ${duplicate.fileName} (${formatPublishedAt(duplicate)})`,
      );
    }
  }

  return removedCount;
}

const entries = await readLinkEntries();
const duplicateGroups = findDuplicateGroups(entries);

if (duplicateGroups.length === 0) {
  console.log("No duplicate links found.");
  process.exit(0);
}

console.log(
  `Found ${duplicateGroups.length} duplicate URL group${duplicateGroups.length === 1 ? "" : "s"}.`,
);

for (const group of duplicateGroups) {
  const [source, ...duplicates] = group;

  console.log("");
  console.log(
    `source ${source.fileName} (${formatPublishedAt(source)}) <- ${source.normalizedUrl}`,
  );

  for (const duplicate of duplicates) {
    console.log(
      `duplicate ${duplicate.fileName} (${formatPublishedAt(duplicate)})`,
    );
  }
}

if (!shouldApply) {
  console.log("");
  console.log("Dry run only. Re-run with --apply to remove duplicates.");
  process.exit(1);
}

console.log("");
const removedCount = await removeDuplicates(duplicateGroups);
console.log("");
console.log(
  `Removed ${removedCount} duplicate file${removedCount === 1 ? "" : "s"}.`,
);
