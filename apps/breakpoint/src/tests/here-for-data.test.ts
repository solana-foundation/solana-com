import { describe, expect, it, vi } from "vitest";
import { loadCardAdds, loadGraph, submitAdds } from "@/lib/here-for/data";
import { graphPayload, personPayload } from "@/lib/here-for/payload";

const mocks = vi.hoisted(() => ({
  transaction: vi.fn(),
  people: vi.fn(),
  person: vi.fn(),
  adds: vi.fn(),
}));
vi.mock("@/lib/awards-db", () => ({
  awardsPrisma: {
    $transaction: mocks.transaction,
    hereForPerson: { findMany: mocks.people, findUnique: mocks.person },
    hereForAdd: { findMany: mocks.adds },
  },
}));

describe("here-for orphan handling", () => {
  it("keeps submitted profiles joined after their browser switches accounts", async () => {
    mocks.people.mockResolvedValue([
      { id: "a", handle: "@alice", claimedAt: new Date(), claimedById: null },
      { id: "b", handle: "@bob", claimedAt: null, claimedById: null },
    ]);
    mocks.adds.mockResolvedValue([{ fromId: "a", toId: "b", rank: 1 }]);
    const rows = await loadGraph();
    expect(graphPayload(rows, null).claimed).toEqual([1, 0]);
    expect(personPayload(rows, "@alice")).toMatchObject({
      claimed: true,
      adds: [{ handle: "@bob" }],
    });
  });

  it("rejects stale X identities before modifying a profile or its picks", async () => {
    const user = { upsert: vi.fn() };
    const tx = {
      user,
      hereForPerson: {
        findUnique: vi.fn().mockResolvedValue({ xUserId: "new-owner" }),
      },
    };
    mocks.transaction.mockImplementation((work: (client: unknown) => unknown) =>
      work(tx),
    );
    await expect(
      submitAdds(
        "ballot",
        "@alice",
        ["@a", "@b", "@c"],
        null,
        null,
        "old-owner",
      ),
    ).rejects.toThrow();
    expect(user.upsert).not.toHaveBeenCalled();
  });
  it("loads a card's adds and mutual status without the full graph", async () => {
    mocks.person.mockResolvedValue({
      adds: [
        { toId: "a", to: { handle: "@a" } },
        { toId: "b", to: { handle: "@b" } },
      ],
      addedBy: [{ fromId: "b" }],
    });
    expect(await loadCardAdds("@me")).toEqual([
      { handle: "@a", mutual: false },
      { handle: "@b", mutual: true },
    ]);
  });
  it("loads only visible people with an incoming or outgoing add", async () => {
    mocks.people.mockResolvedValue([]);
    mocks.adds.mockResolvedValue([]);
    await loadGraph();
    expect(mocks.people).toHaveBeenCalledWith({
      where: {
        hidden: false,
        OR: [
          { adds: { some: { to: { hidden: false } } } },
          { addedBy: { some: { from: { hidden: false } } } },
        ],
      },
      select: { id: true, handle: true, claimedAt: true },
    });
  });

  it("deletes dropped, unclaimed targets only after replacing adds", async () => {
    const events: string[] = [];
    const person = {
      id: "me",
      handle: "@me",
      claimedById: "user",
      xUserId: "123",
    };
    const tx = {
      user: { upsert: vi.fn().mockResolvedValue({ id: "user" }) },
      hereForPerson: {
        findUnique: vi
          .fn()
          .mockResolvedValueOnce(person)
          .mockResolvedValueOnce(person),
        upsert: vi
          .fn()
          .mockResolvedValueOnce(person)
          .mockResolvedValueOnce({ id: "new1" })
          .mockResolvedValueOnce({ id: "new2" })
          .mockResolvedValueOnce({ id: "new3" }),
        deleteMany: vi.fn().mockImplementation(() => {
          events.push("cleanup");
        }),
      },
      hereForAdd: {
        findMany: vi
          .fn()
          .mockResolvedValue([{ toId: "dropped" }, { toId: "kept" }]),
        deleteMany: vi.fn().mockImplementation(() => {
          events.push("remove adds");
        }),
        createMany: vi.fn().mockImplementation(() => {
          events.push("create adds");
        }),
      },
    };
    mocks.transaction.mockImplementation((work: (client: unknown) => unknown) =>
      work(tx),
    );
    await submitAdds("ballot", "@me", ["@a", "@b", "@c"], null, null, "123");
    expect(events).toEqual(["remove adds", "create adds", "cleanup"]);
    expect(tx.hereForPerson.deleteMany).toHaveBeenCalledWith({
      where: {
        id: { in: ["dropped", "kept"] },
        claimedById: null,
        adds: { none: {} },
        addedBy: { none: {} },
      },
    });
  });
});
