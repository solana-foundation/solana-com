import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { runLayout } from "./here-for-layout.mjs";
const seedArg = process.argv.indexOf("--seed");
const seed = seedArg >= 0 ? Number(process.argv[seedArg + 1]) : 2026;
const countArg = process.argv.indexOf("--count");
const count = countArg >= 0 ? Number(process.argv[countArg + 1]) : 5000;
// Three claimed people plus one ghost provide three distinct picks per person.
if (!Number.isSafeInteger(count) || count < 3) {
  throw new Error("--count must be a safe integer of at least 3.");
}
const db = new PrismaClient();
let state = seed >>> 0;
const rng = () =>
  (state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 4294967296;
const pick = (n) => Math.floor(rng() * n);
const syllables = [
  "sol",
  "ana",
  "nova",
  "dex",
  "flow",
  "mint",
  "orbit",
  "pixel",
  "chain",
  "wave",
  "byte",
  "luna",
  "astro",
  "terra",
  "zen",
  "flux",
  "core",
  "spark",
  "alpha",
  "prime",
  "node",
  "blaze",
  "drift",
  "echo",
  "pulse",
  "rune",
  "forge",
  "saga",
  "velo",
  "mira",
];
const handles = new Set();
function handle() {
  for (;;) {
    let name =
      syllables[pick(syllables.length)] +
      syllables[pick(syllables.length)] +
      syllables[pick(syllables.length)];
    if (rng() < 0.6) name += String(pick(1000));
    if (rng() < 0.15) name += "_" + String(pick(10));
    name = name.slice(0, 15);
    if (name.length >= 4 && !handles.has(name)) {
      handles.add(name);
      return "@" + name;
    }
  }
}
async function batch(model, records) {
  for (let i = 0; i < records.length; i += 1000)
    await model.createMany({ data: records.slice(i, i + 1000) });
}
try {
  if (process.argv.includes("--reset")) {
    await db.hereForLayoutSnapshot.deleteMany();
    await db.hereForAdd.deleteMany();
    await db.hereForPerson.deleteMany();
    await db.user.deleteMany({
      where: { browserUuid: { startsWith: "seed-" } },
    });
  }
  const claimed = Array.from({ length: count }, (_, i) => ({
    id: randomUUID(),
    handle: handle(),
    cluster: i % 12,
    createdAt: new Date(Date.now() - rng() * 14 * 86400000),
  }));
  const ghosts = Array.from({ length: Math.round(count * 0.18) }, (_, i) => ({
    id: randomUUID(),
    handle: handle(),
    cluster: i % 12,
    createdAt: new Date(Date.now() - rng() * 14 * 86400000),
  }));
  const users = claimed.map(() => ({
    id: randomUUID(),
    browserUuid: `seed-${randomUUID()}`,
  }));
  await batch(db.user, users);
  await batch(
    db.hereForPerson,
    claimed.map((p, i) => ({
      id: p.id,
      handle: p.handle,
      claimedById: users[i].id,
      claimedAt: p.createdAt,
      createdAt: p.createdAt,
      updatedAt: p.createdAt,
    })),
  );
  await batch(
    db.hereForPerson,
    ghosts.map((p) => ({
      id: p.id,
      handle: p.handle,
      createdAt: p.createdAt,
      updatedAt: p.createdAt,
    })),
  );
  const clusters = Array.from({ length: 12 }, (_, i) =>
    claimed.filter((p) => p.cluster === i),
  );
  const idIndex = new Map(claimed.map((p, i) => [p.id, i]));
  const targetLists = claimed.map((p) => {
    const targets = [];
    while (targets.length < 3) {
      let pool;
      if (rng() < 0.15) pool = ghosts;
      else if (rng() < 0.82) pool = clusters[p.cluster];
      else pool = claimed;
      const rank = Math.pow(rng(), 3);
      const target = pool[Math.floor(rank * pool.length)];
      if (target && target.id !== p.id && !targets.includes(target.id))
        targets.push(target.id);
    }
    return targets;
  });
  for (let i = 0; i < claimed.length; i++)
    for (const target of targetLists[i]) {
      const j = idIndex.get(target);
      if (
        j === undefined ||
        claimed[j].cluster !== claimed[i].cluster ||
        rng() >= 0.3 ||
        targetLists[j].includes(claimed[i].id)
      )
        continue;
      targetLists[j][2] = claimed[i].id;
    }
  const adds = claimed.flatMap((p, i) =>
    targetLists[i].map((toId, j) => ({
      id: randomUUID(),
      fromId: p.id,
      toId,
      rank: j + 1,
      createdAt: p.createdAt,
    })),
  );
  await batch(db.hereForAdd, adds);
  const orphaned = await db.hereForPerson.deleteMany({
    where: {
      claimedById: null,
      adds: { none: {} },
      addedBy: { none: {} },
    },
  });
  const edgeSet = new Set(adds.map((a) => `${a.fromId}:${a.toId}`));
  let mutualPairs = 0;
  for (const a of adds)
    if (a.fromId < a.toId && edgeSet.has(`${a.toId}:${a.fromId}`))
      mutualPairs++;
  console.log(
    `people ${claimed.length + ghosts.length - orphaned.count}, claimed ${claimed.length}, ghosts ${ghosts.length - orphaned.count}, adds ${adds.length}, mutual pairs ${mutualPairs}`,
  );
  const payload = await runLayout(true);
  console.log(`communities ${payload.communities.length}`);
} finally {
  await db.$disconnect();
}
