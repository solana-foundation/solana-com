"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { RpcPath } from "./directory-state";
import type { RpcSceneLabels } from "./RpcRouteScene";
import {
  APP_GLYPHS,
  cableEnds,
  GLYPH_SIZE,
  GLYPH_Y,
  grilleDots,
  jackPosition,
  PATCH_COLORS,
  PATCH_LAYOUTS,
  PATCH_RACK,
  PATCH_TONES,
} from "./rpc-patch-layout";

const RpcRouteScene = dynamic(
  () => import("./RpcRouteScene").then((module) => module.RpcRouteScene),
  { ssr: false },
);

const UNIT = 66;
const sx = (x: number) => 300 + (x - PATCH_RACK.x) * UNIT;
const sy = (y: number) => 175 - (y - PATCH_RACK.y) * UNIT;
const { cream, panel, rack, socket } = PATCH_COLORS;

function Screws({
  x,
  y,
  w,
  h,
  opacity,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  opacity: number;
}) {
  return (
    <g fill={cream} fillOpacity={opacity}>
      {[
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ].map(([dx, dy]) => (
        <circle
          key={`${dx}${dy}`}
          cx={sx(x + dx * (w / 2 - 0.09))}
          cy={sy(y + dy * (h / 2 - 0.09))}
          r={2.1}
        />
      ))}
    </g>
  );
}

function RouteFallback({
  path,
  labels,
}: {
  path: RpcPath;
  labels: RpcSceneLabels;
}) {
  const layout = PATCH_LAYOUTS[path];
  const jackTones = new Map<string, string>();
  for (const cable of layout.cables) {
    jackTones.set(cable.from.join(":"), PATCH_TONES[cable.tone]);
    jackTones.set(cable.to.join(":"), PATCH_TONES[cable.tone]);
  }
  return (
    <svg
      viewBox="0 0 600 350"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect
        x={sx(PATCH_RACK.x - PATCH_RACK.w / 2)}
        y={sy(PATCH_RACK.y + PATCH_RACK.h / 2)}
        width={PATCH_RACK.w * UNIT}
        height={PATCH_RACK.h * UNIT}
        fill={rack}
        stroke={cream}
        strokeOpacity="0.16"
      />
      <g fill={cream} fillOpacity="0.32">
        {[-1, 1].flatMap((side) =>
          Array.from({ length: 8 }, (_, index) => (
            <circle
              key={`${side}${index}`}
              cx={sx(
                PATCH_RACK.x -
                  PATCH_RACK.w / 2 +
                  0.2 +
                  (index * (PATCH_RACK.w - 0.4)) / 7,
              )}
              cy={sy(PATCH_RACK.y + side * (PATCH_RACK.h / 2 - 0.16))}
              r={2.1}
            />
          )),
        )}
      </g>
      {layout.frame && (
        <>
          <rect
            x={sx(layout.frame.x - layout.frame.w / 2)}
            y={sy(layout.frame.y + layout.frame.h / 2)}
            width={layout.frame.w * UNIT}
            height={layout.frame.h * UNIT}
            fill="none"
            stroke={cream}
            strokeOpacity="0.4"
          />
          <Screws {...layout.frame} opacity={0.4} />
        </>
      )}
      {layout.modules.map((part) => {
        const k = part.dim ? 0.5 : 1;
        const knobs = part.knobs ?? 0;
        return (
          <g key={part.id}>
            <rect
              x={sx(part.x - part.w / 2)}
              y={sy(part.y + part.h / 2)}
              width={part.w * UNIT}
              height={part.h * UNIT}
              fill={panel}
              stroke={cream}
              strokeOpacity={0.6 * k}
            />
            <Screws {...part} opacity={0.65 * k} />
            {Array.from({ length: knobs }, (_, index) => {
              const x = part.x + (index - (knobs - 1) / 2) * 0.4;
              const y = part.y + part.h / 2 - 0.36;
              const angle = 0.5 + index * 1.9;
              return (
                <g key={index}>
                  <circle
                    cx={sx(x)}
                    cy={sy(y)}
                    r={0.15 * UNIT}
                    fill={cream}
                    fillOpacity={0.9 * k}
                  />
                  <circle
                    cx={sx(x + Math.cos(angle) * 0.09)}
                    cy={sy(y + Math.sin(angle) * 0.09)}
                    r={1}
                    fill={socket}
                  />
                  {Array.from({ length: 9 }, (_, tick) => {
                    const a = Math.PI * 1.25 - (tick * Math.PI * 1.5) / 8;
                    return (
                      <circle
                        key={tick}
                        cx={sx(x + Math.cos(a) * 0.215)}
                        cy={sy(y + Math.sin(a) * 0.215)}
                        r={0.9}
                        fill={cream}
                        fillOpacity={0.5 * k}
                      />
                    );
                  })}
                </g>
              );
            })}
            {part.glyphs && (
              <g
                fill="none"
                stroke={cream}
                strokeOpacity="0.85"
                transform={`translate(${sx(part.x)} ${sy(part.y + GLYPH_Y)})`}
              >
                {APP_GLYPHS.map(({ kind, dx }) => {
                  const r = GLYPH_SIZE * UNIT;
                  const x = dx * UNIT;
                  return kind === "circle" ? (
                    <circle key={kind} cx={x} r={r} />
                  ) : kind === "triangle" ? (
                    <path
                      key={kind}
                      d={`M${x} ${-r}L${x + r} ${r * 0.8}L${x - r} ${r * 0.8}Z`}
                    />
                  ) : (
                    <rect
                      key={kind}
                      x={x - r * 0.85}
                      y={-r * 0.85}
                      width={r * 1.7}
                      height={r * 1.7}
                    />
                  );
                })}
              </g>
            )}
            {part.leds &&
              Array.from({ length: 15 }, (_, index) => {
                const lit = index % 4 === 1;
                return (
                  <rect
                    key={index}
                    x={sx(part.x + ((index % 5) - 2) * 0.13) - 2.3}
                    y={
                      sy(part.y - 0.12 + (1 - Math.floor(index / 5)) * 0.13) -
                      2.3
                    }
                    width={4.6}
                    height={4.6}
                    fill={lit ? PATCH_TONES.request : cream}
                    fillOpacity={lit ? 0.95 : 0.4}
                  />
                );
              })}
            {part.grille && (
              <g transform={`translate(${sx(part.x)} ${sy(part.y + 0.17)})`}>
                <circle
                  r={0.9 * UNIT}
                  fill="none"
                  stroke={cream}
                  strokeOpacity="0.7"
                />
                {grilleDots(0.9).map((dot, index) => (
                  <circle
                    key={index}
                    cx={dot.x * UNIT}
                    cy={-dot.y * UNIT}
                    r={1.7}
                    fill={dot.lit ? PATCH_TONES.cluster : cream}
                    fillOpacity="0.85"
                  />
                ))}
              </g>
            )}
            {Array.from({ length: part.jacks }, (_, index) => {
              const { x, y } = jackPosition(part, index);
              const tone = jackTones.get(`${part.id}:${index}`);
              return (
                <circle
                  key={index}
                  cx={sx(x)}
                  cy={sy(y)}
                  r={4.2}
                  fill={socket}
                  stroke={tone ?? cream}
                  strokeOpacity={tone ? 1 : 0.75 * k}
                  strokeWidth={1.8}
                />
              );
            })}
          </g>
        );
      })}
      {[...layout.cables]
        .sort((a, b) => Number(Boolean(a.role)) - Number(Boolean(b.role)))
        .map((cable) => {
          const { a, b, low } = cableEnds(layout, cable);
          const tone = PATCH_TONES[cable.tone];
          const opacity = cable.role ? 1 : cable.tone === "shared" ? 0.7 : 0.6;
          const bottom =
            sy(low) + (sy(low) - Math.max(sy(a.y), sy(b.y))) * 0.33;
          const d = `M${sx(a.x)} ${sy(a.y)}C${sx(a.x)} ${bottom} ${sx(b.x)} ${bottom} ${sx(b.x)} ${sy(b.y)}`;
          const width = cable.role ? 6 : 4.5;
          return (
            <g key={`${cable.from}-${cable.to}`} strokeLinecap="round">
              <path
                d={d}
                transform="translate(2.5 4.5)"
                fill="none"
                stroke="black"
                strokeOpacity={0.5 * opacity}
                strokeWidth={width}
              />
              <path
                d={d}
                fill="none"
                stroke={tone}
                strokeOpacity={opacity}
                strokeWidth={width}
              />
              {[a, b].map((end) => (
                <circle
                  key={`${end.x}${end.y}`}
                  cx={sx(end.x)}
                  cy={sy(end.y)}
                  r={5.6}
                  fill={tone}
                  fillOpacity={opacity}
                />
              ))}
            </g>
          );
        })}
      <g
        className="hidden font-mono text-[9.5px] uppercase tracking-wide md:block"
        fill={cream}
        fillOpacity="0.7"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {layout.labels.map(({ key, x, y }) => (
          <text key={key} x={sx(x)} y={sy(y)}>
            {labels[key]}
          </text>
        ))}
      </g>
    </svg>
  );
}

export function RpcRouteVisual({
  path,
  labels,
}: {
  path: RpcPath;
  labels: RpcSceneLabels;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [loadScene, setLoadScene] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(motion.matches);
    syncMotion();
    motion.addEventListener("change", syncMotion);
    return () => motion.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (
      connection?.saveData ||
      window.matchMedia("(prefers-reduced-data: reduce)").matches
    )
      return;
    const desktop = window.matchMedia("(min-width: 768px)");
    let timer: ReturnType<typeof setTimeout> | undefined;
    let observer: IntersectionObserver | undefined;
    let idle: number | undefined;
    let loaded = false;
    const cancelPending = () => {
      if (timer) clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
      observer?.disconnect();
      timer = undefined;
      idle = undefined;
      observer = undefined;
    };
    const syncDesktop = () => {
      if (!desktop.matches) {
        cancelPending();
        loaded = false;
        setLoadScene(false);
        setSceneReady(false);
        return;
      }
      if (observer || loaded) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            observer?.disconnect();
            observer = undefined;
            const load = () => {
              if (!desktop.matches) return;
              loaded = true;
              setLoadScene(true);
            };
            if (window.requestIdleCallback)
              idle = window.requestIdleCallback(load, { timeout: 700 });
            else timer = setTimeout(load, 150);
          }
        },
        { rootMargin: "200px" },
      );
      observer.observe(host);
    };
    syncDesktop();
    desktop.addEventListener("change", syncDesktop);
    return () => {
      desktop.removeEventListener("change", syncDesktop);
      cancelPending();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="relative aspect-[12/7] w-full overflow-hidden"
      aria-hidden="true"
    >
      <div className="md:hidden">
        <RouteFallback path={path} labels={labels} />
      </div>
      <div
        className={
          sceneReady ? "hidden md:block md:opacity-0" : "hidden md:block"
        }
      >
        <RouteFallback path={path} labels={labels} />
      </div>
      {loadScene && (
        <div className="hidden md:block">
          <RpcRouteScene
            path={path}
            animate={!reducedMotion}
            labels={labels}
            onReady={() => setSceneReady(true)}
            onLost={() => setSceneReady(false)}
          />
        </div>
      )}
    </div>
  );
}
