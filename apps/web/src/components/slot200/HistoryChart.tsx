"use client";

import React from "react";
import { useTranslations } from "@workspace/i18n/client";
import { Panel } from "./Panel";
import { usePolled, type SeriesPoint } from "./usePolled";

const GUIDES = [400, 350, 300] as const;

/**
 * The last ~12 hours of measured per-minute average slot time (the RPC's
 * full performance-sample history). When the flip lands it draws the cliff.
 */
export const HistoryChart = React.memo(function HistoryChart() {
  const t = useTranslations("slot200.history");
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const data = usePolled<{ points: SeriesPoint[] }>(
    "/api/slot-time/series",
    60_000,
  );

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const points = data?.points;
    if (!canvas || !points?.length) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const values = points.map((p) => p.ms);
      // Keep the scheduled 300ms guide in view before the measured series
      // descends to it.
      const lo = Math.min(290, Math.min(...values) - 8);
      const hi = Math.max(430, Math.max(...values) + 8);
      const t0 = points[0].t;
      const t1 = points[points.length - 1].t;
      const toX = (time: number) => ((time - t0) / (t1 - t0 || 1)) * (w - 34);
      const toY = (v: number) =>
        h - 18 - ((Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo)) * (h - 30);

      ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
      for (const g of GUIDES) {
        if (g < lo || g > hi) continue;
        const y = toY(g);
        ctx.strokeStyle =
          g === 300 ? "rgba(20,241,149,0.35)" : "rgba(148,163,184,0.25)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w - 30, y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle =
          g === 300 ? "rgba(20,241,149,0.7)" : "rgba(148,163,184,0.6)";
        ctx.fillText(String(g), w - 26, y + 3);
      }

      // hour ticks along the bottom
      ctx.fillStyle = "rgba(148,163,184,0.5)";
      const spanH = (t1 - t0) / 3_600_000;
      const everyH = spanH > 8 ? 3 : 1;
      const firstHour = new Date(t0);
      firstHour.setUTCMinutes(0, 0, 0);
      for (
        let tick = firstHour.getTime();
        tick <= t1;
        tick += everyH * 3_600_000
      ) {
        if (tick < t0) continue;
        const label = `${String(new Date(tick).getUTCHours()).padStart(2, "0")}:00`;
        ctx.fillText(label, Math.min(toX(tick), w - 62), h - 4);
      }

      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      points.forEach((p, i) => {
        const x = toX(p.t);
        const y = toY(p.ms);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [data]);

  return (
    <Panel title={t("title")} meta={t("sub")}>
      <canvas ref={canvasRef} className="s2-chart" />
    </Panel>
  );
});
