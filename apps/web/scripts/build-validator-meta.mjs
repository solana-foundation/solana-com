// Regenerates src/data/slot200/validator-meta.json — identity -> [lat, lon,
// city, name] for every gossip node, so the /200ms map can pulse at the city
// that actually produced each block. Adapted from perp200's
// build-validator-geo.js (github.com/solanadevmint/perp200, our own campaign
// dashboard). IPs are public gossip data; geolocation is city-level via the
// free ip-api.com batch API (~15 requests at current cluster size).
//
// Run manually when the snapshot gets stale:
//   node apps/web/scripts/build-validator-meta.mjs
// Uses HELIUS_API_KEY when set, else the public mainnet RPC.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/data/slot200/validator-meta.json",
);
const RPC = process.env.HELIUS_API_KEY
  ? `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`
  : (process.env.SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com");

async function rpc(method, params = []) {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(`${method}: ${json.error.message}`);
  return json.result;
}

const nodes = (await rpc("getClusterNodes")) ?? [];

// Self-published names from on-chain validator-info (Config program).
const names = {};
try {
  const cfg =
    (await rpc("getProgramAccounts", [
      "Config1111111111111111111111111111111111111",
      { encoding: "jsonParsed" },
    ])) ?? [];
  for (const a of cfg) {
    const p = a.account?.data?.parsed;
    if (!p || p.type !== "validatorInfo") continue;
    const ident = (p.info?.keys ?? [])
      .map((k) => k.pubkey)
      .find((k) => k !== "Va1idator1nfo111111111111111111111111111111");
    const nm = p.info?.configData?.name;
    if (ident && nm) names[ident] = String(nm).slice(0, 40);
  }
} catch (e) {
  console.error("validator-info fetch failed (names omitted):", e.message);
}
console.log("validator names:", Object.keys(names).length);

const byIp = {};
for (const n of nodes) {
  if (!n.gossip || !n.pubkey) continue;
  const ip = n.gossip.split(":")[0];
  (byIp[ip] ??= []).push(n.pubkey);
}
const ips = Object.keys(byIp);
console.log("gossip nodes:", nodes.length, "unique ips:", ips.length);

let old = {};
try {
  old = JSON.parse(fs.readFileSync(OUT, "utf8"));
} catch {
  // first run: no previous snapshot to merge over
}
const geo = { ...old };
let ok = 0;
let fail = 0;
for (let i = 0; i < ips.length; i += 100) {
  const batch = ips.slice(i, i + 100);
  try {
    const res = await fetch(
      "http://ip-api.com/batch?fields=status,lat,lon,city,query",
      {
        method: "POST",
        body: JSON.stringify(batch),
      },
    ).then((r) => r.json());
    for (const r of res) {
      if (r.status !== "success") {
        fail++;
        continue;
      }
      ok++;
      for (const id of byIp[r.query])
        geo[id] = [
          Math.round(r.lat * 10) / 10,
          Math.round(r.lon * 10) / 10,
          r.city || "",
          names[id] || "",
        ];
    }
  } catch (e) {
    console.error("batch err", e.message);
    fail += batch.length;
  }
  // ip-api free tier allows 15 batch requests per minute
  await new Promise((r) => setTimeout(r, 4500));
}
for (const id of Object.keys(geo)) {
  if (names[id] && !geo[id][3]) geo[id][3] = names[id];
}
fs.writeFileSync(OUT, JSON.stringify(geo));
console.log(
  "geolocated ok:",
  ok,
  "fail:",
  fail,
  "total:",
  Object.keys(geo).length,
);
