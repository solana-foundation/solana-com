"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import type {
  AlpenglowEvent,
  BlockConfirmed,
  TransactionObserved,
} from "./types";
import { signatureSeed } from "./types";

const MAX_STAGE_VOXELS = 60_000;
const LEGACY_FINALITY_SECONDS = 12;
const ALPENGLOW_FINALITY_SECONDS = 0.15;
const STREAM_HOLD_MS = 900;
const STAGE_TRANSITION_MS = 850;
const FORM_HOLD_MS = 3_000;
const MELT_DURATION_MS = 3_200;
const VOXEL_SIZE = 0.024;
const MIN_LOGO_POPULATION = 18_000;
const COLOR_BUCKETS = 256;
const STAGE_X = [-2, 0, 2] as const;
const HAZE_GLYPHS = ["0", "1"] as const;
const HAZE_CELL_SIZE_PX = 12;

type FinalityMode = "legacy" | "alpenglow";
type CycleState = "forming" | "holding" | "melting";

type StreamVoxel = TransactionObserved & {
  born: number;
  seed: number;
};

type ConfirmedVoxel = TransactionObserved & {
  enteredAt: number;
  order: number;
  moved: boolean;
  seed: number;
  fromPosition: THREE.Vector3;
};

type FinalVoxel = ConfirmedVoxel & {
  targetIndex: number;
  seed: number;
  finalEnteredAt: number;
  finalFromPosition: THREE.Vector3;
};

type VisualBlock = BlockConfirmed & {
  observedAt: number;
  actualFinalized: boolean;
  finalityMs?: number;
};

type LogoModel = {
  points: THREE.Vector3[];
};

export type ArtworkTelemetry = {
  holding: number;
  rendered: number;
  finalizedBlocks: number;
  currentFinalityMs: number;
  medianFinalityMs: number;
};

export type FinalFormCanvasHandle = {
  push: (_event: AlpenglowEvent) => void;
  setMode: (_mode: FinalityMode) => void;
  resetView: () => void;
};

type Props = {
  onTelemetry: (_telemetry: ArtworkTelemetry) => void;
};

function unit(seed: number, shift: number) {
  return ((seed >>> shift) & 0xff) / 255;
}

function ease(value: number) {
  const clamped = Math.max(0, Math.min(1, value));
  return 1 - Math.pow(1 - clamped, 3);
}

function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

function populationFor(tps: number, mode: FinalityMode) {
  const seconds =
    mode === "legacy" ? LEGACY_FINALITY_SECONDS : ALPENGLOW_FINALITY_SECONDS;
  return Math.max(256, Math.min(MAX_STAGE_VOXELS, Math.round(tps * seconds)));
}

const SOLANA_PURPLE = new THREE.Color(0x9945ff);
const SOLANA_CYAN = new THREE.Color(0x00d4ff);
const SOLANA_GREEN = new THREE.Color(0x14f195);

function setSolanaColor(seed: number, output: THREE.Color) {
  const gradientPosition = unit(seed, 0);
  if (gradientPosition < 0.5) {
    output.copy(SOLANA_PURPLE).lerp(SOLANA_CYAN, gradientPosition * 2);
  } else {
    output.copy(SOLANA_CYAN).lerp(SOLANA_GREEN, (gradientPosition - 0.5) * 2);
  }
  return output;
}

function createVoxelMaterial() {
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vVoxelPosition;",
      )
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvVoxelPosition = position;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vVoxelPosition;",
      )
      .replace(
        "#include <opaque_fragment>",
        `vec3 edgeDistance = vec3(0.5) - abs(vVoxelPosition);
        float nearestFaceEdge = max(
          min(edgeDistance.x, edgeDistance.y),
          min(max(edgeDistance.x, edgeDistance.y), edgeDistance.z)
        );
        float edgePixels = nearestFaceEdge / max(fwidth(nearestFaceEdge), 0.0001);
        float blockInterior = smoothstep(0.0, 0.55, edgePixels);
        diffuseColor.rgb = mix(vec3(0.0), diffuseColor.rgb, blockInterior);
        #include <opaque_fragment>`,
      );
  };
  return material;
}

function createDigitAtlas() {
  const canvas = document.createElement("canvas");
  canvas.width = 64 * HAZE_GLYPHS.length;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = '500 36px "Courier New", monospace';
    HAZE_GLYPHS.forEach((digit, index) => {
      const x = index * 64 + 32;
      context.fillStyle = "rgba(255, 255, 255, 0.3)";
      context.shadowColor = "rgba(255, 255, 255, 0.65)";
      context.shadowBlur = 12;
      context.fillText(digit, x, 33);
      context.shadowBlur = 0;
      context.fillStyle = "white";
      context.fillText(digit, x, 33);
    });
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function createTransactionHaze(width: number, height: number) {
  const group = new THREE.Group();
  const materials: THREE.ShaderMaterial[] = [];
  const textures: THREE.Texture[] = [];
  group.position.z = -2.8;

  function createGeometry(columns: number, rows: number) {
    const positions: number[] = [];
    const seeds: number[] = [];
    const densities: number[] = [];
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const seed = signatureSeed(`haze-${row}-${column}`);
        const x = -1 + (column / (columns - 1)) * 2;
        const y = 1 - (row / (rows - 1)) * 2;
        const main = Math.exp(
          -Math.pow((x - 0.24) / 0.42, 2) - Math.pow((y + 0.02) / 0.62, 2),
        );
        const base = Math.exp(
          -Math.pow((x + 0.24) / 0.86, 2) - Math.pow((y + 0.58) / 0.3, 2),
        );
        const shoulder = Math.exp(
          -Math.pow((x + 0.56) / 0.32, 2) - Math.pow((y + 0.22) / 0.46, 2),
        );
        const edge = Math.min(1 - Math.abs(x), 1 - Math.abs(y));
        const vignette = Math.max(0, Math.min(1, (edge - 0.08) / 0.2));
        const density = Math.min(
          1,
          (0.06 + main * 0.9 + base * 0.66 + shoulder * 0.34) * vignette,
        );
        positions.push(x, y, 0);
        seeds.push(unit(seed, 0));
        densities.push(density);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setAttribute("aSeed", new THREE.Float32BufferAttribute(seeds, 1));
    geometry.setAttribute(
      "aDensity",
      new THREE.Float32BufferAttribute(densities, 1),
    );
    return geometry;
  }

  function gridSize(pixelWidth: number, pixelHeight: number) {
    return {
      columns: Math.max(2, Math.ceil(pixelWidth / HAZE_CELL_SIZE_PX) + 1),
      rows: Math.max(2, Math.ceil(pixelHeight / HAZE_CELL_SIZE_PX) + 1),
    };
  }

  let grid = gridSize(width, height);
  const geometry = createGeometry(grid.columns, grid.rows);
  const texture = createDigitAtlas();
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uGlyph: { value: texture },
      uTime: { value: 0 },
      uSpeed: { value: 0.6 },
      uPixelRatio: { value: 1 },
      uGlyphCount: { value: HAZE_GLYPHS.length },
    },
    vertexShader: `
        attribute float aSeed;
        attribute float aDensity;
        uniform float uTime;
        uniform float uSpeed;
        uniform float uPixelRatio;
        uniform float uGlyphCount;
        varying float vOpacity;
        varying float vDigit;

        void main() {
          float tempo = 0.18 + uSpeed * 0.82;
          float phase = uTime * tempo + aSeed * 18.0;
          float pulse = 0.72 + 0.28 * sin(phase + position.x * 7.0);
          vOpacity = aDensity * pulse * (0.55 + aSeed * 0.35);
          float refreshRate = 0.6 + uSpeed * 4.4;
          float generation = floor(uTime * refreshRate);
          float selection = fract(sin(aSeed * 997.0 + generation * 37.0) * 43758.5453);
          vDigit = floor(selection * uGlyphCount);

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = (7.0 + aDensity * 6.0 + aSeed * 2.0) * uPixelRatio;
        }
      `,
    fragmentShader: `
        uniform sampler2D uGlyph;
        uniform float uGlyphCount;
        varying float vOpacity;
        varying float vDigit;

        void main() {
          vec2 atlasUv = vec2(
            (gl_PointCoord.x + vDigit) / uGlyphCount,
            1.0 - gl_PointCoord.y
          );
          vec4 glyph = texture2D(uGlyph, atlasUv);
          float bokeh = smoothstep(0.5, 0.0, distance(gl_PointCoord, vec2(0.5)));
          float alpha = (glyph.a * 0.86 + bokeh * 0.045) * vOpacity;
          if (alpha < 0.008) discard;
          gl_FragColor = vec4(vec3(1.0), alpha);
        }
      `,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geometry, material);
  points.renderOrder = -2;
  group.add(points);
  materials.push(material);
  textures.push(texture);

  return {
    group,
    materials,
    textures,
    resize(pixelWidth: number, pixelHeight: number) {
      const nextGrid = gridSize(pixelWidth, pixelHeight);
      if (nextGrid.columns === grid.columns && nextGrid.rows === grid.rows) {
        return;
      }
      points.geometry.dispose();
      points.geometry = createGeometry(nextGrid.columns, nextGrid.rows);
      grid = nextGrid;
    },
    dispose() {
      points.geometry.dispose();
      materials.forEach((hazeMaterial) => hazeMaterial.dispose());
      textures.forEach((hazeTexture) => hazeTexture.dispose());
    },
  };
}

function latticeResolution(population: number) {
  return Math.max(2, Math.ceil(Math.cbrt(population)));
}

function latticePosition(index: number, population: number, stageX: number) {
  const resolution = latticeResolution(population);
  const cell = index % Math.pow(resolution, 3);
  const planeSize = resolution * resolution;
  const x = Math.floor(cell / planeSize);
  const withinPlane = cell % planeSize;
  const y = withinPlane % resolution;
  const z = Math.floor(withinPlane / resolution);
  const step = 1.08 / Math.max(1, resolution - 1);
  return new THREE.Vector3(
    stageX + 0.54 - x * step,
    -0.54 + y * step,
    -0.54 + z * step,
  );
}

function createLogoModel(population: number): LogoModel {
  let resolution = Math.max(8, Math.ceil(Math.cbrt(population / 0.4)));
  let candidates: THREE.Vector3[] = [];
  const bands = [
    [
      [-0.42, 0.46],
      [0.54, 0.46],
      [0.42, 0.26],
      [-0.54, 0.26],
    ],
    [
      [-0.54, 0.1],
      [0.42, 0.1],
      [0.54, -0.1],
      [-0.42, -0.1],
    ],
    [
      [-0.42, -0.26],
      [0.54, -0.26],
      [0.42, -0.46],
      [-0.54, -0.46],
    ],
  ];

  function insideBand(x: number, y: number, polygon: number[][]) {
    let inside = false;
    for (
      let index = 0, previous = polygon.length - 1;
      index < polygon.length;
      previous = index++
    ) {
      const [xi, yi] = polygon[index]!;
      const [xj, yj] = polygon[previous]!;
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
    return inside;
  }

  while (candidates.length < population) {
    candidates = [];
    for (let zIndex = 0; zIndex < resolution; zIndex += 1) {
      for (let yIndex = 0; yIndex < resolution; yIndex += 1) {
        for (let xIndex = 0; xIndex < resolution; xIndex += 1) {
          const x = -0.54 + (xIndex / (resolution - 1)) * 1.08;
          const y = -0.54 + (yIndex / (resolution - 1)) * 1.08;
          const z = -0.38 + (zIndex / (resolution - 1)) * 0.76;
          if (bands.some((band) => insideBand(x, y, band))) {
            candidates.push(new THREE.Vector3(STAGE_X[2] + x, y, z));
          }
        }
      }
    }
    if (candidates.length < population) resolution += 1;
  }

  const points = Array.from({ length: population }, (_, index) => {
    const candidateIndex = Math.floor((index / population) * candidates.length);
    return candidates[candidateIndex]!.clone();
  });
  points.sort((first, second) => {
    const firstGradient = -first.x - first.y;
    const secondGradient = -second.x - second.y;
    return firstGradient - secondGradient || second.z - first.z;
  });
  return { points };
}

function createTargetBuckets(population: number) {
  const buckets = Array.from({ length: COLOR_BUCKETS }, () => [] as number[]);
  for (let index = 0; index < population; index += 1) {
    const bucket = Math.min(
      COLOR_BUCKETS - 1,
      Math.floor((index / population) * COLOR_BUCKETS),
    );
    buckets[bucket]!.push(index);
  }
  return buckets;
}

function addStageFrame(group: THREE.Group, x: number) {
  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const fill = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: 0x0b0b0d,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.34,
    }),
  );
  fill.position.x = x;
  edges.position.x = x;
  group.add(fill, edges);
}

type FallbackState = {
  counts: [number, number, number];
  population: number;
  cyclePopulation: number;
  cycleState: CycleState;
  cycleAt: number;
};

function mountFallback(host: HTMLDivElement, state: FallbackState) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);
  const context = canvas.getContext("2d");
  const fallbackColor = new THREE.Color();
  let frame = 0;

  function draw(now: number) {
    if (!context) return;
    if (state.cycleState === "holding" && now - state.cycleAt >= FORM_HOLD_MS) {
      state.cycleState = "melting";
      state.cycleAt = now;
    } else if (
      state.cycleState === "melting" &&
      now - state.cycleAt >= MELT_DURATION_MS
    ) {
      state.counts[2] = 0;
      state.cyclePopulation = state.population;
      state.cycleState = "forming";
    }
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
    context.clearRect(0, 0, width, height);
    context.strokeStyle = "rgba(255,255,255,.42)";
    context.lineWidth = 1;
    const size = Math.min(width * 0.24, height * 0.44);
    const gap = size * 0.12;
    const start = width / 2 - (size * 3 + gap * 2) / 2;
    const top = height / 2 - size / 2;

    for (let stage = 0; stage < 3; stage += 1) {
      const left = start + stage * (size + gap);
      context.strokeRect(left, top, size, size);
      context.strokeRect(left + size * 0.1, top - size * 0.1, size, size);
      context.beginPath();
      context.moveTo(left, top);
      context.lineTo(left + size * 0.1, top - size * 0.1);
      context.moveTo(left + size, top);
      context.lineTo(left + size * 1.1, top - size * 0.1);
      context.moveTo(left + size, top + size);
      context.lineTo(left + size * 1.1, top + size * 0.9);
      context.stroke();

      const visible = Math.min(900, state.counts[stage]!);
      const columns = Math.max(2, Math.ceil(Math.sqrt(visible)));
      const dot = Math.max(1.2, size * 0.012);
      for (let index = 0; index < visible; index += 1) {
        const seed = signatureSeed(`${index}`);
        let x = left + size * (0.15 + unit(seed, 0) * 0.72);
        let y = top + size * (0.15 + unit(seed, 8) * 0.72);
        if (stage === 1) {
          x = left + size * (0.12 + ((index % columns) / columns) * 0.76);
          y =
            top +
            size * (0.12 + (Math.floor(index / columns) / columns) * 0.76);
        }
        if (stage === 2) {
          const band = Math.floor((index / visible) * 3);
          const bandCount = Math.ceil(visible / 3);
          const bandColumns = Math.max(3, Math.ceil(Math.sqrt(bandCount * 4)));
          const localIndex = index % bandCount;
          const column = localIndex % bandColumns;
          const row = Math.floor(localIndex / bandColumns);
          const progress = column / Math.max(1, bandColumns - 1);
          const chamfer = Math.abs(row - 2) * 0.008;
          x = left + size * (0.18 + chamfer + progress * (0.64 - chamfer * 2));
          y = top + size * (0.23 + band * 0.27 + row * 0.012);
          if (state.cycleState === "melting") {
            const melt = Math.min(1, (now - state.cycleAt) / MELT_DURATION_MS);
            y += melt * melt * size * (0.4 + unit(seed, 16) * 0.35);
          }
        }
        context.fillStyle = `#${setSolanaColor(seed, fallbackColor).getHexString()}`;
        context.fillRect(x, y, dot, dot);
        context.strokeStyle = "#000000";
        context.lineWidth = 0.5;
        context.strokeRect(x, y, dot, dot);
      }
    }
    frame = requestAnimationFrame(draw);
  }

  frame = requestAnimationFrame(draw);
  return () => {
    cancelAnimationFrame(frame);
    canvas.remove();
  };
}

export const FinalFormCanvas = forwardRef<FinalFormCanvasHandle, Props>(
  function FinalFormCanvas({ onTelemetry }, ref) {
    const hostRef = useRef<HTMLDivElement>(null);
    const runtimeRef = useRef<{
      push: (_event: AlpenglowEvent) => void;
      setMode: (_mode: FinalityMode) => void;
      resetView: () => void;
    } | null>(null);

    useImperativeHandle(ref, () => ({
      push: (event) => runtimeRef.current?.push(event),
      setMode: (mode) => runtimeRef.current?.setMode(mode),
      resetView: () => runtimeRef.current?.resetView(),
    }));

    useEffect(() => {
      const host = hostRef.current;
      if (!host) return;
      const hostElement = host;
      const scene = new THREE.Scene();
      const assembly = new THREE.Group();
      assembly.rotation.set(-0.18, -0.28, 0);
      scene.add(assembly);
      STAGE_X.forEach((x) => addStageFrame(assembly, x));

      const defaultZoom = () => 7.2;
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
      camera.position.set(0, 0.2, defaultZoom());
      let renderer: THREE.WebGLRenderer;

      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        let mode: FinalityMode = "alpenglow";
        let tps = 3_000;
        const fallbackState: FallbackState = {
          counts: [0, 0, 0],
          population: populationFor(tps, mode),
          cyclePopulation: populationFor(tps, mode),
          cycleState: "forming",
          cycleAt: 0,
        };
        const fallbackBlocks = new Map<string, number>();
        const fallbackFinalityValues: number[] = [];
        let fallbackFinalizedBlocks = 0;
        let fallbackCurrentFinalityMs = 0;
        function reportFallback() {
          onTelemetry({
            holding: fallbackBlocks.size,
            rendered: fallbackState.counts.reduce(
              (total, count) => total + count,
              0,
            ),
            finalizedBlocks: fallbackFinalizedBlocks,
            currentFinalityMs: fallbackCurrentFinalityMs,
            medianFinalityMs: median(fallbackFinalityValues),
          });
        }
        runtimeRef.current = {
          push(event) {
            if (event.type === "performance_sample") {
              tps = event.totalTps;
              fallbackState.population = populationFor(tps, mode);
              reportFallback();
            }
            if (event.type === "transaction_observed") {
              fallbackState.counts[0] = Math.min(
                fallbackState.population,
                fallbackState.counts[0] + 1,
              );
            }
            if (event.type === "block_confirmed") {
              fallbackBlocks.set(event.blockhash, event.transactionCount);
              fallbackState.counts[1] = Math.min(
                fallbackState.population,
                fallbackState.counts[1] + event.transactionCount,
              );
              reportFallback();
            }
            if (event.type === "block_finalized") {
              const transactionCount =
                fallbackBlocks.get(event.blockhash) ?? 1_000;
              fallbackBlocks.delete(event.blockhash);
              const moved = Math.min(
                transactionCount,
                fallbackState.cyclePopulation - fallbackState.counts[2],
              );
              fallbackState.counts[1] = Math.max(
                0,
                fallbackState.counts[1] - moved,
              );
              fallbackState.counts[2] += moved;
              fallbackFinalizedBlocks += 1;
              fallbackCurrentFinalityMs = event.observedFinalityMs;
              fallbackFinalityValues.push(event.observedFinalityMs);
              if (fallbackState.counts[2] >= fallbackState.cyclePopulation) {
                fallbackState.cycleState = "holding";
                fallbackState.cycleAt = performance.now();
              }
              reportFallback();
            }
          },
          setMode(value) {
            mode = value;
            fallbackState.population = populationFor(tps, mode);
          },
          resetView() {},
        };
        const cleanup = mountFallback(hostElement, fallbackState);
        return () => {
          runtimeRef.current = null;
          cleanup();
        };
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.setClearColor(0x000000, 0);
      hostElement.appendChild(renderer.domElement);
      const transactionHaze = createTransactionHaze(
        hostElement.clientWidth,
        hostElement.clientHeight,
      );
      scene.add(transactionHaze.group);

      const voxelGeometry = new THREE.BoxGeometry(1, 1, 1);
      const streamingMaterial = createVoxelMaterial();
      const confirmedMaterial = createVoxelMaterial();
      const finalMaterial = createVoxelMaterial();
      const streamingMesh = new THREE.InstancedMesh(
        voxelGeometry,
        streamingMaterial,
        MAX_STAGE_VOXELS,
      );
      const confirmedMesh = new THREE.InstancedMesh(
        voxelGeometry,
        confirmedMaterial,
        MAX_STAGE_VOXELS,
      );
      const finalMesh = new THREE.InstancedMesh(
        voxelGeometry,
        finalMaterial,
        MAX_STAGE_VOXELS,
      );
      streamingMesh.count = 0;
      confirmedMesh.count = 0;
      finalMesh.count = 0;
      streamingMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      confirmedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      finalMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      assembly.add(streamingMesh, confirmedMesh, finalMesh);

      let mode: FinalityMode = "alpenglow";
      let tps = 3_000;
      let targetPopulation = populationFor(tps, mode);
      let cyclePopulation = Math.max(targetPopulation, MIN_LOGO_POPULATION);
      let logoModel = createLogoModel(cyclePopulation);
      let targetBuckets = createTargetBuckets(cyclePopulation);
      let targetBucketCursors = new Uint32Array(COLOR_BUCKETS);
      let lastFinalArrivalAt = 0;
      const pending: TransactionObserved[] = [];
      let pendingIndex = 0;
      let emissionCredit = 0;
      let confirmedOrder = 0;
      let streaming: StreamVoxel[] = [];
      let confirmed: ConfirmedVoxel[] = [];
      let final: FinalVoxel[] = [];
      let confirmedDirty = true;
      let finalDirty = true;
      let cycleState: CycleState = "forming";
      let cycleAt = 0;
      let finalizedBlocks = 0;
      let currentFinalityMs = 0;
      let lastTelemetry = 0;
      let lastFrame = performance.now();
      const blocks = new Map<string, VisualBlock>();
      const finalityValues: number[] = [];
      const object = new THREE.Object3D();
      const position = new THREE.Vector3();
      const color = new THREE.Color();
      let frame = 0;
      let dragging = false;
      let pointerX = 0;
      let pointerY = 0;
      let targetRotationX = assembly.rotation.x;
      let targetRotationY = assembly.rotation.y;
      let targetZoom = camera.position.z;
      let zoomModifierHeld = false;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      function modeFinalityMs() {
        return mode === "legacy"
          ? LEGACY_FINALITY_SECONDS * 1_000
          : ALPENGLOW_FINALITY_SECONDS * 1_000;
      }

      function updatePopulationModel() {
        const previousPopulation = targetPopulation;
        const now = performance.now();
        for (const voxel of confirmed) {
          voxel.fromPosition = latticePosition(
            voxel.order,
            previousPopulation,
            STAGE_X[1],
          );
          voxel.enteredAt = now;
        }
        targetPopulation = populationFor(tps, mode);
        confirmedDirty = true;
      }

      function blockIsFinal(block: VisualBlock, now: number) {
        if (mode === "legacy") return block.actualFinalized;
        return now - block.observedAt >= modeFinalityMs();
      }

      function takeLogoTarget(seed: number) {
        const desiredBucket = seed & 0xff;
        for (let distance = 0; distance < COLOR_BUCKETS; distance += 1) {
          const candidates =
            distance === 0
              ? [desiredBucket]
              : [desiredBucket - distance, desiredBucket + distance];
          for (const bucket of candidates) {
            if (bucket < 0 || bucket >= COLOR_BUCKETS) continue;
            const cursor = targetBucketCursors[bucket]!;
            const targets = targetBuckets[bucket]!;
            if (cursor >= targets.length) continue;
            targetBucketCursors[bucket] = cursor + 1;
            return targets[cursor]!;
          }
        }
        return cyclePopulation - 1;
      }

      function moveReadyVoxels(now: number) {
        let movedAny = false;
        for (const voxel of confirmed) {
          if (voxel.moved || now - voxel.enteredAt < modeFinalityMs()) continue;
          const block = voxel.blockhash
            ? blocks.get(voxel.blockhash)
            : undefined;
          if (!block || !blockIsFinal(block, now)) continue;
          if (cycleState !== "forming" || final.length >= cyclePopulation)
            continue;
          voxel.moved = true;
          final.push({
            ...voxel,
            targetIndex: takeLogoTarget(voxel.seed),
            seed: voxel.seed,
            finalEnteredAt: now,
            finalFromPosition: latticePosition(
              voxel.order,
              targetPopulation,
              STAGE_X[1],
            ),
          });
          lastFinalArrivalAt = now;
          movedAny = true;
        }
        if (!movedAny) return;
        const remaining = confirmed.filter((voxel) => !voxel.moved);
        remaining.forEach((voxel, order) => {
          voxel.fromPosition = latticePosition(
            voxel.order,
            targetPopulation,
            STAGE_X[1],
          );
          voxel.order = order;
          voxel.enteredAt = now;
        });
        confirmed = remaining;
        confirmedOrder = confirmed.length;
        confirmedDirty = true;
        finalDirty = true;
      }

      function push(event: AlpenglowEvent) {
        if (event.type === "transaction_observed") {
          pending.push(event);
          return;
        }
        if (event.type === "performance_sample") {
          const previousPopulation = targetPopulation;
          tps = Math.max(1, event.totalTps);
          if (
            Math.abs(populationFor(tps, mode) - previousPopulation) /
              previousPopulation >
            0.08
          ) {
            updatePopulationModel();
          }
          return;
        }
        if (event.type === "block_confirmed") {
          blocks.set(event.blockhash, {
            ...event,
            observedAt: performance.now(),
            actualFinalized: false,
          });
          return;
        }
        if (event.type === "block_finalized") {
          const block = blocks.get(event.blockhash);
          if (block) {
            block.actualFinalized = true;
            block.finalityMs = event.observedFinalityMs;
          }
          finalizedBlocks += 1;
          currentFinalityMs = event.observedFinalityMs;
          finalityValues.push(event.observedFinalityMs);
          if (finalityValues.length > 48) finalityValues.shift();
        }
      }

      function resetView() {
        targetRotationX = -0.18;
        targetRotationY = -0.28;
        targetZoom = defaultZoom();
      }

      runtimeRef.current = {
        push,
        setMode(value) {
          if (mode === value) return;
          mode = value;
          updatePopulationModel();
        },
        resetView,
      };

      function resize() {
        const width = hostElement.clientWidth;
        const height = hostElement.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(height, 1);
        camera.fov = width < 720 ? 52 : 34;
        camera.updateProjectionMatrix();
        transactionHaze.resize(width, height);
        sizeTransactionHaze();
      }

      function sizeTransactionHaze() {
        const distance = camera.position.z - transactionHaze.group.position.z;
        const halfHeight =
          Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * distance;
        transactionHaze.group.scale.set(
          halfHeight * camera.aspect,
          halfHeight,
          1,
        );
      }

      function onPointerDown(event: PointerEvent) {
        dragging = true;
        pointerX = event.clientX;
        pointerY = event.clientY;
        renderer.domElement.setPointerCapture(event.pointerId);
      }

      function onPointerMove(event: PointerEvent) {
        if (!dragging) return;
        targetRotationY += (event.clientX - pointerX) * 0.006;
        targetRotationX += (event.clientY - pointerY) * 0.006;
        targetRotationX = Math.max(-1.15, Math.min(1.15, targetRotationX));
        pointerX = event.clientX;
        pointerY = event.clientY;
      }

      function onPointerUp(event: PointerEvent) {
        dragging = false;
        if (renderer.domElement.hasPointerCapture(event.pointerId)) {
          renderer.domElement.releasePointerCapture(event.pointerId);
        }
      }

      function onWheel(event: WheelEvent) {
        if (!zoomModifierHeld) return;
        event.preventDefault();
        const minimumZoom = hostElement.clientWidth < 720 ? 6.4 : 4.5;
        targetZoom = Math.max(
          minimumZoom,
          Math.min(9.5, targetZoom + event.deltaY * 0.006),
        );
      }

      function onModifierKey(event: KeyboardEvent) {
        if (event.key !== "Control" && event.key !== "Meta") return;
        zoomModifierHeld = event.type === "keydown";
      }

      function clearZoomModifier() {
        zoomModifierHeld = false;
      }

      renderer.domElement.addEventListener("pointerdown", onPointerDown);
      renderer.domElement.addEventListener("pointermove", onPointerMove);
      renderer.domElement.addEventListener("pointerup", onPointerUp);
      renderer.domElement.addEventListener("pointercancel", onPointerUp);
      renderer.domElement.addEventListener("wheel", onWheel, {
        passive: false,
      });
      window.addEventListener("keydown", onModifierKey);
      window.addEventListener("keyup", onModifierKey);
      window.addEventListener("blur", clearZoomModifier);
      window.addEventListener("resize", resize);
      resize();

      function getStreamingPosition(
        voxel: StreamVoxel,
        now: number,
        output: THREE.Vector3,
      ) {
        const age = now - voxel.born;
        const entry = ease(age / 520);
        output.set(
          -2.8 + entry * (0.8 + unit(voxel.seed, 0) * 0.58),
          (unit(voxel.seed, 8) - 0.5) * 1.08,
          (unit(voxel.seed, 16) - 0.5) * 1.08,
        );
        if (!reduceMotion) {
          output.y += Math.sin(now * 0.002 + voxel.seed) * 0.08;
          output.z += Math.cos(now * 0.0017 + voxel.seed * 0.5) * 0.08;
        }
        return output;
      }

      function renderStreaming(now: number) {
        for (let index = 0; index < streaming.length; index += 1) {
          const voxel = streaming[index]!;
          getStreamingPosition(voxel, now, position);
          object.position.copy(position);
          object.rotation.set(
            now * 0.001 + unit(voxel.seed, 0) * Math.PI,
            now * 0.0013 + unit(voxel.seed, 8) * Math.PI,
            unit(voxel.seed, 16) * Math.PI,
          );
          object.scale.setScalar(VOXEL_SIZE);
          object.updateMatrix();
          streamingMesh.setMatrixAt(index, object.matrix);
          streamingMesh.setColorAt(index, setSolanaColor(voxel.seed, color));
        }
        streamingMesh.count = streaming.length;
        streamingMesh.instanceMatrix.needsUpdate = true;
        if (streamingMesh.instanceColor)
          streamingMesh.instanceColor.needsUpdate = true;
      }

      function renderConfirmed(now: number) {
        if (!confirmedDirty) return;
        let animating = false;
        confirmed.forEach((voxel, index) => {
          const target = latticePosition(
            voxel.order,
            targetPopulation,
            STAGE_X[1],
          );
          const progress = reduceMotion
            ? 1
            : ease((now - voxel.enteredAt) / STAGE_TRANSITION_MS);
          position.lerpVectors(voxel.fromPosition, target, progress);
          object.position.copy(position);
          object.rotation.set(0, 0, 0);
          object.scale.setScalar(VOXEL_SIZE);
          object.updateMatrix();
          confirmedMesh.setMatrixAt(index, object.matrix);
          confirmedMesh.setColorAt(index, setSolanaColor(voxel.seed, color));
          if (progress < 1) animating = true;
        });
        confirmedMesh.count = confirmed.length;
        confirmedMesh.instanceMatrix.needsUpdate = true;
        if (confirmedMesh.instanceColor)
          confirmedMesh.instanceColor.needsUpdate = true;
        confirmedDirty = animating;
      }

      function renderFinal(now: number) {
        if (!finalDirty && cycleState !== "melting") return;
        const melt =
          cycleState === "melting"
            ? Math.min(1, (now - cycleAt) / MELT_DURATION_MS)
            : 0;
        final.forEach((voxel, index) => {
          const target = logoModel.points[voxel.targetIndex];
          if (!target) return;
          const transition = reduceMotion
            ? 1
            : ease((now - voxel.finalEnteredAt) / STAGE_TRANSITION_MS);
          position.lerpVectors(voxel.finalFromPosition, target, transition);
          let scale = VOXEL_SIZE;
          if (melt > 0) {
            position.x += (unit(voxel.seed, 0) - 0.5) * melt * 0.52;
            position.y -= melt * melt * (0.7 + unit(voxel.seed, 8) * 0.7);
            position.z += (unit(voxel.seed, 16) - 0.5) * melt * 0.7;
            scale *= Math.max(0.001, 1 - ease(melt));
          }
          object.position.copy(position);
          object.rotation.set(
            melt * unit(voxel.seed, 0) * 4,
            melt * unit(voxel.seed, 8) * 4,
            melt * unit(voxel.seed, 16) * 4,
          );
          object.scale.setScalar(scale);
          object.updateMatrix();
          finalMesh.setMatrixAt(index, object.matrix);
          finalMesh.setColorAt(index, setSolanaColor(voxel.seed, color));
        });
        finalMesh.count = final.length;
        finalMesh.instanceMatrix.needsUpdate = true;
        if (finalMesh.instanceColor) finalMesh.instanceColor.needsUpdate = true;
        finalDirty = final.some(
          (voxel) => now - voxel.finalEnteredAt < STAGE_TRANSITION_MS,
        );
      }

      function render(now: number) {
        frame = requestAnimationFrame(render);
        const delta = Math.min(50, now - lastFrame);
        lastFrame = now;
        assembly.rotation.x += (targetRotationX - assembly.rotation.x) * 0.09;
        assembly.rotation.y += (targetRotationY - assembly.rotation.y) * 0.09;
        camera.position.z += (targetZoom - camera.position.z) * 0.09;
        sizeTransactionHaze();
        const hazeSpeed = Math.max(0.12, Math.min(1, tps / 5_000));
        for (const material of transactionHaze.materials) {
          material.uniforms.uTime!.value = reduceMotion ? 0 : now * 0.001;
          material.uniforms.uSpeed!.value = reduceMotion ? 0 : hazeSpeed;
          material.uniforms.uPixelRatio!.value = renderer.getPixelRatio();
        }

        emissionCredit += (tps * delta) / 1_000;
        const emitCount = Math.min(
          Math.floor(emissionCredit),
          pending.length - pendingIndex,
          MAX_STAGE_VOXELS - streaming.length,
        );
        if (emitCount > 0) {
          emissionCredit -= emitCount;
          for (let index = 0; index < emitCount; index += 1) {
            const transaction = pending[pendingIndex++]!;
            streaming.push({
              ...transaction,
              born: now - delta + (index / emitCount) * delta,
              seed: signatureSeed(transaction.signature),
            });
          }
        }
        if (pendingIndex > 20_000) {
          pending.splice(0, pendingIndex);
          pendingIndex = 0;
        }

        const remainingStreaming: StreamVoxel[] = [];
        for (const voxel of streaming) {
          if (now - voxel.born < STREAM_HOLD_MS) {
            remainingStreaming.push(voxel);
            continue;
          }
          const block = voxel.blockhash
            ? blocks.get(voxel.blockhash)
            : undefined;
          if (!block || confirmed.length >= MAX_STAGE_VOXELS) {
            remainingStreaming.push(voxel);
            continue;
          }
          confirmed.push({
            ...voxel,
            enteredAt: now,
            order: confirmedOrder++,
            moved: false,
            fromPosition: getStreamingPosition(voxel, now, new THREE.Vector3()),
          });
          confirmedDirty = true;
        }
        streaming = remainingStreaming;

        moveReadyVoxels(now);
        if (
          cycleState === "forming" &&
          final.length >= cyclePopulation &&
          now - lastFinalArrivalAt >= STAGE_TRANSITION_MS
        ) {
          cycleState = "holding";
          cycleAt = now;
        } else if (cycleState === "holding" && now - cycleAt >= FORM_HOLD_MS) {
          cycleState = "melting";
          cycleAt = now;
          finalDirty = true;
        } else if (
          cycleState === "melting" &&
          now - cycleAt >= MELT_DURATION_MS
        ) {
          final = [];
          finalMesh.count = 0;
          cyclePopulation = Math.max(targetPopulation, MIN_LOGO_POPULATION);
          logoModel = createLogoModel(cyclePopulation);
          targetBuckets = createTargetBuckets(cyclePopulation);
          targetBucketCursors = new Uint32Array(COLOR_BUCKETS);
          lastFinalArrivalAt = 0;
          cycleState = "forming";
          finalDirty = true;
        }

        renderStreaming(now);
        renderConfirmed(now);
        renderFinal(now);

        if (now - lastTelemetry > 500) {
          lastTelemetry = now;
          onTelemetry({
            holding: [...blocks.values()].filter(
              (block) => !block.actualFinalized,
            ).length,
            rendered: streaming.length + confirmed.length + final.length,
            finalizedBlocks,
            currentFinalityMs,
            medianFinalityMs: median(finalityValues),
          });
        }
        renderer.render(scene, camera);
      }
      frame = requestAnimationFrame(render);

      return () => {
        cancelAnimationFrame(frame);
        runtimeRef.current = null;
        window.removeEventListener("resize", resize);
        renderer.domElement.removeEventListener("pointerdown", onPointerDown);
        renderer.domElement.removeEventListener("pointermove", onPointerMove);
        renderer.domElement.removeEventListener("pointerup", onPointerUp);
        renderer.domElement.removeEventListener("pointercancel", onPointerUp);
        renderer.domElement.removeEventListener("wheel", onWheel);
        window.removeEventListener("keydown", onModifierKey);
        window.removeEventListener("keyup", onModifierKey);
        window.removeEventListener("blur", clearZoomModifier);
        renderer.dispose();
        voxelGeometry.dispose();
        streamingMaterial.dispose();
        confirmedMaterial.dispose();
        finalMaterial.dispose();
        transactionHaze.dispose();
        scene.traverse((object3d) => {
          if (object3d instanceof THREE.LineSegments) {
            object3d.geometry.dispose();
            if (object3d.material instanceof THREE.Material)
              object3d.material.dispose();
          }
          if (
            object3d instanceof THREE.Mesh &&
            object3d !== streamingMesh &&
            object3d !== confirmedMesh &&
            object3d !== finalMesh
          ) {
            object3d.geometry.dispose();
            if (object3d.material instanceof THREE.Material)
              object3d.material.dispose();
          }
        });
        renderer.domElement.remove();
      };
    }, [onTelemetry]);

    return <div ref={hostRef} className="ff-canvas" aria-hidden="true" />;
  },
);
