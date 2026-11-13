"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "@workspace/i18n/client";
import { CLIENTS, CLIENT_INDEX, lightCss, type ClientId } from "./config";
import { PlateStage } from "./PlateStage";
import {
  useDemoSource,
  useLiveSource,
  type NetworkSource,
} from "./useNetworkSource";

const IDLE_SOURCE: NetworkSource = {
  status: "connecting",
  finalityMs: null,
  slotMs: 200,
  subscribe: () => () => {},
};

const ALL_ON: Record<ClientId, number> = {
  agave: 1,
  firedancer: 1,
  mithril: 1,
  sig: 1,
};

const CAPTION_MS = 1100;

type DriverProps = { onChange: (_source: NetworkSource) => void };

function useReport(source: NetworkSource, onChange: DriverProps["onChange"]) {
  const { status, finalityMs, slotMs, subscribe } = source;
  useEffect(
    () => onChange({ status, finalityMs, slotMs, subscribe }),
    [onChange, status, finalityMs, slotMs, subscribe],
  );
}

function LiveDriver({ onChange }: DriverProps) {
  useReport(useLiveSource(), onChange);
  return null;
}

function DemoDriver({ onChange }: DriverProps) {
  useReport(useDemoSource(), onChange);
  return null;
}

/**
 * The /solana-1-0 page shell: sticky plate stage, the poster footer with the
 * client toggles, then the server-rendered content passed as children.
 * `?demo=1` swaps the mainnet feed for a simulation (QA and screenshots).
 */
export default function Solana10Experience({
  children,
}: {
  children: ReactNode;
}) {
  const t = useTranslations("solana10.hero");
  const [demo, setDemo] = useState<boolean | null>(null);
  const [source, setSource] = useState<NetworkSource>(IDLE_SOURCE);
  const [gains, setGains] = useState(ALL_ON);
  const [caption, setCaption] = useState(false);
  const captionShown = useRef(false);

  useEffect(() => {
    setDemo(new URLSearchParams(window.location.search).get("demo") === "1");
  }, []);

  useEffect(() => {
    if (!caption) return;
    const timer = setTimeout(() => setCaption(false), CAPTION_MS);
    return () => clearTimeout(timer);
  }, [caption]);

  const toggle = (id: ClientId) => {
    const cutting = gains[id] > 0;
    setGains((prev) => ({ ...prev, [id]: prev[id] > 0 ? 0 : 1 }));
    if (cutting && !captionShown.current) {
      captionShown.current = true;
      setCaption(true);
    } else if (!cutting) {
      setCaption(false);
    }
  };

  return (
    <div className="relative isolate bg-[#040408] font-brand text-[#ece7df] [--s10-dim:#8a857f] [--s10-faint:#3f3b3a] [--s10-rule:#2a2727]">
      {demo === null ? null : demo ? (
        <DemoDriver onChange={setSource} />
      ) : (
        <LiveDriver onChange={setSource} />
      )}
      <PlateStage source={source} gains={gains} />

      <section
        aria-labelledby="s10-title"
        className="relative z-10 -mt-[calc(100svh-var(--s10-top,0px))] flex h-[calc(100svh-var(--s10-top,0px))] flex-col justify-end"
      >
        <h1 id="s10-title" className="sr-only">
          {t("title")}
        </h1>
        <p
          aria-hidden={!caption}
          className={`pointer-events-none mb-5 text-center font-brand-mono text-[0.75rem] font-light uppercase tracking-[0.3em] text-[#ece7df] transition-opacity duration-300 motion-reduce:transition-none ${caption ? "opacity-100" : "opacity-0"}`}
        >
          {t("cutCaption")}
        </p>

        <div className="grid gap-x-10 gap-y-4 border-t border-[var(--s10-rule)] bg-[#040408]/70 px-5 py-4 backdrop-blur-sm md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)] md:items-start md:px-8 md:py-6 xl:px-10">
          <div>
            <p className="m-0 text-[0.9375rem] font-bold uppercase leading-tight tracking-[0.14em] md:text-[1.0625rem]">
              {t("retired")}
            </p>
            <p className="m-0 mt-1.5 font-brand-mono text-[0.75rem] font-light leading-snug tracking-[0.06em] text-[var(--s10-dim)]">
              {t("networkVersion")}
            </p>
          </div>

          <ul className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-3 p-0">
            {CLIENTS.map((client) => {
              const on = gains[client.id] > 0;
              const state = !client.live
                ? t("state.staged")
                : on
                  ? t("state.live")
                  : t("state.cut");
              const label = (
                <>
                  <span
                    className={`mt-[0.3rem] block h-2.5 w-2.5 shrink-0 rounded-full border transition-[background-color,box-shadow] duration-300 ${client.live ? "border-solid" : "border-dashed"}`}
                    style={{
                      borderColor: lightCss(client),
                      backgroundColor:
                        client.live && on ? lightCss(client) : "transparent",
                      boxShadow:
                        client.live && on
                          ? `0 0 12px ${lightCss(client)}`
                          : "none",
                      opacity: client.live ? 1 : 0.7,
                    }}
                  />
                  <span className="min-w-0">
                    <span
                      className={`block text-[0.9375rem] font-medium leading-tight tracking-[0.02em] ${client.live && on ? "text-[#ece7df]" : "text-[var(--s10-dim)]"}`}
                    >
                      {client.name}
                    </span>
                    <span className="mt-1 block font-brand-mono text-[0.6875rem] font-light leading-snug tracking-[0.04em] text-[var(--s10-dim)]">
                      {client.language} · {client.team} · {state}
                    </span>
                  </span>
                </>
              );
              return (
                <li key={client.id} className="m-0">
                  {client.live ? (
                    <button
                      type="button"
                      aria-pressed={on}
                      aria-label={t("toggleLabel", { client: client.name })}
                      onClick={() => toggle(client.id)}
                      className="-m-1.5 flex w-[calc(100%+0.75rem)] cursor-pointer items-start gap-2.5 rounded-sm border-0 !bg-transparent p-1.5 text-left font-brand text-[0.9375rem] font-normal normal-case tracking-normal hover:!bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ece7df]"
                    >
                      {label}
                    </button>
                  ) : (
                    <div className="flex items-start gap-2.5">{label}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="font-brand-mono text-[0.75rem] font-light leading-snug tracking-[0.04em] text-[var(--s10-dim)] md:pr-28">
            <LatestBuilder
              source={source}
              gains={gains}
              label={t("blocksBy")}
            />
            <p className="m-0 mt-1.5 hidden md:block">{t("instruction")}</p>
            <p className="m-0 mt-1 text-[var(--s10-dim)]">
              {t(`feed.${source.status}`)}
            </p>
          </div>
        </div>
      </section>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

/** "Blocks by <client>": the family that built the most recent block. */
function LatestBuilder({
  source,
  gains,
  label,
}: {
  source: NetworkSource;
  gains: Record<ClientId, number>;
  label: string;
}) {
  const [family, setFamily] = useState<ClientId | null>(null);
  const [client, setClient] = useState<string | null>(null);
  const { subscribe } = source;
  const gainsRef = useRef(gains);
  gainsRef.current = gains;
  const dark = CLIENTS.every((c) => !c.live || gains[c.id] <= 0);

  useEffect(() => {
    let last = 0;
    return subscribe((ev) => {
      // a cut client's blocks are not on the stage, so not in the readout
      if (ev.family && gainsRef.current[ev.family] <= 0) return;
      // leaders hold several slots; a slower readout is easier to read
      const now = Date.now();
      if (now - last < 400) return;
      last = now;
      setFamily(ev.family);
      setClient(ev.client);
    });
  }, [subscribe]);

  const shown = !dark && family && gains[family] > 0 ? family : null;
  const config = shown ? CLIENTS[CLIENT_INDEX[shown]] : null;
  return (
    <p
      className="m-0 font-brand text-[0.9375rem] font-medium leading-tight tracking-[0.02em] text-[#ece7df]"
      title={client ?? undefined}
    >
      {label}{" "}
      <span style={{ color: config ? lightCss(config) : "#8a857f" }}>
        {config?.name ?? "—"}
      </span>
      {client && config && client !== config.name ? (
        <span className="font-brand-mono text-[0.6875rem] font-light text-[var(--s10-dim)]">
          {" "}
          · {client}
        </span>
      ) : null}
    </p>
  );
}
