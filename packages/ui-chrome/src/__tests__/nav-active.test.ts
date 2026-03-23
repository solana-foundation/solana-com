import { describe, expect, it } from "vitest";

import { HEADER_SECTION_METADATA } from "../header-section-metadata";
import { isNavSectionActive } from "../nav-active";

describe("shared header route matching", () => {
  const solutionsSection = HEADER_SECTION_METADATA.find(
    ({ id }) => id === "solutions",
  );
  const communitySection = HEADER_SECTION_METADATA.find(
    ({ id }) => id === "community",
  );

  it("keeps wallet aliases active under the solutions section", () => {
    expect(solutionsSection).toBeDefined();

    expect(
      isNavSectionActive("/solana-wallets", solutionsSection?.matchRules ?? []),
    ).toBe(true);
    expect(
      isNavSectionActive("/wallets", solutionsSection?.matchRules ?? []),
    ).toBe(true);
    expect(isNavSectionActive("/ai", solutionsSection?.matchRules ?? [])).toBe(
      true,
    );
  });

  it("matches exact and nested community routes without leaking to unrelated paths", () => {
    expect(communitySection).toBeDefined();

    expect(
      isNavSectionActive("/community", communitySection?.matchRules ?? []),
    ).toBe(true);
    expect(
      isNavSectionActive(
        "/podcasts/validated",
        communitySection?.matchRules ?? [],
      ),
    ).toBe(true);
    expect(
      isNavSectionActive(
        "/solutions/payments",
        communitySection?.matchRules ?? [],
      ),
    ).toBe(false);
  });
});
