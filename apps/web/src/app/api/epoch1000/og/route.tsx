import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { tierFor } from "@/lib/epoch1000/tiers";
import {
  GH_CELL_BORDER,
  GH_EMPTY,
  GH_LEVELS,
  githubGreen,
} from "@/lib/epoch1000/github-colors";

export const dynamic = "force-dynamic";

const CACHE_CONTROL =
  "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400";
const CELLS = 50; // 1 cell = 20 epochs of the first 1000
const EPOCHS_PER_CELL = 1000 / CELLS;

const SOLANA_MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397.7 311.7"><defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="360.879" y1="351.455" x2="141.213" y2="-69.294" gradientTransform="matrix(1 0 0 -1 0 314)"><stop offset="0" stop-color="#00FFA3"/><stop offset="1" stop-color="#DC1FFF"/></linearGradient></defs><path fill="url(#g)" d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"/><path fill="url(#g)" d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"/><path fill="url(#g)" d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"/></svg>`;
const SOLANA_MARK_URI = `data:image/svg+xml,${encodeURIComponent(SOLANA_MARK_SVG)}`;

function fmtDate(ts: number | null): string {
  if (!ts) return "";
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

async function font(file: string) {
  return readFile(
    path.join(process.cwd(), "assets", "fonts", "epoch1000", file),
  );
}

let fontDataPromise: Promise<
  [Buffer<ArrayBufferLike>, Buffer<ArrayBufferLike>, Buffer<ArrayBufferLike>]
>;

function getFontData() {
  fontDataPromise ??= Promise.all([
    font("ABCDiatype-Bold.woff"),
    font("ABCDiatypeSemi-Mono-Regular.woff"),
    font("ABCDiatypeSemi-Mono-Medium.woff"),
  ]);

  return fontDataPromise;
}

export async function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  const survived = Math.max(0, parseInt(p.get("s") ?? "0", 10) || 0);
  const firstEpoch = Math.max(0, parseInt(p.get("fe") ?? "0", 10) || 0);
  const currentEpoch = Math.max(
    firstEpoch,
    parseInt(p.get("c") ?? "0", 10) || 0,
  );
  const blockTime = parseInt(p.get("t") ?? "0", 10) || null;
  const wallet = p.get("w") ?? "";
  const capped = p.get("x") === "1";
  const tier = tierFor(survived);

  const [diatype700, dsemi400, dsemi600] = await getFontData();

  const firstCell = Math.min(
    CELLS - 1,
    Math.floor(firstEpoch / EPOCHS_PER_CELL),
  );
  const currentCell = Math.min(
    CELLS - 1,
    Math.floor(currentEpoch / EPOCHS_PER_CELL),
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#000000",
        backgroundImage: `radial-gradient(ellipse 900px 500px at 85% -10%, ${tier.glow}55, transparent 70%)`,
        padding: "56px 64px",
        fontFamily: "DSemi",
        color: "#FFFFFF",
      }}
    >
      {/* header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img src={SOLANA_MARK_URI} width={46} height={36} alt="" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: `2px solid ${tier.color}`,
            color: tier.color,
            borderRadius: 999,
            padding: "10px 26px",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "0.14em",
          }}
        >
          {tier.name}
        </div>
      </div>

      {/* main stat */}
      <div style={{ display: "flex", flexDirection: "column", marginTop: 44 }}>
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.3em",
            color: "#757575",
          }}
        >
          SURVIVED
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <div
            style={{
              fontFamily: "Diatype",
              fontWeight: 700,
              fontSize: 176,
              lineHeight: 1.05,
              color: tier.color,
            }}
          >
            {/* satori crashes on numeric JSX children — keep this a string */}
            {capped ? `${survived}+` : String(survived)}
          </div>
          <div
            style={{
              fontFamily: "Diatype",
              fontWeight: 700,
              fontSize: 44,
              color: "#FFFFFF",
            }}
          >
            EPOCHS
          </div>
        </div>
        <div
          style={{ display: "flex", fontSize: 26, color: "#B0B0B0", gap: 10 }}
        >
          <span style={{ color: "#757575" }}>first seen</span>
          <span style={{ fontWeight: 600 }}>{`epoch ${firstEpoch}`}</span>
          {blockTime ? (
            <span
              style={{ color: "#757575" }}
            >{`· ${fmtDate(blockTime)}`}</span>
          ) : null}
        </div>
      </div>

      {/* thousand grid — github-contributions strip of square cells */}
      <div
        style={{
          display: "flex",
          gap: 4,
          width: 1046,
          marginTop: 52,
        }}
      >
        {Array.from({ length: CELLS }, (_, i) => {
          const inSpan = i >= firstCell && i <= currentCell;
          return (
            <div
              key={i}
              style={{
                width: 17,
                height: 17,
                borderRadius: 3,
                backgroundColor: inSpan ? githubGreen(i) : GH_EMPTY,
                border: `1px solid ${inSpan ? "transparent" : GH_CELL_BORDER}`,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: 1046,
          fontSize: 20,
          color: "#757575",
          marginTop: 12,
        }}
      >
        <span>EPOCH 0</span>
        <span style={{ color: GH_LEVELS[3], fontWeight: 600 }}>
          {`${(survived / 10).toFixed(0)}% OF SOLANA'S FIRST 1000 EPOCHS`}
        </span>
        <span>EPOCH 1000</span>
      </div>

      {/* footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
          fontSize: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            color: wallet ? "#FFFFFF" : "#757575",
            fontWeight: 600,
          }}
        >
          {wallet || "ANONYMOUS SURVIVOR"}
        </div>
        <div style={{ display: "flex", color: "#757575" }}>
          solana.com/epoch1000
        </div>
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
        { name: "DSemi", data: dsemi400, weight: 400, style: "normal" },
        { name: "DSemi", data: dsemi600, weight: 600, style: "normal" },
      ],
    },
  );
}
