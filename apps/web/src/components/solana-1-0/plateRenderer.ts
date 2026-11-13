import type * as THREE_NS from "three";
import {
  CLIENTS,
  CLIENT_INDEX,
  FONT_DISPLAY,
  NEUTRAL_RGB,
  groupSlot,
  type ClientId,
} from "./config";
import {
  BLOCK_FRAGMENT,
  BLOCK_VERTEX,
  PLATE_FRAGMENT,
  PLATE_VERTEX,
} from "./plateShaders";

type Three = typeof THREE_NS;

const MAX_PIXEL_RATIO = 1.5;
const MAX_TEXT_WIDTH = 1800;
const MAX_BLOCKS = 256;
const ROLL_MS = 340;
const GAIN_EASE_MS = 250;
const FLICKER_DECAY_MS = 110;
const MAX_ROWS = 4;
const LOCK_FLASH_MS = 140;
const CLEAR_MS = 320;
const POP_OUT_MS = 300;

export interface PlateRenderer {
  /** A block landed. `family` null renders neutral grey. */
  pushBlock: (
    _slot: number,
    _family: ClientId | null,
    _client: string | null,
  ) => void;
  setFinality: (_ms: number | null) => void;
  setSlotMs: (_ms: number) => void;
  /** Target light per client, 0 or 1; eased inside the renderer. */
  setGains: (_gains: Record<ClientId, number>) => void;
  /** 0 = full hero, 1 = ambient object (plate only, no stream). */
  setAmbient: (_progress: number) => void;
  setRunning: (_running: boolean) => void;
  dispose: () => void;
}

interface Layout {
  compact: boolean;
  size: number;
  /** y centres of the slot rows, canvas px from the top */
  rows: number[];
  msSize: number;
  msY: number;
}

/**
 * Type is placed on the slice grid. The slot digits sit on a seam so every
 * glyph is cut once, the way the reference poster cuts its numerals; the
 * finality line sits inside a slice, clear of the seams where the
 * lens warp would smear small type.
 */
function computeLayout(w: number, h: number, rail = 1): Layout {
  const compact = w / h < 0.85;
  if (compact) {
    // Fit the stacked digits and their labels between the heading and controls.
    const band = Math.min(h / 9, (h * rail * 0.9) / 5.2);
    const size = Math.min(w * 0.3, band * 1.15);
    return {
      compact,
      size,
      rows: [band, band * 2, band * 3],
      msSize: Math.min(size * 0.4, band * 0.42),
      msY: band * 4.38,
    };
  }
  const band = h / 7;
  const size = Math.min(w * 0.127, band * 1.55);
  return {
    compact,
    size,
    rows: [band * 2],
    msSize: Math.min(size * 0.46, band * 0.62),
    msY: band * 3.5,
  };
}

/** A string of fixed cells whose changed characters roll vertically. */
class RollingField {
  private from = "";
  private to = "";
  private startedAt = -Infinity;

  set(value: string, now: number): boolean {
    if (value === this.to) return false;
    this.from = this.to.length === value.length ? this.to : value;
    this.to = value;
    this.startedAt = now;
    return true;
  }

  rolling(now: number, duration: number): boolean {
    return now - this.startedAt < duration;
  }

  get value() {
    return this.to;
  }

  /**
   * Draw `count` characters starting at `offset`, centred on (cx, cy).
   */
  draw(
    ctx: CanvasRenderingContext2D,
    now: number,
    duration: number,
    offset: number,
    count: number,
    cx: number,
    cy: number,
    size: number,
    cell: number,
  ) {
    const t = Math.min(1, Math.max(0, (now - this.startedAt) / duration));
    const p = 1 - Math.pow(1 - t, 3);
    const baseline = cy + size * 0.36;
    const travel = size * 0.95;
    let x = cx - this.width(offset, count, cell) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, cy - size * 0.47, ctx.canvas.width, size * 0.94);
    ctx.clip();
    for (let i = offset; i < offset + count; i++) {
      const next = this.to[i] ?? "";
      const prev = this.from[i] ?? next;
      const w = next === " " ? cell * 0.5 : cell;
      const mid = x + w / 2;
      if (prev !== next && p < 1) {
        ctx.fillText(prev, mid, baseline - p * travel);
        ctx.fillText(next, mid, baseline + (1 - p) * travel);
      } else {
        ctx.fillText(next, mid, baseline);
      }
      x += w;
    }
    ctx.restore();
  }

  width(offset: number, count: number, cell: number): number {
    let w = 0;
    for (let i = offset; i < offset + count; i++)
      w += this.to[i] === " " ? cell * 0.5 : cell;
    return w;
  }
}

interface Block {
  /** null while falling */
  lockedAt: number | null;
  dyingAt: number | null;
  /** dying because its row filled: flashes white on the way out */
  cleared: boolean;
  family: ClientId | null;
  rgb: [number, number, number];
  col: number;
  /** grid row, counted up from the floor; drops one per block produced */
  row: number;
  /** drawn row, eased toward `row` so each drop reads as a step */
  y: number;
}

/** Stable 0-1 hash of a validator client name, for its home columns. */
function nameHash(name: string): number {
  let h = 2166136261;
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10_000) / 10_000;
}

/**
 * Two draws on one canvas: the block stream (flat instanced squares, one
 * draw call) as the background, then the plate (full-screen quad, one
 * fragment shader) composited over it.
 */
export function createPlateRenderer(
  THREE: Three,
  canvas: HTMLCanvasElement,
  options: { reducedMotion: boolean; railElement: HTMLElement },
): PlateRenderer {
  const motion = options.reducedMotion
    ? { time: 1 / 3, flicker: 0.25, stream: 0.4 }
    : { time: 1, flicker: 1, stream: 1 };

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.autoClear = false;
  renderer.setClearColor(0x040408, 1);

  // ── text plate ──
  const textCanvas = document.createElement("canvas");
  const ctx = textCanvas.getContext("2d")!;
  const textTexture = new THREE.CanvasTexture(textCanvas);
  textTexture.generateMipmaps = false;
  textTexture.minFilter = THREE.LinearFilter;
  textTexture.magFilter = THREE.LinearFilter;
  textTexture.colorSpace = THREE.NoColorSpace;

  const uniforms = {
    uText: { value: textTexture },
    uRes: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uBands: { value: 7 },
    uGain: { value: new THREE.Vector4(0, 0, 0, 0) },
    uStaged: {
      value: new THREE.Vector4(
        ...(CLIENTS.map((c) => (c.live ? 0 : 1)) as [
          number,
          number,
          number,
          number,
        ]),
      ),
    },
    uCol: { value: CLIENTS.map((c) => new THREE.Vector3(...c.rgb)) },
    uFlicker: { value: 0 },
    uRailY: { value: 0.3 },
    uStream: { value: 1 },
  };

  const plateScene = new THREE.Scene();
  const plateCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const plateMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: PLATE_VERTEX,
    fragmentShader: PLATE_FRAGMENT,
    depthTest: false,
    depthWrite: false,
    // premultiplied "over": the plate is drawn on top of the block stream
    transparent: true,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
  });
  const plateGeometry = new THREE.PlaneGeometry(2, 2);
  const plate = new THREE.Mesh(plateGeometry, plateMaterial);
  plate.frustumCulled = false;
  plateScene.add(plate);

  // ── block stream: flat squares in CSS-pixel space, drawn behind the plate ──
  const streamScene = new THREE.Scene();
  const streamCamera = new THREE.OrthographicCamera(0, 1, 1, 0, -1, 1);
  const blockGeometry = new THREE.PlaneGeometry(1, 1);
  const blockTint = new THREE.InstancedBufferAttribute(
    new Float32Array(MAX_BLOCKS * 4),
    4,
  );
  blockTint.setUsage(THREE.DynamicDrawUsage);
  blockGeometry.setAttribute("aTint", blockTint);
  const blockMaterial = new THREE.ShaderMaterial({
    vertexShader: BLOCK_VERTEX,
    fragmentShader: BLOCK_FRAGMENT,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
  });
  const squares = new THREE.InstancedMesh(
    blockGeometry,
    blockMaterial,
    MAX_BLOCKS,
  );
  squares.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  squares.frustumCulled = false;
  squares.count = 0;
  streamScene.add(squares);
  const dummy = new THREE.Object3D();

  // ── state ──
  const slotField = new RollingField();
  const msField = new RollingField();
  let layout = computeLayout(1, 1);
  let cssW = 1;
  let cssH = 1;
  let rail = 1;
  let textDirty = true;
  let hasSlot = false;
  let slotMs = 200;
  let ambient = 0;
  let running = false;
  let disposed = false;
  let raf = 0;
  let lastFrame = 0;
  let time = 0;
  let flicker = 0;
  const gains = [0, 0, 0, 0];
  const targets: number[] = CLIENTS.map((c) => (c.live ? 1 : 0));
  const blocks: Block[] = [];
  /** the well: one stack of blocks per column, bottom first */
  const columns: Block[][] = [];

  const anyLight = () => targets.some((t) => t > 0);

  function drawText(now: number) {
    const w = textCanvas.width;
    const h = textCanvas.height;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    // Red channel: the refracted type.
    ctx.fillStyle = "#f00";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    const { size, rows, msSize, msY, compact } = layout;
    // roll no longer than the slot gap so digits settle between blocks
    const slotRoll = Math.min(ROLL_MS, Math.max(120, slotMs * 0.9));

    if (hasSlot) {
      ctx.font = `700 ${size}px ${FONT_DISPLAY}`;
      const cell = size * 0.66;
      const value = slotField.value;
      if (compact) {
        // "461 204 117" stacked as three rows of three digits
        const groups = value.split(" ");
        let offset = 0;
        const shown = groups.slice(-3);
        offset = value.length - shown.join(" ").length;
        shown.forEach((group, i) => {
          slotField.draw(
            ctx,
            now,
            slotRoll,
            offset,
            group.length,
            w / 2,
            rows[i],
            size,
            cell,
          );
          offset += group.length + 1;
        });
      } else {
        slotField.draw(
          ctx,
          now,
          slotRoll,
          0,
          value.length,
          w / 2,
          rows[0],
          size,
          cell,
        );
      }
    }

    if (msField.value) {
      ctx.font = `700 ${msSize}px ${FONT_DISPLAY}`;
      const cell = msSize * 0.66;
      const digits = msField.value;
      const unit = " MS";
      const unitW = cell * 2.6;
      const digitsW = msField.width(0, digits.length, cell);
      const left = w / 2 - (digitsW + unitW) / 2;
      msField.draw(
        ctx,
        now,
        ROLL_MS,
        0,
        digits.length,
        left + digitsW / 2,
        msY,
        msSize,
        cell,
      );
      ctx.textAlign = "left";
      ctx.fillText(unit, left + digitsW, msY + msSize * 0.36);
      ctx.textAlign = "center";
    }

    textTexture.needsUpdate = true;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const previousRail = rail;
    // Match the DOM border even when copy, fonts, or viewport height change.
    rail = Math.min(
      1,
      Math.max(
        0,
        (options.railElement.getBoundingClientRect().top - rect.top) /
          Math.max(1, rect.height),
      ),
    );
    uniforms.uRailY.value = 1 - rail;
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    if (w === cssW && h === cssH) {
      if (rail !== previousRail) {
        layout = computeLayout(textCanvas.width, textCanvas.height, rail);
        textDirty = true;
      }
      return;
    }
    cssW = w;
    cssH = h;
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    renderer.setPixelRatio(ratio);
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(w * ratio, h * ratio);

    const textW = Math.min(MAX_TEXT_WIDTH, Math.round(w * ratio));
    textCanvas.width = textW;
    textCanvas.height = Math.max(1, Math.round((textW * h) / w));
    textTexture.dispose();
    layout = computeLayout(textCanvas.width, textCanvas.height, rail);
    uniforms.uBands.value = layout.compact ? 9 : 7;

    streamCamera.right = w;
    streamCamera.top = h;
    streamCamera.updateProjectionMatrix();
    textDirty = true;
  }

  // ── the well: squares fall from the top edge, one row per block
  // produced, and lock Tetris-style on the floor above the footer ──
  function wellGeometry() {
    const cols = Math.max(8, Math.round(cssW / (layout.compact ? 28 : 38)));
    const cell = cssW / cols;
    const floor = cssH * (1 - rail);
    const rows = Math.ceil((cssH - floor) / cell) + 1;
    return { cols, cell, floor, rows };
  }

  function release(b: Block, now: number, cleared = false) {
    if (b.dyingAt !== null) return;
    b.dyingAt = now;
    b.cleared = cleared;
    const stack = columns[b.col];
    const i = stack ? stack.indexOf(b) : -1;
    if (i >= 0) stack.splice(i, 1);
  }

  function syncWell() {
    const { cols } = wellGeometry();
    if (columns.length === cols) return;
    // the grid changed (resize, rotate): start a fresh well
    columns.length = 0;
    for (let i = 0; i < cols; i++) columns.push([]);
    blocks.length = 0;
  }

  /** Gravity tick: runs once per block produced, so the fall keeps slot time. */
  function tick(now: number) {
    for (const stack of columns) {
      for (let i = 0; i < stack.length; i++) {
        const b = stack[i];
        if (b.row > i) b.row -= 1;
        if (b.row <= i) {
          b.row = i;
          if (b.lockedAt === null) b.lockedAt = now;
        }
      }
    }
    // a full bottom row clears once every square in it has landed
    if (
      columns.length &&
      columns.every((stack) => stack[0] && stack[0].lockedAt !== null)
    ) {
      for (const stack of columns) release(stack[0], now, true);
    }
  }

  function updateStream(now: number, dt: number) {
    const { cell, floor } = wellGeometry();
    const size = cell * 0.86;
    // each one-row drop finishes well inside a slot, so the fall reads as
    // steps at block-production cadence
    const stepMs = Math.max(40, Math.min(110, slotMs * 0.45)) / motion.stream;
    const step = 1 - Math.exp((-dt * 1000 * 3) / stepMs);
    const alphaAll = uniforms.uStream.value;
    let n = 0;
    for (let i = blocks.length - 1; i >= 0; i--) {
      const b = blocks[i];
      b.y += (b.row - b.y) * step;

      let scale = 1;
      let glow = 1;
      let white = 0;
      if (b.dyingAt !== null) {
        const outT = Math.min(
          1,
          (now - b.dyingAt) / (b.cleared ? CLEAR_MS : POP_OUT_MS),
        );
        if (outT >= 1) {
          blocks.splice(i, 1);
          continue;
        }
        scale = 1 - outT * outT;
        if (b.cleared) {
          white = 1 - outT;
          glow = 1 + 2 * (1 - outT);
        }
      } else if (b.lockedAt !== null) {
        glow = 0.75 + 1.4 * Math.exp(-(now - b.lockedAt) / LOCK_FLASH_MS);
      }

      dummy.position.set(
        (b.col + 0.5) * cell,
        floor + b.y * cell + size / 2,
        0,
      );
      dummy.scale.set(size * scale, size * scale, 1);
      dummy.updateMatrix();
      squares.setMatrixAt(n, dummy.matrix);
      blockTint.setXYZW(
        n,
        b.rgb[0] + (1 - b.rgb[0]) * white,
        b.rgb[1] + (1 - b.rgb[1]) * white,
        b.rgb[2] + (1 - b.rgb[2]) * white,
        alphaAll * glow,
      );
      n++;
    }
    squares.count = n;
    squares.instanceMatrix.needsUpdate = true;
    blockTint.needsUpdate = true;
  }

  function frame(now: number) {
    if (disposed || !running) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, lastFrame ? (now - lastFrame) / 1000 : 0.016);
    lastFrame = now;
    time += dt * motion.time;

    resize();

    const ease = 1 - Math.exp((-dt * 1000 * 3) / GAIN_EASE_MS);
    for (let i = 0; i < 4; i++) {
      gains[i] += (targets[i] - gains[i]) * ease;
      if (Math.abs(targets[i] - gains[i]) < 0.002) gains[i] = targets[i];
    }
    flicker *= Math.exp((-dt * 1000) / FLICKER_DECAY_MS);

    uniforms.uTime.value = time;
    uniforms.uGain.value.set(gains[0], gains[1], gains[2], gains[3]);
    uniforms.uFlicker.value = flicker * motion.flicker;
    uniforms.uStream.value = 1 - Math.min(1, Math.max(0, ambient / 0.35));

    const slotRoll = Math.min(ROLL_MS, Math.max(120, slotMs * 0.9));
    if (
      textDirty ||
      slotField.rolling(now, slotRoll + 34) ||
      msField.rolling(now, ROLL_MS + 34)
    ) {
      textDirty = false;
      drawText(now);
    }

    renderer.clear();
    syncWell();
    if (uniforms.uStream.value > 0.001 || blocks.length) {
      updateStream(now, dt);
      if (uniforms.uStream.value > 0.001 && squares.count > 0)
        renderer.render(streamScene, streamCamera);
    }
    renderer.render(plateScene, plateCamera);
  }

  // Canvas text can only use a face that has loaded.
  void Promise.all([document.fonts.load(`700 64px ${FONT_DISPLAY}`)])
    .catch(() => {})
    .then(() => {
      textDirty = true;
    });

  return {
    pushBlock(slot, family, client) {
      if (!anyLight()) return; // every light cut: the counter stops
      const now = performance.now();
      if (slotField.set(groupSlot(slot), now)) hasSlot = true;
      const lit = family === null || targets[CLIENT_INDEX[family]] > 0;
      if (!lit) return;
      flicker = 1;
      if (!columns.length) return;
      tick(now);
      if (ambient >= 0.35 || !running || blocks.length >= MAX_BLOCKS) return;
      // reduced motion: half as many squares in the air
      if (options.reducedMotion && slot % 2 === 1) return;

      // any column near the low-water mark, so stacks grow uneven but rows
      // still fill and clear
      const lowest = Math.min(...columns.map((stack) => stack.length));
      const open = columns.flatMap((stack, i) =>
        stack.length <= lowest + 2 && stack.length < MAX_ROWS ? [i] : [],
      );
      if (!open.length) return;
      // each validator client drops around its own home column
      const cols = columns.length;
      const home =
        nameHash(client ?? "unknown") * cols +
        (Math.random() + Math.random() - 1) * cols * 0.14;
      const col = open.reduce((best, i) =>
        Math.abs(i - home) < Math.abs(best - home) ? i : best,
      );
      const { rows } = wellGeometry();
      const block: Block = {
        lockedAt: null,
        dyingAt: null,
        cleared: false,
        family,
        rgb: family ? CLIENTS[CLIENT_INDEX[family]].rgb : NEUTRAL_RGB,
        col,
        row: rows,
        y: rows,
      };
      columns[col].push(block);
      blocks.push(block);
    },
    setFinality(ms) {
      if (
        msField.set(
          ms === null ? "" : String(Math.round(ms)),
          performance.now(),
        )
      )
        textDirty = true;
    },
    setSlotMs(ms) {
      if (ms > 50 && ms < 2000) slotMs = ms;
    },
    setGains(next) {
      const now = performance.now();
      for (const client of CLIENTS) {
        const i = CLIENT_INDEX[client.id];
        targets[i] = client.live ? next[client.id] : 0;
      }
      const dark = !anyLight();
      for (const b of blocks) {
        if (b.dyingAt !== null) continue;
        const cut = b.family !== null && targets[CLIENT_INDEX[b.family]] <= 0;
        if (cut || dark) release(b, now);
      }
    },
    setAmbient(progress) {
      ambient = progress;
    },
    setRunning(next) {
      if (disposed || next === running) return;
      running = next;
      if (running) {
        lastFrame = 0;
        raf = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(raf);
      }
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      textTexture.dispose();
      plateGeometry.dispose();
      plateMaterial.dispose();
      blockGeometry.dispose();
      blockMaterial.dispose();
      renderer.dispose();
    },
  };
}
