"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { CLIENTS, groupSlot, lightCss, type ClientId } from "./config";
import type { PlateRenderer } from "./plateRenderer";
import type { NetworkSource } from "./useNetworkSource";

type Mode = "pending" | "gl" | "static";

interface Props {
  source: NetworkSource;
  gains: Record<ClientId, number>;
  infoPanelRef: RefObject<HTMLDivElement | null>;
}

/**
 * The full-bleed stage. Sticks to the viewport for the whole page: a poster
 * frame at the top, then shrinks into an ambient object (plate only, no
 * block stream) as the content scrolls in. Three.js loads after first paint;
 * without WebGL the plate renders as static HTML type.
 */
export function PlateStage({ source, gains, infoPanelRef }: Props) {
  const stickyRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<PlateRenderer | null>(null);
  const progressRef = useRef(0);
  const coveredRef = useRef(false);
  const syncRunningRef = useRef(() => {});
  const gainsRef = useRef(gains);
  const sourceRef = useRef(source);
  const [mode, setMode] = useState<Mode>("pending");
  gainsRef.current = gains;
  sourceRef.current = source;

  useEffect(() => {
    const canvas = canvasRef.current;
    const sticky = stickyRef.current;
    const infoPanel = infoPanelRef.current;
    if (!canvas || !sticky || !infoPanel) return;
    let cancelled = false;
    let renderer: PlateRenderer | null = null;
    let visible = true;

    const sync = () =>
      renderer?.setRunning(visible && !document.hidden && !coveredRef.current);
    syncRunningRef.current = sync;
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
        const { createPlateRenderer } = await import("./plateRenderer");
        if (cancelled) return;
        renderer = createPlateRenderer(canvas, {
          railElement: infoPanel,
          reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches,
        });
        rendererRef.current = renderer;
        renderer.setAmbient(progressRef.current);
        renderer.setGains(gainsRef.current);
        renderer.setFinality(sourceRef.current.finalityMs);
        renderer.setSlotMs(sourceRef.current.slotMs);
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
      syncRunningRef.current = () => {};
      renderer?.dispose();
    };
  }, [infoPanelRef]);

  const { subscribe, finalityMs, slotMs } = source;
  useEffect(
    () =>
      subscribe((ev) =>
        rendererRef.current?.pushBlock(ev.slot, ev.family, ev.client),
      ),
    [subscribe],
  );
  useEffect(() => {
    rendererRef.current?.setFinality(finalityMs);
  }, [finalityMs]);
  useEffect(() => {
    rendererRef.current?.setSlotMs(slotMs);
  }, [slotMs]);
  useEffect(() => {
    rendererRef.current?.setGains(gains);
  }, [gains]);

  // Scroll progress through the first viewport drives the shrink.
  useEffect(() => {
    const sticky = stickyRef.current;
    const frame = frameRef.current;
    const page = sticky?.parentElement;
    if (!sticky || !frame || !page) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const top = page.getBoundingClientRect().top;
      // The site header is sticky and in flow: the stage sits below it.
      const offset = Math.max(0, Math.round(top + window.scrollY));
      page.style.setProperty("--s10-top", `${offset}px`);
      const p = Math.min(1, Math.max(0, (offset - top) / (vh * 0.85)));
      progressRef.current = p;
      const e = p * p * (3 - 2 * p);
      const wide = window.innerWidth >= 1024;
      const scale = 1 - e * (wide ? 0.56 : 0.3);
      const x = wide ? e * 25 : 0;
      const y = wide ? 0 : e * -16;
      frame.style.transform = `translate3d(${x}vw, ${y}svh, 0) scale(${scale})`;
      frame.style.opacity = String(1 - e * (wide ? 0.15 : 0.82));
      frame.style.setProperty("--s10-p", e.toFixed(3));
      rendererRef.current?.setAmbient(p);
      // The opaque sections cover the plate after the introduction.
      const content = page.querySelector("[data-s10-opaque-content]");
      coveredRef.current =
        !!content && content.getBoundingClientRect().top <= offset;
      syncRunningRef.current();
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
      <div
        ref={frameRef}
        className="relative h-full w-full origin-center pt-[var(--s10-heading-space)] will-change-transform [mask-image:radial-gradient(farthest-corner,#000_calc(100%-var(--s10-p,0)*62%),transparent_calc(101%-var(--s10-p,0)*1%))]"
      >
        <canvas
          ref={canvasRef}
          className={`block h-full w-full transition-opacity duration-700 ${mode === "gl" ? "opacity-100" : "opacity-0"}`}
        />
        {mode !== "gl" ? <StaticPlate source={source} gains={gains} /> : null}
      </div>
    </div>
  );
}

/** No-WebGL fallback: HTML type with CSS text-shadow fringes, no stream. */
function StaticPlate({ source, gains }: Pick<Props, "source" | "gains">) {
  const [slot, setSlot] = useState<number | null>(null);
  const { subscribe } = source;
  const lit = CLIENTS.filter((c) => c.live && gains[c.id] > 0);

  useEffect(() => {
    let last = 0;
    return subscribe((ev) => {
      const now = Date.now();
      if (now - last < 1000) return;
      last = now;
      setSlot(ev.slot);
    });
  }, [subscribe]);

  const warm = lit[0];
  const cool = lit[lit.length - 1];
  const color = lit.length > 1 ? "#fff" : warm ? lightCss(warm) : "#3f3b3a";
  const shadow =
    warm && cool
      ? `0.06em 0 0 ${lightCss(warm, 0.6)}, -0.06em 0 0 ${lightCss(cool, 0.6)}`
      : "none";

  return (
    <div
      className="absolute inset-x-0 bottom-0 top-[var(--s10-heading-space)] flex flex-col items-center justify-center gap-[2vh] pb-[22svh] text-center font-brand font-bold leading-none"
      style={{ color, textShadow: shadow }}
    >
      <div className="text-[clamp(2.5rem,11vw,13rem)] tracking-[0.06em] [font-variant-numeric:tabular-nums]">
        {slot ? groupSlot(slot) : " "}
      </div>
      <div className="text-[clamp(1.25rem,5vw,6rem)] tracking-[0.06em]">
        {source.finalityMs ? `${source.finalityMs} MS` : " "}
      </div>
    </div>
  );
}
