"use client";

import React from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import { Panel } from "./Panel";
import type { Attribution } from "./useAttribution";

/** Below this, a client's gap stats are a curiosity, not a ranking entry. */
const SOLID_MIN_SLOTS = 40;

interface Row {
  key: string;
  client: string;
  slots: number;
  /** tie-break only — the visible ranking metric is the median */
  avg: number;
  median: number;
  /** small sample — shown, but dimmed and excluded from the ranking */
  dim: boolean;
}

/**
 * Gap time by the producing validator's client, measured entirely by this
 * page: every gap comes off our own RPC slot stream, credited via the leader
 * schedule. Identities come from the on-chain validator history program
 * (decoded by our own RPC sweep — Jito, BAM, Harmonic, Rakurai…), with
 * gossip-version families as the fallback. Session-scoped — counting starts
 * when the viewer tunes in, and the labels say so.
 */
export const ClientClock = React.memo(function ClientClock({
  attribution,
}: {
  attribution: Attribution;
}) {
  const t = useTranslations("slot200.clients");
  const locale = useLocale();
  const nf = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);

  const solid = attribution.clients
    .filter((c) => c.slots >= SOLID_MIN_SLOTS)
    .sort((a, b) => a.median - b.median || a.avg - b.avg);
  const small = attribution.clients
    .filter((c) => c.slots < SOLID_MIN_SLOTS)
    .sort((a, b) => b.slots - a.slots);
  const rows: Row[] = [...solid, ...small].map((c) => ({
    key: c.client,
    client: c.client,
    slots: c.slots,
    avg: c.avg,
    median: c.median,
    dim: c.slots < SOLID_MIN_SLOTS,
  }));
  const meta =
    attribution.attributed > 0
      ? t("meta", { count: nf.format(attribution.attributed) })
      : t("metaSyncing");
  const note = t("note");

  // Bars scale to the ranked rows only: one long gap in an 8-slot sample
  // must not own the visual range. A ranking of one is not a ranking.
  const ranked = rows.filter((r) => !r.dim);
  const maxMedian = Math.max(1, ...ranked.map((r) => r.median));
  const bestMedian = ranked.length >= 2 ? ranked[0].median : -1;

  return (
    <Panel title={t("title")} meta={meta}>
      {rows.length === 0 ? (
        <p className="s2-empty">{t("empty")}</p>
      ) : (
        <table className="s2-table">
          <thead>
            <tr>
              <th>{t("colClient")}</th>
              <th>{t("colSlots")}</th>
              <th>{t("colMedian")}</th>
              <th aria-hidden />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.key}
                className={
                  r.dim
                    ? "is-dim"
                    : r.median === bestMedian
                      ? "is-fast"
                      : undefined
                }
              >
                <td>
                  {r.client}
                  {r.dim ? <small> {t("smallSample")}</small> : null}
                </td>
                <td className="s2-num">{nf.format(r.slots)}</td>
                <td className="s2-num">{Math.round(r.median)} ms</td>
                <td className="s2-barcell">
                  <div className="s2-bar">
                    <div
                      className="s2-bar-fill"
                      style={{
                        width: `${Math.min(100, Math.round((r.median / maxMedian) * 100))}%`,
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="s2-note">{note}</p>
    </Panel>
  );
});
