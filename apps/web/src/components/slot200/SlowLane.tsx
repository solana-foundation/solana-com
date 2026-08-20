"use client";

import React from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import { Panel } from "./Panel";
import type { Attribution } from "./useAttribution";

const MAX_ROWS = 8;

/**
 * The slow lane: per-validator time added beyond the session median —
 * slow blocks weighted by how many blocks the validator actually makes.
 */
export const SlowLane: React.FC<{ attribution: Attribution }> = ({
  attribution,
}) => {
  const t = useTranslations("slot200.slowlane");
  const locale = useLocale();
  const nf = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const { validators, netMedian } = attribution;
  const rows = validators.slice(0, MAX_ROWS);
  const maxExcess = Math.max(1, rows[0]?.excessMs ?? 1);

  return (
    <Panel
      title={t("title")}
      meta={
        netMedian !== null && validators.length > 0
          ? t("meta", {
              count: nf.format(validators.length),
              median: Math.round(netMedian),
            })
          : t("metaSyncing")
      }
    >
      {rows.length === 0 ? (
        <p className="s2-empty">{t("empty")}</p>
      ) : (
        <table className="s2-table">
          <thead>
            <tr>
              <th>{t("colValidator")}</th>
              <th>{t("colSlots")}</th>
              <th>{t("colAvg")}</th>
              <th>{t("colExcess")}</th>
              <th aria-hidden />
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v.id}>
                <td className="s2-val-name">
                  {v.name || v.id}
                  {v.city ? <small> {v.city}</small> : null}
                </td>
                <td className="s2-num">{nf.format(v.slots)}</td>
                <td className="s2-num">{Math.round(v.avg)} ms</td>
                <td className="s2-num is-hot">
                  +{(Math.max(0, v.excessMs) / 1000).toFixed(1)}s
                </td>
                <td className="s2-barcell">
                  <div className="s2-bar">
                    <div
                      className="s2-bar-fill is-hot"
                      style={{
                        width: `${Math.min(100, Math.round((Math.max(0, v.excessMs) / maxExcess) * 100))}%`,
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="s2-note">{t("note")}</p>
    </Panel>
  );
};
