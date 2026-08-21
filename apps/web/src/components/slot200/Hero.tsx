"use client";

import React from "react";
import { useLocale, useTranslations } from "@workspace/i18n/client";
import { STEPS, nextStep, pctFaster, rolloutState } from "./stages";
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
 * The hero: title and explainer on the left, the live counter on the right
 * (pulsing once per mainnet block, doubling as the audio source). Every
 * state is derived from measured averages and
 * the confirmed activation schedule, so the page rides the whole rollout —
 * countdown, live flip, landed, waiting for the next epoch — without edits.
 */
export const Hero = React.memo(function Hero({ feed, subscribe }: HeroProps) {
  const t = useTranslations("slot200.hero");
  const locale = useLocale();
  const nf = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const [soundOn, setSoundOn] = React.useState(false);
  const audioRef = React.useRef<HeartbeatAudio | null>(null);
  const bigRef = React.useRef<HTMLDivElement>(null);
  const pulseTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const unsub = subscribe(() => {
      audioRef.current?.tick();
      const big = bigRef.current;
      big?.classList.add("on");
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
      pulseTimer.current = setTimeout(() => {
        big?.classList.remove("on");
        pulseTimer.current = null;
      }, 120);
    });
    return () => {
      unsub();
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
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
  // The struck-out number is always a clock the network left behind: mid-flip
  // that's `from`; once the average settles and `from` re-bases to the new
  // step, it's the previous step (never the clock we just arrived on).
  const cameFrom =
    phase === "flipping" || phase === "flipped"
      ? from
      : stepsDone > 0
        ? STEPS[stepsDone - 1]
        : null;

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

  // The share text is a live snapshot: whoever posts it stamps the exact
  // moment they watched — a countdown number or a measured speed, never hype.
  let shareText: string;
  if (ready && counting && slotsLeft !== null) {
    shareText = t("shareCounting", {
      n: nf.format(slotsLeft),
      from,
      to: to ?? from,
    });
  } else if (phase === "flipping") {
    shareText = t("shareFlipping", { from, to: to ?? from });
  } else if (phase === "flipped") {
    shareText = t("shareFlipped", {
      pct: pctFaster(from, to ?? from),
      from,
      to: to ?? from,
    });
  } else if (avgShown !== null) {
    shareText = t("shareLive", { avg: avgShown });
  } else {
    shareText = t("shareDefault");
  }
  const shareHref = `https://x.com/intent/post?text=${encodeURIComponent(
    shareText,
  )}&url=${encodeURIComponent("https://solana.com/200ms")}`;

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
    lock =
      stepsDone > 0
        ? t("lockHolding", { from, pct: pctFaster(STEPS[0], from), to })
        : t("lockUnscheduled", { to });
  }

  return (
    <section className="s2-hero" aria-labelledby="s2-hero-title">
      <div className="s2-hero-copy">
        <h1 className="s2-hero-title" id="s2-hero-title">
          {t("title")}
        </h1>
        <p className="s2-minilock">{lock}</p>
        <div className="s2-hero-actions">
          <button type="button" className="s2-soundbtn" onClick={toggleSound}>
            {soundOn ? t("soundOn") : t("soundOff")}
          </button>
          <a
            className="s2-sharebtn"
            href={shareHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("share")}
          </a>
        </div>
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
            {cameFrom !== null && (
              <>
                <span className="s2-big-old">{cameFrom}</span>
                <span className="s2-big-arrow" aria-hidden>
                  →
                </span>
              </>
            )}
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
});
