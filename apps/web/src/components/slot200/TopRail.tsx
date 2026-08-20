"use client";

import React from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import type { FeedState } from "./useSlotFeed";

/** The thin status rail: connection state, current slot, UTC clock. */
export const TopRail: React.FC<{ feed: FeedState }> = ({ feed }) => {
  const t = useTranslations("slot200.rail");
  const locale = useLocale();
  const nf = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const [utc, setUtc] = React.useState("");

  React.useEffect(() => {
    const fmt = () => setUtc(new Date().toISOString().slice(11, 19));
    fmt();
    const timer = setInterval(fmt, 1000);
    return () => clearInterval(timer);
  }, []);

  const since = feed.sinceAt
    ? new Date(feed.sinceAt).toISOString().slice(11, 19)
    : null;

  return (
    <div className="s2-rail">
      <div className="s2-rail-in">
        <span className="s2-rail-status">
          <span
            aria-hidden
            className={`s2-dot ${
              feed.status === "live"
                ? "s2-dot-live"
                : feed.status === "degraded"
                  ? "s2-dot-warn"
                  : "s2-dot-idle"
            }`}
          />
          {feed.status === "live"
            ? t("live")
            : feed.status === "degraded"
              ? t("degraded")
              : t("connecting")}
        </span>
        <span className="s2-rail-mid">
          {feed.slot ? (
            <>
              {t("slot")} <b>{nf.format(feed.slot)}</b>
            </>
          ) : null}
        </span>
        <span className="s2-rail-right">
          {since && (
            <span className="s2-rail-since">{t("since", { time: since })}</span>
          )}
          <span suppressHydrationWarning>{utc} UTC</span>
        </span>
      </div>
    </div>
  );
};
