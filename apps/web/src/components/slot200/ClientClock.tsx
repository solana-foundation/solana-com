"use client";

import React from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import { Panel } from "./Panel";
import type { Attribution } from "./useAttribution";

/** Rolling gap time by the leader's client family, since the viewer tuned in. */
export const ClientClock: React.FC<{ attribution: Attribution }> = ({
  attribution,
}) => {
  const t = useTranslations("slot200.clients");
  const locale = useLocale();
  const nf = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const { clients, attributed } = attribution;
  const maxAvg = Math.max(1, ...clients.map((c) => c.avg));
  const bestAvg = clients.length >= 2 ? clients[0].avg : -1;

  return (
    <Panel
      title={t("title")}
      meta={
        attributed > 0
          ? t("meta", { count: nf.format(attributed) })
          : t("metaSyncing")
      }
    >
      {clients.length === 0 ? (
        <p className="s2-empty">{t("empty")}</p>
      ) : (
        <table className="s2-table">
          <thead>
            <tr>
              <th>{t("colClient")}</th>
              <th>{t("colSlots")}</th>
              <th>{t("colAvg")}</th>
              <th>{t("colMedian")}</th>
              <th aria-hidden />
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr
                key={c.client}
                className={c.avg === bestAvg ? "is-fast" : undefined}
              >
                <td>{c.client}</td>
                <td className="s2-num">{nf.format(c.slots)}</td>
                <td className="s2-num">{Math.round(c.avg)} ms</td>
                <td className="s2-num">{Math.round(c.median)} ms</td>
                <td className="s2-barcell">
                  <div className="s2-bar">
                    <div
                      className="s2-bar-fill"
                      style={{
                        width: `${Math.min(100, Math.round((c.avg / maxAvg) * 100))}%`,
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
