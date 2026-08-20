"use client";

import React from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import { nextStep, pctFaster, rolloutState } from "./stages";
import { HeartbeatAudio } from "./heartbeatAudio";
import type { FeedState, SlotEvent } from "./useSlotFeed";

interface HeroProps {
  feed: FeedState;
  subscribe: (_fn: (_ev: SlotEvent) => void) => () => void;
}

const SLOTS_PER_EPOCH = 432_000;

function fmtEta(ms: number): string {
  const totalMin = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
}

/**
 * The hero: title and explainer on the left (the beating dot is the
 * heartbeat, one pulse per mainnet block, and the audio source), the live
 * counter on the right. Every state is derived from measured averages and
 * the confirmed activation schedule, so the page rides the whole rollout —
 * countdown, live flip, landed, waiting for the next epoch — without edits.
 */
export const Hero: React.FC<HeroProps> = ({ feed, subscribe }) => {
  const t = useTranslations("slot200.hero");
  const locale = useLocale();
  const nf = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const [soundOn, setSoundOn] = React.useState(false);
  const audioRef = React.useRef<HeartbeatAudio | null>(null);
  const dotRef = React.useRef<HTMLSpanElement>(null);
  const bigRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const unsub = subscribe(() => {
      audioRef.current?.tick();
      const dot = dotRef.current;
      const big = bigRef.current;
      dot?.classList.add("on");
      big?.classList.add("on");
      setTimeout(() => {
        dot?.classList.remove("on");
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

  const rollout = rolloutState(feed.avg1m, feed.avg10m);
  const { from, to, phase, stepIndex, stepsDone, targetEpoch } = rollout;
  const avgShown = feed.avg1m ? Math.round(feed.avg1m) : null;

  // countdown only against a confirmed epoch, drained by real slots
  const slotsLeft =
    targetEpoch !== null &&
    feed.epoch !== null &&
    feed.epochEndSlot &&
    feed.slot &&
    targetEpoch > feed.epoch
      ? Math.max(
          0,
          feed.epochEndSlot +
            (targetEpoch - feed.epoch - 1) * SLOTS_PER_EPOCH -
            feed.slot,
        )
      : null;
  const finalMinute = slotsLeft !== null && slotsLeft > 0 && slotsLeft <= 150;
  const eta =
    slotsLeft !== null ? fmtEta(slotsLeft * (feed.avg1m ?? from)) : null;

  const ready = feed.slot > 0 && feed.avg1m !== null;
  const counting = !ready || (phase === "pre" && slotsLeft !== null);
  const rich = {
    old: (chunks: React.ReactNode) => (
      <span className="s2-ml-old">{chunks}</span>
    ),
    arw: (chunks: React.ReactNode) => (
      <span className="s2-ml-arw" aria-hidden>
        {chunks}
      </span>
    ),
  };

  let under: string;
  let lock: React.ReactNode;
  if (!ready) {
    under = t("under", { from });
    lock = " ";
  } else if (counting) {
    under = finalMinute ? t("underFinal", { from }) : t("under", { from });
    lock = t.rich(stepIndex === 1 ? "lockFirst" : "lockNext", {
      ...rich,
      from,
      to: to ?? from,
      step: stepIndex,
      epoch: String(targetEpoch),
      eta: eta ?? "—",
    });
  } else if (phase === "flipping") {
    under = t("underMeasured");
    lock = t("sentenceFlipping", { to: to ?? from });
  } else if (phase === "flipped") {
    under = t("underMeasured");
    const after = to !== null ? nextStep(to) : null;
    lock =
      after !== null
        ? t("sentenceFlipped", {
            pct: pctFaster(from, to ?? from),
            next: after,
          })
        : t("sentenceFlippedLast", { pct: pctFaster(from, to ?? from) });
  } else if (to === null) {
    under = t("underMeasured");
    lock = t("sentenceDone");
  } else {
    under = t("underHolding", { done: stepsDone });
    lock = t("lockUnscheduled", { to });
  }

  return (
    <section className="s2-hero" aria-labelledby="s2-hero-title">
      <div className="s2-hero-copy">
        <p className="s2-eyebrow">
          <span ref={dotRef} className="s2-beat" aria-hidden />
          {t("kicker")}
        </p>
        <h1 className="s2-hero-title" id="s2-hero-title">
          {t("title")}
        </h1>
        <p className="s2-minilock">{lock}</p>
        <button type="button" className="s2-soundbtn" onClick={toggleSound}>
          {soundOn ? t("soundOn") : t("soundOff")}
        </button>
      </div>

      <div className="s2-hero-live">
        <p className={`s2-under ${finalMinute ? "is-final" : ""}`}>{under}</p>
        {counting ? (
          <div className="s2-big" ref={bigRef}>
            <span className="s2-big-num">
              {slotsLeft !== null ? nf.format(slotsLeft) : "—"}
            </span>
          </div>
        ) : (
          <div className="s2-big" ref={bigRef}>
            <span className="s2-big-old">{from}</span>
            <span className="s2-big-arrow" aria-hidden>
              →
            </span>
            <span
              className={`s2-big-num ${phase === "flipping" ? "" : "is-flipped"}`}
            >
              {avgShown ?? "—"}
            </span>
            <span className="s2-big-unit">ms</span>
          </div>
        )}
      </div>
    </section>
  );
};
