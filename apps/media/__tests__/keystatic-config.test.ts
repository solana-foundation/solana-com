import { describe, expect, it } from "vitest";

import { githubStorage } from "../keystatic.config";

describe("Keystatic GitHub storage", () => {
  it("passes the dedicated staging branch policy to Keystatic", () => {
    expect(githubStorage).toMatchObject({
      kind: "github",
      branchPrefix: "staging-",
      pathPrefix: "apps/media",
    });
  });
});
