import { execFileSync } from "node:child_process";

const base =
  process.env.TURBO_SCM_BASE ||
  execFileSync("git", ["merge-base", "origin/main", "HEAD"], {
    encoding: "utf8",
  }).trim();
const head = process.env.TURBO_SCM_HEAD || "HEAD";

const changedPaths = execFileSync(
  "git",
  [
    "diff",
    "--name-only",
    "--diff-filter=AR",
    "-z",
    base,
    head,
    "--",
    "apps",
    "packages",
  ],
  { encoding: "utf8" },
)
  .split("\0")
  .filter(Boolean);
const newModules = changedPaths.filter((path) =>
  /\.module\.(?:css|scss)$/.test(path),
);

if (newModules.length) {
  console.error(
    "New CSS Modules are not allowed. Use Tailwind utilities instead:",
  );
  for (const path of newModules) console.error(`  ${path}`);
  process.exitCode = 1;
} else {
  console.log("No new CSS Modules found.");
}
