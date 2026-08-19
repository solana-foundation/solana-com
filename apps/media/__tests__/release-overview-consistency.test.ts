import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const RELEASES_DIR = join(import.meta.dirname, "../content/releases");
const UPGRADES_DIR = join(import.meta.dirname, "../content/upgrades");

function readFrontmatterField(content: string, field: string): string | null {
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter) {
    return null;
  }

  const match = (frontmatter[1] ?? "").match(
    new RegExp(`^${field}:\\s*(\\S+)\\s*$`, "m"),
  );
  return match?.[1] ?? null;
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.mdx$/, "");
}

describe("release/overview content contract", () => {
  it("every release's overview article is itself tagged with that same release", () => {
    // groupUpgradesByRelease (lib/upgrades/group-by-release.ts) excludes an
    // upgrade from EVERY release's regular list the moment any release names
    // it as an `overview`, regardless of what the upgrade's own `release`
    // field says. That's intentional — it stops the same article rendering
    // twice — but it means an overview article whose own `release` field
    // points elsewhere silently vanishes from the release it actually claims,
    // and can even make that other release disappear from the page entirely
    // if it had no other content. This check catches the authoring mistake
    // (release.overview and the target article's own `release` disagreeing)
    // before it reaches the grouping logic.
    const upgradeReleaseBySlug = new Map<string, string | null>();
    for (const filename of readdirSync(UPGRADES_DIR).filter((name) =>
      name.endsWith(".mdx"),
    )) {
      const content = readFileSync(join(UPGRADES_DIR, filename), "utf8");
      upgradeReleaseBySlug.set(
        slugFromFilename(filename),
        readFrontmatterField(content, "release"),
      );
    }

    const mismatches: string[] = [];
    for (const filename of readdirSync(RELEASES_DIR).filter((name) =>
      name.endsWith(".mdx"),
    )) {
      const releaseSlug = slugFromFilename(filename);
      const content = readFileSync(join(RELEASES_DIR, filename), "utf8");
      const overviewSlug = readFrontmatterField(content, "overview");

      if (!overviewSlug) {
        continue;
      }

      if (!upgradeReleaseBySlug.has(overviewSlug)) {
        mismatches.push(
          `${filename}: overview "${overviewSlug}" does not match any upgrade article`,
        );
        continue;
      }

      const overviewOwnRelease = upgradeReleaseBySlug.get(overviewSlug);
      if (overviewOwnRelease !== releaseSlug) {
        mismatches.push(
          `${filename}: overview "${overviewSlug}" has release "${overviewOwnRelease ?? "(none)"}", expected "${releaseSlug}"`,
        );
      }
    }

    expect(mismatches).toEqual([]);
  });
});
