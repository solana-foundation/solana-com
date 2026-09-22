"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import type {
  AlpenglowEvent,
  BlockConfirmed,
  TransactionObserved,
} from "./types";
import { shouldRenderSignature, signatureSeed } from "./types";

const COHORT_SIZE = 32;
const MAX_GLYPHS = 280;
const FINAL_CELLS = 1_260;

type Glyph = TransactionObserved & { born: number; confirmedAt?: number };
type WaitingBlock = BlockConfirmed & {
  lane: number;
  seed: number;
  finalizedAt?: number;
  finalityMs?: number;
};
type Cell = {
  x: number;
  y: number;
  blockhash?: string;
  slot?: number;
  born?: number;
  fromY?: number;
};

export type Inspection = {
  kind: "transaction" | "block" | "final";
  title: string;
  lines: string[];
  href: string;
};

export type ArtworkTelemetry = {
  holding: number;
  rendered: number;
  finalizedBlocks: number;
  form: number;
  progress: number;
  currentFinalityMs: number;
  medianFinalityMs: number;
  firstSlot?: number;
  lastSlot?: number;
  transactions: number;
};

const EMPTY_FALLBACK_TELEMETRY: ArtworkTelemetry = {
  holding: 0,
  rendered: 0,
  finalizedBlocks: 0,
  form: 147,
  progress: 0,
  currentFinalityMs: 0,
  medianFinalityMs: 0,
  transactions: 0,
};

export type FinalFormCanvasHandle = {
  push: (_event: AlpenglowEvent) => void;
  setPaused: (_paused: boolean) => void;
};

type Props = {
  onInspect: (_inspection: Inspection | null) => void;
  onTelemetry: (_telemetry: ArtworkTelemetry) => void;
};

function makeMask() {
  const points: Array<{ x: number; y: number }> = [];
  for (let row = 0; row < 54; row += 1) {
    for (let column = 0; column < 74; column += 1) {
      const x = -0.72 + (column / 73) * 1.44;
      const y = -0.62 + (row / 53) * 1.24;
      const top =
        y > 0.25 && y < 0.51 && x > -0.59 + y * 0.34 && x < 0.59 + y * 0.34;
      const middle =
        y > -0.13 && y < 0.13 && x > -0.59 - y * 0.34 && x < 0.59 - y * 0.34;
      const bottom =
        y > -0.51 && y < -0.25 && x > -0.59 + y * 0.34 && x < 0.59 + y * 0.34;
      if (top || middle || bottom) points.push({ x, y });
    }
  }
  return points.slice(0, FINAL_CELLS);
}

function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

function formatSignature(signature: string) {
  return `${signature.slice(0, 7)}…${signature.slice(-6)}`;
}

function mountCanvasFallback(host: HTMLDivElement, getProgress: () => number) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);
  const context = canvas.getContext("2d");
  const fallbackMask = makeMask();
  let frame = 0;

  function draw(now: number) {
    if (!context) return;
    const ratio = Math.min(window.devicePixelRatio, 1.5);
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.fillStyle = "#050505";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "rgba(115,119,122,.35)";
    context.lineWidth = 1;
    const portrait = width < 720;
    const boundaries = portrait
      ? [height * 0.39, height * 0.62]
      : [width / 3, (width / 3) * 2];
    boundaries.forEach((position) => {
      context.beginPath();
      if (portrait) {
        context.moveTo(0, position);
        context.lineTo(width, position);
      } else {
        context.moveTo(position, height * 0.27);
        context.lineTo(position, height * 0.82);
      }
      context.stroke();
    });
    context.strokeStyle = "rgba(183,186,184,.75)";
    for (let index = 0; index < 75; index += 1) {
      const seed = signatureSeed(`fallback-${index}`);
      const phase = (now * 0.00008 * (1 + (seed % 5))) % 1;
      const x = portrait
        ? width * (0.15 + (seed % 700) / 1_000)
        : width * (0.03 + phase * 0.27);
      const y = portrait
        ? height * (0.23 + phase * 0.12)
        : height * (0.39 + (seed % 440) / 1_000);
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + 5 + (seed % 13), y + ((seed % 3) - 1) * 4);
      context.stroke();
    }
    for (let lane = 0; lane < 7; lane += 1) {
      context.beginPath();
      for (let point = 0; point < 42; point += 1) {
        const unit = point / 41;
        const x = portrait
          ? width * (0.15 + unit * 0.7)
          : width * (0.36 + unit * 0.27);
        const y = portrait
          ? height *
            (0.43 + lane * 0.025 + Math.sin(point * 0.7 + now * 0.002) * 0.008)
          : height *
            (0.4 + lane * 0.045 + Math.sin(point * 0.7 + now * 0.002) * 0.012);
        if (point === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
    }
    context.fillStyle = "#f1f1ec";
    const visibleFallbackCells = Math.floor(
      fallbackMask.length * getProgress(),
    );
    fallbackMask.forEach((point, index) => {
      if (index >= visibleFallbackCells) return;
      const x = portrait
        ? width * (0.5 + point.x * 0.32)
        : width * (0.83 + point.x * 0.15);
      const y = portrait
        ? height * (0.79 + point.y * 0.13)
        : height * (0.55 + point.y * 0.25);
      context.fillRect(x, y, 2, 2);
    });
    frame = requestAnimationFrame(draw);
  }
  frame = requestAnimationFrame(draw);
  return () => {
    cancelAnimationFrame(frame);
    canvas.remove();
  };
}

export const FinalFormCanvas = forwardRef<FinalFormCanvasHandle, Props>(
  function FinalFormCanvas({ onInspect, onTelemetry }, ref) {
    const hostRef = useRef<HTMLDivElement>(null);
    const runtimeRef = useRef<{
      push: (_event: AlpenglowEvent) => void;
      paused: boolean;
    } | null>(null);

    useImperativeHandle(ref, () => ({
      push(event) {
        runtimeRef.current?.push(event);
      },
      setPaused(paused) {
        if (runtimeRef.current) runtimeRef.current.paused = paused;
      },
    }));

    useEffect(() => {
      const host = hostRef.current;
      if (!host) return;
      const hostElement = host;

      const scene = new THREE.Scene();
      const artwork = new THREE.Group();
      scene.add(artwork);
      const camera = new THREE.OrthographicCamera(-1.65, 1.65, 1, -1, 0.1, 10);
      camera.position.z = 2;
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        const holding = new Map<string, BlockConfirmed>();
        let finalized = 0;
        let currentFinalityMs = 0;
        let fallbackPaused = false;
        runtimeRef.current = {
          push(event) {
            if (event.type === "block_confirmed") {
              holding.set(event.blockhash, event);
            }
            if (event.type === "block_finalized") {
              const block = holding.get(event.blockhash);
              if (block) {
                holding.delete(event.blockhash);
                finalized = Math.min(COHORT_SIZE, finalized + 1);
                currentFinalityMs = event.observedFinalityMs;
                onTelemetry({
                  ...EMPTY_FALLBACK_TELEMETRY,
                  holding: holding.size,
                  finalizedBlocks: finalized,
                  progress: finalized / COHORT_SIZE,
                  currentFinalityMs,
                  medianFinalityMs: currentFinalityMs,
                });
              }
            }
          },
          get paused() {
            return fallbackPaused;
          },
          set paused(value: boolean) {
            fallbackPaused = value;
          },
        };
        const cleanup = mountCanvasFallback(
          hostElement,
          () => finalized / COHORT_SIZE,
        );
        return () => {
          runtimeRef.current = null;
          cleanup();
        };
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0x050505, 1);
      host.appendChild(renderer.domElement);

      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xb7bab8,
        transparent: true,
        opacity: 0.76,
      });
      const dimMaterial = new THREE.LineBasicMaterial({
        color: 0x73777a,
        transparent: true,
        opacity: 0.3,
      });
      const waveMaterial = new THREE.LineBasicMaterial({
        color: 0xb7bab8,
        transparent: true,
        opacity: 0.68,
      });
      const dividerMaterial = new THREE.LineBasicMaterial({
        color: 0x73777a,
        transparent: true,
        opacity: 0.25,
      });
      const glyphGeometry = new THREE.BufferGeometry();
      const relationGeometry = new THREE.BufferGeometry();
      const waveGeometry = new THREE.BufferGeometry();
      const glyphLines = new THREE.LineSegments(glyphGeometry, lineMaterial);
      const relationLines = new THREE.LineSegments(
        relationGeometry,
        dimMaterial,
      );
      const waveLines = new THREE.LineSegments(waveGeometry, waveMaterial);
      artwork.add(glyphLines, relationLines, waveLines);

      const dividers = new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-0.43, -0.82, 0),
          new THREE.Vector3(-0.43, 0.82, 0),
          new THREE.Vector3(0.42, -0.82, 0),
          new THREE.Vector3(0.42, 0.82, 0),
        ]),
        dividerMaterial,
      );
      artwork.add(dividers);

      const cellGeometry = new THREE.PlaneGeometry(0.012, 0.012);
      const cellMaterial = new THREE.MeshBasicMaterial({
        color: 0xf1f1ec,
        transparent: true,
      });
      const cellsMesh = new THREE.InstancedMesh(
        cellGeometry,
        cellMaterial,
        FINAL_CELLS,
      );
      cellsMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      artwork.add(cellsMesh);

      const flashMaterial = new THREE.LineBasicMaterial({
        color: 0x66e6d1,
        transparent: true,
        opacity: 0,
      });
      const flash = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0.42, -0.78, 0.2),
          new THREE.Vector3(0.42, 0.78, 0.2),
        ]),
        flashMaterial,
      );
      artwork.add(flash);

      const mask = makeMask();
      const cells: Cell[] = mask.map(({ x, y }) => ({ x, y }));
      const shuffled = cells.map((_, index) => index);
      const glyphs = new Map<string, Glyph>();
      const blocks = new Map<string, WaitingBlock>();
      const finalityValues: number[] = [];
      const cohort: WaitingBlock[] = [];
      const buffered: WaitingBlock[] = [];
      const pointer = new THREE.Vector2(99, 99);
      const temp = new THREE.Object3D();
      let finalBlocks = 0;
      let cohortTransactions = 0;
      let form = 147;
      let cycleState: "forming" | "holding" | "dissolving" = "forming";
      let cycleAt = 0;
      let flashAt = 0;
      let paused = false;
      let lastTelemetry = 0;
      let lastFrame = performance.now();
      let reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      function resetMask(seed: number) {
        shuffled.sort((a, b) => {
          const av = signatureSeed(`${seed}:${a}`);
          const bv = signatureSeed(`${seed}:${b}`);
          return av - bv;
        });
        cells.forEach((cell) => {
          delete cell.blockhash;
          delete cell.slot;
          delete cell.born;
          delete cell.fromY;
        });
        cohort.length = 0;
        finalBlocks = 0;
        cohortTransactions = 0;
        cycleState = "forming";
        while (buffered.length && cohort.length < COHORT_SIZE) {
          cohort.push(buffered.shift()!);
        }
        for (const block of [...cohort]) {
          if (block.finalizedAt) crystallize(block, performance.now());
        }
      }

      function assignBlock(block: WaitingBlock) {
        const target = cohort.length < COHORT_SIZE ? cohort : buffered;
        target.push(block);
      }

      function crystallize(block: WaitingBlock, now: number) {
        let cohortIndex = cohort.findIndex(
          (entry) => entry.blockhash === block.blockhash,
        );
        if (cohortIndex < 0 && cohort.length < COHORT_SIZE) {
          cohort.push(block);
          cohortIndex = cohort.length - 1;
        }
        if (cohortIndex < 0) return;
        const start = Math.floor((cohortIndex / COHORT_SIZE) * cells.length);
        const end = Math.floor(
          ((cohortIndex + 1) / COHORT_SIZE) * cells.length,
        );
        for (let index = start; index < end; index += 1) {
          const cell = cells[shuffled[index] ?? index];
          cell.blockhash = block.blockhash;
          cell.slot = block.slot;
          cell.born = now + (index - start) * (reducedMotion ? 0 : 6);
          cell.fromY = -0.68 + block.lane * 0.11;
        }
        finalBlocks += 1;
        cohortTransactions += block.transactionCount;
        flashAt = now;
        if (finalBlocks >= COHORT_SIZE) {
          cycleState = "holding";
          cycleAt = now;
        }
      }

      function push(event: AlpenglowEvent) {
        const now = performance.now();
        if (event.type === "transaction_observed") {
          if (shouldRenderSignature(event.signature, 0.08)) {
            glyphs.set(event.signature, { ...event, born: now });
            while (glyphs.size > MAX_GLYPHS)
              glyphs.delete(glyphs.keys().next().value!);
          }
          return;
        }
        if (event.type === "block_confirmed") {
          const waiting: WaitingBlock = {
            ...event,
            lane: event.slot % 9,
            seed: signatureSeed(event.blockhash),
          };
          blocks.set(event.blockhash, waiting);
          event.transactionSignatures.forEach((signature) => {
            const glyph = glyphs.get(signature);
            if (glyph) glyph.confirmedAt = now;
          });
          assignBlock(waiting);
          return;
        }
        if (event.type === "block_finalized") {
          const block = blocks.get(event.blockhash);
          if (!block) return;
          block.finalizedAt = now;
          block.finalityMs = event.observedFinalityMs;
          finalityValues.push(event.observedFinalityMs);
          if (finalityValues.length > 48) finalityValues.shift();
          crystallize(block, now);
        }
      }

      runtimeRef.current = {
        push,
        get paused() {
          return paused;
        },
        set paused(value: boolean) {
          paused = value;
        },
      };

      function resize() {
        const width = hostElement.clientWidth;
        const height = hostElement.clientHeight;
        renderer.setSize(width, height, false);
        const aspect = width / Math.max(height, 1);
        camera.left = -aspect;
        camera.right = aspect;
        camera.top = 1;
        camera.bottom = -1;
        camera.updateProjectionMatrix();
        const portrait = width < 720;
        artwork.rotation.z = portrait ? -Math.PI / 2 : 0;
        artwork.scale.setScalar(portrait ? 0.78 : 1);
      }

      function pointerPosition(event: PointerEvent) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        pointer.x *= camera.right;
        if (hostElement.clientWidth < 720) {
          const x = pointer.x;
          pointer.x = -pointer.y;
          pointer.y = x;
        }
      }

      function inspect() {
        let closest: { distance: number; value: Inspection } | undefined;
        for (const glyph of glyphs.values()) {
          const seed = signatureSeed(glyph.signature);
          const x =
            -1.2 + Math.min(0.72, (performance.now() - glyph.born) / 5_000);
          const y = -0.7 + ((seed % 1_000) / 1_000) * 1.4;
          const distance = Math.hypot(pointer.x - x, pointer.y - y);
          if (distance < 0.08 && (!closest || distance < closest.distance)) {
            closest = {
              distance,
              value: {
                kind: "transaction",
                title: formatSignature(glyph.signature),
                lines: [
                  `slot ${glyph.slot.toLocaleString()}`,
                  glyph.success ? "successful" : "failed",
                  `${glyph.computeUnits?.toLocaleString() ?? "—"} compute units`,
                ],
                href: `https://explorer.solana.com/tx/${glyph.signature}`,
              },
            };
          }
        }
        for (const block of blocks.values()) {
          if (block.finalizedAt) continue;
          const y = 0.48 - block.lane * 0.12;
          const distance = Math.abs(pointer.y - y) + Math.abs(pointer.x) * 0.15;
          if (
            pointer.x > -0.42 &&
            pointer.x < 0.42 &&
            distance < 0.08 &&
            (!closest || distance < closest.distance)
          ) {
            closest = {
              distance,
              value: {
                kind: "block",
                title: `SLOT ${block.slot.toLocaleString()}`,
                lines: [
                  `${block.transactionCount.toLocaleString()} transactions`,
                  `${((Date.now() - block.confirmedAt) / 1_000).toFixed(2)}s since confirmed`,
                  "waiting for finality",
                ],
                href: `https://explorer.solana.com/block/${block.slot}`,
              },
            };
          }
        }
        const finalCell = cells.find(
          (cell) =>
            cell.blockhash &&
            Math.hypot(
              pointer.x - (0.98 + cell.x * 0.62),
              pointer.y - cell.y * 0.92,
            ) < 0.035,
        );
        if (finalCell) {
          const block = blocks.get(finalCell.blockhash!);
          closest = {
            distance: 0,
            value: {
              kind: "final",
              title: `FINAL · SLOT ${finalCell.slot?.toLocaleString()}`,
              lines: [
                `${block?.transactionCount.toLocaleString() ?? "—"} transactions`,
                `${((block?.finalityMs ?? 0) / 1_000).toFixed(2)}s observed finality`,
                "irreversible point territory",
              ],
              href: `https://explorer.solana.com/block/${finalCell.slot}`,
            },
          };
        }
        onInspect(closest?.value ?? null);
      }

      renderer.domElement.addEventListener("pointermove", pointerPosition);
      renderer.domElement.addEventListener("pointerleave", () =>
        pointer.set(99, 99),
      );
      renderer.domElement.addEventListener("click", inspect);
      window.addEventListener("resize", resize);
      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const motionChange = () => {
        reducedMotion = motionQuery.matches;
      };
      motionQuery.addEventListener("change", motionChange);
      resize();

      let frame = 0;
      function render(now: number) {
        frame = requestAnimationFrame(render);
        const delta = Math.min(32, now - lastFrame);
        lastFrame = now;
        const time = now * 0.001;
        if (!paused) {
          if (cycleState === "holding" && now - cycleAt > 2_000) {
            cycleState = "dissolving";
            cycleAt = now;
          } else if (cycleState === "dissolving" && now - cycleAt > 3_200) {
            form += 1;
            resetMask(cohort[0]?.seed ?? form);
          }
        }

        const glyphVertices: number[] = [];
        const relationVertices: number[] = [];
        for (const [signature, glyph] of glyphs) {
          const age = now - glyph.born;
          if (age > 8_000) {
            glyphs.delete(signature);
            continue;
          }
          const seed = signatureSeed(signature);
          const baseX = -1.42 + Math.min(0.95, age / 6_700);
          const baseY = -0.72 + ((seed % 1_000) / 1_000) * 1.44;
          const dx =
            pointer.distanceTo(new THREE.Vector2(baseX, baseY)) < 0.13
              ? (baseX - pointer.x) * 0.45
              : 0;
          const dy =
            pointer.distanceTo(new THREE.Vector2(baseX, baseY)) < 0.13
              ? (baseY - pointer.y) * 0.45
              : 0;
          const x = baseX + dx;
          const y = baseY + dy;
          const size =
            0.012 + Math.min(0.034, (glyph.computeUnits ?? 20_000) / 3_000_000);
          const variant = seed % 5;
          if (variant === 0) glyphVertices.push(x - size, y, 0, x + size, y, 0);
          else if (variant === 1)
            glyphVertices.push(
              x - size,
              y,
              0,
              x - size * 0.6,
              y,
              0,
              x + size * 0.4,
              y,
              0,
              x + size,
              y,
              0,
            );
          else if (variant === 2)
            glyphVertices.push(
              x - size,
              y - size,
              0,
              x,
              y + size,
              0,
              x,
              y + size,
              0,
              x + size,
              y - size * 0.2,
              0,
            );
          else if (variant === 3)
            glyphVertices.push(
              x - size,
              y - size,
              0,
              x + size,
              y - size,
              0,
              x + size,
              y - size,
              0,
              x + size,
              y + size,
              0,
              x + size,
              y + size,
              0,
              x - size,
              y + size,
              0,
            );
          else
            glyphVertices.push(
              x - size,
              y,
              0,
              x,
              y + size,
              0,
              x,
              y + size,
              0,
              x + size,
              y - size,
              0,
            );
          if (glyph.confirmedAt)
            relationVertices.push(
              x,
              y,
              0,
              -0.43,
              -0.66 + (glyph.slot % 9) * 0.16,
              0,
            );
        }
        glyphGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(glyphVertices, 3),
        );
        relationGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(relationVertices, 3),
        );

        const waveVertices: number[] = [];
        for (const [hash, block] of blocks) {
          if (block.finalizedAt && now - block.finalizedAt > 1_400) {
            blocks.delete(hash);
            continue;
          }
          const yBase = 0.48 - block.lane * 0.12;
          const fade = block.finalizedAt
            ? Math.max(0, 1 - (now - block.finalizedAt) / 1_400)
            : 1;
          const amplitude =
            (0.015 + Math.min(0.035, block.transactionCount / 80_000)) * fade;
          for (let step = 0; step < 40; step += 1) {
            const x1 = -0.39 + step * 0.0202;
            const x2 = -0.39 + (step + 1) * 0.0202;
            const deform1 =
              Math.abs(pointer.x - x1) < 0.14 &&
              Math.abs(pointer.y - yBase) < 0.12
                ? (pointer.y - yBase) * -0.18
                : 0;
            const deform2 =
              Math.abs(pointer.x - x2) < 0.14 &&
              Math.abs(pointer.y - yBase) < 0.12
                ? (pointer.y - yBase) * -0.18
                : 0;
            const phase =
              block.seed * 0.0001 + time * (block.finalizedAt ? 0 : 2.1);
            waveVertices.push(
              x1,
              yBase + Math.sin(step * 0.72 + phase) * amplitude + deform1,
              0,
              x2,
              yBase + Math.sin((step + 1) * 0.72 + phase) * amplitude + deform2,
              0,
            );
          }
        }
        waveGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(waveVertices, 3),
        );

        let visibleCells = 0;
        for (const cell of cells) {
          if (!cell.blockhash || !cell.born || now < cell.born) continue;
          let x = 0.98 + cell.x * 0.62;
          let y = cell.y * 0.92;
          let scale = 1;
          if (!reducedMotion && now - cell.born < 650) {
            const t = Math.max(0, Math.min(1, (now - cell.born) / 650));
            const eased = 1 - Math.pow(1 - t, 3);
            x = 0.45 + (x - 0.45) * eased;
            y = (cell.fromY ?? 0) + (y - (cell.fromY ?? 0)) * eased;
            scale = 0.45 + eased * 0.55;
          }
          if (cycleState === "dissolving") {
            const t = Math.min(1, (now - cycleAt) / 3_200);
            const edge = Math.abs(cell.x) + Math.abs(cell.y);
            const local = Math.max(0, (t - (0.95 - edge) * 0.28) / 0.72);
            y -=
              local *
              local *
              (0.5 + (signatureSeed(`${cell.slot}`) % 40) / 100);
            x += local * (0.08 + cell.y * 0.05);
            y += Math.sin(cell.x * 8 + time * 1.7) * local * 0.08;
            scale *= 1 - local;
          }
          temp.position.set(x, y, 0.1);
          temp.scale.setScalar(Math.max(0.001, scale));
          temp.updateMatrix();
          cellsMesh.setMatrixAt(visibleCells, temp.matrix);
          visibleCells += 1;
        }
        cellsMesh.count = visibleCells;
        cellsMesh.instanceMatrix.needsUpdate = true;
        flashMaterial.opacity = Math.max(0, 1 - (now - flashAt) / 520);

        if (now - lastTelemetry > 500) {
          lastTelemetry = now;
          const active = [...blocks.values()].filter(
            (block) => !block.finalizedAt,
          );
          onTelemetry({
            holding: active.length,
            rendered: glyphs.size,
            finalizedBlocks: finalBlocks,
            form,
            progress: finalBlocks / COHORT_SIZE,
            currentFinalityMs: finalityValues.at(-1) ?? 0,
            medianFinalityMs: median(finalityValues),
            firstSlot: cohort[0]?.slot,
            lastSlot: cohort.at(-1)?.slot,
            transactions: cohortTransactions,
          });
        }
        if (delta >= 0) renderer.render(scene, camera);
      }
      frame = requestAnimationFrame(render);

      return () => {
        cancelAnimationFrame(frame);
        runtimeRef.current = null;
        window.removeEventListener("resize", resize);
        motionQuery.removeEventListener("change", motionChange);
        renderer.dispose();
        glyphGeometry.dispose();
        relationGeometry.dispose();
        waveGeometry.dispose();
        cellGeometry.dispose();
        lineMaterial.dispose();
        dimMaterial.dispose();
        waveMaterial.dispose();
        dividerMaterial.dispose();
        cellMaterial.dispose();
        flashMaterial.dispose();
        host.removeChild(renderer.domElement);
      };
    }, [onInspect, onTelemetry]);

    return <div ref={hostRef} className="ff-canvas" aria-hidden="true" />;
  },
);
