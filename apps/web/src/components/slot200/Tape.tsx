"use client";

import React from "react";
import { useTranslations } from "@workspace/i18n/client";
import { Panel } from "./Panel";
import { usePolled, type BlockSample } from "./usePolled";
import type { FeedState, SlotEvent } from "./useSlotFeed";

const MAX_BLOCK_ROWS = 40;
const MAX_TX_ROWS = 48;

interface TapeProps {
  feed: FeedState;
  subscribe: (_fn: (_ev: SlotEvent) => void) => () => void;
}

/**
 * The tape: blocks landing live on the left (one row per slot from the
 * stream), and on the right the transactions inside the latest sampled
 * block. Both lists keep constant height with scroll anchoring off — rows
 * are inserted at the top, exactly like the perp200 tape.
 */
export const Tape: React.FC<TapeProps> = ({ feed, subscribe }) => {
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
      </div>
      <p className="s2-note">{t("note")}</p>
    </Panel>
  );
};
