import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { defaultLocale, locales } from "@workspace/i18n/config";
import { loadAppMessages } from "@workspace/i18n/messages";
import { createTranslator } from "next-intl";
import {
  loadCardAdds,
  loadIsMutual,
  loadPersonalGraph,
} from "@/lib/here-for/data";
import { normalizeHandle } from "@/lib/here-for/handles";
import { hereForStatus, mePayload } from "@/lib/here-for/payload";
import type { HereForHandle } from "@/lib/here-for/types";

export const runtime = "nodejs";

const WIDTH = 1200;
const HEIGHT = 630;
const CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=3600";

const COLOR = {
  black: "#000000",
  white: "#ffffff",
  purple: "#aa67fb",
  green: "#14f195",
  yellow: "#c0e021",
  stroke: "#353535",
  secondary: "#a2a2a2",
  muted: "#696969",
};

const asset = (file: string) =>
  readFile(path.join(process.cwd(), "public", file));

let assetsPromise: ReturnType<typeof loadAssets> | null = null;
async function loadAssets() {
  const [
    favorit,
    favoritBold,
    mono,
    monoBold,
    purpleBand,
    greenBand,
    edge,
    logo,
  ] = await Promise.all([
    asset("fonts/abc-favorit/ABCFavorit-Regular.woff"),
    asset("fonts/abc-favorit/ABCFavorit-Bold.woff"),
    asset("fonts/abc-favorit-mono/ABCFavoritMono-Regular.woff"),
    asset("fonts/abc-favorit-mono/ABCFavoritMono-Bold.woff"),
    asset("img/here-for/card-band-purple.jpg"),
    asset("img/here-for/card-band-green.jpg"),
    asset("assets/pixel-edge.svg"),
    asset("assets/nav-bp26.svg"),
  ]);
  const dataUri = (buffer: Buffer, type: string) =>
    `data:${type};base64,${buffer.toString("base64")}`;
  return {
    fonts: [
      {
        name: "Favorit",
        data: favorit,
        weight: 400 as const,
        style: "normal" as const,
      },
      {
        name: "Favorit",
        data: favoritBold,
        weight: 700 as const,
        style: "normal" as const,
      },
      {
        name: "FavoritMono",
        data: mono,
        weight: 400 as const,
        style: "normal" as const,
      },
      {
        name: "FavoritMono",
        data: monoBold,
        weight: 700 as const,
        style: "normal" as const,
      },
    ],
    purpleBand: dataUri(purpleBand, "image/jpeg"),
    greenBand: dataUri(greenBand, "image/jpeg"),
    edge: dataUri(
      Buffer.from(
        edge.toString("utf8").replace("var(--fill-0, black)", "black"),
      ),
      "image/svg+xml",
    ),
    logo: dataUri(logo, "image/svg+xml"),
  };
}

type Card =
  | {
      type: "your3";
      handle: HereForHandle;
      adds: { handle: HereForHandle; mutual: boolean }[];
    }
  | { type: "mutual"; handle: HereForHandle; other: HereForHandle }
  | {
      type: "mutuals";
      handle: HereForHandle;
      mutuals: HereForHandle[];
      next: HereForHandle[];
    };

const DEMO: Record<Card["type"], Card> = {
  your3: {
    type: "your3",
    handle: "@your_handle",
    adds: [
      { handle: "@pixel_ana", mutual: true },
      { handle: "@rpc_rob", mutual: false },
      { handle: "@mint_mira", mutual: false },
    ],
  },
  mutual: { type: "mutual", handle: "@your_handle", other: "@pixel_ana" },
  mutuals: {
    type: "mutuals",
    handle: "@your_handle",
    mutuals: ["@pixel_ana"],
    next: ["@validator_kat", "@ledger_lu", "@sol_sam"],
  },
};

async function resolveCard(params: URLSearchParams): Promise<Card | null> {
  const type = params.get("type");
  if (type !== "your3" && type !== "mutual" && type !== "mutuals") return null;
  if (params.get("demo") === "1") return DEMO[type];

  const handle = normalizeHandle(params.get("handle"));
  if (!handle) return null;
  if (type === "mutual") {
    const other = normalizeHandle(params.get("with"));
    // Only render a mutual the graph backs, so crafted links can't claim one.
    return other && other !== handle && (await loadIsMutual(handle, other))
      ? { type, handle, other }
      : null;
  }

  if (type === "your3") {
    const adds = await loadCardAdds(handle);
    return adds?.length ? { type, handle, adds } : null;
  }
  const me = mePayload(
    await loadPersonalGraph(handle),
    handle,
    hereForStatus(),
  );
  if (!me.handle) return null;
  return {
    type,
    handle,
    mutuals: me.mutuals.slice(0, 3),
    next: me.suggestions.slice(0, 3).map((s) => s.handle),
  };
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const requestedLocale = params.get("locale") ?? defaultLocale;
  const locale = (locales as readonly string[]).includes(requestedLocale)
    ? requestedLocale
    : defaultLocale;

  let card: Card | null;
  try {
    card = await resolveCard(params);
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "here_for_card_failure",
        errorName: error instanceof Error ? error.name : typeof error,
      }),
    );
    return new Response("Card unavailable", { status: 503 });
  }
  if (!card) return new Response("Not found", { status: 404 });

  assetsPromise ??= loadAssets();
  const assets = await assetsPromise;
  const translator = createTranslator({
    locale,
    messages: await loadAppMessages("breakpoint", locale),
    namespace: "breakpoint.hereFor.card",
  });
  const t: T = (key, values) => translator(key as never, values as never);

  return new ImageResponse(
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: COLOR.black,
        color: COLOR.white,
        fontFamily: "Favorit",
      }}
    >
      <img
        src={card.type === "mutual" ? assets.greenBand : assets.purpleBand}
        width={WIDTH}
        height={150}
        style={{ position: "absolute", left: 0, top: 0, objectFit: "cover" }}
      />
      <img
        src={assets.edge}
        width={WIDTH}
        height={80}
        style={{ position: "absolute", left: 0, top: 70 }}
      />
      <div
        style={{
          position: "absolute",
          right: 48,
          top: 28,
          display: "flex",
          padding: "10px 14px",
          background: COLOR.black,
        }}
      >
        <img src={assets.logo} height={28} width={146} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          top: 168,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {card.type === "your3" && <Your3 card={card} t={t} />}
        {card.type === "mutual" && <Mutual card={card} t={t} />}
        {card.type === "mutuals" && <Mutuals card={card} t={t} />}
      </div>

      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          bottom: 28,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "FavoritMono",
          fontSize: 18,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: COLOR.secondary,
        }}
      >
        <span>{t("footer")}</span>
        <span style={{ color: COLOR.white }}>{t("question")}</span>
      </div>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: assets.fonts,
      headers: { "Cache-Control": CACHE_CONTROL },
    },
  );
}

type T = (key: string, values?: Record<string, string>) => string;

const eyebrow = (color: string) => ({
  fontFamily: "FavoritMono",
  fontSize: 22,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color,
});

function Your3({ card, t }: { card: Extract<Card, { type: "your3" }>; t: T }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ ...eyebrow(COLOR.white), marginBottom: 18 }}>
        {t("isHereFor", { handle: card.handle })}
      </span>
      {card.adds.map((add, i) => (
        <div
          key={add.handle}
          style={{
            display: "flex",
            alignItems: "center",
            height: 96,
            borderTop: `1px solid ${COLOR.stroke}`,
            borderBottom:
              i === card.adds.length - 1 ? `1px solid ${COLOR.stroke}` : "none",
          }}
        >
          <span style={{ ...eyebrow(COLOR.purple), width: 68 }}>0{i + 1}</span>
          <span style={{ flex: 1, fontSize: 64, letterSpacing: "-0.05em" }}>
            {add.handle}
          </span>
          {add.mutual && (
            <span
              style={{
                fontFamily: "FavoritMono",
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: COLOR.green,
                color: COLOR.black,
                padding: "6px 10px",
              }}
            >
              {t("mutual")}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function Mutual({
  card,
  t,
}: {
  card: Extract<Card, { type: "mutual" }>;
  t: T;
}) {
  const avatar = (handle: string, background: string) => (
    <div
      style={{
        width: 120,
        height: 120,
        borderRadius: 60,
        background,
        color: COLOR.black,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "FavoritMono",
        fontWeight: 700,
        fontSize: 44,
        textTransform: "uppercase",
      }}
    >
      {handle.charAt(1)}
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={eyebrow(COLOR.green)}>{t("mutualEyebrow")}</span>
      <div style={{ display: "flex", alignItems: "center", marginTop: 28 }}>
        {avatar(card.handle, COLOR.yellow)}
        <div
          style={{
            flex: 1,
            height: 4,
            background: COLOR.green,
            display: "flex",
          }}
        />
        <svg
          width="88"
          height="44"
          viewBox="0 0 88 44"
          fill="none"
          stroke={COLOR.green}
          strokeWidth="4"
          style={{ margin: "0 20px" }}
        >
          <path d="M8 14h72M66 2l14 12M8 30h72M22 42L8 30" />
        </svg>
        <div
          style={{
            flex: 1,
            height: 4,
            background: COLOR.green,
            display: "flex",
          }}
        />
        {avatar(card.other, COLOR.green)}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 28,
          fontSize: 60,
          letterSpacing: "-0.05em",
        }}
      >
        <span>{card.handle}</span>
        <span>{card.other}</span>
      </div>
    </div>
  );
}

function Mutuals({
  card,
  t,
}: {
  card: Extract<Card, { type: "mutuals" }>;
  t: T;
}) {
  const column = (label: string, color: string, handles: string[]) => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <span
        style={{
          ...eyebrow(color),
          fontSize: 18,
          fontWeight: 700,
          paddingBottom: 12,
        }}
      >
        {label}
      </span>
      {(handles.length ? handles : ["—"]).map((handle, i, all) => (
        <div
          key={handle}
          style={{
            display: "flex",
            alignItems: "center",
            height: 76,
            fontSize: 48,
            letterSpacing: "-0.05em",
            borderTop: `1px solid ${COLOR.stroke}`,
            borderBottom:
              i === all.length - 1 ? `1px solid ${COLOR.stroke}` : "none",
          }}
        >
          {handle}
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ ...eyebrow(COLOR.white), marginBottom: 26 }}>
        {t("mutualsEyebrow", { handle: card.handle })}
      </span>
      <div style={{ display: "flex", gap: 40 }}>
        {column(t("mutualsLabel"), COLOR.green, card.mutuals)}
        {column(t("nextLabel"), COLOR.purple, card.next)}
      </div>
    </div>
  );
}
