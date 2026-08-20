import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { unstable_cache } from "next/cache";
import { getEpochInfo, getPerformanceSamples } from "@/lib/slot200/rpc";
import { pctFaster, rolloutState } from "@/components/slot200/stages";

export const dynamic = "force-dynamic";

const CACHE_CONTROL =
  "public, max-age=0, s-maxage=60, stale-while-revalidate=300";
const STATUS_CACHE_REVALIDATE_SECONDS = 20;
const STATUS_CACHE_KEY = "slot200-og-status-v1";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const SLOTS_PER_EPOCH = 432_000;

const nf = new Intl.NumberFormat("en-US");

/**
 * The one-line snapshot burned into the share card, mirroring the hero's
 * measured-only states: countdown, live flip, landed, holding. Crawlers
 * refetch the card, so whoever shares the page stamps the moment they did.
 */
async function loadStatusLine(): Promise<string> {
  const [info, samples] = await Promise.all([
    getEpochInfo(),
    getPerformanceSamples(10),
  ]);

  const first = samples[0];
  const avg1m =
    first && first.numSlots > 0
      ? (first.samplePeriodSecs / first.numSlots) * 1000
      : null;
  const totalSlots = samples.reduce((a, s) => a + s.numSlots, 0);
  const totalSecs = samples.reduce((a, s) => a + s.samplePeriodSecs, 0);
  const avg10m = totalSlots > 0 ? (totalSecs / totalSlots) * 1000 : null;

  const { from, to, phase, targetEpoch } = rolloutState(avg1m, avg10m);

  const slotsLeft =
    targetEpoch !== null && targetEpoch > info.epoch
      ? Math.max(
          0,
          info.slotsInEpoch -
            info.slotIndex +
            (targetEpoch - info.epoch - 1) * SLOTS_PER_EPOCH,
        )
      : null;

  if (phase === "flipping") {
    return `The flip to ${to} ms is happening right now`;
  }
  if (phase === "flipped") {
    return `The flip landed: Solana runs ${pctFaster(from, to ?? from)}% faster`;
  }
  if (slotsLeft !== null) {
    return `${nf.format(slotsLeft)} slots left on the ${from} ms clock`;
  }
  if (to === null) {
    return `Genesis shipped 400 ms. Solana runs 200.`;
  }
  if (avg1m !== null) {
    return `A block every ${Math.round(avg1m)} ms, measured live`;
  }
  return "Live slot-time telemetry from mainnet";
}

const getStatusLine = IS_PRODUCTION
  ? unstable_cache(loadStatusLine, [STATUS_CACHE_KEY], {
      revalidate: STATUS_CACHE_REVALIDATE_SECONDS,
    })
  : loadStatusLine;

let fontPromise: Promise<Buffer<ArrayBufferLike>>;

function getFont() {
  fontPromise ??= readFile(
    path.join(process.cwd(), "src", "fonts", "diatype", "ABCDiatype-Bold.woff"),
  );
  return fontPromise;
}

let backgroundPromise: Promise<string>;

function getBackground() {
  backgroundPromise ??= readFile(
    path.join(process.cwd(), "public", "social", "solana-200ms.jpg"),
  ).then((data) => `data:image/jpeg;base64,${data.toString("base64")}`);
  return backgroundPromise;
}

// Dev-only previews of the non-countdown states, so layout fits can be
// checked without waiting for the network to reach them.
const DEV_PREVIEW_LINES: Record<string, string> = {
  flipping: "The flip to 350 ms is happening right now",
  flipped: "The flip landed: Solana runs 14.3% faster",
  live: "A block every 391 ms, measured live",
  done: "Genesis shipped 400 ms. Solana runs 200.",
  fallback: "Live slot-time telemetry from mainnet",
};

export async function GET(req: Request) {
  const preview = IS_PRODUCTION
    ? null
    : (DEV_PREVIEW_LINES[new URL(req.url).searchParams.get("state") ?? ""] ??
      null);

  const [diatype700, background, line] = await Promise.all([
    getFont(),
    getBackground(),
    preview ??
      getStatusLine().catch(
        () => "Live slot-time telemetry from mainnet" as const,
      ),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
      }}
    >
      <img
        src={background}
        width={1200}
        height={630}
        alt=""
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: 90,
          bottom: 36,
          fontFamily: "Diatype",
          fontWeight: 700,
          fontSize: line.length > 40 ? 56 : 64,
          color: "#19F898",
        }}
      >
        {line}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": CACHE_CONTROL,
      },
      fonts: [
        { name: "Diatype", data: diatype700, weight: 700, style: "normal" },
      ],
    },
  );
}
