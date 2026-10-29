import type { Prisma } from "@prisma/client";
import { awardsPrisma } from "@/lib/awards-db";
import type { HereForDirectoryPayload, HereForHandle } from "./types";
import type { GraphRows } from "./graph";

export type LayoutSnapshot = {
  id: string;
  createdAt: Date;
  payload: {
    positions: Record<string, [number, number, number]>;
    community: Record<string, number>;
    communities: { id: number; size: number; label: HereForHandle }[];
  };
};

export async function loadGraph(): Promise<GraphRows> {
  const [people, adds] = await Promise.all([
    awardsPrisma.hereForPerson.findMany({
      where: {
        hidden: false,
        OR: [
          { adds: { some: { to: { hidden: false } } } },
          { addedBy: { some: { from: { hidden: false } } } },
        ],
      },
      select: { id: true, handle: true, claimedAt: true },
    }),
    awardsPrisma.hereForAdd.findMany({
      where: { from: { hidden: false }, to: { hidden: false } },
      select: { fromId: true, toId: true, rank: true },
    }),
  ]);
  return {
    people: people.map((p) => ({ ...p, handle: p.handle as HereForHandle })),
    adds,
  };
}

/** Load only the edges needed for a profile and all four suggestion reasons. */
export async function loadPersonalGraph(
  handle: HereForHandle,
): Promise<GraphRows> {
  const person = await awardsPrisma.hereForPerson.findUnique({
    where: { handle, hidden: false },
    select: {
      id: true,
      adds: {
        where: { to: { hidden: false } },
        select: { toId: true },
      },
      addedBy: {
        where: { from: { hidden: false } },
        select: { fromId: true },
      },
    },
  });
  if (!person || (!person.adds.length && !person.addedBy.length))
    return { people: [], adds: [] };

  const mine = person.adds.map((add) => add.toId);
  const sources = [
    ...new Set([
      person.id,
      ...mine,
      ...person.addedBy.map((add) => add.fromId),
    ]),
  ];
  const selectPerson = { id: true, handle: true, claimedAt: true } as const;
  const edges = await awardsPrisma.hereForAdd.findMany({
    where: {
      from: { hidden: false },
      to: { hidden: false },
      OR: [{ fromId: { in: sources } }, { toId: { in: mine } }],
    },
    select: {
      fromId: true,
      toId: true,
      rank: true,
      from: { select: selectPerson },
      to: { select: selectPerson },
    },
  });
  const people = new Map<string, GraphRows["people"][number]>();
  const adds = edges.map(({ from, to, ...add }) => {
    people.set(from.id, { ...from, handle: from.handle as HereForHandle });
    people.set(to.id, { ...to, handle: to.handle as HereForHandle });
    return add;
  });
  return { people: [...people.values()], adds };
}

export async function loadSnapshot(): Promise<LayoutSnapshot | null> {
  const snapshot = await awardsPrisma.hereForLayoutSnapshot.findFirst({
    orderBy: { createdAt: "desc" },
  });
  return snapshot as LayoutSnapshot | null;
}

export async function saveSnapshot(
  rows: GraphRows,
  payload: LayoutSnapshot["payload"],
) {
  const snapshot = await awardsPrisma.hereForLayoutSnapshot.create({
    data: {
      nodeCount: rows.people.length,
      linkCount: rows.adds.length,
      payload: payload as Prisma.InputJsonValue,
    },
  });
  const old = await awardsPrisma.hereForLayoutSnapshot.findMany({
    orderBy: { createdAt: "desc" },
    skip: 5,
    select: { id: true },
  });
  if (old.length)
    await awardsPrisma.hereForLayoutSnapshot.deleteMany({
      where: { id: { in: old.map((s) => s.id) } },
    });
  return snapshot;
}

export class HandleClaimedError extends Error {}

export async function submitAdds(
  ballotId: string,
  handle: HereForHandle,
  adds: HereForHandle[],
  ipHash: string | null,
  country: string | null,
  xUserId: string,
) {
  return awardsPrisma.$transaction(
    async (tx) => {
      const existing = await tx.hereForPerson.findUnique({ where: { handle } });
      if (!existing || existing.xUserId !== xUserId)
        throw new HandleClaimedError();
      const user = await tx.user.upsert({
        where: { browserUuid: ballotId },
        create: { browserUuid: ballotId, ipHash, country },
        update: {},
      });
      const owned = await tx.hereForPerson.findUnique({
        where: { claimedById: user.id },
      });
      // The handle is verified through X sign-in, so it moves to whichever
      // browser signed in last, and a browser that switched X accounts lets
      // go of the old one.
      if (owned && owned.handle !== handle)
        await tx.hereForPerson.update({
          where: { id: owned.id },
          data: { claimedById: null },
        });
      const person = await tx.hereForPerson.upsert({
        where: { handle },
        create: {
          handle,
          claimedById: user.id,
          claimedAt: new Date(),
          ipHash,
          country,
        },
        update: {
          claimedById: user.id,
          claimedAt: existing?.claimedAt ?? new Date(),
          ipHash,
          country,
        },
      });
      const targets = [];
      for (const target of adds)
        targets.push(
          await tx.hereForPerson.upsert({
            where: { handle: target },
            create: { handle: target },
            update: {},
          }),
        );
      const previous = await tx.hereForAdd.findMany({
        where: { fromId: person.id },
        select: { toId: true },
      });
      await tx.hereForAdd.deleteMany({ where: { fromId: person.id } });
      await tx.hereForAdd.createMany({
        data: targets.map((target, i) => ({
          fromId: person.id,
          toId: target.id,
          rank: i + 1,
        })),
      });
      if (previous.length)
        await tx.hereForPerson.deleteMany({
          where: {
            id: { in: previous.map((add) => add.toId) },
            claimedById: null,
            xUserId: null,
            adds: { none: {} },
            addedBy: { none: {} },
          },
        });
      return person;
    },
    { isolationLevel: "Serializable" },
  );
}

export async function loadMeByBallot(ballotId: string) {
  return awardsPrisma.hereForPerson.findFirst({
    where: { claimedBy: { browserUuid: ballotId }, hidden: false },
    select: { handle: true },
  });
}

/** True when both people are visible and each added the other. */
export async function loadIsMutual(a: HereForHandle, b: HereForHandle) {
  const count = await awardsPrisma.hereForAdd.count({
    where: {
      OR: [
        {
          from: { handle: a, hidden: false },
          to: { handle: b, hidden: false },
        },
        {
          from: { handle: b, hidden: false },
          to: { handle: a, hidden: false },
        },
      ],
    },
  });
  return count === 2;
}

export async function loadCardAdds(handle: HereForHandle) {
  const person = await awardsPrisma.hereForPerson.findUnique({
    where: {
      handle,
      hidden: false,
      OR: [
        { adds: { some: { to: { hidden: false } } } },
        { addedBy: { some: { from: { hidden: false } } } },
      ],
    },
    select: {
      adds: {
        where: { to: { hidden: false } },
        orderBy: { rank: "asc" },
        select: { toId: true, to: { select: { handle: true } } },
      },
      addedBy: { select: { fromId: true } },
    },
  });
  if (!person) return null;
  const incoming = new Set(person.addedBy.map((add) => add.fromId));
  return person.adds.map((add) => ({
    handle: add.to.handle as HereForHandle,
    mutual: incoming.has(add.toId),
  }));
}

export async function loadDirectory(): Promise<HereForDirectoryPayload> {
  const rows = await awardsPrisma.hereForDirectoryEntry.findMany({
    select: { handle: true, name: true },
    orderBy: [{ followers: "desc" }, { handle: "asc" }],
  });
  return { entries: rows.map((row) => [row.handle.slice(1), row.name]) };
}
