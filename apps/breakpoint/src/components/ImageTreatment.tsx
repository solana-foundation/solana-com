"use client";

import React, { useEffect, useRef, useState } from "react";

export type GlitchPattern = "none" | "p1" | "p2";
export type Lighting = "even" | "contrast" | "exposure";
export type TreatmentColor =
  | "none"
  | "white"
  | "purple"
  | "blue"
  | "green"
  | "yellow"
  | "pink";

export interface TreatmentOverrides {
  iframes?: number;
  pframes?: number;
  shift?: number;
  block?: number;
  threshold?: number;
  xShift?: number;
  yShift?: number;
  showEffect?: boolean;
  preprocess?: "distortion" | "base";
  exposure?: number;
  contrast?: number;
  animSpeed?: number;
}

export interface ImageTreatmentProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "color"
> {
  src: string;
  alt?: string;
  glitchPattern?: GlitchPattern;
  intensity?: number;
  lighting?: Lighting;
  color?: TreatmentColor;
  motion?: boolean;
  flicker?: boolean;
  foregroundSrc?: string;
  overrides?: TreatmentOverrides;
  objectFit?: "cover" | "contain";
}

type Preset = {
  iframes: number;
  pframes: number;
  shift: number;
  block: number;
  showEffect: boolean;
  preprocess: "distortion" | "base";
  threshold: number;
  xShift: number;
  yShift: number;
};

const PRESETS: Record<GlitchPattern, Preset> = {
  none: {
    iframes: 0,
    pframes: 0,
    shift: 0,
    block: 5,
    showEffect: false,
    preprocess: "distortion",
    threshold: 0,
    xShift: 0,
    yShift: 0,
  },
  p1: {
    iframes: 79,
    pframes: 20,
    shift: 60,
    block: 61,
    showEffect: false,
    preprocess: "distortion",
    threshold: 51,
    xShift: 98,
    yShift: -116,
  },
  p2: {
    iframes: 25,
    pframes: 8,
    shift: 55,
    block: 61,
    showEffect: true,
    preprocess: "distortion",
    threshold: 100,
    xShift: 0,
    yShift: 0,
  },
};

const LIGHTING_PRESETS: Record<
  Lighting,
  { exposure: number; contrast: number }
> = {
  even: { exposure: 1.25, contrast: 12 },
  contrast: { exposure: 1.15, contrast: 15 },
  exposure: { exposure: 1.1, contrast: -1 },
};

const COLOR_PRESETS: Record<TreatmentColor, [number, number, number] | null> = {
  none: null,
  white: [255, 255, 255],
  purple: [170, 103, 251],
  blue: [60, 145, 255],
  green: [20, 241, 149],
  yellow: [192, 224, 33],
  pink: [230, 93, 219],
};

const FG_OVERLAY: Partial<Record<TreatmentColor, [number, number, number]>> = {
  purple: [219, 190, 253],
  blue: [189, 217, 255],
  green: [192, 251, 227],
};

const MAX_DIMENSION = 800;

type Tear = {
  type: "tear";
  sx: number;
  sy: number;
  w: number;
  h: number;
  offsetX: number;
  targetOffsetX: number;
  speed: number;
  timer: number;
};

type Smear = {
  type: "smear";
  sx: number;
  sy: number;
  w: number;
  stretch: number;
  targetStretch: number;
  speed: number;
  timer: number;
  slices: { ox: number; w: number; oy: number; sl: number }[];
};

type Glitch = Tear | Smear;

function buildSlices(tw: number) {
  const slices: { ox: number; w: number; oy: number; sl: number }[] = [];
  let cx = 0;
  let r = tw;
  while (r > 0) {
    const sw = Math.min(r, 10 + Math.random() * 40);
    slices.push({
      ox: cx,
      w: sw,
      oy: (Math.random() - 0.5) * 80,
      sl: (Math.random() - 0.5) * 80,
    });
    cx += sw;
    r -= sw;
  }
  return slices;
}

function buildGlitches(
  w: number,
  h: number,
  iframes: number,
  pframes: number,
  shift: number,
  block: number,
): Glitch[] {
  const arr: Glitch[] = [];
  for (let i = 0; i < iframes; i++) {
    const full = Math.random() > 0.4;
    arr.push({
      type: "tear",
      sx: full ? 0 : Math.random() * w * 0.5,
      sy: Math.random() * h,
      w: full ? w : w * (0.2 + Math.random() * 0.8),
      h: Math.max(2, block * 0.1 + Math.random() * block * 2),
      offsetX: (Math.random() - 0.5) * shift * 8,
      targetOffsetX: (Math.random() - 0.5) * shift * 15,
      speed: 0.3 + Math.random() * 0.5,
      timer: Math.random() * 10,
    });
  }
  for (let j = 0; j < pframes; j++) {
    const tw = block * (Math.random() * 4 + 2);
    arr.push({
      type: "smear",
      sx: Math.random() * w,
      sy: Math.random() * h,
      w: tw,
      stretch: Math.random() * shift * 5,
      targetStretch: Math.random() * shift * 15,
      speed: 0.3 + Math.random() * 0.5,
      timer: Math.random() * 10,
      slices: buildSlices(tw),
    });
  }
  return arr;
}

function loadImage(src: string, signal: AbortSignal) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const onAbort = () => {
      img.onload = null;
      img.onerror = null;
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });
    img.onload = () => {
      signal.removeEventListener("abort", onAbort);
      resolve(img);
    };
    img.onerror = () => {
      signal.removeEventListener("abort", onAbort);
      reject(new Error(`Failed to load ${src}`));
    };
    img.src = src;
  });
}

export default function ImageTreatment({
  src,
  alt = "",
  glitchPattern = "p1",
  intensity = 100,
  lighting = "even",
  color = "purple",
  motion = false,
  flicker = false,
  foregroundSrc,
  overrides,
  objectFit = "cover",
  className,
  style,
  ...rest
}: ImageTreatmentProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [fgImage, setFgImage] = useState<HTMLImageElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    loadImage(src, ctrl.signal)
      .then(setImage)
      .catch((err: unknown) => {
        if ((err as DOMException)?.name !== "AbortError") console.error(err);
      });
    return () => ctrl.abort();
  }, [src]);

  useEffect(() => {
    if (!foregroundSrc) {
      setFgImage(null);
      return;
    }
    const ctrl = new AbortController();
    loadImage(foregroundSrc, ctrl.signal)
      .then(setFgImage)
      .catch((err: unknown) => {
        if ((err as DOMException)?.name !== "AbortError") console.error(err);
      });
    return () => ctrl.abort();
  }, [foregroundSrc]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const overridesKey = JSON.stringify(overrides ?? null);

  useEffect(() => {
    if (!image || !canvasRef.current || !inView) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = motion && !prefersReducedMotion;

    let w = image.naturalWidth;
    let h = image.naturalHeight;
    if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
      const r = MAX_DIMENSION / Math.max(w, h);
      w = Math.max(1, Math.floor(w * r));
      h = Math.max(1, Math.floor(h * r));
    }
    canvas.width = w;
    canvas.height = h;

    const preset = PRESETS[glitchPattern];
    const lightPreset = LIGHTING_PRESETS[lighting];
    const colorRgb = COLOR_PRESETS[color];
    const intensityPct = Math.max(0, Math.min(100, intensity)) / 100;

    const params = {
      iframes: Math.round(preset.iframes * intensityPct),
      pframes: Math.round(preset.pframes * intensityPct),
      shift: Math.round(preset.shift * intensityPct),
      block: Math.max(5, Math.round(preset.block * intensityPct)),
      threshold: preset.threshold,
      xShift: preset.xShift,
      yShift: preset.yShift,
      showEffect: preset.showEffect,
      preprocess: preset.preprocess,
      exposure: lightPreset.exposure,
      contrast: lightPreset.contrast,
      animSpeed: 0.4,
      ...(overrides ?? {}),
    };

    const baseCanvas = document.createElement("canvas");
    baseCanvas.width = w;
    baseCanvas.height = h;
    const bCtx = baseCanvas.getContext("2d", { willReadFrequently: true })!;
    const tintedCanvas = document.createElement("canvas");
    tintedCanvas.width = w;
    tintedCanvas.height = h;
    const tCtx = tintedCanvas.getContext("2d", { willReadFrequently: true })!;
    const displacedCanvas = document.createElement("canvas");
    displacedCanvas.width = w;
    displacedCanvas.height = h;
    const dCtx = displacedCanvas.getContext("2d", {
      willReadFrequently: true,
    })!;

    let fgCanvas: HTMLCanvasElement | null = null;
    let fgX = 0;
    let fgY = 0;
    if (fgImage) {
      const ratio = Math.min(w / fgImage.width, h / fgImage.height);
      const fgW = Math.round(fgImage.width * ratio);
      const fgH = Math.round(fgImage.height * ratio);
      fgX = Math.round((w - fgW) / 2);
      fgY = Math.round((h - fgH) / 2);
      fgCanvas = document.createElement("canvas");
      fgCanvas.width = fgW;
      fgCanvas.height = fgH;
      const fx = fgCanvas.getContext("2d")!;
      fx.drawImage(fgImage, 0, 0, fgW, fgH);
      const id = fx.getImageData(0, 0, fgW, fgH);
      const d = id.data;
      for (let i = 0; i < d.length; i += 4) {
        const gv = d[i]! * 0.299 + d[i + 1]! * 0.587 + d[i + 2]! * 0.114;
        d[i] = d[i + 1] = d[i + 2] = gv;
      }
      fx.putImageData(id, 0, 0);
    }

    const processBase = (xs: number, ys: number) => {
      const fillR = colorRgb ? colorRgb[0] : 170;
      const fillG = colorRgb ? colorRgb[1] : 103;
      const fillB = colorRgb ? colorRgb[2] : 251;

      bCtx.clearRect(0, 0, w, h);
      bCtx.drawImage(image, 0, 0, w, h);

      tCtx.clearRect(0, 0, w, h);
      tCtx.drawImage(image, 0, 0, w, h);

      const imgData = tCtx.getImageData(0, 0, w, h);
      const d = imgData.data;
      const applyColor = color !== "none" && colorRgb !== null;
      const isBW =
        applyColor &&
        colorRgb![0] === 255 &&
        colorRgb![1] === 255 &&
        colorRgb![2] === 255;
      const exp = params.exposure;
      const factor =
        (259 * (params.contrast + 255)) / (255 * (259 - params.contrast));
      const rC = applyColor ? colorRgb![0] : 0;
      const gC = applyColor ? colorRgb![1] : 0;
      const bC = applyColor ? colorRgb![2] : 0;

      for (let i = 0, len = d.length; i < len; i += 4) {
        if (d[i + 3] === 0) continue;
        let r = d[i]! * exp;
        let g = d[i + 1]! * exp;
        let b = d[i + 2]! * exp;
        r = factor * (r - 128) + 128;
        g = factor * (g - 128) + 128;
        b = factor * (b - 128) + 128;
        r = r < 0 ? 0 : r > 255 ? 255 : r;
        g = g < 0 ? 0 : g > 255 ? 255 : g;
        b = b < 0 ? 0 : b > 255 ? 255 : b;
        if (applyColor) {
          const gray = r * 0.299 + g * 0.587 + b * 0.114;
          d[i] = isBW ? gray : (gray * rC) / 255;
          d[i + 1] = isBW ? gray : (gray * gC) / 255;
          d[i + 2] = isBW ? gray : (gray * bC) / 255;
        } else {
          d[i] = r;
          d[i + 1] = g;
          d[i + 2] = b;
        }
      }
      tCtx.putImageData(imgData, 0, 0);

      dCtx.fillStyle = `rgb(${fillR},${fillG},${fillB})`;
      dCtx.fillRect(0, 0, w, h);

      if (!params.showEffect) {
        dCtx.drawImage(tintedCanvas, 0, 0);
        return;
      }

      const inData = tCtx.getImageData(0, 0, w, h);
      const baseData = bCtx.getImageData(0, 0, w, h);
      const outData = dCtx.createImageData(w, h);
      const inPix = inData.data;
      const basePix = baseData.data;
      const outPix = outData.data;
      const t = params.threshold;
      const wm1 = w - 1;
      const hm1 = h - 1;
      const isPrepBase = params.preprocess === "base";
      let idx = 0;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++, idx += 4) {
          if (inPix[idx + 3] === 0) {
            outPix[idx] = fillR;
            outPix[idx + 1] = fillG;
            outPix[idx + 2] = fillB;
            outPix[idx + 3] = 255;
            continue;
          }
          const lum =
            basePix[idx]! * 0.299 +
            basePix[idx + 1]! * 0.587 +
            basePix[idx + 2]! * 0.114;
          if (isPrepBase) {
            const val = lum >= t ? lum : 0;
            outPix[idx] = outPix[idx + 1] = outPix[idx + 2] = val;
            outPix[idx + 3] = 255;
            continue;
          }
          let si = idx;
          if (lum >= t) {
            const disp = (lum - 128) / 128;
            const dx = (disp * xs) | 0;
            const dy = (disp * ys) | 0;
            const sx = x + dx < 0 ? 0 : x + dx > wm1 ? wm1 : x + dx;
            const sy = y + dy < 0 ? 0 : y + dy > hm1 ? hm1 : y + dy;
            si = (sy * w + sx) * 4;
          }
          if (inPix[si + 3] === 0) {
            outPix[idx] = fillR;
            outPix[idx + 1] = fillG;
            outPix[idx + 2] = fillB;
            outPix[idx + 3] = 255;
          } else {
            outPix[idx] = inPix[si]!;
            outPix[idx + 1] = inPix[si + 1]!;
            outPix[idx + 2] = inPix[si + 2]!;
            outPix[idx + 3] = 255;
          }
        }
      }
      dCtx.putImageData(outData, 0, 0);
    };

    const renderHeadshot = () => {
      if (!fgCanvas) return;
      const overlayRgb = FG_OVERLAY[color] ?? [219, 190, 253];
      ctx.drawImage(fgCanvas, fgX, fgY);
      const tmp = document.createElement("canvas");
      tmp.width = w;
      tmp.height = h;
      const tmpCtx = tmp.getContext("2d")!;
      tmpCtx.drawImage(fgCanvas, fgX, fgY);
      tmpCtx.globalCompositeOperation = "source-atop";
      tmpCtx.fillStyle = `rgb(${overlayRgb[0]},${overlayRgb[1]},${overlayRgb[2]})`;
      tmpCtx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "color";
      ctx.drawImage(tmp, 0, 0);
      ctx.globalCompositeOperation = "source-over";
    };

    const glitches: Glitch[] = buildGlitches(
      w,
      h,
      params.iframes,
      params.pframes,
      params.shift,
      params.block,
    );

    const renderFrame = (mode: "static" | "chaos") => {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(displacedCanvas, 0, 0);
      const spd = params.animSpeed;
      for (const g of glitches) {
        if (mode === "chaos") {
          g.timer -= spd;
          if (g.timer <= 0) {
            if (g.type === "tear") {
              g.targetOffsetX = (Math.random() - 0.5) * params.shift * 20;
              if (Math.random() > 0.4) g.sy = Math.random() * h;
              g.h = Math.max(
                2,
                params.block * 0.1 + Math.random() * params.block * 2.5,
              );
            } else {
              g.targetStretch = Math.random() * params.shift * 20;
              if (Math.random() > 0.4) {
                g.sx = Math.random() * w;
                g.sy = Math.random() * h;
                g.slices = buildSlices(g.w);
              }
            }
            g.timer = (2 + Math.random() * 10) / Math.max(0.1, spd);
          }
          const ease = g.speed * spd;
          if (g.type === "tear") {
            g.offsetX += (g.targetOffsetX - g.offsetX) * ease;
          } else {
            g.stretch += (g.targetStretch - g.stretch) * ease;
          }
        }
        if (g.type === "tear") {
          ctx.drawImage(
            displacedCanvas,
            g.sx,
            g.sy,
            g.w,
            g.h,
            g.sx + g.offsetX,
            g.sy,
            g.w,
            g.h,
          );
        } else {
          for (const s of g.slices) {
            ctx.drawImage(
              canvas,
              g.sx + s.ox,
              g.sy + s.oy,
              s.w,
              2,
              g.sx + s.ox,
              g.sy + s.oy,
              s.w,
              Math.max(2, g.stretch + s.sl),
            );
          }
        }
      }
    };

    processBase(params.xShift, params.yShift);

    const drawClean = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(tintedCanvas, 0, 0);
      renderHeadshot();
    };

    let raf = 0;
    const motionLoop = () => {
      if (Math.random() > 0.5 / Math.max(0.1, params.animSpeed)) {
        const jx = params.xShift + (Math.random() - 0.5) * 80;
        const jy = params.yShift + (Math.random() - 0.5) * 80;
        processBase(jx, jy);
      }
      renderFrame("chaos");
      renderHeadshot();
      raf = requestAnimationFrame(motionLoop);
    };
    const stopMotion = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const startGlitched = () => {
      const fresh = buildGlitches(
        w,
        h,
        params.iframes,
        params.pframes,
        params.shift,
        params.block,
      );
      glitches.length = 0;
      for (const g of fresh) glitches.push(g);
      if (animate) raf = requestAnimationFrame(motionLoop);
      else {
        renderFrame("static");
        renderHeadshot();
      }
    };

    const hasGlitch = glitchPattern !== "none";

    if (flicker && hasGlitch) {
      let timeoutId: number | null = null;
      let isGlitching = Math.random() < 0.4;
      const schedule = () => {
        const dur = isGlitching
          ? 140 + Math.random() * 360
          : 2500 + Math.random() * 5000;
        timeoutId = window.setTimeout(() => {
          isGlitching = !isGlitching;
          if (isGlitching) startGlitched();
          else {
            stopMotion();
            drawClean();
          }
          schedule();
        }, dur);
      };
      if (isGlitching) startGlitched();
      else drawClean();
      schedule();
      return () => {
        if (timeoutId != null) clearTimeout(timeoutId);
        stopMotion();
      };
    }

    if (animate) {
      startGlitched();
      return () => stopMotion();
    }

    renderFrame("static");
    renderHeadshot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    image,
    fgImage,
    inView,
    glitchPattern,
    intensity,
    lighting,
    color,
    motion,
    flicker,
    overridesKey,
  ]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={style}
      role="img"
      aria-label={alt}
      {...rest}
    >
      <canvas
        ref={canvasRef}
        className={`block h-full w-full ${objectFit === "cover" ? "object-cover" : "object-contain"}`}
      />
    </div>
  );
}
