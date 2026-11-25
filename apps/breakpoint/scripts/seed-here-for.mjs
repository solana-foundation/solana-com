import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { generateSeedGraph } from "./here-for-seed-graph.mjs";
import { runLayout } from "./here-for-layout.mjs";
const seedArg = process.argv.indexOf("--seed");
const seed = seedArg >= 0 ? Number(process.argv[seedArg + 1]) : 2026;
const countArg = process.argv.indexOf("--count");
const count = countArg >= 0 ? Number(process.argv[countArg + 1]) : 5000;
// The celebrity pool always holds enough people for three distinct picks.
if (!Number.isSafeInteger(count) || count < 3) {
  throw new Error("--count must be a safe integer of at least 3.");
}
const db = new PrismaClient();
const { people, communities, pods } = generateSeedGraph(seed, count);

async function batch(model, records) {
  for (let i = 0; i < records.length; i += 1000)
    await model.createMany({ data: records.slice(i, i + 1000) });
}
try {
  if (process.argv.includes("--reset")) {
    await db.hereForLayoutSnapshot.deleteMany();
    await db.hereForAdd.deleteMany();
    await db.hereForPerson.deleteMany();
    // X sign-in creates the person row, so a session that outlives it would
    // reject saves as handle_claimed until the visitor signs in again.
    await db.hereForXSession.deleteMany();
    await db.user.deleteMany({
      where: { browserUuid: { startsWith: "seed-" } },
    });
  }
  const claimed = people.filter((p) => p.claimed);
  const ghosts = people.filter((p) => !p.claimed && p.adders.length);
  const users = claimed.map(() => ({
    id: randomUUID(),
    browserUuid: `seed-${randomUUID()}`,
  }));
  await batch(db.user, users);
  await batch(db.hereForPerson, [
    ...claimed.map((p, i) => ({
      id: p.id,
      handle: p.handle,
      claimedById: users[i].id,
      claimedAt: p.claimedAt,
      createdAt: p.firstAddedAt ?? p.claimedAt,
      updatedAt: p.claimedAt,
    })),
    ...ghosts.map((p) => ({
      id: p.id,
      handle: p.handle,
      createdAt: p.firstAddedAt,
      updatedAt: p.firstAddedAt,
    })),
  ]);
  const adds = claimed.flatMap((p) =>
    p.targets.map((t, j) => ({
      id: randomUUID(),
      fromId: p.id,
      toId: t.id,
      rank: j + 1,
      createdAt: p.claimedAt,
    })),
  );
  await batch(db.hereForAdd, adds);
  const edgeSet = new Set(adds.map((a) => `${a.fromId}:${a.toId}`));
  let mutualPairs = 0;
  for (const a of adds)
    if (a.fromId < a.toId && edgeSet.has(`${a.toId}:${a.fromId}`))
      mutualPairs++;
  const top = [...claimed, ...ghosts]
    .sort((a, b) => b.adders.length - a.adders.length)
    .slice(0, 3)
    .map((p) => `${p.handle} ${p.adders.length}`);
  console.log(
    `people ${claimed.length + ghosts.length}, claimed ${claimed.length}, ghosts ${ghosts.length}, adds ${adds.length}, mutual pairs ${mutualPairs}, communities ${communities.length}, pods ${pods.length}, most added ${top.join(", ")}`,
  );
  const payload = await runLayout(true);
  console.log(`communities ${payload.communities.length}`);
} finally {
  await db.$disconnect();
}
