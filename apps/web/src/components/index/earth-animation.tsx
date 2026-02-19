"use client";

import { useViewportVisibility } from "@/hooks/useViewportVisibility";
import React, { useCallback, useEffect, useRef, useState } from "react";

export type EarthAnimationProps = {
  dotSize?: number;
  gap?: number;
  lapSeconds?: number;
  dotColor?: string;
  className?: string;
};

type Dot = {
  elem: SVGCircleElement;
  subIdx: number;
  offset: number;
  length: number;
  baseR: number;
};

type Subpath = {
  path: SVGPathElement;
  length: number;
};

type Cursor = {
  x: number;
  y: number;
  inside: boolean;
};

const DEFAULTS = {
  dotSize: 1.5,
  gap: 490,
  lapSeconds: 22,
  dotColor: "#ffffff",
};

const BASE_PATH_D =
  "M877.37 1828.27C848.544 1827.11 841.576 1417.29 861.806 912.906C882.036 408.524 921.803 0.578102 950.63 1.73426M950.63 1.73426C950.63 1.73426 950.63 1.73426 950.63 1.73426ZM736.907 1811.68C604.832 1785.59 577.05 1362.99 674.856 867.769C772.661 372.547 959.017 -7.76424 1091.09 18.3205M1091.09 18.3205C1091.09 18.3205 1091.09 18.3205 1091.09 18.3205ZM584.21 1767.43C368.557 1684 341.387 1234.72 523.524 763.932C705.662 293.149 1028.14 -20.8613 1243.79 62.5712M1243.79 62.5712C1243.79 62.5712 1243.79 62.5712 1243.79 62.5712ZM410.624 1677.89C150.141 1506.02 164.347 1025.13 442.354 603.797C720.361 182.462 1156.89 -19.7675 1417.38 152.105M1417.38 152.105C1417.38 152.105 1417.38 152.105 1417.38 152.105ZM217.703 1507.09C-23.054 1223.95 93.5168 729.345 478.071 402.345C862.625 75.3447 1369.54 39.782 1610.3 322.914M1610.3 322.914C1610.3 322.914 1610.3 322.914 1610.3 322.914ZM48.3578 1208.36C-81.9226 823.928 200.026 380.944 678.106 218.927C1156.19 56.909 1649.36 237.21 1779.64 621.641M1779.64 621.641C1779.64 621.641 1779.64 621.641 1779.64 621.641ZM6.71757 804.39C56.6369 394.925 503.309 112.511 1004.39 173.599C1505.47 234.687 1871.2 616.146 1821.28 1025.61M130.361 444.568C331.594 109.357 845.573 48.2331 1278.37 308.045C1711.16 567.858 1898.87 1050.22 1697.64 1385.43M321.903 218.712C583.057 -3.36378 1059.86 128.347 1386.86 512.896C1713.87 897.446 1767.25 1389.21 1506.1 1611.29M506.162 97.0368C748.941 -24.0137 1128.35 244.07 1353.59 695.819C1578.83 1147.57 1564.62 1611.91 1321.84 1732.96M667.761 34.7942C842.329 -14.0417 1094.09 340.451 1230.08 826.575C1366.08 1312.7 1334.81 1746.37 1160.24 1795.21M812.724 6.62831C891.142 -2.11469 1000.06 397.49 1055.99 899.169C1111.92 1400.85 1093.69 1814.63 1015.28 1823.37M1057.33 1817.7C963.541 1832.59 864.459 1832.59 770.668 1817.7M1375.42 1703.99C1125.48 1850.16 716.292 1852.44 461.459 1709.08C458.472 1707.4 455.514 1705.7 452.584 1703.99M1550.6 1570.85C1342.85 1772.51 889.41 1839.39 537.823 1720.23C430.439 1683.83 340.851 1632.44 277.396 1570.85M1674.79 1421.56C1514.32 1662.56 1043.62 1783.32 623.451 1691.28C406.932 1643.85 235.903 1545.75 153.214 1421.56M1760.47 1259.8C1651.25 1527.95 1183.72 1694.54 716.232 1631.89C394.209 1588.73 142.768 1444.51 67.5304 1259.8M1811.18 1089.55C1755.89 1373.76 1309.38 1578.45 813.883 1546.73C394.584 1519.89 63.6113 1330.05 16.8215 1089.55M1828 915C1828 1204.54 1418.79 1439.26 914 1439.26C409.212 1439.26 0 1204.54 0 915M1828 915C1828 1419.79 1418.79 1829 914 1829C409.212 1829 0 1419.79 0 915M1828 915C1828 410.212 1418.79 1 914 1C409.212 1 0 410.212 0 915M0 915C0 915 0 915 0 915ZM1811.18 740.451C1866.47 1024.66 1509.61 1280.77 1014.12 1312.49C518.619 1344.2 72.1144 1139.51 16.8216 855.302C9.39658 817.137 9.39659 778.616 16.8216 740.451M1760.47 570.2C1869.69 838.348 1579.26 1106.51 1111.77 1169.16C644.275 1231.81 176.754 1065.22 67.5304 797.074C37.1356 722.454 37.1356 644.82 67.5304 570.2M1674.79 408.44C1835.25 649.444 1624.72 919.431 1204.55 1011.47C784.379 1103.51 313.68 982.755 153.214 741.75C81.7555 634.427 81.7555 515.763 153.214 408.44M1550.6 259.152C1758.36 460.818 1641.76 720.904 1290.18 840.071C938.59 959.238 485.152 892.359 277.396 690.693C140.279 557.596 140.279 392.248 277.396 259.152M1375.42 126.012C1625.35 272.182 1621.37 506.891 1366.54 650.249C1111.71 793.608 702.516 791.329 452.584 645.159C206.078 500.992 206.078 270.179 452.584 126.012M1057.33 12.2997C1343.28 57.7056 1510.92 227.479 1431.76 391.499C1352.6 555.52 1056.62 651.676 770.667 606.27C484.715 560.864 317.077 391.091 396.237 227.07C446.599 122.72 588.744 41.187 770.667 12.2997M1328.95 247.899C1328.95 379.35 1143.17 485.912 914 485.912C684.831 485.912 499.053 379.35 499.053 247.899C499.053 116.448 684.831 9.88583 914 9.88583C1143.17 9.88583 1328.95 116.448 1328.95 247.899ZM1196.44 202.939C1196.44 292.415 1069.99 364.95 914 364.95C758.012 364.95 631.558 292.415 631.558 202.939C631.558 113.463 758.012 40.9283 914 40.9283C1069.99 40.9283 1196.44 113.463 1196.44 202.939ZM1056.98 175.513C1056.98 220.811 992.966 257.532 914 257.532C835.034 257.532 771.019 220.811 771.019 175.513C771.019 130.215 835.034 93.4931 914 93.4931C992.966 93.4931 1056.98 130.215 1056.98 175.513Z";

const INFLUENCE_RADIUS = 120;
const SPEED_BOOST = 3.0;
const SIZE_BOOST = 2.0;
const GLOW_BOOST = 1.8;

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  const s =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(s, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function svgPoint(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
): DOMPoint {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  return pt.matrixTransform(svg.getScreenCTM()?.inverse() || new DOMMatrix());
}

export const EarthAnimation: React.FC<EarthAnimationProps> = ({
  dotSize = DEFAULTS.dotSize,
  gap = DEFAULTS.gap,
  lapSeconds = DEFAULTS.lapSeconds,
  dotColor = DEFAULTS.dotColor,
  className,
}) => {
  const stackRef = useRef<HTMLDivElement>(null);
  const basePathRef = useRef<SVGPathElement>(null);
  const glowSvgRef = useRef<SVGSVGElement>(null);
  const dotLayerRef = useRef<SVGGElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTRef = useRef<number>(performance.now());
  const dotsRef = useRef<Dot[]>([]);
  const subpathsRef = useRef<Subpath[]>([]);
  const cursorRef = useRef<Cursor>({ x: Infinity, y: Infinity, inside: false });
  const [ready, setReady] = useState(false);

  // Initialize subpaths
  const viewportHandler = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return;
      if (!glowSvgRef.current || !basePathRef.current) return;
      if (ready) return;

      const glowSVG = glowSvgRef.current;
      const d = BASE_PATH_D;
      const subDs = (d.match(/M[^M]+/g) || []).map((s) => s.trim());

      const subpaths: Subpath[] = subDs.map((sd) => {
        const p = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        p.setAttribute("d", sd);
        p.setAttribute("fill", "none");
        p.setAttribute("stroke", "none");
        glowSVG.appendChild(p);
        return { path: p, length: p.getTotalLength() };
      });

      subpathsRef.current = subpaths;

      setReady(true);

      return () => {
        subpaths.forEach((sp) => {
          if (sp.path.parentNode) {
            sp.path.parentNode.removeChild(sp.path);
          }
        });
      };
    },
    [ready],
  );

  const { ref: divRef } = useViewportVisibility<HTMLDivElement>(
    viewportHandler,
    {
      topOffset: 100,
      bottomOffset: 100,
    },
  );

  // Rebuild dots when config changes
  useEffect(() => {
    if (!dotLayerRef.current || subpathsRef.current.length === 0) return;

    const dotLayer = dotLayerRef.current;
    const subpaths = subpathsRef.current;
    const dots: Dot[] = [];

    // Clear existing dots
    while (dotLayer.firstChild) {
      dotLayer.removeChild(dotLayer.firstChild);
    }

    subpaths.forEach((sp, subIdx) => {
      const L = sp.length;
      if (!isFinite(L) || L <= 1) return;

      const count = Math.max(1, Math.floor(L / gap));
      for (let i = 0; i < count; i++) {
        const offset = (i * gap) % L;
        const c = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle",
        );
        c.setAttribute("r", dotSize.toString());
        c.setAttribute("class", "dot");
        c.setAttribute("fill", dotColor);
        dotLayer.appendChild(c);
        dots.push({ elem: c, subIdx, offset, length: L, baseR: dotSize });
      }
    });

    // Update dot styles
    const { r, g, b } = hexToRgb(dotColor);
    dotLayer.querySelectorAll(".dot").forEach((c) => {
      c.setAttribute("fill", dotColor);
      (c as HTMLElement).style.filter =
        `drop-shadow(0 0 6px rgba(${r},${g},${b},0.95))`;
    });

    dotsRef.current = dots;
  }, [dotSize, gap, dotColor, ready]);

  // Animation loop
  useEffect(() => {
    if (!glowSvgRef.current || dotsRef.current.length === 0) return;

    const BASE_LAP = lapSeconds;

    function tick(now: number) {
      const dt = (now - lastTRef.current) / 1000;
      lastTRef.current = now;

      const { r, g, b } = hexToRgb(dotColor);

      dotsRef.current.forEach((d) => {
        const sp = subpathsRef.current[d.subIdx];
        if (!sp) return;

        const baseSpeed = sp.length / BASE_LAP;

        let speed = baseSpeed;
        let grow = 1.0;
        let glowM = 1.0;

        if (cursorRef.current.inside) {
          const pt = sp.path.getPointAtLength(d.offset);
          const dx = pt.x - cursorRef.current.x;
          const dy = pt.y - cursorRef.current.y;
          const dist = Math.hypot(dx, dy);

          if (dist < INFLUENCE_RADIUS) {
            const t = 1 - dist / INFLUENCE_RADIUS;
            const influence = t * t;
            speed *= 1 + SPEED_BOOST * influence;
            grow *= 1 + (SIZE_BOOST - 1) * influence;
            glowM *= 1 + (GLOW_BOOST - 1) * influence;
          }
        }

        d.offset = (d.offset + speed * dt) % d.length;

        const pt2 = sp.path.getPointAtLength(d.offset);
        d.elem.setAttribute("cx", pt2.x.toString());
        d.elem.setAttribute("cy", pt2.y.toString());
        d.elem.setAttribute("r", (d.baseR * grow).toFixed(3));

        const blur = (6 * glowM).toFixed(2);
        d.elem.style.filter = `drop-shadow(0 0 ${blur}px rgba(${r},${g},${b},0.95))`;
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    }

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [lapSeconds, dotColor, ready]);

  // Cursor tracking
  useEffect(() => {
    const stack = stackRef.current;
    const glowSVG = glowSvgRef.current;
    if (!stack || !glowSVG) return;

    const handlePointerMove = (e: PointerEvent) => {
      const p = svgPoint(glowSVG, e.clientX, e.clientY);
      cursorRef.current = { x: p.x, y: p.y, inside: true };
    };

    const handlePointerLeave = () => {
      cursorRef.current = { x: Infinity, y: Infinity, inside: false };
    };

    stack.addEventListener("pointermove", handlePointerMove);
    stack.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      stack.removeEventListener("pointermove", handlePointerMove);
      stack.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [ready]);

  return (
    <div className={className} ref={divRef}>
      <div
        ref={stackRef}
        className="relative w-full"
        style={{ aspectRatio: "1828 / 790" }}
      >
        {/* Base SVG (overlay) */}
        <svg
          id="earthBase"
          viewBox="0 0 1828 790"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full block"
          style={{
            maskImage:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 1))",
          }}
        >
          <g>
            <path
              ref={basePathRef}
              id="earthBasePath"
              d={BASE_PATH_D}
              stroke="#ffffff"
              strokeOpacity={1}
              strokeWidth={1}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ vectorEffect: "non-scaling-stroke" }}
            />
          </g>
        </svg>

        {/* Glow SVG (dots only, on top) */}
        <svg
          ref={glowSvgRef}
          id="earthGlow"
          viewBox="0 0 1828 790"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full block pointer-events-none"
          style={{
            maskImage:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 1))",
          }}
        >
          <g ref={dotLayerRef} id="dotLayer" />
        </svg>
      </div>
    </div>
  );
};
