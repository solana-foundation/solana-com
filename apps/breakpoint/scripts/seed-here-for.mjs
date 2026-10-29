import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
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
let state = seed >>> 0;
const rng = () =>
  (state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 4294967296;
const pick = (n) => Math.floor(rng() * n);
const any = (list) => list[pick(list.length)];
const gaussian = () =>
  Math.sqrt(-2 * Math.log(1 - rng())) * Math.cos(2 * Math.PI * rng());
function weighted(list, weight) {
  let total = 0;
  for (const item of list) total += weight(item);
  let r = rng() * total;
  for (const item of list) if ((r -= weight(item)) <= 0) return item;
  return list[list.length - 1];
}

// Handles: mostly people's names, some crypto-flavoured, all X-valid.
const firsts =
  "maya,leo,ana,kai,noor,jun,sofia,omar,lena,ravi,mei,tomas,zara,ivan,aiko,diego,priya,femi,elsa,hugo,yara,arjun,chloe,mateo,ines,kofi,sasha,theo,lin,nadia,jonas,amara,felix,rosa,dev,hana,luca,nia,oscar,tara,ezra,mila,raj,sven,ada,bruno,cleo,dani,emre,gia,ike,jade,kenji,lars,mona,nico,olu,pia,quinn,remy".split(
    ",",
  );
const lasts =
  "chen,silva,okafor,patel,kim,novak,haddad,garcia,ito,meyer,rossi,nguyen,costa,sato,berg,diaz,khan,lopez,moreau,park,reyes,schmidt,tanaka,walsh,young,zhou,ali,bauer,cruz,dubois".split(
    ",",
  );
const words =
  "sol,dev,build,onchain,degen,anon,rust,anchor,mint,stake,node,gm,based,labs,dao,defi,nft,rpc,ser,wagmi,validator,pixel,alpha,ship,hack".split(
    ",",
  );
const handles = new Set();
function handle(famous = false) {
  for (;;) {
    const first = any(firsts);
    const last = any(lasts);
    const digits = () => String(pick(rng() < 0.5 ? 100 : 10000));
    const patterns = famous
      ? [
          () => first + last,
          () => first + any(words),
          () => any(words) + any(words),
          () => first,
        ]
      : [
          () => first + last,
          () => first + "_" + last,
          () => first + last[0] + digits(),
          () => first + digits(),
          () => first + "_" + any(words),
          () => any(words) + first,
          () => "0x" + first,
          () => first + last + "_",
          () => any(words) + any(words) + digits(),
        ];
    const name = any(patterns)().slice(0, 15);
    if (!handles.has(name)) {
      handles.add(name);
      return "@" + name;
    }
  }
}

const people = [];
function person(props) {
  const p = {
    id: randomUUID(),
    handle: handle(props.celebrity),
    community: -1,
    second: -1,
    fame: 0,
    celebrity: false,
    pod: false,
    claimed: false,
    claimedAt: null,
    firstAddedAt: null,
    targets: [],
    adders: [],
    ...props,
  };
  people.push(p);
  return p;
}

// Ecosystem-wide names everyone adds; few of them sign up themselves.
const celebrities = Array.from(
  { length: Math.min(40, Math.max(8, Math.round(count / 150))) },
  (_, i) => person({ celebrity: true, fame: 40 / (i + 1) ** 0.9 }),
);

// Friends who sign up together and only add each other. A pod of three
// shares one outside friend who never signs up, so everyone still has 3.
const podded = count >= 60 ? Math.round(count * 0.04) : 0;
const pods = [];
for (let n = 0; podded - n >= 3;) {
  const size = Math.min(podded - n, 3 + pick(3));
  const members = Array.from({ length: size }, () => person({ pod: true }));
  const friend = size === 3 ? person({ pod: true }) : null;
  pods.push({ members, friend });
  n += size;
}
let podPeopleLeft = pods.reduce((sum, pod) => sum + pod.members.length, 0);

// Heavy-tailed communities: a few big scenes, many small circles. Extra
// members beyond the claimers are people who get added but never sign up.
const communities = [];
const target = Math.round((count - podded) * 1.7);
while (communities.reduce((sum, c) => sum + c.length, 0) < target) {
  const size = Math.round(
    Math.min(
      target * 0.2,
      Math.max(6, Math.exp(Math.log(50) + 1.1 * gaussian())),
    ),
  );
  const id = communities.length;
  const members = Array.from({ length: size }, (_, i) =>
    person({
      community: id,
      fame: i < Math.max(2, size * 0.04) ? 6 + rng() * 10 : rng() * 0.5,
      // Plenty of people get tagged and never sign up.
      joins: rng() < 0.62,
    }),
  );
  communities.push(members);
}
const sizes = communities.map((c, i) => [i, c.length]);
for (const members of communities)
  for (const p of members)
    if (communities.length > 1 && rng() < 0.12)
      while (p.second === -1 || p.second === p.community)
        p.second = weighted(sizes, ([, size]) => size)[0];

// Front-loaded launch with share waves on days 2, 6 and 10.
const times = Array.from({ length: count }, () => {
  const day =
    rng() < 0.6 ? 14 * rng() ** 2.5 : any([2, 6, 10]) + Math.abs(gaussian());
  return Date.now() - (14 - Math.min(14, day)) * 86400000;
}).sort((a, b) => a - b);

// Sign-up order: insiders first, then whoever their friends tagged.
const waiting = people.filter((p) => !p.pod);
const joinWeight = (p) =>
  p.claimed || p.joins === false
    ? 0
    : (p.celebrity ? 0.05 : 1) *
      (1 + Math.min(p.fame, 8) * 0.4) *
      (1 + 2.5 * Math.min(p.adders.length, 6));
function link(from, to, at) {
  from.targets.push(to);
  to.adders.push(from);
  to.firstAddedAt ??= at;
}
function choose(p) {
  const picked = new Set();
  const ok = (t) => t && t !== p && !picked.has(t);
  const local = (members) =>
    weighted(members, (t) =>
      ok(t) ? 0.3 + t.fame + 0.8 * t.adders.length : 0,
    );
  for (let attempt = 0; picked.size < 3 && attempt < 40; attempt++) {
    const r = rng();
    let t;
    // Add back someone who tagged you, follow a friend's pick, name an
    // ecosystem celebrity, or pick from your own scenes.
    if (r < 0.35 && p.adders.length) t = any(p.adders);
    else if (r < 0.5 && picked.size) t = any(any([...picked]).targets);
    else if (r < 0.64) t = weighted(celebrities, (c) => c.fame);
    else if (r < 0.74 && p.second >= 0) t = local(communities[p.second]);
    else if (p.community >= 0) t = local(communities[p.community]);
    if (ok(t)) picked.add(t);
  }
  for (const c of celebrities) if (picked.size < 3 && ok(c)) picked.add(c);
  return [...picked];
}
let claimedCount = 0;
let nextPod = 0;
while (claimedCount < count) {
  const pod = pods[nextPod];
  if (
    pod &&
    pod.members.length <= count - claimedCount &&
    rng() < podPeopleLeft / (count - claimedCount)
  ) {
    nextPod++;
    podPeopleLeft -= pod.members.length;
    const at = times[claimedCount];
    for (const p of pod.members) {
      p.claimed = true;
      p.claimedAt = new Date(at + pick(3600000));
      claimedCount++;
    }
    for (const p of pod.members) {
      const friends = pod.members.filter((f) => f !== p);
      while (friends.length > 3) friends.splice(pick(friends.length), 1);
      if (pod.friend) friends.push(pod.friend);
      for (const f of friends) link(p, f, p.claimedAt);
    }
    continue;
  }
  const p = weighted(waiting, joinWeight);
  if (p.claimed) break;
  p.claimed = true;
  p.claimedAt = new Date(times[claimedCount++]);
  for (const t of choose(p)) link(p, t, p.claimedAt);
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
