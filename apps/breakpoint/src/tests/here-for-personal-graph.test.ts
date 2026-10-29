import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadPersonalGraph } from "@/lib/here-for/data";
import { mePayload } from "@/lib/here-for/payload";
import type { GraphRows } from "@/lib/here-for/graph";

const mocks = vi.hoisted(() => ({ person: vi.fn(), adds: vi.fn() }));
vi.mock("@/lib/awards-db", () => ({
  awardsPrisma: {
    hereForPerson: { findUnique: mocks.person },
    hereForAdd: { findMany: mocks.adds },
  },
}));
beforeEach(() => vi.resetAllMocks());

// Every recommendation reason, a mutual pair, multiple shared adds, and
// an unrelated component that must not be loaded by the profile query.
const handles = [
  "@me",
  "@a",
  "@b",
  "@c",
  "@fan",
  "@shared",
  "@step",
  "@co",
  "@unrelated",
  "@other",
] as const;
const rows: GraphRows = {
  people: handles.map((handle, i) => ({
    id: String(i),
    handle,
    claimedById: "user",
  })),
  adds: [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 0],
    [4, 0],
    [4, 7],
    [5, 1],
    [5, 2],
    [1, 6],
    [8, 9],
  ].map(([from, to], i) => ({
    fromId: String(from),
    toId: String(to),
    rank: (i % 3) + 1,
  })),
};

describe("personal graph", () => {
  it("preserves all profile fields and recommendation scores without unrelated edges", async () => {
    mocks.person.mockResolvedValue({
      id: "0",
      adds: [{ toId: "1" }, { toId: "2" }, { toId: "3" }],
      addedBy: [{ fromId: "1" }, { fromId: "4" }],
    });
    mocks.adds.mockImplementation(async ({ where }) => {
      expect(where.from).toEqual({ hidden: false });
      expect(where.to).toEqual({ hidden: false });
      const [outgoing, incoming] = where.OR;
      expect(outgoing.fromId.in).toEqual(["0", "1", "2", "3", "4"]);
      expect(incoming.toId.in).toEqual(["1", "2", "3"]);
      return rows.adds
        .filter(
          (a) =>
            outgoing.fromId.in.includes(a.fromId) ||
            incoming.toId.in.includes(a.toId),
        )
        .map((a) => ({
          ...a,
          from: rows.people[Number(a.fromId)],
          to: rows.people[Number(a.toId)],
        }));
    });
    const local = await loadPersonalGraph("@me");
    expect(local.people.map((p) => p.handle)).not.toContain("@unrelated");
    const profile = mePayload(local, "@me", "open");
    expect(profile).toEqual(mePayload(rows, "@me", "open"));
    expect(profile.suggestions.find((s) => s.handle === "@shared")?.score).toBe(
      4,
    );
    expect(
      new Set(profile.suggestions.flatMap((s) => s.reasons.map((r) => r.kind))),
    ).toEqual(new Set(["addedYou", "sharedAdd", "yourAddAdded", "coAdded"]));
    expect(mocks.person).toHaveBeenCalledWith(
      expect.objectContaining({ where: { handle: "@me", hidden: false } }),
    );
  });

  it.each([null, { id: "0", adds: [], addedBy: [] }])(
    "skips edge reads for missing or isolated profiles",
    async (person) => {
      mocks.person.mockResolvedValue(person);
      expect(await loadPersonalGraph("@me")).toEqual({ people: [], adds: [] });
      expect(mocks.adds).not.toHaveBeenCalled();
    },
  );
});
