"use client";

import { useEffect, useRef, useState } from "react";
import { groupSlot, type ClientId } from "./config";
import type { FilmRenderer } from "./filmRenderer";
import { SCENE_KEYS, type SceneKey } from "./filmShapes";
import type { NetworkSource } from "./useNetworkSource";

type Mode = "pending" | "gl" | "static";

interface Props {
  source: NetworkSource;
  gains: Record<ClientId, number>;
}

/** Shot names from the launch film, shown in the viewfinder. */
const SHOT_LABELS: Record<SceneKey, string> = {
  iris: "AWAKE",
  tree: "GENESIS",
  globe: "VALIDATOR.MESH",
  tower: "BLOCK.STACK",
  lattice: "NODE_GRAPH",
  torus: "STATE.FIELD",
  tunnel: "SLIPSTREAM",
  horizon: "MAINNET",
};

/** Viewport heights a chapter travels while the cut into it plays. */
const CUT_SPAN = 0.62;

const cornerClass =
  "absolute h-3 w-3 border-solid border-[#ece7df]/40 md:h-4 md:w-4";

/**
 * The film stage: one three.js canvas pinned behind the whole page. Each
 * `[data-s10-scene]` chapter in the page is a shot from the launch film; the
 * particle cloud cuts to the next shot as its chapter scrolls in, rings on
 * every mainnet block, and loses a client's colour when that client is cut.
 * Three.js loads after first paint; with reduced motion or no WebGL the
 * stage is a still backdrop and the viewfinder keeps its live readout.
 */
export function FilmStage({ source, gains }: Props) {
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const rendererRef = useRef<FilmRenderer | null>(null);
  const sceneRef = useRef(0);
  const gainsRef = useRef(gains);
  const [mode, setMode] = useState<Mode>("pending");
  const [shot, setShot] = useState(0);
  gainsRef.current = gains;

  useEffect(() => {
    const canvas = canvasRef.current;
    const sticky = stickyRef.current;
    if (!canvas || !sticky) return;
    let cancelled = false;
    let renderer: FilmRenderer | null = null;
    let visible = true;

    const sync = () => renderer?.setRunning(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      sync();
    });
    observer.observe(sticky);
    document.addEventListener("visibilitychange", sync);

    const init = async () => {
      try {
        const device = navigator as Navigator & {
          connection?: { saveData?: boolean };
        };
        if (
          window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
          device.connection?.saveData
        ) {
          if (!cancelled) setMode("static");
          return;
        }
        const { createFilmRenderer } = await import("./filmRenderer");
        if (cancelled) return;
        renderer = createFilmRenderer(canvas);
        rendererRef.current = renderer;
        renderer.setScene(sceneRef.current);
        renderer.setGains(gainsRef.current);
        sync();
        setMode("gl");
      } catch {
        if (!cancelled) setMode("static");
      }
    };
    // Let the server-rendered heading and controls paint before loading WebGL.
    const idle = typeof window.requestIdleCallback === "function";
    const start = idle
      ? window.requestIdleCallback(() => void init(), { timeout: 1000 })
      : window.setTimeout(() => void init(), 32);

    return () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(start);
      else window.clearTimeout(start);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      rendererRef.current = null;
      renderer?.dispose();
    };
  }, []);

  const { subscribe, finalityMs } = source;
  useEffect(() => {
    let last = 0;
    return subscribe((ev) => {
      rendererRef.current?.pushBlock(ev.family);
      const now = Date.now();
      if (now - last < 90 || !slotRef.current) return;
      last = now;
      slotRef.current.textContent = groupSlot(ev.slot);
    });
  }, [subscribe]);
  useEffect(() => {
    rendererRef.current?.setGains(gains);
  }, [gains]);

  // Scroll position, in scenes: each chapter cuts in as it enters the viewport.
  useEffect(() => {
    const sticky = stickyRef.current;
    const page = sticky?.parentElement;
    if (!sticky || !page) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const top = page.getBoundingClientRect().top;
      // The site header is sticky and in flow: the stage sits below it.
      const offset = Math.max(0, Math.round(top + window.scrollY));
      page.style.setProperty("--s10-top", `${offset}px`);
      let value = 0;
      const last = SCENE_KEYS.length - 1;
      page.querySelectorAll("[data-s10-scene]").forEach((chapter) => {
        const entered = (vh - chapter.getBoundingClientRect().top) / vh;
        const p = Math.min(1, Math.max(0, entered / CUT_SPAN));
        value += p * p * (3 - 2 * p);
      });
      value = Math.min(last, value);
      sceneRef.current = value;
      rendererRef.current?.setScene(value);
      setShot(Math.round(value));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // banners above the page can appear or collapse after load, which moves
    // the page without a scroll or resize event
    const layoutObserver = new ResizeObserver(onScroll);
    layoutObserver.observe(document.body);
    return () => {
      layoutObserver.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={stickyRef}
      aria-hidden="true"
      className="pointer-events-none sticky top-[var(--s10-top,0px)] z-0 h-[calc(100svh-var(--s10-top,0px))] w-full overflow-clip"
    >
      <canvas
        ref={canvasRef}
        className={`block h-full w-full transition-opacity duration-1000 ${mode === "gl" ? "opacity-100" : "opacity-0"}`}
      />
      {mode === "static" ? (
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_30%_40%,rgb(153_69_255/0.22),transparent),radial-gradient(50%_45%_at_72%_58%,rgb(20_241_149/0.14),transparent)]" />
      ) : null}

      <div className="absolute inset-3 font-brand-mono text-[0.625rem] uppercase leading-none tracking-[0.14em] text-[#ece7df]/55 md:inset-5 md:text-[0.6875rem]">
        <span
          className={`${cornerClass} left-0 top-0 border-0 border-l border-t`}
        />
        <span
          className={`${cornerClass} right-0 top-0 border-0 border-r border-t`}
        />
        <span
          className={`${cornerClass} bottom-0 left-0 border-0 border-b border-l`}
        />
        <span
          className={`${cornerClass} bottom-0 right-0 border-0 border-b border-r`}
        />
        <p className="absolute left-4 top-3 m-0 flex items-center gap-2 md:left-6 md:top-4">
          <span className="h-1.5 w-1.5 rounded-full bg-[#14f195] motion-safe:animate-pulse" />
          {SHOT_LABELS[SCENE_KEYS[shot]]}
        </p>
        <p className="absolute right-4 top-3 m-0 flex flex-col items-end gap-1.5 [font-variant-numeric:tabular-nums] md:right-6 md:top-4">
          <span className="text-[#14f195]/80">
            SLOT <span ref={slotRef}>—</span>
          </span>
          <span>{finalityMs === null ? "—" : finalityMs} MS</span>
        </p>
      </div>
    </div>
  );
}
