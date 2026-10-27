"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { RpcPath } from "./directory-state";
import type { RpcSceneLabels } from "./RpcRouteScene";

const RpcRouteScene = dynamic(
  () => import("./RpcRouteScene").then((module) => module.RpcRouteScene),
  { ssr: false },
);

function RouteFallback({ path }: { path: RpcPath }) {
  const local = path === "local";
  const shared = path === "public";
  return (
    <svg
      viewBox="0 0 600 350"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {local && (
        <rect
          x="42"
          y="83"
          width="326"
          height="185"
          rx="8"
          fill="none"
          stroke="#ECE4FD"
          strokeOpacity="0.4"
        />
      )}
      {shared && (
        <>
          <path
            d="M111 78 C170 78 205 145 270 168 M111 275 C170 275 205 205 270 180"
            fill="none"
            stroke="#ECE4FD"
            strokeOpacity="0.35"
          />
          <rect
            x="77"
            y="60"
            width="46"
            height="38"
            fill="none"
            stroke="#ECE4FD"
            strokeOpacity="0.35"
          />
          <rect
            x="77"
            y="255"
            width="46"
            height="38"
            fill="none"
            stroke="#ECE4FD"
            strokeOpacity="0.35"
          />
        </>
      )}
      {!local && !shared && (
        <>
          <path
            d="M125 175 C190 175 215 255 270 255"
            fill="none"
            stroke="#ECE4FD"
            strokeOpacity="0.55"
            strokeDasharray="5 5"
          />
          <path
            d="M330 255 C392 255 416 196 480 175"
            fill="none"
            stroke="#ECE4FD"
            strokeOpacity="0.35"
          />
          <rect
            x="270"
            y="220"
            width="60"
            height="70"
            fill="none"
            stroke="#ECE4FD"
            strokeOpacity="0.7"
          />
        </>
      )}
      <path
        d="M125 175 C190 175 215 145 270 145"
        fill="none"
        stroke="#55E9AB"
        strokeWidth="2"
      />
      {!local && (
        <path
          d="M330 145 C392 145 416 175 480 175"
          fill="none"
          stroke="#ECE4FD"
          strokeOpacity="0.55"
        />
      )}
      <rect
        x="65"
        y="135"
        width="60"
        height="80"
        fill="none"
        stroke="#ECE4FD"
      />
      <rect
        x="270"
        y="110"
        width="60"
        height="70"
        fill="#55E9AB"
        fillOpacity="0.08"
        stroke="#55E9AB"
      />
      {!local && (
        <g stroke="#ECE4FD" fill="none" strokeOpacity="0.75">
          <circle cx="510" cy="175" r="47" strokeOpacity="0.2" />
          {[0, 1, 2, 3, 4, 5, 6].map((index) => {
            const angle = (index * Math.PI * 2) / 7;
            return (
              <rect
                key={index}
                x={510 + Math.cos(angle) * 47 - 7}
                y={175 + Math.sin(angle) * 47 - 7}
                width="14"
                height="14"
              />
            );
          })}
        </g>
      )}
      <circle cx="205" cy="158" r="5" fill="white" />
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
      className="relative h-[240px] w-full overflow-hidden md:h-[400px] xl:h-[470px]"
      aria-hidden="true"
    >
      <div className="md:hidden">
        <RouteFallback path={path} />
      </div>
      <div
        className={
          sceneReady ? "hidden md:block md:opacity-0" : "hidden md:block"
        }
      >
        <RouteFallback path={path} />
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
