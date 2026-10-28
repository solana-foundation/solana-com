import { describe, expect, it } from "vitest";
import { sponsorTiers } from "@/content/sponsors";
import { resolveSponsorLogo } from "@/lib/sponsors";

describe("Breakpoint sponsor assets", () => {
  it("resolves every published sponsor logo", () => {
    for (const tier of sponsorTiers) {
      for (const sponsor of tier.sponsors) {
        const resolved = resolveSponsorLogo(sponsor);
        expect(resolved.src, sponsor.companyId).toBeTruthy();
      }
    }
  });

  it("keeps Accretion and HackHack as separate sponsor brands", () => {
    const sponsors = sponsorTiers.flatMap((tier) => tier.sponsors);
    const accretion = sponsors.find((entry) => entry.companyId === "accretion");
    const hackhack = sponsors.find((entry) => entry.companyId === "hackhack");

    expect(accretion).toBeDefined();
    expect(hackhack).toBeDefined();
    expect(resolveSponsorLogo(accretion!).src).not.toBe(
      resolveSponsorLogo(hackhack!).src,
    );
  });
});
