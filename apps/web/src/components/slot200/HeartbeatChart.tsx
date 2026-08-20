"use client";

import React from "react";
import { useTranslations } from "@workspace/i18n/client";
import { Panel } from "./Panel";
import type { SlotEvent } from "./useSlotFeed";

const KEEP = 240;
const GUIDES = [400, 350] as const;

interface HeartbeatChartProps {
  subscribe: (_fn: (_ev: SlotEvent) => void) => () => void;
}

/** The heartbeat: every measured block gap, one tick per slot, live. */
export const HeartbeatChart: React.FC<HeartbeatChartProps> = React.memo(
  function HeartbeatChart({ subscribe }) {
    const t = useTranslations("slot200.heartbeat");
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const gaps = React.useRef<number[]>([]);

    React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      let raf = 0;

      const draw = () => {
        raf = 0;
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

        const data = gaps.current;
        const lo = 250;
        // one long gap must not own the visual range — outliers clip instead
        const hi = Math.min(900, Math.max(560, ...data.slice(-KEEP)));
        const toY = (v: number) =>
          h -
          14 -
          ((Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo)) * (h - 28);

        ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
        for (const g of GUIDES) {
          const y = toY(g);
          ctx.strokeStyle =
            g === 350 ? "rgba(20,241,149,0.35)" : "rgba(148,163,184,0.25)";
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w - 30, y);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle =
            g === 350 ? "rgba(20,241,149,0.7)" : "rgba(148,163,184,0.6)";
          ctx.fillText(String(g), w - 26, y + 3);
        }

        if (data.length < 2) return;
        const step = (w - 34) / (KEEP - 1);
        const start = Math.max(0, data.length - KEEP);
        ctx.strokeStyle = "rgba(255,90,72,0.9)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let i = start; i < data.length; i++) {
          const x = w - 34 - (data.length - 1 - i) * step;
          const y = toY(data[i]);
          if (i === start) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        const last = data[data.length - 1];
        ctx.fillStyle = "#ff5a48";
        ctx.beginPath();
        ctx.arc(w - 34, toY(last), 3, 0, Math.PI * 2);
        ctx.fill();
        // value label above the head, clear of the right-edge guide labels
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.textAlign = "center";
        ctx.fillText(
          `${Math.round(last)}`,
          w - 34,
          Math.max(10, toY(last) - 8),
        );
        ctx.textAlign = "left";
      };
      const schedule = () => {
        if (!raf) raf = requestAnimationFrame(draw);
      };

      const unsub = subscribe((ev) => {
        if (ev.dt === null) return;
        gaps.current.push(ev.dt);
        if (gaps.current.length > KEEP * 2)
          gaps.current.splice(0, gaps.current.length - KEEP);
        if (!document.hidden) schedule();
      });
      const ro = new ResizeObserver(schedule);
      ro.observe(canvas);
      return () => {
        unsub();
        ro.disconnect();
        if (raf) cancelAnimationFrame(raf);
      };
    }, [subscribe]);

    return (
      <Panel title={t("title")} meta={t("sub")} live>
        <canvas ref={canvasRef} className="s2-chart" />
      </Panel>
    );
  },
);
