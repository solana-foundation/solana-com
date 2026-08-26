import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

const CACHE_CONTROL =
  "public, max-age=0, s-maxage=60, stale-while-revalidate=300";

let backgroundPromise: Promise<string>;

function getBackground() {
  backgroundPromise ??= readFile(
    path.join(process.cwd(), "public", "social", "solana-200ms.jpg"),
  ).then((data) => `data:image/jpeg;base64,${data.toString("base64")}`);
  return backgroundPromise;
}

export async function GET() {
  const background = await getBackground();

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
    </div>,
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": CACHE_CONTROL,
      },
    },
  );
}
