"use client";

import React from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import { Panel } from "./Panel";
import type { BlockSample } from "./usePolled";

const MAX_ROWS = 9;

/** What one recent block actually carried, classified by known program. */
export const Blockspace = React.memo(function Blockspace({
  block,
}: {
  block: BlockSample | null;
}) {
  const t = useTranslations("slot200.blockspace");
  const locale = useLocale();
  const nf = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const nfSol = React.useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 4 }),
    [locale],
  );
  const [agoText, setAgoText] = React.useState("");
  const seenAt = React.useRef(0);
  const lastSlot = React.useRef(0);

  React.useEffect(() => {
    if (block && block.slot !== lastSlot.current) {
      lastSlot.current = block.slot;
      seenAt.current = Date.now();
    }
  }, [block]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (!seenAt.current) return;
      const ago = Math.max(0, Math.round((Date.now() - seenAt.current) / 1000));
      setAgoText(ago <= 4 ? t("live") : t("ago", { s: ago }));
    }, 1000);
    return () => clearInterval(timer);
  }, [t]);

  const rows = block?.programs.slice(0, MAX_ROWS) ?? [];
  const tail = block ? block.programs.slice(MAX_ROWS) : [];
  const tailCount = tail.reduce((a, p) => a + p.count, 0);
  const max = Math.max(1, rows[0]?.count ?? 1);

  return (
    <Panel
      title={t("title")}
      meta={
        block
          ? `${t("meta", {
              slot: nf.format(block.slot),
              txs: nf.format(block.nonVotes),
              votes: nf.format(block.votes),
            })} · ${agoText}`
          : t("metaSyncing")
      }
    >
      {!block ? (
        <p className="s2-empty">{t("empty")}</p>
      ) : (
        <>
          <div className="s2-bstats">
            {typeof block.feeLamports === "number"
              ? t("stats", {
                  fees: nfSol.format(block.feeLamports / 1e9),
                  tips: nfSol.format((block.tipLamports ?? 0) / 1e9),
                  cu: block.cuPct ?? 0,
                })
              : "—"}
          </div>
          <div className="s2-progs">
            {rows.map((p) => (
              <div key={p.name} className="s2-prow">
                <span className="s2-pname">{p.name}</span>
                <div className="s2-bar">
                  <div
                    className="s2-bar-fill"
                    style={{ width: `${Math.round((p.count / max) * 100)}%` }}
                  />
                </div>
                <span className="s2-pval">{nf.format(p.count)}</span>
              </div>
            ))}
            {tailCount > 0 && (
              <div className="s2-prow is-tail">
                <span className="s2-pname">
                  {t("tail", { n: tail.length })}
                </span>
                <div className="s2-bar">
                  <div
                    className="s2-bar-fill"
                    style={{
                      width: `${Math.min(100, Math.round((tailCount / max) * 100))}%`,
                    }}
                  />
                </div>
                <span className="s2-pval">{nf.format(tailCount)}</span>
              </div>
            )}
          </div>
        </>
      )}
      <p className="s2-note">{t("note")}</p>
    </Panel>
  );
});
