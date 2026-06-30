import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const [message, ...pathspecs] = process.argv.slice(2);

if (!message || pathspecs.length === 0) {
  console.error(
    "Usage: node scripts/github/create-verified-commit.mjs <message> <path>...",
  );
  process.exit(1);
}

const token = process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
const branch = process.env.GITHUB_REF_NAME;

if (!token || !repository || !branch) {
  console.error(
    "GITHUB_TOKEN, GITHUB_REPOSITORY, and GITHUB_REF_NAME are required.",
  );
  process.exit(1);
}

const [owner, repo] = repository.split("/");

if (!owner || !repo) {
  console.error(`Invalid GITHUB_REPOSITORY value: ${repository}`);
  process.exit(1);
}

function git(args, options = {}) {
  return execFileSync("git", args, {
    encoding: options.encoding ?? "utf8",
    stdio: options.stdio ?? ["ignore", "pipe", "pipe"],
  });
}

function splitNul(output) {
  return output.split("\0").filter(Boolean);
}

function unique(values) {
  return [...new Set(values)];
}

async function github(endpoint, options = {}) {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `${options.method ?? "GET"} ${endpoint} failed: ${response.status} ${body}`,
    );
  }

  return response.json();
}

function getChangedPaths() {
  const tracked = splitNul(
    git(["diff", "--name-only", "-z", "--", ...pathspecs]),
  );
  const untracked = splitNul(
    git([
      "ls-files",
      "--others",
      "--exclude-standard",
      "-z",
      "--",
      ...pathspecs,
    ]),
  );

  return unique([...tracked, ...untracked]).sort();
}

function getFileMode(filePath) {
  if (!fs.existsSync(filePath)) {
    return "100644";
  }

  const indexEntry = git(["ls-files", "-s", "--", filePath]).trim();
  if (indexEntry) {
    return indexEntry.split(/\s+/, 1)[0];
  }

  const stat = fs.lstatSync(filePath);
  if (stat.isSymbolicLink()) {
    return "120000";
  }

  return stat.mode & 0o111 ? "100755" : "100644";
}

async function createTreeObject(filePath) {
  const mode = getFileMode(filePath);

  if (!fs.existsSync(filePath)) {
    return {
      path: filePath,
      mode,
      type: "blob",
      sha: null,
    };
  }

  const content =
    mode === "120000"
      ? Buffer.from(fs.readlinkSync(filePath), "utf8").toString("base64")
      : fs.readFileSync(filePath).toString("base64");

  const blob = await github(`/repos/${owner}/${repo}/git/blobs`, {
    method: "POST",
    body: JSON.stringify({
      content,
      encoding: "base64",
    }),
  });

  return {
    path: filePath,
    mode,
    type: "blob",
    sha: blob.sha,
  };
}

const changedPaths = getChangedPaths();

if (changedPaths.length === 0) {
  console.log("No changes to commit.");
  process.exit(0);
}

const localHead = git(["rev-parse", "HEAD"]).trim();
const refName = `heads/${branch}`;
const encodedRefName = refName
  .split("/")
  .map((part) => encodeURIComponent(part))
  .join("/");

const ref = await github(`/repos/${owner}/${repo}/git/ref/${encodedRefName}`);
const remoteHead = ref.object.sha;

if (remoteHead !== localHead) {
  throw new Error(
    `Branch ${branch} advanced from ${localHead} to ${remoteHead}; refusing to create a stale formatting commit.`,
  );
}

const baseCommit = await github(
  `/repos/${owner}/${repo}/git/commits/${remoteHead}`,
);
const treeEntries = [];

for (const filePath of changedPaths) {
  treeEntries.push(await createTreeObject(path.posix.normalize(filePath)));
}

const tree = await github(`/repos/${owner}/${repo}/git/trees`, {
  method: "POST",
  body: JSON.stringify({
    base_tree: baseCommit.tree.sha,
    tree: treeEntries,
  }),
});

const commit = await github(`/repos/${owner}/${repo}/git/commits`, {
  method: "POST",
  body: JSON.stringify({
    message,
    tree: tree.sha,
    parents: [remoteHead],
  }),
});

if (!commit.verification?.verified) {
  throw new Error(
    `GitHub did not verify commit ${commit.sha}: ${commit.verification?.reason ?? "unknown reason"}`,
  );
}

await github(`/repos/${owner}/${repo}/git/refs/${encodedRefName}`, {
  method: "PATCH",
  body: JSON.stringify({
    sha: commit.sha,
    force: false,
  }),
});

console.log(`Created verified commit ${commit.sha} on ${branch}.`);
