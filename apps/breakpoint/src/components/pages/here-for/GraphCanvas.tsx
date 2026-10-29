"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { GraphIndex, HereForView } from "./graph-index";
import { isMutual } from "./graph-index";

export type GraphCanvasHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  fit: () => void;
  flyTo: (node: number) => void;
};

export type GraphLabel = { node: number; text: string; tone: LabelTone };
export type LabelTone = "focus" | "you" | "mutual" | "plain" | "community";

type GraphCanvasProps = {
  index: GraphIndex;
  focus: number | null;
  you: number | null;
  view: HereForView;
  path: number[];
  near: Set<number> | null;
  labels: GraphLabel[];
  reducedMotion: boolean;
  onSelect: (node: number) => void;
  onEgg: () => void;
  onZoomChange: (percent: number) => void;
  onHandle?: (handle: GraphCanvasHandle | null) => void;
};

// Breakpoint core tokens (tailwind.config.ts). three.js needs raw values.
const COLOR = {
  purple: new THREE.Color("#aa67fb"),
  green: new THREE.Color("#14f195"),
  yellow: new THREE.Color("#c0e021"),
  blue: new THREE.Color("#3c91ff"),
  pink: new THREE.Color("#e65ddb"),
  white: new THREE.Color("#ffffff"),
  // Neutrals lean slightly toward the purple links so the crowd isn't flat grey.
  node: new THREE.Color("#e4dcf5"),
  ghost: new THREE.Color("#6a6578"),
  black: new THREE.Color("#000000"),
};

const COMMUNITY_PALETTE = [
  COLOR.purple,
  COLOR.blue,
  COLOR.yellow,
  COLOR.green,
  COLOR.white,
].flatMap((c) => [c, c.clone().multiplyScalar(0.55)]);
const INCOMING_COLOR = COLOR.white.clone().multiplyScalar(0.6);

const EGG_DISTANCE = 1.45;
const FLY_MS = 700;
// Desktop map size the link brightness was tuned at.
const REFERENCE_AREA = 728 * 756;
const IDLE_ORBIT_MS = 12000;

// Stable 0..1 per node, so the crowd shimmers a little instead of reading as one flat tone.
const nodeJitter = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

const GraphCanvas = forwardRef<GraphCanvasHandle, GraphCanvasProps>(
  function GraphCanvas(props, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const labelLayerRef = useRef<HTMLDivElement>(null);
    const stateRef = useRef<SceneState | null>(null);
    const propsRef = useRef(props);
    propsRef.current = props;

    const { index } = props;
    const { onHandle } = props;
    const radius = useMemo(() => boundingRadius(index), [index]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const state = createScene(container, index, radius, propsRef);
      stateRef.current = state;
      return () => {
        state.dispose();
        stateRef.current = null;
      };
    }, [index, radius]);

    // Restyling walks every node and link, so only run it when the selection
    // or view changes, never on zoom or label updates.
    const { focus, you, view, path, near } = props;
    useEffect(() => {
      stateRef.current?.restyle(propsRef.current);
    }, [index, focus, you, view, path, near]);

    useEffect(() => {
      stateRef.current?.setLabels(props.labels, labelLayerRef.current);
    }, [index, props.labels]);

    useEffect(() => {
      stateRef.current?.setReducedMotion(props.reducedMotion);
    }, [index, props.reducedMotion]);

    const handle = useMemo<GraphCanvasHandle>(
      () => ({
        zoomIn: () => stateRef.current?.zoomBy(0.8),
        zoomOut: () => stateRef.current?.zoomBy(1.25),
        fit: () => stateRef.current?.fit(),
        flyTo: (node) => stateRef.current?.flyTo(node),
      }),
      [],
    );
    useImperativeHandle(ref, () => handle, [handle]);
    useEffect(() => {
      onHandle?.(handle);
      return () => onHandle?.(null);
    }, [handle, onHandle]);

    return (
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
      >
        <div
          ref={labelLayerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        />
      </div>
    );
  },
);

export default GraphCanvas;

type SceneState = {
  restyle: (props: GraphCanvasProps) => void;
  setReducedMotion: (reduced: boolean) => void;
  setLabels: (labels: GraphLabel[], layer: HTMLDivElement | null) => void;
  zoomBy: (factor: number) => void;
  fit: () => void;
  flyTo: (node: number) => void;
  dispose: () => void;
};

function boundingRadius(index: GraphIndex) {
  const { positions } = index.payload;
  const distances: number[] = [];
  for (let i = 0; i < positions.length; i += 3) {
    distances.push(
      Math.hypot(positions[i]!, positions[i + 1]!, positions[i + 2]!),
    );
  }
  distances.sort((a, b) => a - b);
  return Math.max(distances[Math.floor(distances.length * 0.9)] ?? 400, 200);
}

function createScene(
  container: HTMLDivElement,
  index: GraphIndex,
  radius: number,
  propsRef: React.MutableRefObject<GraphCanvasProps>,
): SceneState {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.5 : 2));
  renderer.setClearColor(0x000000, 1);
  renderer.domElement.className = "block h-full w-full";
  container.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 1, radius * 20);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = radius * 0.05;
  controls.maxDistance = radius * 6;
  controls.autoRotateSpeed = 0.35;
  controls.enablePan = true;
  controls.screenSpacePanning = true;

  const { positions, handles } = index.payload;
  const size = handles.length;

  // Nodes: one instanced draw call.
  const nodeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const nodeMaterial = new THREE.MeshBasicMaterial({ toneMapped: false });
  const nodes = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, size);
  nodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(nodes);

  // Links: one line-segment draw call. Additive blending means a darker
  // vertex colour reads as a fainter line, which is how we fade the crowd.
  const linkCount = index.payload.links.length / 2;
  const linkPositions = new Float32Array(linkCount * 6);
  const linkColors = new Float32Array(linkCount * 6);
  for (let i = 0; i < linkCount; i++) {
    const a = index.payload.links[i * 2]! * 3;
    const b = index.payload.links[i * 2 + 1]! * 3;
    for (let axis = 0; axis < 3; axis++) {
      linkPositions[i * 6 + axis] = positions[a + axis]!;
      linkPositions[i * 6 + 3 + axis] = positions[b + axis]!;
    }
  }
  const linkGeometry = new THREE.BufferGeometry();
  linkGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(linkPositions, 3),
  );
  const linkColorAttribute = new THREE.BufferAttribute(linkColors, 3);
  linkColorAttribute.setUsage(THREE.DynamicDrawUsage);
  linkGeometry.setAttribute("color", linkColorAttribute);
  const links = new THREE.LineSegments(
    linkGeometry,
    new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  scene.add(links);

  // Selection layer: the focused person's links and your path, drawn on top.
  const highlightGeometry = new THREE.BufferGeometry();
  const highlightCapacity = linkCount + size;
  const highlightPositions = new Float32Array(highlightCapacity * 6);
  const highlightColors = new Float32Array(highlightCapacity * 6);
  const highlightPositionAttribute = new THREE.BufferAttribute(
    highlightPositions,
    3,
  );
  const highlightColorAttribute = new THREE.BufferAttribute(highlightColors, 3);
  highlightPositionAttribute.setUsage(THREE.DynamicDrawUsage);
  highlightColorAttribute.setUsage(THREE.DynamicDrawUsage);
  highlightGeometry.setAttribute("position", highlightPositionAttribute);
  highlightGeometry.setAttribute("color", highlightColorAttribute);
  highlightGeometry.setDrawRange(0, 0);
  const highlight = new THREE.LineSegments(
    highlightGeometry,
    new THREE.LineBasicMaterial({
      vertexColors: true,
      depthTest: false,
      toneMapped: false,
    }),
  );
  highlight.renderOrder = 2;
  highlight.frustumCulled = false;
  scene.add(highlight);

  // The lone node: unconnected, far outside the crowd.
  const egg = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: COLOR.pink, toneMapped: false }),
  );
  egg.position.set(radius * EGG_DISTANCE, radius * 0.55, -radius * 0.35);
  egg.scale.setScalar(Math.max(radius * 0.012, 4));
  scene.add(egg);

  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();

  let density = 1;
  const restyle = (props: GraphCanvasProps) => {
    const { focus, you, view, path, near } = props;
    const inDegree = index.payload.inDegree;
    const related = new Set<number>(path);
    if (focus !== null) {
      related.add(focus);
      index.outs[focus]!.forEach((n) => related.add(n));
      index.ins[focus]!.forEach((n) => related.add(n));
    }
    const dimOthers = focus !== null || view === "network";
    const base = radius * 0.006;

    for (let i = 0; i < size; i++) {
      const claimed = index.payload.claimed[i] === 1;
      let scale = base * (claimed ? 1 : 0.7);
      let brightness = (claimed ? 0.6 : 0.42) * (0.8 + nodeJitter(i) * 0.4);
      color.copy(claimed ? COLOR.node : COLOR.ghost);

      if (view === "most") scale = base * (0.8 + Math.sqrt(inDegree[i] ?? 0));
      if (view === "communities") {
        color.copy(
          COMMUNITY_PALETTE[index.payload.community[i]!] ?? COLOR.ghost,
        );
        brightness = 0.85;
      }
      if (dimOthers && !related.has(i) && !(near?.has(i) ?? false)) {
        brightness *= 0.35;
      }
      if (view === "network" && near?.has(i)) brightness = 0.9;
      if (related.has(i)) {
        brightness = 1;
        scale = Math.max(scale, base * 1.6);
      }
      if (focus !== null && i !== focus && isMutual(index, i, focus)) {
        color.copy(COLOR.green);
      }
      if (i === you) {
        color.copy(COLOR.yellow);
        brightness = 1;
        scale = base * 2.4;
      }
      if (i === focus) {
        color.copy(COLOR.white);
        brightness = 1;
        scale = base * 2.8;
      }
      color.multiplyScalar(brightness);
      nodes.setColorAt(i, color);
      const p = i * 3;
      matrix.makeScale(scale, scale, scale);
      matrix.setPosition(positions[p]!, positions[p + 1]!, positions[p + 2]!);
      nodes.setMatrixAt(i, matrix);
    }
    nodes.instanceMatrix.needsUpdate = true;
    if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true;

    // Smaller canvases pack the same links into fewer pixels, so fade them more.
    const crowd =
      (view === "communities" ? 0.03 : dimOthers ? 0.012 : 0.028) * density;
    for (let i = 0; i < linkCount; i++) {
      const a = index.payload.links[i * 2]!;
      const b = index.payload.links[i * 2 + 1]!;
      const mutual = index.linkMutual[i] === 1;
      let tone = COLOR.purple;
      let strength = crowd;
      if (view === "communities") {
        tone =
          index.payload.community[a] === index.payload.community[b]
            ? (COMMUNITY_PALETTE[index.payload.community[a]!] ?? COLOR.ghost)
            : COLOR.ghost;
      } else if (mutual) {
        tone = COLOR.green;
        strength = crowd * 2.4;
      }
      if (view === "mutuals" && !mutual) strength = 0;
      if (view === "network" && !(near?.has(a) && near?.has(b))) {
        strength *= 0.25;
      }
      color.copy(tone).multiplyScalar(strength);
      linkColors[i * 6] = linkColors[i * 6 + 3] = color.r;
      linkColors[i * 6 + 1] = linkColors[i * 6 + 4] = color.g;
      linkColors[i * 6 + 2] = linkColors[i * 6 + 5] = color.b;
    }
    linkColorAttribute.needsUpdate = true;

    // Highlight layer.
    let segmentCount = 0;
    const addHighlight = (a: number, b: number, tone: THREE.Color) => {
      const offset = segmentCount++ * 6;
      for (let axis = 0; axis < 3; axis++) {
        highlightPositions[offset + axis] = positions[a * 3 + axis]!;
        highlightPositions[offset + 3 + axis] = positions[b * 3 + axis]!;
      }
      highlightColors[offset] = highlightColors[offset + 3] = tone.r;
      highlightColors[offset + 1] = highlightColors[offset + 4] = tone.g;
      highlightColors[offset + 2] = highlightColors[offset + 5] = tone.b;
    };
    if (focus !== null) {
      for (const to of index.outs[focus]!) {
        addHighlight(
          focus,
          to,
          isMutual(index, focus, to) ? COLOR.green : COLOR.purple,
        );
      }
      for (const from of index.ins[focus]!) {
        if (isMutual(index, focus, from)) continue;
        addHighlight(from, focus, INCOMING_COLOR);
      }
    }
    for (let i = 0; i + 1 < path.length; i++) {
      addHighlight(path[i]!, path[i + 1]!, COLOR.yellow);
    }
    highlightGeometry.setDrawRange(0, segmentCount * 2);
    highlightPositionAttribute.needsUpdate = true;
    highlightColorAttribute.needsUpdate = true;
    requestRender();
  };

  // Camera helpers.
  // Fit whichever axis is tighter, so portrait phones don't crop the sides.
  const fitDistance = () => {
    const halfVertical = THREE.MathUtils.degToRad(camera.fov / 2);
    const halfHorizontal = Math.atan(Math.tan(halfVertical) * camera.aspect);
    return (radius * 1.15) / Math.sin(Math.min(halfVertical, halfHorizontal));
  };
  let flight: {
    start: number;
    fromTarget: THREE.Vector3;
    toTarget: THREE.Vector3;
    fromPos: THREE.Vector3;
    toPos: THREE.Vector3;
  } | null = null;

  const moveCamera = (target: THREE.Vector3, distance: number) => {
    const direction = camera.position
      .clone()
      .sub(controls.target)
      .normalize()
      .multiplyScalar(distance);
    const toPos = target.clone().add(direction);
    if (propsRef.current.reducedMotion) {
      controls.target.copy(target);
      camera.position.copy(toPos);
      flight = null;
      requestRender();
      return;
    }
    flight = {
      start: performance.now(),
      fromTarget: controls.target.clone(),
      toTarget: target,
      fromPos: camera.position.clone(),
      toPos,
    };
    requestRender();
  };

  const nodeVector = (node: number) =>
    new THREE.Vector3(
      positions[node * 3]!,
      positions[node * 3 + 1]!,
      positions[node * 3 + 2]!,
    );

  const fit = () => moveCamera(new THREE.Vector3(), fitDistance());
  const flyTo = (node: number) =>
    moveCamera(
      nodeVector(node),
      Math.min(camera.position.distanceTo(controls.target), radius * 0.9),
    );
  const zoomBy = (factor: number) => {
    const distance = THREE.MathUtils.clamp(
      camera.position.distanceTo(controls.target) * factor,
      controls.minDistance,
      controls.maxDistance,
    );
    moveCamera(controls.target.clone(), distance);
  };

  camera.position.set(0, radius * 0.25, fitDistance());
  controls.target.set(0, 0, 0);
  controls.update();

  // Picking: click without drag selects. Instanced raycasts stay cheap at 10k.
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let downAt: { x: number; y: number } | null = null;
  const pick = (event: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    const eggHit = raycaster.intersectObject(egg, false)[0];
    if (eggHit) return { egg: true as const };
    // Inflate hit targets so small nodes are tappable.
    const hits = raycaster.intersectObject(nodes, false);
    if (hits[0]?.instanceId !== undefined) return { node: hits[0].instanceId };
    return pickNearest(event, rect);
  };
  const projected = new THREE.Vector3();
  const pickNearest = (event: PointerEvent, rect: DOMRect) => {
    const tolerance = coarse ? 22 : 12;
    let best = -1;
    let bestDistance = tolerance;
    for (let i = 0; i < size; i++) {
      projected
        .set(positions[i * 3]!, positions[i * 3 + 1]!, positions[i * 3 + 2]!)
        .project(camera);
      if (projected.z < -1 || projected.z > 1) continue;
      const x = ((projected.x + 1) / 2) * rect.width + rect.left;
      const y = ((1 - projected.y) / 2) * rect.height + rect.top;
      const d = Math.hypot(x - event.clientX, y - event.clientY);
      if (d < bestDistance) {
        bestDistance = d;
        best = i;
      }
    }
    return best >= 0 ? { node: best } : null;
  };

  const onPointerDown = (event: PointerEvent) => {
    downAt = { x: event.clientX, y: event.clientY };
    stopIdle();
  };
  const onPointerUp = (event: PointerEvent) => {
    if (!downAt) return;
    const moved = Math.hypot(
      event.clientX - downAt.x,
      event.clientY - downAt.y,
    );
    downAt = null;
    if (moved > 6) return;
    const hit = pick(event);
    if (!hit) return;
    if ("egg" in hit) propsRef.current.onEgg();
    else propsRef.current.onSelect(hit.node);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "+" || event.key === "=") zoomBy(0.8);
    else if (event.key === "-" || event.key === "_") zoomBy(1.25);
    else return;
    event.preventDefault();
  };
  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointerup", onPointerUp);
  renderer.domElement.addEventListener("wheel", stopIdle, { passive: true });
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute(
    "aria-label",
    "Connection map. Drag to orbit, scroll or pinch to zoom, plus and minus keys to zoom.",
  );
  renderer.domElement.addEventListener("keydown", onKeyDown);

  // Idle auto-orbit: off for reduced motion, pauses on any input.
  let idleTimer = 0;
  function stopIdle() {
    controls.autoRotate = false;
    window.clearTimeout(idleTimer);
    if (propsRef.current.reducedMotion) return;
    idleTimer = window.setTimeout(() => {
      controls.autoRotate = true;
      requestRender();
    }, IDLE_ORBIT_MS);
  }
  controls.autoRotate = !propsRef.current.reducedMotion;
  controls.addEventListener("start", stopIdle);
  const onControlsChange = () => requestRender();
  controls.addEventListener("change", onControlsChange);

  // Labels: a handful of DOM nodes positioned each frame.
  let labelEls: { node: number; el: HTMLElement }[] = [];
  const setLabels = (labels: GraphLabel[], layer: HTMLDivElement | null) => {
    if (!layer) return;
    layer.replaceChildren();
    labelEls = labels.map((label) => {
      const el = document.createElement("span");
      el.textContent = label.text;
      el.className = LABEL_CLASS[label.tone];
      layer.appendChild(el);
      return { node: label.node, el };
    });
    requestRender();
  };
  const placeLabels = () => {
    const width = renderer.domElement.clientWidth;
    const height = renderer.domElement.clientHeight;
    for (const { node, el } of labelEls) {
      projected
        .set(
          positions[node * 3]!,
          positions[node * 3 + 1]!,
          positions[node * 3 + 2]!,
        )
        .project(camera);
      if (projected.z < -1 || projected.z > 1) {
        el.style.visibility = "hidden";
        continue;
      }
      el.style.visibility = "visible";
      const x = ((projected.x + 1) / 2) * width + 10;
      const y = ((1 - projected.y) / 2) * height - 10;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }
  };

  // Render loop: runs while something moves, sleeps otherwise.
  let frame = 0;
  let inViewport = false;
  let visible = false;
  let lastZoom = -1;
  function requestRender() {
    if (!frame && visible) frame = requestAnimationFrame(tick);
  }
  function tick(now: number) {
    frame = 0;
    if (flight) {
      const t = easeOutExpo(Math.min(1, (now - flight.start) / FLY_MS));
      controls.target.lerpVectors(flight.fromTarget, flight.toTarget, t);
      camera.position.lerpVectors(flight.fromPos, flight.toPos, t);
      if (t >= 1) flight = null;
    }
    const moving = controls.update() || flight !== null || controls.autoRotate;
    renderer.render(scene, camera);
    placeLabels();
    const zoom = Math.round(
      (fitDistance() / camera.position.distanceTo(controls.target)) * 100,
    );
    if (zoom !== lastZoom) {
      lastZoom = zoom;
      propsRef.current.onZoomChange(zoom);
    }
    if (moving) requestRender();
  }

  let sized = false;
  const resize = () => {
    const { clientWidth, clientHeight } = container;
    if (!clientWidth || !clientHeight) return;
    const nextDensity = THREE.MathUtils.clamp(
      Math.sqrt((clientWidth * clientHeight) / REFERENCE_AREA),
      0.3,
      1,
    );
    if (Math.abs(nextDensity - density) > 0.05) {
      density = nextDensity;
      restyle(propsRef.current);
    }
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    // The camera is placed before the first real size is known; re-fit once.
    if (!sized) {
      sized = true;
      camera.position
        .sub(controls.target)
        .setLength(fitDistance())
        .add(controls.target);
    }
    requestRender();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const updateVisibility = () => {
    visible = inViewport && !document.hidden;
    if (visible) requestRender();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
  const intersection = new IntersectionObserver(([entry]) => {
    inViewport = entry?.isIntersecting ?? false;
    updateVisibility();
  });
  document.addEventListener("visibilitychange", updateVisibility);
  intersection.observe(container);
  resize();
  restyle(propsRef.current);

  return {
    restyle,
    setReducedMotion(reduced) {
      window.clearTimeout(idleTimer);
      controls.autoRotate = !reduced;
      if (reduced && flight) {
        controls.target.copy(flight.toTarget);
        camera.position.copy(flight.toPos);
        flight = null;
      }
      requestRender();
    },
    setLabels,
    zoomBy,
    fit,
    flyTo,
    dispose() {
      cancelAnimationFrame(frame);
      window.clearTimeout(idleTimer);
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("wheel", stopIdle);
      renderer.domElement.removeEventListener("keydown", onKeyDown);
      controls.removeEventListener("start", stopIdle);
      controls.removeEventListener("change", onControlsChange);
      controls.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      linkGeometry.dispose();
      (links.material as THREE.Material).dispose();
      highlightGeometry.dispose();
      (highlight.material as THREE.Material).dispose();
      egg.geometry.dispose();
      (egg.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

const LABEL_BASE =
  "absolute left-0 top-0 whitespace-nowrap px-[5px] py-[2px] font-mono text-3xs uppercase tracking-[0.06em] will-change-transform";

const LABEL_CLASS: Record<LabelTone, string> = {
  focus: `${LABEL_BASE} bg-white text-black`,
  you: `${LABEL_BASE} bg-core-yellow text-black`,
  mutual: `${LABEL_BASE} bg-black/75 text-core-green`,
  plain: `${LABEL_BASE} bg-black/75 text-neutral-100`,
  community: `${LABEL_BASE} border border-stroke-secondary bg-black/80 text-white`,
};
