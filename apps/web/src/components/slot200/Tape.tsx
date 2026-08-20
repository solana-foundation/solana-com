"use client";

import React from "react";
import { useTranslations } from "@workspace/i18n/client";
import { Panel } from "./Panel";
import { usePolled, type BlockSample } from "./usePolled";
import type { LeaderEntry } from "./useLeaderSchedule";
import type { FeedState, SlotEvent } from "./useSlotFeed";

const MAX_BLOCK_ROWS = 40;
const MAX_TX_ROWS = 48;
const MAX_UPCOMING = 10;

interface TapeProps {
  feed: FeedState;
  subscribe: (_fn: (_ev: SlotEvent) => void) => () => void;
  lookup: (_slot: number) => LeaderEntry | null;
}

/**
 * The tape: blocks landing live on the left (one row per slot from the
 * stream), the transactions inside the latest sampled block in the middle,
 * and on the right the confirmed leader schedule — who makes the blocks
 * after this one. The live lists keep constant height with scroll anchoring
 * off — rows are inserted at the top, exactly like the perp200 tape.
 */
export const Tape: React.FC<TapeProps> = ({ feed, subscribe, lookup }) => {
  const t = useTranslations("slot200.tape");
  const blocksRef = React.useRef<HTMLDivElement>(null);
  const txRef = React.useRef<HTMLDivElement>(null);
  const block = usePolled<BlockSample>("/api/slot-time/block", 5_000);
  const lastTapeSlot = React.useRef(0);
  const nf = React.useMemo(() => new Intl.NumberFormat("en-US"), []);

  React.useEffect(
    () =>
      subscribe((ev) => {
        const list = blocksRef.current;
        if (!list || document.hidden) return;
        const row = document.createElement("div");
        row.className = "s2-trow";
        const num = document.createElement("span");
        num.textContent = `#${nf.format(ev.slot)}`;
        const ms = document.createElement("span");
        ms.className = "s2-trow-ms";
        ms.textContent = ev.dt !== null ? `${Math.round(ev.dt)} ms` : "—";
        row.append(num, ms);
        list.insertBefore(row, list.firstChild);
        while (list.children.length > MAX_BLOCK_ROWS)
          list.removeChild(list.lastChild!);
      }),
    [subscribe, nf],
  );

  React.useEffect(() => {
    if (!block || block.slot === lastTapeSlot.current) return;
    lastTapeSlot.current = block.slot;
    const list = txRef.current;
    if (!list) return;
    const frag = document.createDocumentFragment();
    for (const tx of block.tape) {
      const row = document.createElement("div");
      row.className = "s2-trow is-tx";
      const sig = document.createElement("span");
      sig.className = "s2-trow-sig";
      sig.textContent = tx.sig;
      const p = document.createElement("span");
      p.textContent = tx.p;
      row.append(sig, p);
      frag.appendChild(row);
    }
    list.insertBefore(frag, list.firstChild);
    while (list.children.length > MAX_TX_ROWS)
      list.removeChild(list.lastChild!);
  }, [block]);

  // the leaders about to produce: consecutive 4-slot runs collapsed to one
  // row each, straight from the shared schedule fetch (O(1) lookups)
  const upcoming: { slot: number; entry: LeaderEntry }[] = [];
  if (feed.slot > 0) {
    let prevId: string | null = null;
    for (
      let s = feed.slot + 1;
      s <= feed.slot + 400 && upcoming.length < MAX_UPCOMING;
      s++
    ) {
      const entry = lookup(s);
      if (!entry) break;
      if (entry.id === prevId) continue;
      upcoming.push({ slot: s, entry });
      prevId = entry.id;
    }
  }

  return (
    <Panel
      title={t("title")}
      live
      meta={
        feed.avg1m
          ? t("meta", { ms: Math.round(feed.avg1m) })
          : t("metaSyncing")
      }
    >
      <div className="s2-tape">
        <div className="s2-tape-col">
          <div className="s2-tape-h">{t("blocks")}</div>
          <div ref={blocksRef} className="s2-tape-list" />
        </div>
        <div className="s2-tape-col">
          <div className="s2-tape-h">{t("txs")}</div>
          <div ref={txRef} className="s2-tape-list" />
        </div>
        <div className="s2-tape-col">
          <div className="s2-tape-h">{t("upNext")}</div>
          <div className="s2-tape-list">
            {upcoming.map(({ slot, entry }) => (
              <div key={slot} className="s2-trow">
                <span className="s2-val-name">
                  {entry.name || entry.id}
                  {entry.city ? <small> {entry.city}</small> : null}
                </span>
                <span className="s2-trow-ms">+{slot - feed.slot}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="s2-tape-foot">
        <p className="s2-note">{t("note")}</p>
      </div>
    </Panel>
  );
};
