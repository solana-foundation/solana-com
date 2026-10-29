import { describe, expect, it, vi } from "vitest";
import { loadCardAdds, loadGraph, submitAdds } from "@/lib/here-for/data";

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
      select: { id: true, handle: true, claimedById: true },
    });
  });

  it("deletes dropped, unclaimed targets only after replacing adds", async () => {
    const events: string[] = [];
    const person = { id: "me", handle: "@me", claimedById: "user" };
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
    await submitAdds("ballot", "@me", ["@a", "@b", "@c"], null, null);
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
