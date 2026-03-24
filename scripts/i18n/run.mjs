import { spawnSync } from "node:child_process";
import fs from "node:fs";
import process from "node:process";
import path from "node:path";

const rootDir = process.cwd();
const uiCatalogPathByApp = {
  web: "messages/web/",
  accelerate: "messages/accelerate/",
  media: "messages/media/",
  templates: "messages/templates/",
};

function loadEnvFileIfPresent(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  process.loadEnvFile(filePath);
}

function loadI18nEnv() {
  loadEnvFileIfPresent(path.join(rootDir, ".env.local"));
  loadEnvFileIfPresent(path.join(rootDir, ".env"));

  // Lingo now prefers LINGO_API_KEY, but keep the older repo convention working.
  if (!process.env.LINGO_API_KEY && process.env.LINGODOTDEV_API_KEY) {
    process.env.LINGO_API_KEY = process.env.LINGODOTDEV_API_KEY;
  }
}

loadI18nEnv();

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: false,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runUi(bucket) {
  if (bucket) {
    const fileFilter = uiCatalogPathByApp[bucket];

    if (!fileFilter) {
      console.error(`Unknown shared UI catalog: ${bucket}`);
      process.exit(1);
    }

    run(
      "npx",
      ["lingo.dev@latest", "run", "--bucket", "json", "--file", fileFilter],
      `${rootDir}/packages/i18n`,
    );
    return;
  }

  run("pnpm", ["--dir", "packages/i18n", "i18n:lingo"], rootDir);
}

function runDocsContent() {
  run("pnpm", ["--dir", "apps/docs", "i18n:lingo:content"], rootDir);
}

const [, , target, app] = process.argv;

switch (target) {
  case "all":
    runUi();
    runDocsContent();
    break;
  case "ui":
    runUi();
    break;
  case "docs":
    runDocsContent();
    break;
  case "app":
    if (!app) {
      console.error("Usage: pnpm i18n:app <app>");
      process.exit(1);
    }

    if (app === "docs") {
      runDocsContent();
      break;
    }

    if (app === "breakpoint") {
      console.log("Breakpoint has no local translation catalog to sync.");
      break;
    }

    runUi(app);
    break;
  default:
    console.error("Usage: pnpm i18n[:ui|:docs|:app <app>]");
    process.exit(1);
}
