import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  WebGLRenderer,
} from "three";
import { CLIENTS, CLIENT_INDEX, type ClientId } from "./config";
import {
  POINTS_FRAGMENT,
  POINTS_VERTEX,
  POST_FRAGMENT,
  POST_VERTEX,
} from "./filmShaders";
import {
  SCENE_KEYS,
  buildShape,
  familySplit,
  mulberry32,
  type SceneKey,
} from "./filmShapes";

const MAX_PIXEL_RATIO = 1.5;
const PARTICLES_WIDE = 64_000;
const PARTICLES_NARROW = 26_000;
const CAMERA_Z = 6.2;
const FOV = 40;
const GAIN_EASE_MS = 250;
/**
 * Seconds between ripples per client. Slots are 200ms, so ringing on every
 * block strobes; one ripple per gap keeps the link to block production calm.
 */
const RIPPLE_GAP_S = 2.4;

export interface FilmRenderer {
  /**
   * A block landed: its builder's particles ripple, at most once per
   * RIPPLE_GAP_S. Null ripples both, faintly.
   */
  pushBlock: (_family: ClientId | null) => void;
  /** Target light per client, 0 or 1; eased inside the renderer. */
  setGains: (_gains: Record<ClientId, number>) => void;
  /** Scroll position in scenes: 0 = hero, 1.5 = halfway from scene 1 to 2. */
  setScene: (_value: number) => void;
  setRunning: (_running: boolean) => void;
  dispose: () => void;
}

interface View {
  /** radians per second about Y and about Z */
  spin: [number, number];
  /** x and y as fractions of the half-viewport, then scale */
  wide: [number, number, number];
  narrow: [number, number, number];
}

/** Where each scene sits: beside the copy on wide screens, above it on narrow. */
const VIEWS: Record<SceneKey, View> = {
  iris: { spin: [0, 0], wide: [0, 0.3, 0.95], narrow: [0, 0.45, 0.7] },
  tree: { spin: [0.14, 0], wide: [0.5, 0, 1.3], narrow: [0, 0.42, 0.72] },
  globe: { spin: [0.16, 0], wide: [0.5, 0, 1.2], narrow: [0, 0.42, 0.68] },
  tower: { spin: [0.2, 0], wide: [0.5, 0, 1.2], narrow: [0, 0.42, 0.66] },
  lattice: { spin: [0.12, 0], wide: [0.5, 0, 1.05], narrow: [0, 0.42, 0.6] },
  torus: { spin: [0.26, 0], wide: [0.5, 0, 1.4], narrow: [0, 0.42, 0.8] },
  tunnel: { spin: [0, 0.22], wide: [0.42, 0, 1], narrow: [0, 0.3, 0.6] },
  horizon: { spin: [0, 0], wide: [0, -0.12, 1], narrow: [0, -0.45, 0.42] },
};

const smooth = (t: number) => t * t * (3 - 2 * t);

export function createFilmRenderer(canvas: HTMLCanvasElement): FilmRenderer {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 1);

  const count =
    window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4
      ? PARTICLES_NARROW
      : PARTICLES_WIDE;
  const shapes = SCENE_KEYS.map((key) => buildShape(key, count));

  // ── the cloud ──
  const split = familySplit(count);
  const rand = mulberry32(1010);
  const seeds = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    seeds[i * 4] = rand();
    seeds[i * 4 + 1] = rand();
    seeds[i * 4 + 2] = i < split ? 0 : 1;
    seeds[i * 4 + 3] = rand();
  }
  const geometry = new BufferGeometry();
  const from = new BufferAttribute(new Float32Array(shapes[0]), 3);
  const to = new BufferAttribute(new Float32Array(shapes[1]), 3);
  geometry.setAttribute("position", from);
  geometry.setAttribute("aTarget", to);
  geometry.setAttribute("aSeed", new BufferAttribute(seeds, 4));

  const colA = new Vector3(...CLIENTS[CLIENT_INDEX.agave].rgb);
  const colB = new Vector3(...CLIENTS[CLIENT_INDEX.firedancer].rgb);
  const gain = new Vector2(0, 0);
  const pointUniforms = {
    uMix: { value: 0 },
    uTime: { value: 0 },
    uScale: { value: 1 },
    uSpinA: { value: new Vector2() },
    uSpinB: { value: new Vector2() },
    uPulse: { value: new Vector2(9, 9) },
    uPulseAmp: { value: new Vector2(0, 0) },
    uGain: { value: gain },
    uColA: { value: colA },
    uColB: { value: colB },
  };
  const pointMaterial = new ShaderMaterial({
    uniforms: pointUniforms,
    vertexShader: POINTS_VERTEX,
    fragmentShader: POINTS_FRAGMENT,
    transparent: true,
    blending: AdditiveBlending,
    depthTest: false,
    depthWrite: false,
  });
  const points = new Points(geometry, pointMaterial);
  points.frustumCulled = false;
  const group = new Group();
  group.add(points);
  const scene = new Scene();
  scene.add(group);
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 40);
  camera.position.z = CAMERA_Z;

  // ── the film pass ──
  const target = new WebGLRenderTarget(1, 1, {
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    depthBuffer: false,
  });
  const postUniforms = {
    tScene: { value: target.texture },
    uRes: { value: new Vector2(1, 1) },
    uTime: { value: 0 },
    uGlitch: { value: 0 },
    uHaze: { value: new Vector2(0.5, 0.5) },
    uGain: { value: gain },
    uColA: { value: colA },
    uColB: { value: colB },
  };
  const postMaterial = new ShaderMaterial({
    uniforms: postUniforms,
    vertexShader: POST_VERTEX,
    fragmentShader: POST_FRAGMENT,
    depthTest: false,
    depthWrite: false,
  });
  const postGeometry = new PlaneGeometry(2, 2);
  const postMesh = new Mesh(postGeometry, postMaterial);
  postMesh.frustumCulled = false;
  const postScene = new Scene();
  postScene.add(postMesh);
  const postCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // ── state ──
  let cssW = 1;
  let cssH = 1;
  let needsResize = true;
  let running = false;
  let disposed = false;
  let raf = 0;
  let lastFrame = 0;
  let time = 0;
  let sceneValue = 0;
  let shown = 0;
  let pair = 0;
  let pointerX = 0;
  let pointerY = 0;
  const targets = [1, 1];
  const pulseAt = [-9, -9];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    if (w === cssW && h === cssH) return;
    cssW = w;
    cssH = h;
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    renderer.setPixelRatio(ratio);
    renderer.setSize(w, h, false);
    target.setSize(Math.round(w * ratio), Math.round(h * ratio));
    postUniforms.uRes.value.set(w * ratio, h * ratio);
    pointUniforms.uScale.value = h * ratio * 0.0155;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function setPair(next: number) {
    pair = next;
    from.array.set(shapes[next]);
    to.array.set(shapes[next + 1]);
    from.needsUpdate = true;
    to.needsUpdate = true;
  }

  function frame(now: number) {
    if (disposed || !running) return;
    raf = requestAnimationFrame(frame);
    // Phones draw at 30fps: half the particle and film-pass work per second.
    if (cssW < 768 && lastFrame && now - lastFrame < 1000 / 30 - 0.5) return;
    const dt = Math.min(0.1, lastFrame ? (now - lastFrame) / 1000 : 0.016);
    lastFrame = now;
    time += dt;

    if (needsResize) {
      needsResize = false;
      resize();
    }

    // follow the scroll with a little inertia so cuts read as motion
    shown += (sceneValue - shown) * (1 - Math.exp(-dt * 7));
    if (Math.abs(sceneValue - shown) < 0.0005) shown = sceneValue;
    const last = SCENE_KEYS.length - 2;
    const index = Math.min(last, Math.max(0, Math.floor(shown)));
    if (index !== pair) setPair(index);
    const mix = Math.min(1, Math.max(0, shown - index));

    const ease = 1 - Math.exp((-dt * 1000 * 3) / GAIN_EASE_MS);
    gain.x += (targets[0] - gain.x) * ease;
    gain.y += (targets[1] - gain.y) * ease;

    const a = VIEWS[SCENE_KEYS[index]];
    const b = VIEWS[SCENE_KEYS[index + 1]];
    const narrow = cssW / cssH < 0.9;
    const va = narrow ? a.narrow : a.wide;
    const vb = narrow ? b.narrow : b.wide;
    const e = smooth(mix);
    const halfH = Math.tan((FOV * Math.PI) / 360) * CAMERA_Z;
    const halfW = halfH * camera.aspect;
    const x = (va[0] + (vb[0] - va[0]) * e) * halfW;
    const y = (va[1] + (vb[1] - va[1]) * e) * halfH;
    group.position.set(x, y, 0);
    group.scale.setScalar(va[2] + (vb[2] - va[2]) * e);
    group.rotation.y += (pointerX * 0.16 - group.rotation.y) * 0.05;
    group.rotation.x += (pointerY * 0.1 - group.rotation.x) * 0.05;

    pointUniforms.uMix.value = mix;
    pointUniforms.uTime.value = time;
    pointUniforms.uSpinA.value.set(time * a.spin[0], time * a.spin[1]);
    pointUniforms.uSpinB.value.set(time * b.spin[0], time * b.spin[1]);
    pointUniforms.uPulse.value.set(time - pulseAt[0], time - pulseAt[1]);

    // a cut glitches hardest mid-morph, in bursts rather than a steady smear
    const arc = Math.sin(mix * Math.PI);
    const burst = Math.sin(time * 23) * Math.sin(time * 7.3) > 0.1 ? 1 : 0.2;
    postUniforms.uGlitch.value = arc * arc * burst;
    postUniforms.uTime.value = time;
    postUniforms.uHaze.value.set(0.5 + x / halfW / 2, 0.5 + y / halfH / 2);

    renderer.setRenderTarget(target);
    renderer.clear();
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.render(postScene, postCamera);
  }

  const onResize = () => {
    needsResize = true;
  };
  const onPointer = (ev: PointerEvent) => {
    if (ev.pointerType !== "mouse") return;
    pointerX = (ev.clientX / window.innerWidth) * 2 - 1;
    pointerY = (ev.clientY / window.innerHeight) * 2 - 1;
  };
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(canvas);
  window.addEventListener("resize", onResize);
  window.addEventListener("pointermove", onPointer, { passive: true });

  return {
    pushBlock(family) {
      const amps = pointUniforms.uPulseAmp.value;
      const ripple = (i: number, amp: number) => {
        if (time - pulseAt[i] < RIPPLE_GAP_S) return;
        pulseAt[i] = time;
        amps.setComponent(i, amp);
      };
      if (family === null) {
        ripple(0, 0.35);
        ripple(1, 0.35);
      } else {
        const i = CLIENT_INDEX[family];
        if (targets[i] > 0) ripple(i, 1);
      }
    },
    setGains(next) {
      targets[0] = next.agave > 0 ? 1 : 0;
      targets[1] = next.firedancer > 0 ? 1 : 0;
    },
    setScene(value) {
      sceneValue = Math.min(SCENE_KEYS.length - 1, Math.max(0, value));
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
      resizeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(raf);
      geometry.dispose();
      pointMaterial.dispose();
      postGeometry.dispose();
      postMaterial.dispose();
      target.dispose();
      renderer.dispose();
    },
  };
}
