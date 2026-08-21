import { createHash } from "node:crypto";
import { rpc } from "./rpc";

/**
 * Real client identity (Jito, BAM, Harmonic, Rakurai…) straight from the
 * chain: Jito's validator history program records each validator's
 * gossip-reported client type once per epoch. Gossip version strings alone
 * can only separate Firedancer from the Agave lineage; this is the on-chain
 * source that names the forks.
 *
 * Layout verified against mainnet (offsets from
 * jito-foundation/stakenet validator-history state.rs):
 *   disc(8) struct_version(4) vote_account(32) index(4) bump(1) pad(7)
 *   last_ip_ts(8) last_version_ts(8) validator_age(4) age_epoch(2) pad(226)
 *   CircBuf{ idx(8) is_empty(1) pad(7) arr[512 × 128-byte entries] }
 * Entry: stake(8) epoch(2) mev_commission(2) credits(4) commission(1)
 *   client_type(1) version(4) ip(4) …
 *
 * Cost discipline (this fetch is heavy, so it is cached per epoch upstream):
 * ONE getProgramAccounts with a discriminator filter and a 300-byte dataSlice
 * (vote account + buffer cursor — 0.5% of each 64 KB account), then sliced
 * getMultipleAccounts reads of just the recent entries, banded so validators
 * with nearby cursors share a call. Entries are written sparsely — client
 * type can sit unset (255) for epochs — so each validator walks back up to
 * WALKBACK entries to its latest known value, the same latest-known-per
 * -identity rule the perp200 warehouse uses.
 */

const PROGRAM_ID = "HistoryJTGbKQD2mRgLZ3XhqHnN811Qpez8X9kCcGHoa";
const ACCOUNT_SIZE = 65856;
const VOTE_OFFSET = 12;
const IDX_OFFSET = 304;
const ARR_OFFSET = 320;
const ENTRY_SIZE = 128;
const ENTRY_EPOCH = 8; // u16
const ENTRY_CLIENT_TYPE = 17; // u8
/** entries in the circular buffer — a cursor walkback wraps past index 0 */
const RING_SIZE = 512;
/** epochs of history to search for the latest set client type (~1 month) */
const WALKBACK = 16;
/** cursor band width — validators in a band share one sliced read */
const BAND = 16;
const MAX_KEYS_PER_CALL = 100;
const CONCURRENCY = 8;
/** one retry per band — public-RPC 429s are bursty, not persistent */
const RETRY_DELAY_MS = 750;
const UNSET = 255;
/** zeroed (never-written) buffer slots decode as epoch 0 — reject them */
const MIN_PLAUSIBLE_EPOCH = 500;

/** client_type → display name (matches the perp200 dashboard's table). */
export const CLIENT_NAMES: Record<number, string> = {
  0: "Solana Labs",
  1: "Jito",
  2: "Frankendancer",
  3: "Agave",
  4: "Agave Paladin",
  5: "Firedancer",
  6: "Agave BAM",
  7: "Sig",
  8: "Rakurai",
  9: "Harmonic FD",
  10: "Harmonic Agave",
  11: "Harmonic Frank",
  12: "FireBAM",
  13: "Raiku",
};

const B58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function b58encode(buf: Uint8Array): string {
  let n = 0n;
  for (const b of buf) n = (n << 8n) | BigInt(b);
  let out = "";
  while (n > 0n) {
    out = B58_ALPHABET[Number(n % 58n)] + out;
    n /= 58n;
  }
  for (const b of buf) {
    if (b !== 0) break;
    out = "1" + out;
  }
  return out;
}

const DISCRIMINATOR = b58encode(
  createHash("sha256")
    .update("account:ValidatorHistory")
    .digest()
    .subarray(0, 8),
);

interface SlicedAccount {
  pubkey: string;
  account: { data: [string, string] };
}

interface VoteIdentity {
  votePubkey: string;
  nodePubkey: string;
  activatedStake: number;
}

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (_item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    }),
  );
  return out;
}

/**
 * identity pubkey → client_type for every currently staked validator whose
 * history resolves within the walk-back window. Missing validators simply
 * aren't in the map — callers keep their gossip-family fallback.
 */
export async function loadValidatorClientTypes(): Promise<
  Record<string, number>
> {
  const [votes, accounts] = await Promise.all([
    rpc<{ current: VoteIdentity[] }>("getVoteAccounts", [
      { keepUnstakedDelinquents: false },
    ]).then((r) => r.current),
    rpc<SlicedAccount[]>("getProgramAccounts", [
      PROGRAM_ID,
      {
        encoding: "base64",
        dataSlice: {
          offset: VOTE_OFFSET,
          length: IDX_OFFSET + 8 - VOTE_OFFSET,
        },
        filters: [
          { dataSize: ACCOUNT_SIZE },
          { memcmp: { offset: 0, bytes: DISCRIMINATOR } },
        ],
      },
    ]),
  ]);

  const histByVote = new Map<string, { pubkey: string; idx: number }>();
  for (const a of accounts) {
    const d = Buffer.from(a.account.data[0], "base64");
    histByVote.set(b58encode(d.subarray(0, 32)), {
      pubkey: a.pubkey,
      idx: Number(d.readBigUInt64LE(IDX_OFFSET - VOTE_OFFSET)),
    });
  }

  // Only staked validators matter (the leader schedule holds no others).
  // When an identity runs several vote accounts the heaviest one decides —
  // enforced by explicit stake comparison below, since bands resolve in RPC
  // completion order, not submission order.
  const staked = votes.filter((v) => v.activatedStake > 0);

  // Band by cursor so one sliced read covers every validator in the band:
  // fetch [bandStart − (WALKBACK−1) … bandEnd] and walk back per validator.
  // The buffer is a ring, so once it wraps a cursor within WALKBACK of index
  // 0 continues its walk-back from the array's end — covered by an extra
  // tail read. Pre-wrap those tail slots are zeroed and decode as epoch 0,
  // which the plausibility check rejects.
  const bands = new Map<
    number,
    { pubkey: string; idx: number; identity: string; stake: number }[]
  >();
  for (const v of staked) {
    const h = histByVote.get(v.votePubkey);
    if (!h) continue;
    const band = Math.floor(h.idx / BAND);
    if (!bands.has(band)) bands.set(band, []);
    bands
      .get(band)!
      .push({ ...h, identity: v.nodePubkey, stake: v.activatedStake });
  }

  const calls: {
    keys: { pubkey: string; idx: number; identity: string; stake: number }[];
    from: number;
    count: number;
    tailCount: number;
  }[] = [];
  for (const [band, group] of bands) {
    const start = band * BAND - (WALKBACK - 1);
    const from = Math.max(0, start);
    const count = (band + 1) * BAND - 1 - from + 1;
    const tailCount = Math.max(0, -start);
    for (let i = 0; i < group.length; i += MAX_KEYS_PER_CALL)
      calls.push({
        keys: group.slice(i, i + MAX_KEYS_PER_CALL),
        from,
        count,
        tailCount,
      });
  }

  const byIdentity: Record<string, number> = {};
  const best: Record<string, { stake: number; pubkey: string }> = {};
  let failedBands = 0;
  await mapLimit(
    calls,
    CONCURRENCY,
    async ({ keys, from, count, tailCount }) => {
      const readSlice = (offset: number, length: number) =>
        rpc<{ value: ({ data: [string, string] } | null)[] }>(
          "getMultipleAccounts",
          [
            keys.map((k) => k.pubkey),
            { encoding: "base64", dataSlice: { offset, length } },
          ],
        );
      // The walk-back window for a low cursor wraps below index 0 to the ring's
      // end, and dataSlice is a single contiguous range — so wrapped bands read
      // the ring tail separately and prepend it, making the walk seamless.
      const readBand = () =>
        Promise.all([
          readSlice(ARR_OFFSET + from * ENTRY_SIZE, count * ENTRY_SIZE),
          tailCount > 0
            ? readSlice(
                ARR_OFFSET + (RING_SIZE - tailCount) * ENTRY_SIZE,
                tailCount * ENTRY_SIZE,
              )
            : null,
        ]);
      // A rate-limited band must not sink the sweep: partial identities beat
      // none, since every missing validator keeps its gossip-family fallback.
      let band: Awaited<ReturnType<typeof readBand>>;
      try {
        band = await readBand();
      } catch {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        try {
          band = await readBand();
        } catch {
          failedBands++;
          return;
        }
      }
      const [head, tail] = band;
      head.value.forEach((val, i) => {
        if (!val) return;
        const headBuf = Buffer.from(val.data[0], "base64");
        const tailVal = tail?.value[i];
        const buf =
          tailCount > 0
            ? Buffer.concat([
                tailVal
                  ? Buffer.from(tailVal.data[0], "base64")
                  : Buffer.alloc(tailCount * ENTRY_SIZE),
                headBuf,
              ])
            : headBuf;
        const { idx, identity, stake, pubkey } = keys[i];
        for (
          let e = tailCount + idx - from;
          e >= Math.max(0, tailCount + idx - from - (WALKBACK - 1));
          e--
        ) {
          const ct = buf.readUInt8(e * ENTRY_SIZE + ENTRY_CLIENT_TYPE);
          const epoch = buf.readUInt16LE(e * ENTRY_SIZE + ENTRY_EPOCH);
          if (ct !== UNSET && epoch >= MIN_PLAUSIBLE_EPOCH) {
            // the heaviest vote account decides, independent of which band's
            // RPC call completes first; equal stakes tie-break on pubkey so
            // the result is deterministic across runs
            const cur = best[identity];
            if (
              !cur ||
              stake > cur.stake ||
              (stake === cur.stake && pubkey > cur.pubkey)
            ) {
              best[identity] = { stake, pubkey };
              byIdentity[identity] = ct;
            }
            return;
          }
        }
      });
    },
  );

  // Nothing resolved at all is a real outage — throw so the route's failure
  // cooldown engages instead of caching an empty map as a good sweep.
  if (calls.length > 0 && failedBands === calls.length)
    throw new Error(
      `validator history: all ${calls.length} getMultipleAccounts bands failed`,
    );
  return byIdentity;
}
