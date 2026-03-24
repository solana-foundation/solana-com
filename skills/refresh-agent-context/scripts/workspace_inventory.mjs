#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readText(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function exists(relPath) {
  return fs.existsSync(path.join(rootDir, relPath));
}

function listDirs(relPath) {
  const abs = path.join(rootDir, relPath);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function inferDevPort(packageJson) {
  const devScript = packageJson.scripts?.dev ?? "";
  const match =
    devScript.match(/--port\s+(\d+)/) ??
    devScript.match(/-p\s+(\d+)/) ??
    devScript.match(/PORT=(\d+)/);
  if (match?.[1]) return match[1];
  if (devScript.includes("next dev")) return "3000";
  return "";
}

function resolveConstString(fileText, identifier) {
  const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = fileText.match(
    new RegExp(`const\\s+${escaped}\\s*=\\s*["'\`](.+?)["'\`]`),
  );
  return match?.[1] ?? "";
}

function inferAssetPrefix(fileText) {
  const direct = fileText.match(/assetPrefix:\s*["'`](.+?)["'`]/);
  if (direct?.[1]) return direct[1];

  const viaIdentifier = fileText.match(/assetPrefix:\s*([A-Za-z_$][\w$]*)/);
  if (viaIdentifier?.[1]) {
    return resolveConstString(fileText, viaIdentifier[1]);
  }

  if (/\bassetPrefix\b/.test(fileText)) {
    const shorthand = resolveConstString(fileText, "assetPrefix");
    if (shorthand) return shorthand;
  }

  return "";
}

function inferAppName(fileText) {
  const match = fileText.match(/NEXT_PUBLIC_APP_NAME:\s*["'`](.+?)["'`]/);
  return match?.[1] ?? "";
}

function summarizeWorkspace(kind, dirName) {
  const relBase = `${kind}/${dirName}`;
  const pkgPath = path.join(rootDir, relBase, "package.json");
  if (!fs.existsSync(pkgPath)) {
    return null;
  }

  const pkg = readJson(pkgPath);
  const nextConfigText = readText(path.join(rootDir, relBase, "next.config.ts"));

  return {
    name: dirName,
    path: relBase,
    packageName: pkg.name ?? "",
    hasAgents: exists(`${relBase}/AGENTS.md`),
    hasReadme: exists(`${relBase}/README.md`),
    hasClaude: exists(`${relBase}/CLAUDE.md`),
    devPort: inferDevPort(pkg),
    assetPrefix: inferAssetPrefix(nextConfigText),
    appNameEnv: inferAppName(nextConfigText),
  };
}

function formatBool(value) {
  return value ? "yes" : "no";
}

function printTable(headers, rows) {
  console.log(`| ${headers.join(" | ")} |`);
  console.log(`| ${headers.map(() => "---").join(" | ")} |`);
  for (const row of rows) {
    console.log(`| ${row.join(" | ")} |`);
  }
  console.log("");
}

const apps = listDirs("apps")
  .map((name) => summarizeWorkspace("apps", name))
  .filter(Boolean);

const packages = listDirs("packages")
  .map((name) => summarizeWorkspace("packages", name))
  .filter(Boolean);

console.log("# Workspace Inventory");
console.log("");
console.log(`Root AGENTS.md: ${formatBool(exists("AGENTS.md"))}`);
console.log(`Root README.md: ${formatBool(exists("README.md"))}`);
console.log(`turbo.json: ${formatBool(exists("turbo.json"))}`);
console.log("");

console.log("## Apps");
console.log("");
printTable(
  [
    "workspace",
    "package",
    "dev port",
    "asset prefix",
    "app env",
    "AGENTS",
    "README",
    "CLAUDE",
  ],
  apps.map((app) => [
    `\`${app.path}\``,
    `\`${app.packageName}\``,
    app.devPort || "-",
    app.assetPrefix || "-",
    app.appNameEnv || "-",
    formatBool(app.hasAgents),
    formatBool(app.hasReadme),
    formatBool(app.hasClaude),
  ]),
);

console.log("## Packages");
console.log("");
printTable(
  ["workspace", "package", "AGENTS", "README"],
  packages.map((pkg) => [
    `\`${pkg.path}\``,
    `\`${pkg.packageName}\``,
    formatBool(pkg.hasAgents),
    formatBool(pkg.hasReadme),
  ]),
);
