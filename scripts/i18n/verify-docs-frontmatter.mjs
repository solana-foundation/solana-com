import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "../..");
const contentDir = path.join(rootDir, "apps/docs/content");
const violations = [];

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      visit(absolutePath);
      continue;
    }

    if (!entry.isFile() || path.extname(entry.name) !== ".mdx") {
      continue;
    }

    const lines = fs.readFileSync(absolutePath, "utf8").split(/\r?\n/);
    if (lines[0] !== "---") {
      continue;
    }

    for (
      let index = 1;
      index < lines.length && lines[index] !== "---";
      index++
    ) {
      if (lines[index].includes("`")) {
        violations.push(`${path.relative(rootDir, absolutePath)}:${index + 1}`);
      }
    }
  }
}

visit(contentDir);

if (violations.length > 0) {
  console.error(
    "Backticks are not allowed in docs frontmatter because Lingo can restore them as invalid YAML:",
  );
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log("Docs frontmatter guard passed");
