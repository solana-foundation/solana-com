import { readFileSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import {
  COMPLIANCE_ITEMS,
  CONFIDENTIAL_BALANCES_STATS,
  CONFIDENTIAL_BALANCES_TAGS,
  ECOSYSTEM_PROJECTS,
  FEATURED_SOLUTIONS,
  GLANCE_STATS,
  PRIVATE_CHANNELS_STEPS,
  PRIVATE_CHANNELS_TAGS,
  RESOURCE_LINKS,
  RING_RULES,
  RINGS_TAGS,
  isExternalHref,
} from "@/data/solutions/privacy";
import { requiredCardContent } from "@/lib/required-card-content";

// Only the English source catalog is checked: target locales are regenerated
// by the main-branch Lingo workflow and fall back to English until then.
const englishCatalog = path.join(
  __dirname,
  "../../../../../packages/i18n/messages/web/en/common.json",
);

const privacy = JSON.parse(readFileSync(englishCatalog, "utf8"))
  .privacy as Record<string, unknown>;

function atPath(value: unknown, dotted: string): unknown {
  return dotted.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[segment];
  }, value);
}

function keysAt(dotted: string): string[] {
  const value = atPath(privacy, dotted);
  expect(value, dotted).toBeTypeOf("object");
  return Object.keys(value as Record<string, unknown>).sort();
}

describe("privacy page data", () => {
  it("features the three brochure solutions first, in brochure order", () => {
    expect(FEATURED_SOLUTIONS.map(({ key }) => key)).toEqual([
      "confidentialBalances",
      "privateChannels",
      "rings",
    ]);
  });

  it("keeps the featured solutions and the ecosystem projects disjoint", () => {
    const featured = FEATURED_SOLUTIONS.map(({ key }) => key);
    for (const project of ECOSYSTEM_PROJECTS) {
      expect(featured, project.key).not.toContain(project.key);
    }
  });

  it("has English copy for every featured solution and ecosystem card", () => {
    const featured = FEATURED_SOLUTIONS.map(({ key }) => key);
    const projects = ECOSYSTEM_PROJECTS.map(({ key }) => key);

    expect(keysAt("solutions.items")).toEqual([...featured].sort());
    for (const key of featured) {
      expect(() =>
        requiredCardContent(
          atPath(privacy, "solutions.items"),
          key,
          ["name", "audience", "description"],
          "privacy.solutions.items",
        ),
      ).not.toThrow();
    }

    expect(keysAt("projects.items")).toEqual([...featured, ...projects].sort());
    for (const key of [...featured, ...projects]) {
      expect(() =>
        requiredCardContent(
          atPath(privacy, "projects.items"),
          key,
          ["title", "category", "description"],
          "privacy.projects.items",
        ),
      ).not.toThrow();
    }
  });

  it("has a status label for every status in use", () => {
    const statuses = keysAt("solutions.status");
    for (const { status } of FEATURED_SOLUTIONS) {
      expect(statuses, status).toContain(status);
    }
  });

  it("mirrors every data list with a matching English object", () => {
    const groups: Array<[readonly string[], string]> = [
      [CONFIDENTIAL_BALANCES_TAGS, "confidentialBalances.tags"],
      [CONFIDENTIAL_BALANCES_STATS, "confidentialBalances.stats"],
      [PRIVATE_CHANNELS_TAGS, "privateChannels.tags"],
      [PRIVATE_CHANNELS_STEPS, "privateChannels.steps"],
      [RINGS_TAGS, "rings.tags"],
      [RING_RULES, "rings.rules"],
      [COMPLIANCE_ITEMS, "compliance.items"],
      [GLANCE_STATS.map(({ key }) => key), "glance.stats"],
      [RESOURCE_LINKS.map(({ key }) => key), "resources.links"],
    ];

    for (const [ids, dotted] of groups) {
      expect(keysAt(dotted), dotted).toEqual([...ids].sort());
    }
  });

  it("uses absolute https URLs for external links and root-relative paths otherwise", () => {
    const hrefs = [
      ...FEATURED_SOLUTIONS.map(({ href }) => href),
      ...ECOSYSTEM_PROJECTS.map(({ href }) => href),
      ...RESOURCE_LINKS.map(({ href }) => href),
    ];

    for (const href of hrefs) {
      if (isExternalHref(href)) {
        expect(href, href).toMatch(/^https:\/\//);
      } else {
        expect(href, href).toMatch(/^\/[a-z]/);
      }
    }

    const projectHrefs = ECOSYSTEM_PROJECTS.map(({ href }) => href);
    expect(new Set(projectHrefs).size).toBe(projectHrefs.length);
  });
});
