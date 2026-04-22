import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import yaml from "js-yaml";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "content", "upgrades");
const REPO_OWNER = "solana-foundation";
const REPO_NAME = "solana-improvement-documents";
const PROPOSALS_PATH = "proposals";

type GitHubDirectoryEntry = {
  name: string;
  path: string;
  sha: string;
  download_url: string | null;
  type: "file" | "dir";
};

type ExistingUpgradeFile = {
  description?: string;
  editorialNote?: string;
  featured?: boolean;
  heroImage?: string;
  tags?: Array<{ tag?: string }>;
};

function getHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "solana-com-media-sync",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status}): ${url}`);
  }
  return response.json() as Promise<T>;
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, { headers: getHeaders() });
  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status}): ${url}`);
  }
  return response.text();
}

function normalizeSlug(simdNumber: string) {
  return `simd-${simdNumber.padStart(4, "0")}`;
}

function normalizeEnumValue(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function toDateString(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return null;
}

function extractSummary(content: string) {
  const summaryMatch = content.match(/^## Summary\s+([\s\S]*?)(?=^##\s|\Z)/m);
  if (!summaryMatch) {
    return "";
  }

  const summaryBlock = summaryMatch[1].trim();
  const paragraphs = summaryBlock
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return paragraphs[0] || "";
}

function extractRelatedSimds(content: string, simdNumber: string) {
  const matches = Array.from(content.matchAll(/\bSIMD-(\d{4})\b/gi)).map(
    (match) => match[1],
  );

  return Array.from(new Set(matches)).filter((value) => value !== simdNumber);
}

async function readExistingUpgrade(slug: string): Promise<ExistingUpgradeFile> {
  const filePath = path.join(CONTENT_DIR, `${slug}.yaml`);

  try {
    const contents = await fs.readFile(filePath, "utf8");
    const parsed = yaml.load(contents);
    return parsed && typeof parsed === "object"
      ? (parsed as ExistingUpgradeFile)
      : {};
  } catch {
    return {};
  }
}

async function fetchLatestCommitDate(filePath: string) {
  if (!process.env.GITHUB_TOKEN) {
    return null;
  }

  try {
    const commits = await fetchJson<
      Array<{ commit?: { committer?: { date?: string } } }>
    >(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?path=${encodeURIComponent(
        filePath,
      )}&per_page=1`,
    );

    return commits[0]?.commit?.committer?.date || null;
  } catch {
    return null;
  }
}

async function main() {
  await fs.mkdir(CONTENT_DIR, { recursive: true });

  const directoryEntries = await fetchJson<GitHubDirectoryEntry[]>(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PROPOSALS_PATH}?per_page=1000`,
  );

  const proposalFiles = directoryEntries.filter(
    (entry) => entry.type === "file" && entry.name.endsWith(".md"),
  );

  let created = 0;
  let updated = 0;
  let unchanged = 0;
  let failed = 0;

  for (const entry of proposalFiles) {
    try {
      if (!entry.download_url) {
        failed += 1;
        continue;
      }

      const markdown = await fetchText(entry.download_url);
      const { data, content } = matter(markdown);
      const simdNumber = String(data.simd || "").replace(/\D/g, "");

      if (!simdNumber) {
        failed += 1;
        continue;
      }

      const slug = normalizeSlug(simdNumber);
      const existing = await readExistingUpgrade(slug);
      const createdDate = toDateString(data.created);
      const updatedDate =
        (await fetchLatestCommitDate(entry.path)) ||
        toDateString(data.updated) ||
        createdDate ||
        null;

      const nextDocument = {
        slug,
        simdNumber,
        title: String(data.title || `SIMD-${simdNumber}`),
        status: normalizeEnumValue(data.status) || "draft",
        category: normalizeEnumValue(data.category) || "standard",
        type: normalizeEnumValue(data.type) || undefined,
        authors: toStringArray(data.authors),
        createdDate: createdDate || updatedDate || "",
        updatedDate: updatedDate || "",
        featureGate:
          typeof data.feature === "string" ? data.feature : undefined,
        githubUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/main/${entry.path}`,
        discussionUrl:
          typeof data["discussion-to"] === "string"
            ? data["discussion-to"]
            : typeof data.discussion === "string"
              ? data.discussion
              : undefined,
        summary: extractSummary(content),
        relatedSimds: extractRelatedSimds(content, simdNumber),
        sourceSha: entry.sha,
        description: existing.description || undefined,
        editorialNote: existing.editorialNote || undefined,
        featured: Boolean(existing.featured),
        tags: existing.tags || [],
        heroImage: existing.heroImage || undefined,
      };

      const filePath = path.join(CONTENT_DIR, `${slug}.yaml`);
      const nextContents = yaml.dump(nextDocument, {
        lineWidth: 0,
        noRefs: true,
        sortKeys: false,
      });

      let previousContents = "";
      try {
        previousContents = await fs.readFile(filePath, "utf8");
      } catch {}

      if (!previousContents) {
        created += 1;
      } else if (previousContents !== nextContents) {
        updated += 1;
      } else {
        unchanged += 1;
      }

      await fs.writeFile(filePath, nextContents);
    } catch (error) {
      failed += 1;
      console.error(`Failed to sync ${entry.path}:`, error);
    }
  }

  console.log(JSON.stringify({ created, updated, unchanged, failed }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
