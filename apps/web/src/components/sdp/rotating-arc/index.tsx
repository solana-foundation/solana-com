"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

const texts = [
  "Permissioned stablecoins",
  "Tokenized RWAs",
  "Cross-border payments",
  "Merchant settlement",
  "Compliant private transfers",
  "Stablecoin payins/payouts",
  "Atomic delivery vs payments",
  "KYC'd RWA treasury",
  "Policy-gated wallets",
];

type ControlKey =
  | "radius"
  | "outerArcRadius"
  | "innerArcRadius"
  | "outerArcOpacity"
  | "innerArcOpacity"
  | "showInnerArc"
  | "offsetX"
  | "offsetY"
  | "moveDuration"
  | "pauseDuration"
  | "fontSize"
  | "focusScale"
  | "scaleFalloff"
  | "tiltAngle"
  | "arcSpan"
  | "edgeFade"
  | "maxBlur";

type Controls = Record<ControlKey, number>;

const defaultControls: Controls = {
  radius: 200,
  outerArcRadius: 200,
  innerArcRadius: 122,
  outerArcOpacity: 0.15,
  innerArcOpacity: 0.15,
  showInnerArc: 0,
  offsetX: -300,
  offsetY: 0,
  moveDuration: 800,
  pauseDuration: 600,
  fontSize: 20,
  focusScale: 1.1,
  scaleFalloff: 0.12,
  tiltAngle: -4,
  arcSpan: 140,
  edgeFade: 0.3,
  maxBlur: 4,
};

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

export function RotatingArc({ className }: { className?: string }) {
  const itemCount = texts.length;
  const [controls] = useState<Controls>(defaultControls);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [phase, setPhase] = useState<"paused" | "moving">("paused");
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled] = useState(true);
  const [volume] = useState(0.15);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const [entryDone, setEntryDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const resumeTimerRef = useRef<number | null>(null);
  const wheelIdleRef = useRef<number | null>(null);
  const snapAnimRef = useRef<number | null>(null);
  const pointerStartYRef = useRef<number | null>(null);
  const scrubAccumRef = useRef(0);
  const [scrubDirection, setScrubDirection] = useState<1 | -1>(1);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const audioPoolRef = useRef<HTMLAudioElement[]>([]);
  const audioPoolIndexRef = useRef(0);

  const playClick = useCallback(() => {
    if (!soundEnabled) return;
    const poolSize = 4;
    if (audioPoolRef.current.length === 0) {
      for (let i = 0; i < poolSize; i++) {
        const a = new Audio("/sounds/click.mp3");
        a.volume = volume;
        audioPoolRef.current.push(a);
      }
    }
    const audio = audioPoolRef.current[audioPoolIndexRef.current % poolSize];
    audio.volume = volume;
    audioPoolIndexRef.current++;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, [soundEnabled, volume]);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(
    () => () => {
      if (resumeTimerRef.current !== null)
        window.clearTimeout(resumeTimerRef.current);
      if (wheelIdleRef.current !== null)
        window.clearTimeout(wheelIdleRef.current);
      if (snapAnimRef.current !== null)
        cancelAnimationFrame(snapAnimRef.current);
    },
    [],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const totalItems = texts.length;
    const maxRank = (totalItems - 1) * 2;
    const lastDelay = maxRank * 80 + 600;
    const timer = window.setTimeout(() => {
      setEntryDone(true);
      setIsPlaying(true);
    }, lastDelay);
    return () => window.clearTimeout(timer);
  }, [inView]);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      return;
    }

    const animate = () => {
      if (phase === "paused") {
        timerRef.current = window.setTimeout(() => {
          setPhase("moving");
          startTimeRef.current = Date.now();
        }, controls.pauseDuration);
        return;
      }

      const animateMove = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const progress = Math.min(elapsed / controls.moveDuration, 1);
        setStepProgress(progress);

        if (progress < 1) {
          timerRef.current = window.setTimeout(animateMove, 16);
          return;
        }

        setCurrentIndex((previousIndex) => (previousIndex + 1) % itemCount);
        setStepProgress(0);
        setPhase("paused");
      };

      startTimeRef.current = Date.now();
      animateMove();
    };

    animate();

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [
    controls.moveDuration,
    controls.pauseDuration,
    isPlaying,
    itemCount,
    phase,
  ]);

  // const reset = useCallback(() => {
  //   setCurrentIndex(0);
  //   setStepProgress(0);
  //   setPhase("paused");
  //   setIsPlaying(false);
  //   if (timerRef.current !== null) {
  //     window.clearTimeout(timerRef.current);
  //   }
  // }, []);

  const pixelsPerStep = 120;

  const snapToNearest = useCallback(() => {
    // Cancel any existing snap animation
    if (snapAnimRef.current !== null) {
      cancelAnimationFrame(snapAnimRef.current);
    }

    const progress = Math.abs(scrubAccumRef.current) / pixelsPerStep;
    const dir = scrubAccumRef.current >= 0 ? 1 : -1;
    const shouldCommit = progress >= 0.5;

    scrubAccumRef.current = 0;

    if (progress < 0.01) {
      setStepProgress(0);
      setPhase("paused");
      setIsScrubbing(false);
    } else if (shouldCommit) {
      // Animate forward to 1, then commit
      const startProgress = progress;
      const duration = (1 - startProgress) * 250;
      const start = performance.now();

      const animate = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = startProgress + (1 - startProgress) * eased;
        setStepProgress(current);

        if (t < 1) {
          snapAnimRef.current = requestAnimationFrame(animate);
        } else {
          snapAnimRef.current = null;
          setCurrentIndex(
            (prev) => (((prev + dir) % itemCount) + itemCount) % itemCount,
          );
          playClick();
          setStepProgress(0);
          setPhase("paused");
          setIsScrubbing(false);
        }
      };

      snapAnimRef.current = requestAnimationFrame(animate);
    } else {
      // Animate back to 0
      const startProgress = progress;
      const duration = 200 + startProgress * 100;
      const start = performance.now();

      const animate = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = startProgress * (1 - eased);
        setStepProgress(current);

        if (t < 1) {
          snapAnimRef.current = requestAnimationFrame(animate);
        } else {
          snapAnimRef.current = null;
          setStepProgress(0);
          setPhase("paused");
          setIsScrubbing(false);
        }
      };

      snapAnimRef.current = requestAnimationFrame(animate);
    }

    // Resume auto-play after settling
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = window.setTimeout(() => {
      setIsPlaying(true);
    }, 1000);
  }, [itemCount, playClick]);

  const applyScrubDelta = useCallback(
    (deltaPixels: number) => {
      // Pause auto-play on first interaction
      setIsPlaying(false);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      // Cancel any in-flight snap animation
      if (snapAnimRef.current !== null) {
        cancelAnimationFrame(snapAnimRef.current);
        snapAnimRef.current = null;
      }

      setIsScrubbing(true);
      scrubAccumRef.current += deltaPixels;
      const dir = scrubAccumRef.current >= 0 ? 1 : -1;
      setScrubDirection(dir as 1 | -1);
      const progress = Math.abs(scrubAccumRef.current) / pixelsPerStep;

      if (progress >= 1) {
        // Commit step
        setCurrentIndex(
          (prev) => (((prev + dir) % itemCount) + itemCount) % itemCount,
        );
        playClick();
        scrubAccumRef.current = 0;
        setStepProgress(0);
        setPhase("paused");
      } else {
        setPhase("moving");
        setStepProgress(progress);
      }
    },
    [itemCount, playClick],
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!entryDone) return;
      e.preventDefault();
      applyScrubDelta(e.deltaY);
      // Snap back after scroll stops (short debounce)
      if (wheelIdleRef.current !== null) {
        window.clearTimeout(wheelIdleRef.current);
      }
      wheelIdleRef.current = window.setTimeout(() => {
        wheelIdleRef.current = null;
        snapToNearest();
      }, 150);
    },
    [entryDone, applyScrubDelta, snapToNearest],
  );

  const isDraggingRef = useRef(false);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!entryDone) return;
      isDraggingRef.current = true;
      pointerStartYRef.current = e.clientY;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [entryDone],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaY = e.clientY - (pointerStartYRef.current ?? e.clientY);
      pointerStartYRef.current = e.clientY;
      applyScrubDelta(deltaY);
    },
    [applyScrubDelta],
  );

  const handlePointerUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    pointerStartYRef.current = null;
    snapToNearest();
  }, [snapToNearest]);

  const autoGap = controls.arcSpan / itemCount;
  const startAngle = -controls.arcSpan / 2;
  const endAngle = controls.arcSpan / 2;
  const focusAngle = 0;
  const maxArcRadius = Math.max(
    controls.outerArcRadius,
    controls.innerArcRadius,
  );
  const showInnerArc = controls.showInnerArc > 0.5;

  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const rawEasedProgress =
    phase === "moving" ? easeInOutCubic(stepProgress) : 0;
  // Scrubbing uses linear progress for 1:1 feel, auto-play uses eased
  const easedStepProgress = isScrubbing
    ? stepProgress * scrubDirection
    : rawEasedProgress;
  const dotMotionBlend = Math.sin(Math.abs(easedStepProgress) * Math.PI);
  const dotScale = 1 + dotMotionBlend * 0.32;
  const dotGlowOpacity = 0.5 + dotMotionBlend * 0.25;
  const dotGlowBlur = 10 + dotMotionBlend * 8;

  const getItemDataForSteps = useCallback(
    (stepsFromFocus: number, index: number) => {
      const easedProgress = easedStepProgress;
      const interpolatedSteps = stepsFromFocus - easedProgress;
      const angle = focusAngle + interpolatedSteps * autoGap;
      const isVisible =
        angle >= startAngle - autoGap * 2 && angle <= endAngle + autoGap * 2;
      const angleRad = (angle * Math.PI) / 180;
      const x = Math.cos(angleRad) * controls.radius;
      const y = Math.sin(angleRad) * controls.radius;
      const distFromFocus = Math.abs(interpolatedSteps);
      const maxDist = itemCount / 2;
      const normalizedDist = distFromFocus / maxDist;
      const fadeStart = 1 - controls.edgeFade * 2;

      let opacity = 1;
      if (normalizedDist > fadeStart) {
        opacity = 1 - (normalizedDist - fadeStart) / (1 - fadeStart);
      }
      opacity = Math.max(0, Math.min(1, opacity));

      const blur = distFromFocus * (controls.maxBlur / (maxDist * 0.5));
      const isFocused = distFromFocus < 0.5;
      const arcScale = Math.max(
        0.55,
        1 - distFromFocus * controls.scaleFalloff,
      );
      const focusBlend = Math.max(0, 1 - Math.min(distFromFocus, 1));
      const smoothFocusBlend = focusBlend * focusBlend * (3 - 2 * focusBlend);
      const scale =
        arcScale + (controls.focusScale - arcScale) * smoothFocusBlend;

      const tangentRotation = angle;
      const straightRotation = -controls.tiltAngle;
      const isCurrentFocusItem = index === currentIndex;
      const nextIndex = (currentIndex + 1) % itemCount;
      const prevIndex = (currentIndex - 1 + itemCount) % itemCount;
      const isNextFocusItem =
        isScrubbing && scrubDirection === -1
          ? index === prevIndex
          : index === nextIndex;

      let textRotation = tangentRotation;
      if (phase === "paused" && isCurrentFocusItem) {
        textRotation = straightRotation;
      } else if (phase === "moving") {
        const t = easeInOutCubic(stepProgress);
        if (isCurrentFocusItem) {
          textRotation =
            straightRotation + (tangentRotation - straightRotation) * t;
        } else if (isNextFocusItem) {
          textRotation =
            tangentRotation + (straightRotation - tangentRotation) * t;
        }
      }

      return {
        x,
        y,
        angle,
        textRotation,
        opacity,
        scale,
        blur: Math.max(0, blur),
        isFocused,
        isVisible,
      };
    },
    [
      autoGap,
      controls.edgeFade,
      controls.focusScale,
      controls.maxBlur,
      controls.radius,
      controls.scaleFalloff,
      controls.tiltAngle,
      currentIndex,
      endAngle,
      itemCount,
      phase,
      startAngle,
      stepProgress,
      easedStepProgress,
      isScrubbing,
      scrubDirection,
    ],
  );

  const renderItems = useMemo(() => {
    const items: Array<{
      text: string;
      index: number;
      key: string;
      data: ReturnType<typeof getItemDataForSteps>;
    }> = [];

    texts.forEach((text, index) => {
      const rawSteps = index - currentIndex;
      for (const offset of [-itemCount, 0, itemCount]) {
        const steps = rawSteps + offset;
        const angle = focusAngle + steps * autoGap;
        if (
          angle >= startAngle - autoGap * 2 &&
          angle <= endAngle + autoGap * 2
        ) {
          const data = getItemDataForSteps(steps, index);
          if (data.isVisible && data.opacity > 0.01) {
            items.push({ text, index, key: `${index}-${offset}`, data });
          }
        }
      }
    });

    return items;
  }, [
    autoGap,
    currentIndex,
    endAngle,
    getItemDataForSteps,
    itemCount,
    startAngle,
  ]);

  return (
    <div
      className={
        "h-[520px] w-[480px] overflow-visible cursor-grab select-none active:cursor-grabbing " +
        className
      }
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      ref={containerRef}
    >
      <div className="absolute inset-0"></div>
      <div className="relative xl:overflow-hidden h-full w-full cursor-grab select-none active:cursor-grabbing ">
        <div className="absolute left-0 top-1/2 hidden h-[248px] w-[248px] -translate-y-1/2 mix-blend-overlay">
          <Image
            src="/images/ellipse-glow-2.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute left-0 top-1/2 hidden h-[248px] w-[248px] -translate-y-1/2 mix-blend-overlay">
          <Image
            src="/images/ellipse-glow-2.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div className="absolute inset-0 overflow-visible">
          <div
            className="absolute"
            style={{
              left: `calc(50% + ${controls.offsetX}px)`,
              top: `calc(50% + ${controls.offsetY}px)`,
              transform: `rotate(${controls.tiltAngle}deg)`,
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute mix-blend-screen transition-opacity duration-700 ease-out"
              style={{
                left: -maxArcRadius,
                top: -maxArcRadius,
                width: maxArcRadius * 2,
                height: maxArcRadius * 2,
                overflow: "visible",
                opacity: inView ? 1 : 0,
              }}
            >
              <svg
                className="absolute inset-0"
                style={{
                  overflow: "visible",
                }}
              >
                <defs>
                  <linearGradient
                    id="rotating-arc-stroke-gradient"
                    x1={maxArcRadius}
                    y1={0}
                    x2={maxArcRadius}
                    y2={maxArcRadius * 2 * 0.786}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#ECE4FD" stopOpacity="0.95" />
                    <stop offset="1" stopColor="#ECE4FD" stopOpacity="0" />
                  </linearGradient>
                  <filter
                    id="rotating-arc-soft-glow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feGaussianBlur stdDeviation="2" />
                  </filter>
                </defs>
                <circle
                  cx={maxArcRadius}
                  cy={maxArcRadius}
                  r={controls.outerArcRadius}
                  fill="none"
                  stroke="url(#rotating-arc-stroke-gradient)"
                  strokeWidth="2.5"
                  strokeOpacity={0.2 * controls.outerArcOpacity}
                  filter="url(#rotating-arc-soft-glow)"
                />
                <circle
                  cx={maxArcRadius}
                  cy={maxArcRadius}
                  r={controls.outerArcRadius}
                  fill="none"
                  stroke="url(#rotating-arc-stroke-gradient)"
                  strokeWidth="1"
                  strokeOpacity={controls.outerArcOpacity}
                />
                {showInnerArc ? (
                  <>
                    <path
                      d={describeArc(
                        maxArcRadius,
                        maxArcRadius,
                        controls.innerArcRadius,
                        startAngle,
                        endAngle,
                      )}
                      fill="none"
                      stroke="url(#rotating-arc-stroke-gradient)"
                      strokeWidth="2.75"
                      strokeLinecap="round"
                      strokeOpacity={0.22 * controls.innerArcOpacity}
                      filter="url(#rotating-arc-soft-glow)"
                    />
                    <path
                      d={describeArc(
                        maxArcRadius,
                        maxArcRadius,
                        controls.innerArcRadius,
                        startAngle,
                        endAngle,
                      )}
                      fill="none"
                      stroke="url(#rotating-arc-stroke-gradient)"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeOpacity={controls.innerArcOpacity}
                    />
                  </>
                ) : null}
              </svg>
            </div>

            {(() => {
              const dotAngleRad = (focusAngle * Math.PI) / 180;
              const dotX = Math.cos(dotAngleRad) * controls.radius;
              const dotY = Math.sin(dotAngleRad) * controls.radius;
              const straightRotation = -controls.tiltAngle;

              return (
                <div
                  className="absolute z-10 transition-opacity duration-500 ease-out"
                  style={{
                    left: dotX,
                    top: dotY,
                    transform: `translate(-50%, -50%) rotate(${straightRotation}deg) scale(${dotScale})`,
                    transformOrigin: "center center",
                    opacity: inView ? 1 : 0,
                    transitionDelay: "200ms",
                  }}
                >
                  <span
                    className="block h-2 w-2 rounded-full bg-white"
                    style={{
                      boxShadow: `0 0 ${dotGlowBlur}px rgba(255,255,255,${dotGlowOpacity})`,
                    }}
                  />
                </div>
              );
            })()}

            {mounted &&
              renderItems.map(({ text, key, data }) => {
                const dotGap = 16;
                const stepsFromFocus = Math.round(
                  Math.abs(data.angle) / autoGap,
                );
                // Fan out from focused: down (positive angle) first, then up (negative angle)
                const entryRank =
                  stepsFromFocus === 0
                    ? 0
                    : (stepsFromFocus - 1) * 2 + 1 + (data.angle < 0 ? 1 : 0);
                const entryDelay = entryRank * 80;
                // const showItem = inView && entryDone ? true : inView;
                // const entryOpacity = !inView
                //   ? 0
                //   : entryDone
                //     ? data.opacity
                //     : data.opacity;
                const entryTranslateX = !inView ? -12 : 0;

                return (
                  <div
                    key={key}
                    className="absolute"
                    style={{
                      left: data.x,
                      top: data.y,
                      transform: `translate(${dotGap + entryTranslateX}px, -50%) rotate(${data.textRotation}deg)`,
                      transformOrigin: "left center",
                      width: 0,
                      height: 0,
                      overflow: "visible",
                      transition: !entryDone
                        ? `transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${entryDelay}ms, opacity 600ms ease-out ${entryDelay}ms`
                        : undefined,
                      opacity: !inView ? 0 : 1,
                    }}
                  >
                    <span
                      className="inline-block whitespace-nowrap transition-[color,font-weight] duration-300"
                      style={{
                        transform: `translateY(-50%) scale(${data.scale})`,
                        transformOrigin: "left center",
                        opacity: !inView ? 0 : data.opacity,
                        filter: !inView
                          ? "blur(6px)"
                          : data.blur > 0.1
                            ? `blur(${data.blur}px)`
                            : "none",
                        fontSize: `${controls.fontSize}px`,
                        fontFamily:
                          '"ABC Diatype", system-ui, -apple-system, sans-serif',
                        fontWeight: 500,
                        color: data.isFocused
                          ? "#ffffff"
                          : "rgba(255,255,255,0.4)",
                        transition: !entryDone
                          ? `opacity 600ms ease-out ${entryDelay}ms, filter 600ms ease-out ${entryDelay}ms`
                          : "color 300ms, font-weight 300ms",
                      }}
                    >
                      {text}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
