import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { loadMergedMessages, resolveLocale } from "@workspace/i18n/messages";
import { tierFor } from "@/lib/epoch1000/tiers";
import {
  GH_CELL_BORDER,
  GH_EMPTY,
  githubGreen,
} from "@/lib/epoch1000/github-colors";

export const dynamic = "force-dynamic";

const CACHE_CONTROL =
  "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400";
const CELLS = 50; // 1 cell = 20 epochs of the first 1000
const EPOCHS_PER_CELL = 1000 / CELLS;
type MessageTree = Record<string, unknown>;
type MessageValues = Record<string, number | string>;

const messageCache = new Map<string, Promise<MessageTree>>();

function messagesFor(localeParam: string | null) {
  const locale = resolveLocale(localeParam);
  let messages = messageCache.get(locale);

  if (!messages) {
    messages = loadMergedMessages({
      app: "web",
      locale,
    }) as Promise<MessageTree>;
    messageCache.set(locale, messages);
  }

  return messages;
}

async function getCardMessage(
  localeParam: string | null,
  variant: "wallet" | "validator" = "wallet",
) {
  const messages = await messagesFor(localeParam);
  const rootKey =
    variant === "validator" ? "epoch1000.validator.card" : "epoch1000.card";

  return (key: string, values: MessageValues = {}) => {
    const template = `${rootKey}.${key}`
      .split(".")
      .reduce<unknown>(
        (acc, part) =>
          acc && typeof acc === "object" && part in acc
            ? (acc as MessageTree)[part]
            : undefined,
        messages,
      );

    if (typeof template !== "string") {
      return `${rootKey}.${key}`;
    }

    return template.replace(/\{(\w+)\}/g, (match, name) =>
      name in values ? String(values[name]) : match,
    );
  };
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

const remoteImageCache = new Map<string, Promise<string | null>>();

function getRemoteImageDataUrl(url: string): Promise<string | null> {
  let cached = remoteImageCache.get(url);
  if (!cached) {
    cached = fetch(url)
      .then(async (res) => {
        if (!res.ok) return null;
        const buffer = Buffer.from(await res.arrayBuffer());
        const contentType = res.headers.get("content-type") ?? "image/jpeg";
        return `data:${contentType};base64,${buffer.toString("base64")}`;
      })
      .catch(() => null);
    remoteImageCache.set(url, cached);
  }
  return cached;
}

export async function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  const survived = Math.max(0, parseInt(p.get("s") ?? "0", 10) || 0);
  const firstEpoch = Math.max(0, parseInt(p.get("fe") ?? "0", 10) || 0);
  const currentEpoch = Math.max(
    firstEpoch,
    parseInt(p.get("c") ?? "0", 10) || 0,
  );
  const wallet = p.get("w") ?? "";
  const capped = p.get("x") === "1";
  const variant = p.get("k") === "validator" ? "validator" : "wallet";
  const validatorLogoUrl = p.get("vl");
  const tier = tierFor(survived);
  const survivedLabel = capped ? `${survived}+` : String(survived);

  const [t, [diatype700, dsemi400, dsemi600], solanaLogo, validatorLogo] =
    await Promise.all([
      getCardMessage(p.get("l"), variant),
      getFontData(),
      getSolanaLogo(),
      variant === "validator" && validatorLogoUrl
        ? getRemoteImageDataUrl(validatorLogoUrl)
        : Promise.resolve(null),
    ]);
  const tierName = t(`tiers.${tier.id}.name`);

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
            color: "#8B8B8B",
            fontSize: 24,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          {t("og.epoch1000")}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 54,
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              letterSpacing: "0.18em",
              color: "#8B8B8B",
              textTransform: "uppercase",
            }}
          >
            {t(variant === "validator" ? "og.validatingAge" : "og.walletAge")}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 30,
              marginTop: 8,
            }}
          >
            <div
              style={{
                fontFamily: "Diatype",
                fontWeight: 700,
                fontSize: 202,
                lineHeight: 0.88,
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
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  display: "flex",
                  fontFamily: "Diatype",
                  fontWeight: 700,
                  fontSize: 54,
                  color: "#FFFFFF",
                }}
              >
                {t("og.epochsOld")}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginTop: 18,
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            <div
              style={{
                display: "flex",
                border: "2px solid #2A2F36",
                color: "#BDBDBD",
                borderRadius: 999,
                padding: "10px 22px",
              }}
            >
              {t("og.sinceEpoch", { epoch: firstEpoch })}
            </div>
            <div
              style={{
                display: "flex",
                border: `2px solid ${tier.color}`,
                color: tier.color,
                borderRadius: 999,
                padding: "10px 22px",
              }}
            >
              {tierName}
            </div>
          </div>
        </div>

        {validatorLogo ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 32,
              marginRight: 8,
            }}
          >
            <img
              src={validatorLogo}
              width={208}
              height={208}
              alt=""
              style={{
                borderRadius: 999,
                border: `3px solid ${tier.color}88`,
              }}
            />
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          width: 1046,
          gap: 4,
          marginTop: 48,
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
        <span>{t("og.startEpoch")}</span>
        <span>{t("og.endEpoch")}</span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
          fontSize: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#757575",
            fontWeight: 600,
          }}
        >
          {t("og.proof", {
            wallet:
              wallet ||
              t(
                variant === "validator"
                  ? "og.anonymousVoteAccount"
                  : "og.anonymousWallet",
              ),
          })}
        </div>
        <div style={{ display: "flex", color: "#757575" }}>
          {t("og.footerUrl")}
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
