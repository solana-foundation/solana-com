import { unstable_cache } from "next/cache";
import { NextRequest } from "next/server";
import {
  getEpochInfo,
  getPerformanceSamples,
  rpcWsUrl,
} from "@/lib/slot200/rpc";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// One serverless invocation holds one upstream WebSocket per viewer; the
// EventSource client reconnects seamlessly when we close before the cap.
export const maxDuration = 300;

const STREAM_MS = 285_000;
const ENCODER = new TextEncoder();
const DEFAULT_SLOT_MS = 400;
const STREAM_SNAPSHOT_CACHE_SECONDS = 15;
const STREAM_SNAPSHOT_CACHE_KEY = "slot200-stream-snapshot-v2";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

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

/**
 * Per-viewer SSE bridge: one Helius (or public RPC) WebSocket slotSubscribe
 * upstream, per-slot arrival gaps downstream. Averages are ratio-of-totals
 * over checkpoints — never mean-of-arrival-gaps, WS delivery is bursty.
 */
export async function GET(req: NextRequest) {
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      let ws: WebSocket | null = null;
      const timers: ReturnType<typeof setTimeout>[] = [];

      const send = (data: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(
            ENCODER.encode(`data: ${JSON.stringify(data)}\n\n`),
          );
        } catch {
          cleanup();
        }
      };
      const cleanup = () => {
        if (closed) return;
        closed = true;
        timers.forEach(clearTimeout);
        try {
          ws?.close();
        } catch {
          // already closed
        }
        try {
          controller.close();
        } catch {
          // already closed
        }
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

      // ── measurement state ──
      let lastSlot = 0;
      let lastAt = 0;
      // checkpoints of (t, slot) for ratio-of-totals averages
      const checks: [number, number][] = [];
      let seedAvg: number | null = null;
      let tps: number | null = null;

      const avgOver = (windowMs: number): number | null => {
        const now = Date.now();
        let oldest: [number, number] | null = null;
        for (const c of checks) {
          if (now - c[0] <= windowMs + 5000) {
            oldest = c;
            break;
          }
        }
        if (!oldest || !lastSlot) return null;
        const dSlots = lastSlot - oldest[1];
        const dMs = now - oldest[0];
        // demand a real window before trusting the ratio
        if (dSlots < 20 || dMs < windowMs * 0.5) return null;
        return dMs / dSlots;
      };

      const snap = async (first: boolean) => {
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
          if (secs > 0 && nonVote > 0) tps = Math.round(nonVote / secs);
          if (first) {
            const slots = samples.reduce((a, s) => a + s.numSlots, 0);
            const sampleSecs = samples.reduce(
              (a, s) => a + s.samplePeriodSecs,
              0,
            );
            seedAvg =
              slots > 0 && sampleSecs > 0
                ? (sampleSecs / slots) * 1000
                : DEFAULT_SLOT_MS;
          }
          send({
            type: "snap",
            slot: Math.max(info.absoluteSlot, lastSlot),
            epoch: info.epoch,
            epochEndSlot:
              info.absoluteSlot - info.slotIndex + info.slotsInEpoch,
            avg1m: avgOver(60_000) ?? seedAvg,
            avg10m: avgOver(600_000) ?? seedAvg,
            tps,
          });
        } catch {
          // keep streaming slots; the client holds its last snapshot
        }
      };
      // ── upstream slot subscription ──
      try {
        ws = new WebSocket(rpcWsUrl());
      } catch {
        send({ type: "err" });
        cleanup();
        return;
      }
      const wsGuard = setTimeout(() => {
        if (!lastSlot) {
          send({ type: "err" });
          cleanup();
        }
      }, 8_000);
      timers.push(wsGuard);

      ws.onopen = () =>
        ws?.send(
          JSON.stringify({ jsonrpc: "2.0", id: 1, method: "slotSubscribe" }),
        );
      ws.onmessage = (ev) => {
        let msg: SlotNotification;
        try {
          msg = JSON.parse(String(ev.data));
        } catch {
          return;
        }
        const slot = msg.params?.result?.slot;
        if (!slot || slot <= lastSlot) return;
        const now = Date.now();
        const dt = lastAt && slot === lastSlot + 1 ? now - lastAt : null;
        lastSlot = slot;
        lastAt = now;
        checks.push([now, slot]);
        // 10 min of 400 ms checkpoints ≈ 1500 entries
        if (checks.length > 1600) checks.splice(0, checks.length - 1600);
        const a1 = avgOver(60_000);
        send({
          s: slot,
          dt,
          ...(a1 ? { avg1m: Math.round(a1 * 10) / 10 } : {}),
        });
      };
      ws.onerror = () => {
        if (!lastSlot) {
          send({ type: "err" });
          cleanup();
        }
      };
      ws.onclose = () => cleanup();

      // Open the real-time path before waiting for the slower HTTP snapshot.
      // The first slot can reach the browser while the averages are loading.
      const snapTimer = setInterval(() => void snap(false), 60_000);
      timers.push(snapTimer as unknown as ReturnType<typeof setTimeout>);
      await snap(true);
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
