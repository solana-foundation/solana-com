import { describe, expect, it } from "vitest";

import { HEADER_SECTION_METADATA } from "../header-section-metadata";
import { isNavSectionActive } from "../nav-active";

describe("shared header route matching", () => {
  const useSolanaSection = HEADER_SECTION_METADATA.find(
    ({ id }) => id === "use_solana",
  );
  const enterpriseSection = HEADER_SECTION_METADATA.find(
    ({ id }) => id === "enterprise",
  );
  const productsSection = HEADER_SECTION_METADATA.find(
    ({ id }) => id === "products",
  );
  const ecosystemSection = HEADER_SECTION_METADATA.find(
    ({ id }) => id === "ecosystem",
  );

  it("keeps wallet and learn routes active under Use Solana", () => {
    expect(useSolanaSection).toBeDefined();

    expect(
      isNavSectionActive("/solana-wallets", useSolanaSection?.matchRules ?? []),
    ).toBe(true);
    expect(
      isNavSectionActive("/wallets", useSolanaSection?.matchRules ?? []),
    ).toBe(true);
    expect(
      isNavSectionActive(
        "/learn/what-is-a-wallet",
        useSolanaSection?.matchRules ?? [],
      ),
    ).toBe(true);
  });

  it("keeps preserved solution routes active under their audience sections", () => {
    expect(enterpriseSection).toBeDefined();
    expect(productsSection).toBeDefined();
    expect(ecosystemSection).toBeDefined();

    expect(
      isNavSectionActive(
        "/solutions/tokenization",
        enterpriseSection?.matchRules ?? [],
      ),
    ).toBe(true);
    expect(
      isNavSectionActive("/solutions/sdp", productsSection?.matchRules ?? []),
    ).toBe(true);
    expect(
      isNavSectionActive(
        "/solutions/depin",
        ecosystemSection?.matchRules ?? [],
      ),
    ).toBe(true);
  });

  it("matches exact and nested ecosystem routes without leaking to unrelated paths", () => {
    expect(ecosystemSection).toBeDefined();

    expect(
      isNavSectionActive("/community", ecosystemSection?.matchRules ?? []),
    ).toBe(true);
    expect(
      isNavSectionActive(
        "/podcasts/validated",
        ecosystemSection?.matchRules ?? [],
      ),
    ).toBe(true);
    expect(
      isNavSectionActive(
        "/solutions/payments-tooling",
        ecosystemSection?.matchRules ?? [],
      ),
    ).toBe(false);
  });

  it("keeps product routes out of enterprise-only matching", () => {
    expect(enterpriseSection).toBeDefined();

    expect(
      isNavSectionActive("/products", enterpriseSection?.matchRules ?? []),
    ).toBe(false);
    expect(
      isNavSectionActive("/solutions/ai", enterpriseSection?.matchRules ?? []),
    ).toBe(false);
  });
});
