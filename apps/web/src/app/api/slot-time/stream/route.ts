import { unstable_cache } from "next/cache";
import { NextRequest } from "next/server";
import {
  getEpochInfo,
  getPerformanceSamples,
  rpcWsUrl,
} from "@/lib/slot200/rpc";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// Every viewer on an instance shares ONE upstream RPC WebSocket (see bridge
// below); each SSE response still holds an invocation, so cap its lifetime —
// the EventSource client reconnects seamlessly when we close before the cap.
export const maxDuration = 300;

const STREAM_MS = 285_000;
// Backstop against connection floods: streams are cheap now (fan-out only, no
// per-viewer upstream), but each still pins an invocation for up to STREAM_MS.
// The authoritative rate limit lives at the platform edge (Vercel WAF);
// rejected clients fall back to the cached /api/slot-time poll.
const MAX_STREAMS_PER_INSTANCE = 100;
// A browser needs one stream per tab; anything beyond a handful of concurrent
// streams from a single address (IPv4) or /64 prefix (IPv6) is a misbehaving
// client, so refuse it before it can monopolize the instance-wide allowance.
const MAX_STREAMS_PER_CLIENT = 4;
let activeStreams = 0;
const streamsByClient = new Map<string, number>();

// Vercel sets x-real-ip to the socket peer address; the x-forwarded-for chain
// can carry client-supplied entries, so only its last hop is trusted.
function clientKey(req: NextRequest): string {
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return bucketIp(realIp.trim());
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const hops = fwd.split(",");
    return bucketIp(hops[hops.length - 1].trim());
  }
  return "unknown";
}

// An IPv6 caller usually controls an entire /64 and can rotate through it for
// free, so key those by prefix; IPv4 addresses (including IPv4-mapped IPv6)
// are scarce enough to key individually.
function bucketIp(ip: string): string {
  const addr = ip.toLowerCase();
  if (!addr.includes(":") || addr.includes(".")) return addr;
  const [head, tail = ""] = addr.split("::");
  const headParts = head ? head.split(":") : [];
  const tailParts = tail ? tail.split(":") : [];
  const missing = Math.max(8 - headParts.length - tailParts.length, 0);
  const full = [...headParts, ...Array(missing).fill("0"), ...tailParts];
  return full.slice(0, 4).join(":");
}

const ENCODER = new TextEncoder();
const DEFAULT_SLOT_MS = 400;
const STREAM_SNAPSHOT_CACHE_SECONDS = 15;
const STREAM_SNAPSHOT_CACHE_KEY = "slot200-stream-snapshot-v2";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const SNAP_INTERVAL_MS = 60_000;
const WS_GUARD_MS = 8_000;
const WS_RECONNECT_DELAY_MS = 1_000;
const WS_MAX_CONSECUTIVE_FAILURES = 3;

async function loadStreamSnapshot() {
  return Promise.all([getEpochInfo(), getPerformanceSamples(10)]).then(
    ([info, samples]) => ({ info, samples }),
  );
}

const getStreamSnapshot = IS_PRODUCTION
  ? unstable_cache(loadStreamSnapshot, [STREAM_SNAPSHOT_CACHE_KEY], {
      revalidate: STREAM_SNAPSHOT_CACHE_SECONDS,
    })
  : loadStreamSnapshot;

interface SlotNotification {
  params?: { result?: { slot?: number } };
}

interface SnapPayload {
  type: "snap";
  slot: number;
  epoch: number;
  epochEndSlot: number;
  avg1m: number | null;
  avg10m: number | null;
  tps: number | null;
}

interface Viewer {
  enqueue: (_chunk: Uint8Array) => void;
  end: () => void;
}

/**
 * Shared upstream bridge: ONE slotSubscribe WebSocket and ONE snapshot poll
 * per function instance, fanned out to every connected SSE viewer, so RPC
 * quota scales with warm instances rather than with viewers. This relies on
 * Vercel Fluid compute (in-function concurrency) packing concurrent viewers
 * onto the same instance; without it each invocation is its own instance and
 * this degenerates to one upstream socket per viewer.
 *
 * Averages are ratio-of-totals over checkpoints — never mean-of-arrival-gaps,
 * WS delivery is bursty. Measurement state survives upstream reconnects and
 * quiet periods: the checkpoints are chain-anchored, so the ratio stays valid
 * across a gap.
 */
const bridge = {
  viewers: new Set<Viewer>(),
  ws: null as WebSocket | null,
  wsFailures: 0,
  timers: [] as ReturnType<typeof setTimeout>[],
  // ── measurement state ──
  lastSlot: 0,
  lastAt: 0,
  // checkpoints of (t, slot) for ratio-of-totals averages
  checks: [] as [number, number][],
  seedAvg: null as number | null,
  tps: null as number | null,
  lastSnap: null as SnapPayload | null,
};

function sseChunk(data: unknown): Uint8Array {
  return ENCODER.encode(`data: ${JSON.stringify(data)}\n\n`);
}

function broadcast(data: unknown) {
  const chunk = sseChunk(data);
  for (const viewer of bridge.viewers) viewer.enqueue(chunk);
}

function avgOver(windowMs: number): number | null {
  const now = Date.now();
  let oldest: [number, number] | null = null;
  for (const c of bridge.checks) {
    if (now - c[0] <= windowMs + 5000) {
      oldest = c;
      break;
    }
  }
  if (!oldest || !bridge.lastSlot) return null;
  const dSlots = bridge.lastSlot - oldest[1];
  const dMs = now - oldest[0];
  // demand a real window before trusting the ratio
  if (dSlots < 20 || dMs < windowMs * 0.5) return null;
  return dMs / dSlots;
}

async function snap() {
  try {
    const { info, samples } = await getStreamSnapshot();
    // Samples are newest first. Keep TPS on the same roughly two-minute
    // window as before while reusing the ten samples needed for the
    // initial seed average.
    const recent = samples.slice(0, 2);
    const nonVote = recent.reduce(
      (a, s) => a + (s.numNonVoteTransactions ?? 0),
      0,
    );
    const secs = recent.reduce((a, s) => a + s.samplePeriodSecs, 0);
    if (secs > 0 && nonVote > 0) bridge.tps = Math.round(nonVote / secs);
    if (bridge.seedAvg === null) {
      const slots = samples.reduce((a, s) => a + s.numSlots, 0);
      const sampleSecs = samples.reduce((a, s) => a + s.samplePeriodSecs, 0);
      bridge.seedAvg =
        slots > 0 && sampleSecs > 0
          ? (sampleSecs / slots) * 1000
          : DEFAULT_SLOT_MS;
    }
    const payload: SnapPayload = {
      type: "snap",
      slot: Math.max(info.absoluteSlot, bridge.lastSlot),
      epoch: info.epoch,
      epochEndSlot: info.absoluteSlot - info.slotIndex + info.slotsInEpoch,
      avg1m: avgOver(60_000) ?? bridge.seedAvg,
      avg10m: avgOver(600_000) ?? bridge.seedAvg,
      tps: bridge.tps,
    };
    bridge.lastSnap = payload;
    broadcast(payload);
  } catch {
    // keep streaming slots; clients hold their last snapshot
  }
}

function stopBridge() {
  bridge.timers.forEach(clearTimeout);
  bridge.timers = [];
  const ws = bridge.ws;
  bridge.ws = null;
  try {
    ws?.close();
  } catch {
    // already closed
  }
}

/** Upstream is gone for good: tell every viewer, close them all out. */
function failBridge() {
  broadcast({ type: "err" });
  const viewers = [...bridge.viewers];
  bridge.viewers.clear();
  stopBridge();
  for (const viewer of viewers) viewer.end();
}

function handleUpstreamLoss(ws: WebSocket) {
  if (bridge.ws !== ws) return; // stale socket from a previous generation
  bridge.ws = null;
  try {
    ws.close();
  } catch {
    // already closed
  }
  if (bridge.viewers.size === 0) return;
  bridge.wsFailures++;
  if (bridge.wsFailures > WS_MAX_CONSECUTIVE_FAILURES) {
    failBridge();
    return;
  }
  bridge.timers.push(
    setTimeout(connectUpstream, WS_RECONNECT_DELAY_MS * bridge.wsFailures),
  );
}

function connectUpstream() {
  let ws: WebSocket;
  try {
    ws = new WebSocket(rpcWsUrl());
  } catch {
    failBridge();
    return;
  }
  bridge.ws = ws;
  // never compute a per-slot arrival gap across a (re)connect
  bridge.lastAt = 0;

  let sawSlot = false;
  bridge.timers.push(
    setTimeout(() => {
      if (!sawSlot) handleUpstreamLoss(ws);
    }, WS_GUARD_MS),
  );

  ws.onopen = () =>
    ws.send(JSON.stringify({ jsonrpc: "2.0", id: 1, method: "slotSubscribe" }));
  ws.onmessage = (ev) => {
    let msg: SlotNotification;
    try {
      msg = JSON.parse(String(ev.data));
    } catch {
      return;
    }
    const slot = msg.params?.result?.slot;
    if (!slot || slot <= bridge.lastSlot) return;
    sawSlot = true;
    bridge.wsFailures = 0;
    const now = Date.now();
    const dt =
      bridge.lastAt && slot === bridge.lastSlot + 1
        ? now - bridge.lastAt
        : null;
    bridge.lastSlot = slot;
    bridge.lastAt = now;
    bridge.checks.push([now, slot]);
    // 10 min of 400 ms checkpoints ≈ 1500 entries
    if (bridge.checks.length > 1600)
      bridge.checks.splice(0, bridge.checks.length - 1600);
    const a1 = avgOver(60_000);
    broadcast({
      s: slot,
      dt,
      ...(a1 ? { avg1m: Math.round(a1 * 10) / 10 } : {}),
    });
  };
  ws.onerror = () => handleUpstreamLoss(ws);
  ws.onclose = () => handleUpstreamLoss(ws);
}

function addViewer(viewer: Viewer) {
  const first = bridge.viewers.size === 0;
  bridge.viewers.add(viewer);
  // A late joiner gets the last snapshot immediately (with the freshest slot)
  // instead of waiting for the next poll tick.
  if (bridge.lastSnap) {
    viewer.enqueue(
      sseChunk({
        ...bridge.lastSnap,
        slot: Math.max(bridge.lastSnap.slot, bridge.lastSlot),
      }),
    );
  }
  if (first) {
    bridge.wsFailures = 0;
    // register the poll timer before connecting so a synchronous connect
    // failure (failBridge → stopBridge) clears it too
    const snapTimer = setInterval(() => void snap(), SNAP_INTERVAL_MS);
    bridge.timers.push(snapTimer as unknown as ReturnType<typeof setTimeout>);
    connectUpstream();
    if (bridge.viewers.size > 0) void snap();
  }
}

function removeViewer(viewer: Viewer) {
  bridge.viewers.delete(viewer);
  if (bridge.viewers.size === 0) stopBridge();
}

/**
 * Per-viewer SSE response: admission control, heartbeat, and lifetime cap.
 * All slot data comes from the shared bridge above.
 */
export async function GET(req: NextRequest) {
  const client = clientKey(req);
  const clientStreams = streamsByClient.get(client) ?? 0;
  if (
    activeStreams >= MAX_STREAMS_PER_INSTANCE ||
    clientStreams >= MAX_STREAMS_PER_CLIENT
  ) {
    return new Response("stream capacity reached", {
      status: 429,
      headers: { "Retry-After": "30", "Cache-Control": "no-store" },
    });
  }
  activeStreams++;
  streamsByClient.set(client, clientStreams + 1);
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    activeStreams--;
    const remaining = (streamsByClient.get(client) ?? 1) - 1;
    if (remaining > 0) streamsByClient.set(client, remaining);
    else streamsByClient.delete(client);
  };

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;
      const timers: ReturnType<typeof setTimeout>[] = [];

      function cleanup() {
        if (closed) return;
        closed = true;
        timers.forEach(clearTimeout);
        removeViewer(viewer);
        try {
          controller.close();
        } catch {
          // already closed
        }
        release();
      }

      const viewer: Viewer = {
        enqueue: (chunk) => {
          if (closed) return;
          try {
            controller.enqueue(chunk);
          } catch {
            cleanup();
          }
        },
        end: cleanup,
      };

      req.signal.addEventListener("abort", cleanup);
      timers.push(setTimeout(cleanup, STREAM_MS));
      // keep intermediaries from buffering/idling the connection
      const hb = setInterval(() => {
        if (closed) return clearInterval(hb);
        try {
          controller.enqueue(ENCODER.encode(`: hb\n\n`));
        } catch {
          clearInterval(hb);
          cleanup();
        }
      }, 15_000);
      timers.push(hb as unknown as ReturnType<typeof setTimeout>);

      addViewer(viewer);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
