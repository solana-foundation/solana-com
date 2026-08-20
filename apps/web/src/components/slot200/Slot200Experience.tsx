"use client";

import React from "react";
import { BigBoard } from "./BigBoard";
import { Blockspace } from "./Blockspace";
import { ClientClock } from "./ClientClock";
import { FooterBar } from "./FooterBar";
import { HeartbeatChart } from "./HeartbeatChart";
import { Hero } from "./Hero";
import { HistoryChart } from "./HistoryChart";
import { SlowLane } from "./SlowLane";
import { Tape } from "./Tape";
import { TopRail } from "./TopRail";
import { WorldMap } from "./WorldMap";
import { useAttribution } from "./useAttribution";
import { useLeaderSchedule } from "./useLeaderSchedule";
import { useSlotFeed } from "./useSlotFeed";

/**
 * The /200ms situation room: one live slot feed (server-side slotSubscribe
 * bridge) drives every instrument; the leader schedule attributes each block
 * to its producer for the map and the accountability tables.
 */
export default function Slot200Experience() {
  const { feed, subscribe } = useSlotFeed();
  const { network, lookup } = useLeaderSchedule();
  const attribution = useAttribution(subscribe, lookup);

  return (
    <div className="s2-root">
      <TopRail feed={feed} />
      <Hero feed={feed} subscribe={subscribe} />
      <div className="s2-grid">
        <div className="s2-col-left">
          <BigBoard feed={feed} network={network} />
        </div>
        <div className="s2-col-mid">
          <WorldMap subscribe={subscribe} lookup={lookup} />
        </div>
        <div className="s2-col-right">
          <ClientClock attribution={attribution} />
          <SlowLane attribution={attribution} />
        </div>
        <div className="s2-row-b">
          <HeartbeatChart subscribe={subscribe} />
          <HistoryChart />
          <Blockspace />
        </div>
        <div className="s2-row-c">
          <Tape feed={feed} subscribe={subscribe} />
        </div>
      </div>
      <FooterBar />
    </div>
  );
}
