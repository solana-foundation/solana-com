"use client";

import React from "react";
import { useTranslations } from "@workspace/i18n/client";
import { Panel } from "./Panel";
import type { BlockSample } from "./usePolled";
import type { LeaderEntry } from "./useLeaderSchedule";
import type { FeedState, SlotEvent } from "./useSlotFeed";

const MAX_GROUPS = 10;
const MAX_GROUP_ROWS = 12;
const MAX_TX_ROWS = 48;
const MAX_UPCOMING = 10;

interface TapeProps {
  feed: FeedState;
  block: BlockSample | null;
  subscribe: (_fn: (_ev: SlotEvent) => void) => () => void;
  lookup: (_slot: number) => LeaderEntry | null;
}

/**
 * The tape: blocks landing live on the left, grouped into leader windows
 * (one card per validator's consecutive turn, like the Jito monitor), the
 * confirmed leader schedule in the middle, and the transactions inside the
 * latest sampled block on the right. The live lists keep constant height with
 * scroll anchoring off —
 * rows are inserted at the top, exactly like the perp200 tape.
 */
export const Tape = React.memo(function Tape({
  feed,
  block,
  subscribe,
  lookup,
}: TapeProps) {
  const t = useTranslations("slot200.tape");
  const blocksRef = React.useRef<HTMLDivElement>(null);
  const txRef = React.useRef<HTMLDivElement>(null);
  const lastTapeSlot = React.useRef(0);
  const nf = React.useMemo(() => new Intl.NumberFormat("en-US"), []);
  const groupRef = React.useRef<{ id: string; el: HTMLDivElement } | null>(
    null,
  );
  const lastStatusRef = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(
    () =>
      subscribe((ev) => {
        const list = blocksRef.current;
        if (!list || document.hidden) return;
        const leader = lookup(ev.slot);
        const gid = leader?.id ?? "?";
        let group = groupRef.current;
        if (!group || group.id !== gid || group.el.parentNode !== list) {
          const el = document.createElement("div");
          el.className = "s2-tgroup";
          const head = document.createElement("div");
          head.className = "s2-tgroup-h";
          const name = document.createElement("span");
          name.className = "s2-tgroup-name";
          name.textContent = leader ? leader.name || leader.id : "—";
          if (leader?.city) {
            const city = document.createElement("small");
            city.textContent = ` ${leader.city}`;
            name.appendChild(city);
          }
          const meta = document.createElement("span");
          meta.className = "s2-tgroup-meta";
          meta.textContent = leader
            ? [
                leader.client !== "Unknown" ? leader.client : null,
                leader.stakePct > 0 ? `${leader.stakePct}%` : null,
              ]
                .filter(Boolean)
                .join(" · ")
            : "";
          head.append(name, meta);
          el.appendChild(head);
          list.insertBefore(el, list.firstChild);
          while (list.children.length > MAX_GROUPS)
            list.removeChild(list.lastChild!);
          group = { id: gid, el };
          groupRef.current = group;
        }
        // a newer block landed: the previous one is sealed behind it
        if (lastStatusRef.current) {
          lastStatusRef.current.textContent = "✓";
          lastStatusRef.current.className = "s2-st is-ok";
        }
        const row = document.createElement("div");
        row.className = "s2-trow";
        const num = document.createElement("span");
        num.className = "s2-trow-slot";
        const st = document.createElement("span");
        st.className = "s2-st is-land";
        st.textContent = "○";
        num.append(st, `#${nf.format(ev.slot)}`);
        const ms = document.createElement("span");
        ms.className = "s2-trow-ms";
        ms.textContent = ev.dt !== null ? `${Math.round(ev.dt)} ms` : "—";
        row.append(num, ms);
        // newest slot right under the group header
        group.el.insertBefore(row, group.el.firstChild!.nextSibling);
        while (group.el.children.length > MAX_GROUP_ROWS + 1)
          group.el.removeChild(group.el.lastChild!);
        lastStatusRef.current = st;
      }),
    [subscribe, lookup, nf],
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
          <div className="s2-tape-h">{t("upNext")}</div>
          <div className="s2-tape-list">
            {upcoming.map(({ slot, entry }) => {
              const sub = [
                entry.city || null,
                entry.stakePct > 0 ? `${entry.stakePct}%` : null,
              ]
                .filter(Boolean)
                .join(" · ");
              return (
                <div key={slot} className="s2-trow">
                  <span className="s2-val-name">
                    {entry.name || entry.id}
                    {sub ? <small> {sub}</small> : null}
                  </span>
                  <span className="s2-trow-ms">+{slot - feed.slot}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="s2-tape-col">
          <div className="s2-tape-h">{t("txs")}</div>
          <div ref={txRef} className="s2-tape-list" />
        </div>
      </div>
      <div className="s2-tape-foot">
        <p className="s2-note">{t("note")}</p>
      </div>
    </Panel>
  );
});
