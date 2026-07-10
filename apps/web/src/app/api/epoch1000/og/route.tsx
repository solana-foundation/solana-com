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

let solanaLogoPromise: Promise<string>;

function getSolanaLogo() {
  solanaLogoPromise ??= readFile(
    path.join(
      process.cwd(),
      "public",
      "src",
      "img",
      "branding",
      "solanaLogo.png",
    ),
  ).then((data) => `data:image/png;base64,${data.toString("base64")}`);

  return solanaLogoPromise;
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
  const survivedLabel = capped ? `${survived}+` : String(survived);
  const firstSeenLabel = blockTime
    ? `Epoch ${firstEpoch} · ${fmtDate(blockTime)}`
    : `Epoch ${firstEpoch}`;
  const percentOfFirst1000 = Math.min(
    100,
    Math.max(0, Math.round((survived / 1000) * 100)),
  );

  const [[diatype700, dsemi400, dsemi600], solanaLogo] = await Promise.all([
    getFontData(),
    getSolanaLogo(),
  ]);

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
        padding: "46px 64px",
        fontFamily: "DSemi",
        color: "#FFFFFF",
        boxSizing: "border-box",
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
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <img src={solanaLogo} width={175} height={26} alt="" />
        </div>
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 34,
        }}
      >
        <div
          style={{
            fontSize: 25,
            letterSpacing: "0.18em",
            color: "#BDBDBD",
            textTransform: "uppercase",
          }}
        >
          Epoch 1000 survivor card
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
          <div
            style={{
              fontFamily: "Diatype",
              fontWeight: 700,
              fontSize: 154,
              lineHeight: 0.92,
              color: tier.color,
            }}
          >
            {/* satori crashes on numeric JSX children - keep this a string */}
            {survivedLabel}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: 18,
              gap: 6,
            }}
          >
            <span
              style={{
                display: "flex",
                fontFamily: "Diatype",
                fontWeight: 700,
                fontSize: 44,
                color: "#FFFFFF",
              }}
            >
              EPOCHS SURVIVED
            </span>
            <span
              style={{
                display: "flex",
                fontSize: 24,
                color: "#8B8B8B",
                letterSpacing: "0.14em",
              }}
            >
              OF THE FIRST 1000
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#B0B0B0",
            gap: 10,
            marginTop: 12,
          }}
        >
          <span style={{ color: "#757575" }}>First seen</span>
          <span style={{ fontWeight: 600 }}>{firstSeenLabel}</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 10,
            fontSize: 27,
            fontWeight: 600,
            color: tier.color,
          }}
        >
          {`"${tier.line}"`}
        </div>
      </div>

      {/* thousand grid - github-contributions strip of square cells */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: 1046,
          marginTop: 34,
          fontSize: 21,
        }}
      >
        <span
          style={{
            color: "#8B8B8B",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          First 1000 epochs
        </span>
        <span
          style={{
            color: GH_LEVELS[3],
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {`${percentOfFirst1000}%`}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          gap: 4,
          width: 1046,
          marginTop: 14,
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
          {wallet || "Anonymous survivor"}
        </div>
        <div style={{ display: "flex", gap: 10, color: "#757575" }}>
          <span style={{ color: "#FFFFFF", fontWeight: 600 }}>Check yours</span>
          <span>·</span>
          <span>solana.com/epoch1000</span>
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
