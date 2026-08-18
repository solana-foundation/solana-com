import { describe, expect, it } from "vitest";
import {
  groupUpgradesByRelease,
  type ReleaseInput,
  type UpgradeListItem,
} from "@/lib/upgrades/group-by-release";

function upgrade(overrides: Partial<UpgradeListItem>): UpgradeListItem {
  return {
    slug: "example",
    title: "Example",
    description: "",
    subtitle: "",
    publishedAt: null,
    stage: "in_development",
    metrics: [],
    release: null,
    order: null,
    ...overrides,
  };
}

function release(overrides: Partial<ReleaseInput>): ReleaseInput {
  return {
    slug: "example-release",
    name: "Example Release",
    status: "planned",
    expectedDate: null,
    overview: null,
    ...overrides,
  };
}

describe("groupUpgradesByRelease", () => {
  it("orders planned releases soonest-first, then shipped most-recent-first, then unscheduled last", () => {
    const releases: ReleaseInput[] = [
      release({
        slug: "shipped-old",
        name: "Shipped Old",
        status: "shipped",
        expectedDate: "2026-01-01",
      }),
      release({
        slug: "planned-far",
        name: "Planned Far",
        status: "planned",
        expectedDate: "2027-01-01",
      }),
      release({
        slug: "shipped-new",
        name: "Shipped New",
        status: "shipped",
        expectedDate: "2026-06-01",
      }),
      release({
        slug: "planned-near",
        name: "Planned Near",
        status: "planned",
        expectedDate: "2026-09-01",
      }),
    ];
    const upgrades: UpgradeListItem[] = [
      upgrade({ slug: "a", release: "shipped-old" }),
      upgrade({ slug: "b", release: "planned-far" }),
      upgrade({ slug: "c", release: "shipped-new" }),
      upgrade({ slug: "d", release: "planned-near" }),
      upgrade({ slug: "e", release: null }),
    ];

    const groups = groupUpgradesByRelease(upgrades, releases);

    expect(groups.map((group) => group.key)).toEqual([
      "planned-near",
      "planned-far",
      "shipped-new",
      "shipped-old",
      "unscheduled",
    ]);
  });

  it("sorts within a group by order ascending, falling back to publishedAt descending", () => {
    const releases: ReleaseInput[] = [
      release({ slug: "r", status: "shipped", expectedDate: "2026-06-01" }),
    ];
    const upgrades: UpgradeListItem[] = [
      upgrade({
        slug: "no-order-newer",
        release: "r",
        order: null,
        publishedAt: "2026-05-01",
      }),
      upgrade({
        slug: "no-order-older",
        release: "r",
        order: null,
        publishedAt: "2026-01-01",
      }),
      upgrade({ slug: "second", release: "r", order: 2 }),
      upgrade({ slug: "first", release: "r", order: 1 }),
    ];

    const groups = groupUpgradesByRelease(upgrades, releases);

    expect(groups[0]!.upgrades.map((item) => item.slug)).toEqual([
      "first",
      "second",
      "no-order-newer",
      "no-order-older",
    ]);
  });

  it("excludes a release's overview upgrade from its regular list and returns it separately", () => {
    const releases: ReleaseInput[] = [
      release({
        slug: "r",
        status: "shipped",
        expectedDate: "2026-06-01",
        overview: "overview-article",
      }),
    ];
    const upgrades: UpgradeListItem[] = [
      upgrade({ slug: "overview-article", release: "r" }),
      upgrade({ slug: "regular-article", release: "r" }),
    ];

    const groups = groupUpgradesByRelease(upgrades, releases);

    expect(groups[0]!.overview?.slug).toBe("overview-article");
    expect(groups[0]!.upgrades.map((item) => item.slug)).toEqual([
      "regular-article",
    ]);
  });

  it("treats an upgrade referencing an unknown release as unscheduled", () => {
    const releases: ReleaseInput[] = [
      release({ slug: "r", status: "shipped", expectedDate: "2026-06-01" }),
    ];
    const upgrades: UpgradeListItem[] = [
      upgrade({ slug: "orphan", release: "does-not-exist" }),
    ];

    const groups = groupUpgradesByRelease(upgrades, releases);

    const unscheduled = groups.find((group) => group.key === "unscheduled");
    expect(unscheduled?.upgrades.map((item) => item.slug)).toEqual(["orphan"]);
  });

  it("drops a release group with no overview and no upgrades", () => {
    const releases: ReleaseInput[] = [
      release({ slug: "empty", status: "planned", expectedDate: "2026-06-01" }),
    ];

    const groups = groupUpgradesByRelease([], releases);

    expect(groups).toEqual([]);
  });

  it("excludes an upgrade from a release's list if it is any release's overview (cross-release mismatch)", () => {
    const releases: ReleaseInput[] = [
      release({
        slug: "a",
        name: "Release A",
        status: "shipped",
        expectedDate: "2026-06-01",
        overview: "x",
      }),
      release({
        slug: "b",
        name: "Release B",
        status: "shipped",
        expectedDate: "2026-07-01",
      }),
    ];
    const upgrades: UpgradeListItem[] = [
      upgrade({ slug: "x", release: "b" }),
      upgrade({ slug: "other", release: "b" }),
    ];

    const groups = groupUpgradesByRelease(upgrades, releases);

    const groupA = groups.find((g) => g.key === "a");
    const groupB = groups.find((g) => g.key === "b");

    expect(groupA?.overview?.slug).toBe("x");
    expect(groupB?.upgrades.map((item) => item.slug)).toEqual(["other"]);
  });

  it("drops a release entirely if its only assigned upgrade is actually another release's overview", () => {
    const releases: ReleaseInput[] = [
      release({
        slug: "a",
        name: "Release A",
        status: "shipped",
        expectedDate: "2026-06-01",
        overview: "x",
      }),
      release({
        slug: "b",
        name: "Release B",
        status: "shipped",
        expectedDate: "2026-07-01",
      }),
    ];
    const upgrades: UpgradeListItem[] = [upgrade({ slug: "x", release: "b" })];

    const groups = groupUpgradesByRelease(upgrades, releases);

    // "x" is claimed as release "a"'s overview but tagged with release "b" —
    // a content-authoring mistake (its release field should be "a"). Since it's
    // globally excluded from every release's regular list to avoid rendering
    // twice, and "b" has no other content, "b" disappears from the page
    // entirely rather than showing an empty section. This is the accepted
    // trade-off of the cross-release-mismatch fix above: catch the underlying
    // mistake with the release-overview-consistency content check instead of
    // trying to make the grouping logic paper over it.
    expect(groups.map((group) => group.key)).toEqual(["a"]);
    expect(groups.find((group) => group.key === "b")).toBeUndefined();
  });

  it("treats order: 0 as present (not falsy)", () => {
    const releases: ReleaseInput[] = [
      release({ slug: "r", status: "shipped", expectedDate: "2026-06-01" }),
    ];
    const upgrades: UpgradeListItem[] = [
      upgrade({ slug: "ordered-zero", release: "r", order: 0 }),
      upgrade({ slug: "ordered-one", release: "r", order: 1 }),
      upgrade({
        slug: "no-order",
        release: "r",
        order: null,
        publishedAt: "2026-05-01",
      }),
    ];

    const groups = groupUpgradesByRelease(upgrades, releases);

    expect(groups[0]!.upgrades.map((item) => item.slug)).toEqual([
      "ordered-zero",
      "ordered-one",
      "no-order",
    ]);
  });

  it("renders a release with overview but no regular upgrades", () => {
    const releases: ReleaseInput[] = [
      release({
        slug: "r",
        status: "shipped",
        expectedDate: "2026-06-01",
        overview: "overview-article",
      }),
    ];
    const upgrades: UpgradeListItem[] = [
      upgrade({ slug: "overview-article", release: "r" }),
    ];

    const groups = groupUpgradesByRelease(upgrades, releases);

    expect(groups).toHaveLength(1);
    expect(groups[0]!.overview?.slug).toBe("overview-article");
    expect(groups[0]!.upgrades).toEqual([]);
  });
});
