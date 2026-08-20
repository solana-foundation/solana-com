"use client";

import React from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import { Panel } from "./Panel";
import { usePolled } from "./usePolled";
import type { ClientStats } from "@/app/api/slot-time/clients/route";
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
 * Rolling gap time by the producing validator's client. Primary source: the
 * perp200 relay's rolling window, where identities map to real clients
 * (Firedancer, Jito, BAM, Harmonic, Rakurai…) via the on-chain validator
 * history program. Fallback when that proxy fails: this page's own
 * session-scoped attribution by gossip version family.
 */
export const ClientClock = React.memo(function ClientClock({
  attribution,
}: {
  attribution: Attribution;
}) {
  const t = useTranslations("slot200.clients");
  const locale = useLocale();
  const nf = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const remote = usePolled<ClientStats>("/api/slot-time/clients", 30_000);

  let rows: Row[];
  let meta: string;
  let note: string;
  if (remote?.rows?.length) {
    const solid = remote.rows
      .filter((r) => r.slots >= SOLID_MIN_SLOTS)
      .sort((a, b) => a.median - b.median || a.avg - b.avg);
    const small = remote.rows
      .filter((r) => r.slots < SOLID_MIN_SLOTS)
      .sort((a, b) => b.slots - a.slots);
    rows = [...solid, ...small].map((r) => ({
      key: `ct${r.ct}`,
      client: r.client,
      slots: r.slots,
      avg: r.avg,
      median: r.median,
      dim: r.slots < SOLID_MIN_SLOTS,
    }));
    const span =
      remote.toSlot && remote.fromSlot ? remote.toSlot - remote.fromSlot : 0;
    meta = t("metaWindow", {
      count: nf.format(remote.attributed),
      hours: Math.max(1, Math.round((span * 0.4) / 3600)),
    });
    note = t("noteLive");
  } else {
    rows = attribution.clients
      .map((c) => ({
        key: c.client,
        client: c.client,
        slots: c.slots,
        avg: c.avg,
        median: c.median,
        dim: false,
      }))
      .sort((a, b) => a.median - b.median || a.avg - b.avg);
    meta =
      attribution.attributed > 0
        ? t("meta", { count: nf.format(attribution.attributed) })
        : t("metaSyncing");
    note = t("note");
  }

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
