"use client";

import React from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import type { NetworkTotals } from "./useLeaderSchedule";
import type { FeedState } from "./useSlotFeed";

interface TileProps {
  value: React.ReactNode;
  label: string;
  tone?: "hot" | "good" | "plain";
  big?: boolean;
}

const Tile: React.FC<TileProps> = ({ value, label, tone = "plain", big }) => (
  <div className={`s2-tile ${big ? "s2-tile-big" : ""}`}>
    <div className={`s2-tile-v is-${tone}`}>{value}</div>
    <div className="s2-tile-k">{label}</div>
  </div>
);

/**
 * The JHU-style number wall: measured pace and network vitals, every value
 * live from the feed or the shared schedule fetch.
 */
export const BigBoard = React.memo(function BigBoard({
  feed,
  network,
}: {
  feed: FeedState;
  network: NetworkTotals | null;
}) {
  const t = useTranslations("slot200.board");
  const locale = useLocale();
  const nf = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);

  const epochPct =
    feed.epochEndSlot && feed.slot
      ? Math.min(
          100,
          Math.max(0, 100 - ((feed.epochEndSlot - feed.slot) / 432_000) * 100),
        )
      : null;

  return (
    <div className="s2-board">
      <Tile
        big
        tone="hot"
        value={feed.avg1m ? `${Math.round(feed.avg1m)} ms` : "—"}
        label={t("avg1m")}
      />
      <div className="s2-board-grid">
        <Tile
          value={feed.avg10m ? `${Math.round(feed.avg10m)} ms` : "—"}
          label={t("avg10m")}
        />
        <Tile
          value={feed.lastDt !== null ? `${feed.lastDt} ms` : "—"}
          label={t("thisBlock")}
        />
        <Tile
          value={feed.tps !== null ? nf.format(feed.tps) : "—"}
          label={t("tps")}
        />
        <Tile
          tone="good"
          value={feed.gained > 0 ? `+${nf.format(feed.gained)}` : "0"}
          label={t("gained")}
        />
        <Tile
          value={network ? nf.format(network.validators) : "—"}
          label={t("validators")}
        />
        <Tile
          value={
            network ? t("stakeValue", { m: nf.format(network.stakeM) }) : "—"
          }
          label={t("stake")}
        />
      </div>
      <div className="s2-tile">
        <div className="s2-tile-v is-good">
          {network ? `${network.upgraded.stakePct}%` : "—"}
        </div>
        <div className="s2-tile-k">{t("upgraded")}</div>
        <div className="s2-meter" aria-hidden>
          <div
            className="s2-meter-fill is-good"
            style={{ width: `${network?.upgraded.stakePct ?? 0}%` }}
          />
        </div>
      </div>
      <div className="s2-tile">
        <div className="s2-tile-v">
          {epochPct !== null ? `${epochPct.toFixed(1)}%` : "—"}
        </div>
        <div className="s2-tile-k">
          {feed.epoch !== null
            ? t("epochProgress", { epoch: String(feed.epoch) })
            : t("epochProgressSyncing")}
        </div>
        <div className="s2-meter" aria-hidden>
          <div
            className="s2-meter-fill is-hot"
            style={{ width: `${epochPct ?? 0}%` }}
          />
        </div>
      </div>
    </div>
  );
});
