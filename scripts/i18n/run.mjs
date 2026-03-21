import { spawnSync } from "node:child_process";
import process from "node:process";

const rootDir = process.cwd();

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
    run("npx", ["lingo.dev@latest", "run", "--bucket", bucket], `${rootDir}/packages/i18n`);
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
      runUi("docs");
      runDocsContent();
      break;
    }

    runUi(app);
    break;
  default:
    console.error("Usage: pnpm i18n[:ui|:docs|:app <app>]");
    process.exit(1);
}
