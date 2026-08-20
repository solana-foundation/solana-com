"use client";

import React from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import { flipPhase } from "./stages";
import { HeartbeatAudio } from "./heartbeatAudio";
import type { FeedState, SlotEvent } from "./useSlotFeed";

interface HeroProps {
  feed: FeedState;
  subscribe: (_fn: (_ev: SlotEvent) => void) => () => void;
}

function fmtEta(ms: number): string {
  const totalMin = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
}

/**
 * The countdown hero: slots left on the 400 ms clock falling live, the
 * epoch-1020 lock line, measured per-block proof, and the audible heartbeat.
 * After the flip is MEASURED (never on the calendar alone), it becomes the
 * "measured right now" hero.
 */
export const Hero: React.FC<HeroProps> = ({ feed, subscribe }) => {
  const t = useTranslations("slot200.hero");
  const locale = useLocale();
  const nf = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const [soundOn, setSoundOn] = React.useState(false);
  const audioRef = React.useRef<HeartbeatAudio | null>(null);
  const beatRef = React.useRef<HTMLSpanElement>(null);
  const bigRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const unsub = subscribe(() => {
      audioRef.current?.tick();
      const beat = beatRef.current;
      const big = bigRef.current;
      beat?.classList.add("on");
      big?.classList.add("on");
      setTimeout(() => {
        beat?.classList.remove("on");
        big?.classList.remove("on");
      }, 120);
    });
    return () => {
      unsub();
      audioRef.current?.dispose();
      audioRef.current = null;
    };
  }, [subscribe]);

  const toggleSound = () => {
    audioRef.current ??= new HeartbeatAudio();
    setSoundOn(audioRef.current.toggle());
  };

  const phase = flipPhase(feed.avg1m, feed.avg10m);
  const slotsLeft =
    feed.epochEndSlot && feed.slot
      ? Math.max(0, feed.epochEndSlot - feed.slot)
      : null;
  const finalMinute = slotsLeft !== null && slotsLeft > 0 && slotsLeft <= 150;
  const eta =
    slotsLeft !== null ? fmtEta(slotsLeft * (feed.avg1m ?? 400)) : null;
  const avgShown = feed.avg1m ? Math.round(feed.avg1m) : null;
  const pctFaster = feed.avg1m
    ? ((400 / feed.avg1m - 1) * 100).toFixed(1)
    : "0";

  return (
    <section className="s2-hero" aria-labelledby="s2-hero-big">
      <p className="s2-kicker">
        {phase === "flipped" ? t("kickerPost") : t("kicker")}
      </p>

      {phase === "flipped" ? (
        <div className="s2-big" id="s2-hero-big" ref={bigRef}>
          <span className="s2-big-old">400</span>
          <span className="s2-big-arrow" aria-hidden>
            →
          </span>
          <span className="s2-big-num is-flipped">{avgShown ?? "—"}</span>
          <span className="s2-big-unit">ms</span>
        </div>
      ) : (
        <div className="s2-big" id="s2-hero-big" ref={bigRef}>
          <span className="s2-big-num">
            {slotsLeft !== null ? nf.format(slotsLeft) : "—"}
          </span>
        </div>
      )}

      <p className={`s2-under ${finalMinute ? "is-final" : ""}`}>
        {phase === "flipped"
          ? t("underPost")
          : finalMinute
            ? t("underFinal")
            : t("under")}
      </p>

      {phase !== "flipped" && feed.epoch !== null && (
        <p className="s2-minilock">
          {t.rich("minilock", {
            eta: eta ?? "—",
            epoch: String(feed.epoch + 1),
            old: (chunks) => <span className="s2-ml-old">{chunks}</span>,
            arw: (chunks) => (
              <span className="s2-ml-arw" aria-hidden>
                {chunks}
              </span>
            ),
          })}
        </p>
      )}

      <p className="s2-liveproof">
        <span ref={beatRef} className="s2-beat" aria-hidden />
        <span>
          {t.rich("liveproof", {
            ms: feed.lastDt !== null ? String(feed.lastDt) : "—",
            avg: avgShown !== null ? String(avgShown) : "—",
            slot: feed.slot ? nf.format(feed.slot) : "—",
            b: (chunks) => <b>{chunks}</b>,
          })}
        </span>
      </p>

      <p className="s2-story">
        {phase === "flipped"
          ? t.rich("storyFlipped", {
              pct: pctFaster,
              b: (chunks) => <b>{chunks}</b>,
            })
          : phase === "flipping"
            ? t.rich("storyFlipping", {
                ms: String(avgShown ?? "—"),
                b: (chunks) => <b>{chunks}</b>,
              })
            : t.rich("story", { b: (chunks) => <b>{chunks}</b> })}
      </p>

      <button type="button" className="s2-soundbtn" onClick={toggleSound}>
        {soundOn ? t("soundOn") : t("soundOff")}
      </button>
    </section>
  );
};
