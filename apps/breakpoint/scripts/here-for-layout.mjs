import { PrismaClient } from "@prisma/client";
import { computeLayout } from "../src/lib/here-for/layout-core.mjs";
const db = new PrismaClient();
export async function runLayout(cold = true) {
  const start = performance.now();
  const [people, adds, previous] = await Promise.all([
    db.hereForPerson.findMany({
      where: {
        hidden: false,
        OR: [
          { adds: { some: { to: { hidden: false } } } },
          { addedBy: { some: { from: { hidden: false } } } },
        ],
      },
      select: { id: true, handle: true },
    }),
    db.hereForAdd.findMany({
      where: { from: { hidden: false }, to: { hidden: false } },
      select: { fromId: true, toId: true },
    }),
    cold
      ? Promise.resolve(null)
      : db.hereForLayoutSnapshot.findFirst({ orderBy: { createdAt: "desc" } }),
  ]);
  const payload = computeLayout({ people, adds }, previous?.payload ?? null);
  const snapshot = await db.hereForLayoutSnapshot.create({
    data: { nodeCount: people.length, linkCount: adds.length, payload },
  });
  const old = await db.hereForLayoutSnapshot.findMany({
    orderBy: { createdAt: "desc" },
    skip: 5,
    select: { id: true },
  });
  if (old.length)
    await db.hereForLayoutSnapshot.deleteMany({
      where: { id: { in: old.map((x) => x.id) } },
    });
  console.log(
    `layout ${cold ? "cold" : "warm"}: ${Math.round(performance.now() - start)}ms, ${people.length} nodes, ${adds.length} adds, ${payload.communities.length} communities, snapshot ${snapshot.id}`,
  );
  return payload;
}
if (process.argv[1]?.endsWith("here-for-layout.mjs"))
  try {
    await runLayout(!process.argv.includes("--warm"));
  } finally {
    await db.$disconnect();
  }
