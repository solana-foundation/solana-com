import { describe, expect, it } from "vitest";

import { githubStorage } from "../keystatic.config";

describe("Keystatic GitHub storage", () => {
  it("creates and filters dedicated staging branches", () => {
    expect(githubStorage.kind).toBe("github");
    expect(githubStorage.branchPrefix).toBe("staging-");
    expect(`${githubStorage.branchPrefix}editor-article-name`).toBe(
      "staging-editor-article-name",
    );
  });
});
