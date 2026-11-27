"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STAGE_COLORS, type FlowStage } from "@/data/agents";

/** Requests travel left to right over the top arc; responses return below. */
const OUTBOUND: Record<FlowStage, boolean> = {
  request: true,
  challenge: false,
  payment: true,
  success: false,
};

const TRAVEL_MS = 1100;
const PAUSE_MS = 380;
const HOLD_MS = 1800;
const STAGE_MS = TRAVEL_MS + PAUSE_MS;
const TRAIL = 6;
const NODE_X = 2.35;

function glowTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.35)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function arc(outbound: boolean) {
  const y = outbound ? 0.95 : -0.95;
  return new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(outbound ? -NODE_X : NODE_X, 0, 0),
    new THREE.Vector3(0, y * 2, 0),
    new THREE.Vector3(outbound ? NODE_X : -NODE_X, 0, 0),
  );
}

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Draws the request/payment loop between two endpoints and reports the
 * active stage through `onStage`. Changing `stages` or `replayKey` restarts
 * the loop. With `still`, it renders one finished frame and never animates.
 * `onUnavailable` fires when WebGL cannot start, so the caller can show its
 * fallback.
 */
export default function FlowScene({
  stages,
  replayKey,
  still,
  onStage,
  onUnavailable,
}: {
  stages: readonly FlowStage[];
  replayKey: number;
  still: boolean;
  onStage: (index: number) => void;
  onUnavailable: () => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stagesRef = useRef(stages);
  const startRef = useRef(0);
  const onStageRef = useRef(onStage);
  const redrawRef = useRef<() => void>(() => {});
  onStageRef.current = onStage;

  useEffect(() => {
    stagesRef.current = stages;
    startRef.current = performance.now();
    redrawRef.current();
  }, [stages, replayKey]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      onUnavailable();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.set(0, 0, 9);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(item: T) => {
      disposables.push(item);
      return item;
    };

    // Endpoints: a ring with a core on each side.
    const ringGeometry = track(new THREE.TorusGeometry(0.42, 0.018, 12, 96));
    const coreGeometry = track(new THREE.SphereGeometry(0.12, 24, 24));
    const rings: THREE.Mesh[] = [];
    for (const x of [-NODE_X, NODE_X]) {
      const ringMaterial = track(
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.55,
        }),
      );
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.x = x;
      const outer = new THREE.Mesh(ringGeometry, ringMaterial);
      outer.scale.setScalar(1.45);
      outer.position.x = x;
      outer.rotation.x = Math.PI / 2.6;
      const core = new THREE.Mesh(
        coreGeometry,
        track(new THREE.MeshBasicMaterial({ color: 0xffffff })),
      );
      core.position.x = x;
      scene.add(ring, outer, core);
      rings.push(ring, outer);
    }

    // The two arcs the packet travels along.
    const arcs = { out: arc(true), back: arc(false) };
    const arcMaterials = {
      out: track(
        new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.18,
        }),
      ),
      back: track(
        new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.18,
        }),
      ),
    };
    for (const key of ["out", "back"] as const) {
      const geometry = track(
        new THREE.BufferGeometry().setFromPoints(arcs[key].getPoints(96)),
      );
      scene.add(new THREE.Line(geometry, arcMaterials[key]));
    }

    // Packet with a fading trail.
    const texture = track(glowTexture());
    const packet: THREE.Sprite[] = [];
    for (let i = 0; i < TRAIL; i += 1) {
      const material = track(
        new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: i === 0 ? 1 : 0.55 * (1 - i / TRAIL),
        }),
      );
      const sprite = new THREE.Sprite(material);
      const scale = i === 0 ? 0.7 : 0.45 * (1 - i / TRAIL) + 0.12;
      sprite.scale.setScalar(scale);
      scene.add(sprite);
      packet.push(sprite);
    }

    // A quiet field of points behind everything.
    const fieldCount = 220;
    const positions = new Float32Array(fieldCount * 3);
    for (let i = 0; i < fieldCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = -2 - Math.random() * 4;
    }
    const fieldGeometry = track(new THREE.BufferGeometry());
    fieldGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    const field = new THREE.Points(
      fieldGeometry,
      track(
        new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.025,
          transparent: true,
          opacity: 0.35,
        }),
      ),
    );
    scene.add(field);

    const color = new THREE.Color();
    let lastStage = -2;

    function placePacket(curve: THREE.Curve<THREE.Vector3>, t: number) {
      packet.forEach((sprite, i) => {
        const u = Math.max(0, t - i * 0.035);
        sprite.position.copy(curve.getPoint(u));
        sprite.visible = t > 0 && t <= 1;
      });
    }

    function paintStage(stage: FlowStage, active: number) {
      color.set(STAGE_COLORS[stage]);
      packet.forEach((sprite) => sprite.material.color.copy(color));
      const outbound = OUTBOUND[stage];
      arcMaterials.out.color.set(outbound ? color : 0xffffff);
      arcMaterials.back.color.set(outbound ? 0xffffff : color);
      arcMaterials.out.opacity = outbound ? 0.18 + 0.5 * active : 0.18;
      arcMaterials.back.opacity = outbound ? 0.18 : 0.18 + 0.5 * active;
    }

    function frame(now: number) {
      const current = stagesRef.current;
      if (still) {
        // A finished loop: both arcs lit, the packet resting at the agent.
        arcMaterials.out.color.set(STAGE_COLORS.request);
        arcMaterials.out.opacity = 0.55;
        const last = current[current.length - 1] ?? "success";
        arcMaterials.back.color.set(STAGE_COLORS[last]);
        arcMaterials.back.opacity = 0.55;
        packet.forEach((sprite) => (sprite.visible = false));
        if (lastStage !== current.length - 1) {
          lastStage = current.length - 1;
          onStageRef.current(lastStage);
        }
        renderer.render(scene, camera);
        return;
      }

      const elapsed = now - startRef.current;
      const cycle = current.length * STAGE_MS + HOLD_MS;
      const local = elapsed % cycle;
      const index = Math.floor(local / STAGE_MS);

      if (index < current.length) {
        const stage = current[index]!;
        const within = local - index * STAGE_MS;
        const t = Math.min(1, within / TRAVEL_MS);
        placePacket(OUTBOUND[stage] ? arcs.out : arcs.back, easeInOut(t));
        paintStage(stage, within < TRAVEL_MS ? 1 : 0.6);
        if (index !== lastStage) {
          lastStage = index;
          onStageRef.current(index);
        }
      } else {
        packet.forEach((sprite) => (sprite.visible = false));
        arcMaterials.out.opacity = 0.18;
        arcMaterials.back.opacity = 0.18;
      }

      const spin = now * 0.0004;
      rings.forEach((ring, i) => {
        ring.rotation.y = spin * (i % 2 === 0 ? 1 : -1.3);
      });
      field.rotation.z = now * 0.00002;
      renderer.render(scene, camera);
    }

    function resize() {
      const width = mount!.clientWidth;
      const height = mount!.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = width / height;
      // Fit the endpoints at 20% and 80% of the width on any aspect ratio,
      // so the HTML labels in the overlay line up with them.
      const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
      camera.position.z = NODE_X / (0.6 * Math.tan(halfFov) * camera.aspect);
      camera.updateProjectionMatrix();
      frame(performance.now());
    }

    let raf = 0;
    let visible = true;
    const loop = (now: number) => {
      frame(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (still || raf || !visible || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    redrawRef.current = () => {
      lastStage = -2;
      frame(performance.now());
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) start();
      else stop();
    });
    intersectionObserver.observe(mount);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    startRef.current = performance.now();
    resize();
    start();

    return () => {
      stop();
      redrawRef.current = () => {};
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [still, onUnavailable]);

  return <div ref={mountRef} className="absolute inset-0" />;
}
