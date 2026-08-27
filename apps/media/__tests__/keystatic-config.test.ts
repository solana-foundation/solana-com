import { describe, expect, it } from "vitest";

import config, { githubStorage } from "../keystatic.config";

describe("Keystatic GitHub storage", () => {
  it("passes the dedicated staging branch policy to Keystatic", () => {
    expect(githubStorage).toMatchObject({
      kind: "github",
      branchPrefix: "staging-",
      pathPrefix: "apps/media",
    });
  });
});

describe("releases collection", () => {
  it("defines the fields the grouped listing page relies on", () => {
    const releaseFields = Object.keys(
      config.collections?.releases?.schema ?? {},
    );
    expect(releaseFields).toEqual(
      expect.arrayContaining(["name", "expectedDate", "status", "overview"]),
    );
  });
});

describe("upgrades schema", () => {
  it("replaces the freeform badges field with stage, release, and order", () => {
    const upgradeFields = Object.keys(
      config.collections?.upgrades?.schema ?? {},
    );
    expect(upgradeFields).not.toContain("badges");
    expect(upgradeFields).toEqual(
      expect.arrayContaining(["stage", "release", "order"]),
    );
  });
});
