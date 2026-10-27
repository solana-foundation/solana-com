"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { RpcPath } from "./directory-state";
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
  type PatchLabel,
} from "./rpc-patch-layout";

type Props = {
  path: RpcPath;
  animate: boolean;
  labels: RpcSceneLabels;
  onReady: () => void;
  onLost: () => void;
};

export type RpcSceneLabels = {
  app: string;
  provider: string;
  fallback: string;
  official: string;
  otherApps: string;
  machine: string;
  localValidator: string;
  mainnet: string;
  devnet: string;
};

type Faded = {
  material: THREE.Material & { opacity: number };
  opacity: number;
};
type RouteLayout = {
  group: THREE.Group;
  faded: Faded[];
  request: THREE.CatmullRomCurve3;
  downstream?: THREE.CatmullRomCurve3;
  labels: PatchLabel[];
};
type Controller = { switchPath: (path: RpcPath, animate: boolean) => void };

const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z);
const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

export function RpcRouteScene({
  path,
  animate,
  labels,
  onReady,
  onLost,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const controller = useRef<Controller | null>(null);
  const callbacks = useRef({ onReady, onLost });
  callbacks.current = { onReady, onLost };
  const labelsRef = useRef(labels);
  labelsRef.current = labels;
  const initial = useRef({ path, animate });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      callbacks.current.onLost();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "absolute inset-0 h-full w-full";
    host.appendChild(renderer.domElement);
    const labelLayer = document.createElement("div");
    labelLayer.className =
      "pointer-events-none absolute inset-0 overflow-hidden";
    labelLayer.setAttribute("aria-hidden", "true");
    host.appendChild(labelLayer);
    const labelElements = Array.from({ length: 4 }, () => {
      const element = document.createElement("span");
      element.className =
        "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-brand-mono text-[10px] uppercase tracking-wider text-[#E7DFD0]/70";
      labelLayer.appendChild(element);
      return element;
    });

    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    const textures = new Set<THREE.Texture>();
    const geo = <T extends THREE.BufferGeometry>(item: T): T => {
      geometries.add(item);
      return item;
    };
    const mat = <T extends THREE.Material>(item: T): T => {
      materials.add(item);
      return item;
    };
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    const target = v(PATCH_RACK.x, PATCH_RACK.y, 0);
    const cameraBase = v(PATCH_RACK.x + 0.35, PATCH_RACK.y + 0.5, 12.8);
    camera.position.copy(cameraBase);
    camera.lookAt(target);

    // Flat, unlit materials keep the poster-like patch-bay look; depth comes
    // from layered z offsets and pointer parallax.
    const basicMaterial = (color: THREE.ColorRepresentation, opacity: number) =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
    const rectPoints = (w: number, h: number) => [
      v(-w / 2, -h / 2),
      v(w / 2, -h / 2),
      v(w / 2, h / 2),
      v(-w / 2, h / 2),
      v(-w / 2, -h / 2),
    ];
    const screwGeometry = geo(new THREE.CircleGeometry(0.032, 16));
    const jackGeometry = geo(new THREE.RingGeometry(0.05, 0.078, 32));
    const socketGeometry = geo(new THREE.CircleGeometry(0.034, 16));
    const plugGeometry = geo(new THREE.CircleGeometry(0.085, 24));
    const knobGeometry = geo(new THREE.CircleGeometry(0.15, 40));
    const tickGeometry = geo(new THREE.CircleGeometry(0.013, 8));
    const ledGeometry = geo(new THREE.PlaneGeometry(0.07, 0.07));
    const dotGeometry = geo(new THREE.CircleGeometry(0.026, 10));
    const ringGeometry = geo(
      new THREE.BufferGeometry().setFromPoints(
        new THREE.EllipseCurve(0, 0, 0.9, 0.9)
          .getPoints(96)
          .map((point) => v(point.x, point.y)),
      ),
    );

    // The rack stays put across paths; only the patch changes.
    const rack = new THREE.Group();
    rack.position.set(PATCH_RACK.x, PATCH_RACK.y, -0.05);
    scene.add(rack);
    rack.add(
      new THREE.Mesh(
        geo(new THREE.PlaneGeometry(PATCH_RACK.w, PATCH_RACK.h)),
        mat(basicMaterial(PATCH_COLORS.rack, 1)),
      ),
    );
    rack.add(
      new THREE.Line(
        geo(
          new THREE.BufferGeometry().setFromPoints(
            rectPoints(PATCH_RACK.w, PATCH_RACK.h),
          ),
        ),
        mat(
          new THREE.LineBasicMaterial({
            color: PATCH_COLORS.cream,
            transparent: true,
            opacity: 0.16,
          }),
        ),
      ),
    );
    const railScrew = mat(basicMaterial(PATCH_COLORS.cream, 0.32));
    for (const side of [-1, 1])
      for (let index = 0; index < 8; index++) {
        const screw = new THREE.Mesh(screwGeometry, railScrew);
        screw.position.set(
          -PATCH_RACK.w / 2 + 0.2 + (index * (PATCH_RACK.w - 0.4)) / 7,
          side * (PATCH_RACK.h / 2 - 0.16),
          0.001,
        );
        rack.add(screw);
      }

    const makeLayout = (kind: RpcPath): RouteLayout => {
      const spec = PATCH_LAYOUTS[kind];
      const group = new THREE.Group();
      scene.add(group);
      const faded: Faded[] = [];
      const cache = new Map<string, THREE.MeshBasicMaterial>();
      const basic = (color: THREE.ColorRepresentation, opacity: number) => {
        const key = `${color}:${opacity.toFixed(3)}`;
        let material = cache.get(key);
        if (!material) {
          material = mat(basicMaterial(color, opacity));
          faded.push({ material, opacity });
          cache.set(key, material);
        }
        return material;
      };
      const line = (
        points: THREE.Vector3[] | THREE.BufferGeometry,
        opacity: number,
      ) => {
        const material = mat(
          new THREE.LineBasicMaterial({
            color: PATCH_COLORS.cream,
            transparent: true,
            opacity,
            depthWrite: false,
          }),
        );
        faded.push({ material, opacity });
        return new THREE.Line(
          Array.isArray(points)
            ? geo(new THREE.BufferGeometry().setFromPoints(points))
            : points,
          material,
        );
      };
      const add = (
        object: THREE.Object3D,
        x: number,
        y: number,
        z: number,
        order: number,
      ) => {
        object.position.set(x, y, z);
        object.renderOrder = order;
        group.add(object);
      };
      const screws = (
        x: number,
        y: number,
        w: number,
        h: number,
        opacity: number,
      ) => {
        for (const [sx, sy] of [
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
        ])
          add(
            new THREE.Mesh(screwGeometry, basic(PATCH_COLORS.cream, opacity)),
            x + sx * (w / 2 - 0.09),
            y + sy * (h / 2 - 0.09),
            0.01,
            1,
          );
      };
      const jackTones = new Map<string, string>();
      for (const cable of spec.cables) {
        jackTones.set(cable.from.join(":"), PATCH_TONES[cable.tone]);
        jackTones.set(cable.to.join(":"), PATCH_TONES[cable.tone]);
      }

      if (spec.frame) {
        const { x, y, w, h } = spec.frame;
        add(line(rectPoints(w, h), 0.4), x, y, 0.005, 1);
        screws(x, y, w, h, 0.4);
      }
      for (const part of spec.modules) {
        const k = part.dim ? 0.5 : 1;
        add(
          new THREE.Mesh(
            geo(new THREE.PlaneGeometry(part.w, part.h)),
            basic(PATCH_COLORS.panel, 0.97),
          ),
          part.x,
          part.y,
          0,
          0,
        );
        add(
          line(rectPoints(part.w, part.h), 0.6 * k),
          part.x,
          part.y,
          0.005,
          1,
        );
        screws(part.x, part.y, part.w, part.h, 0.65 * k);
        for (let index = 0; index < part.jacks; index++) {
          const { x, y } = jackPosition(part, index);
          const tone = jackTones.get(`${part.id}:${index}`);
          add(
            new THREE.Mesh(
              jackGeometry,
              basic(tone ?? PATCH_COLORS.cream, tone ? 1 : 0.75 * k),
            ),
            x,
            y,
            0.01,
            1,
          );
          add(
            new THREE.Mesh(socketGeometry, basic(PATCH_COLORS.socket, 1)),
            x,
            y,
            0.012,
            1,
          );
        }
        const knobs = part.knobs ?? 0;
        for (let index = 0; index < knobs; index++) {
          const x = part.x + (index - (knobs - 1) / 2) * 0.4;
          const y = part.y + part.h / 2 - 0.36;
          add(
            new THREE.Mesh(knobGeometry, basic(PATCH_COLORS.cream, 0.9 * k)),
            x,
            y,
            0.01,
            1,
          );
          const angle = 0.5 + index * 1.9;
          add(
            new THREE.Mesh(tickGeometry, basic(PATCH_COLORS.socket, 1)),
            x + Math.cos(angle) * 0.09,
            y + Math.sin(angle) * 0.09,
            0.012,
            2,
          );
          for (let tick = 0; tick < 9; tick++) {
            const a = Math.PI * 1.25 - (tick * Math.PI * 1.5) / 8;
            add(
              new THREE.Mesh(tickGeometry, basic(PATCH_COLORS.cream, 0.5 * k)),
              x + Math.cos(a) * 0.215,
              y + Math.sin(a) * 0.215,
              0.01,
              1,
            );
          }
        }
        if (part.glyphs)
          for (const glyph of APP_GLYPHS) {
            const r = GLYPH_SIZE;
            const points =
              glyph.kind === "circle"
                ? new THREE.EllipseCurve(0, 0, r, r)
                    .getPoints(40)
                    .map((point) => v(point.x, point.y))
                : glyph.kind === "triangle"
                  ? [v(0, r), v(r, -r * 0.8), v(-r, -r * 0.8), v(0, r)]
                  : rectPoints(r * 1.7, r * 1.7);
            add(
              line(points, 0.85),
              part.x + glyph.dx,
              part.y + GLYPH_Y,
              0.01,
              1,
            );
          }
        if (part.leds)
          for (let index = 0; index < 15; index++) {
            const lit = index % 4 === 1;
            add(
              new THREE.Mesh(
                ledGeometry,
                basic(
                  lit ? PATCH_TONES.request : PATCH_COLORS.cream,
                  lit ? 0.95 : 0.4,
                ),
              ),
              part.x + ((index % 5) - 2) * 0.13,
              part.y - 0.12 + (1 - Math.floor(index / 5)) * 0.13,
              0.01,
              1,
            );
          }
        if (part.grille) {
          const y = part.y + 0.17;
          add(line(ringGeometry, 0.7), part.x, y, 0.01, 1);
          const dots = grilleDots(0.9);
          const grille = new THREE.InstancedMesh(
            dotGeometry,
            basic(0xffffff, 0.85),
            dots.length,
          );
          const dummy = new THREE.Object3D();
          const cream = new THREE.Color(PATCH_COLORS.cream);
          const lit = new THREE.Color(PATCH_TONES.cluster);
          dots.forEach((dot, index) => {
            dummy.position.set(dot.x, dot.y, 0);
            dummy.updateMatrix();
            grille.setMatrixAt(index, dummy.matrix);
            grille.setColorAt(index, dot.lit ? lit : cream);
          });
          grille.instanceMatrix.needsUpdate = true;
          if (grille.instanceColor) grille.instanceColor.needsUpdate = true;
          add(grille, part.x, y, 0.012, 1);
        }
      }

      let request: THREE.CatmullRomCurve3 | undefined;
      let downstream: THREE.CatmullRomCurve3 | undefined;
      for (const cable of spec.cables) {
        const { a, b, low } = cableEnds(spec, cable);
        const color = PATCH_TONES[cable.tone];
        const opacity = cable.role ? 1 : cable.tone === "shared" ? 0.7 : 0.6;
        const lead = (b.x - a.x) * 0.08;
        const curve = new THREE.CatmullRomCurve3(
          [
            v(a.x, a.y, 0.06),
            v(a.x + lead, a.y - 0.22, 0.32),
            v((a.x + b.x) / 2, low, 0.55),
            v(b.x - lead, b.y - 0.22, 0.32),
            v(b.x, b.y, 0.06),
          ],
          false,
          "centripetal",
        );
        const tube = geo(
          new THREE.TubeGeometry(
            curve,
            96,
            cable.role ? 0.046 : 0.034,
            10,
            false,
          ),
        );
        add(
          new THREE.Mesh(tube, basic(0x000000, 0.5 * opacity)),
          0.04,
          -0.07,
          -0.04,
          2,
        );
        add(
          new THREE.Mesh(tube, basic(color, opacity)),
          0,
          0,
          0,
          cable.role ? 4 : 3,
        );
        for (const end of [a, b])
          add(
            new THREE.Mesh(plugGeometry, basic(color, opacity)),
            end.x,
            end.y,
            0.065,
            cable.role ? 5 : 4,
          );
        if (cable.role === "request") request = curve;
        if (cable.role === "downstream") downstream = curve;
      }
      if (!request)
        throw new Error(`Patch layout ${kind} has no request cable`);
      return { group, faded, request, downstream, labels: spec.labels };
    };

    const layouts: Record<RpcPath, RouteLayout> = {
      local: makeLayout("local"),
      public: makeLayout("public"),
      production: makeLayout("production"),
    };
    const requestPulse = new THREE.Mesh(
      geo(new THREE.SphereGeometry(0.075, 16, 12)),
      mat(new THREE.MeshBasicMaterial({ color: PATCH_TONES.request })),
    );
    const pulseHalo = new THREE.Mesh(
      geo(new THREE.SphereGeometry(0.16, 16, 12)),
      mat(
        new THREE.MeshBasicMaterial({
          color: PATCH_TONES.request,
          transparent: true,
          opacity: 0.2,
          depthWrite: false,
        }),
      ),
    );
    requestPulse.renderOrder = 6;
    pulseHalo.renderOrder = 5;
    requestPulse.add(pulseHalo);
    scene.add(requestPulse);
    requestPulse.visible = false;

    const setOpacity = (layout: RouteLayout, opacity: number) => {
      layout.group.visible = opacity > 0.001;
      layout.group.position.y = -0.18 * (1 - opacity);
      for (const item of layout.faded)
        item.material.opacity = item.opacity * opacity;
    };
    const active = initial.current.path;
    let current: RpcPath = active;
    const opacities: Record<RpcPath, number> = {
      local: 0,
      public: 0,
      production: 0,
    };
    let fromOpacity = { ...opacities };
    let started = performance.now();
    let duration = initial.current.animate ? 2750 : 0;
    let motionEnabled = initial.current.animate;
    let requestFrame = 0;
    let visible = true;
    let lost = false;
    let ready = false;
    let targetYaw = 0;
    let targetPitch = 0;
    let yaw = 0;
    let pitch = 0;
    const render = (now: number) => {
      requestFrame = 0;
      if (lost || !visible || document.hidden) return;
      const progress = duration ? Math.min((now - started) / duration, 1) : 1;
      const appear = duration > 2000 ? ease(progress / 0.35) : ease(progress);
      for (const key of Object.keys(layouts) as RpcPath[]) {
        const target = key === current ? 1 : 0;
        opacities[key] =
          fromOpacity[key] + (target - fromOpacity[key]) * appear;
        setOpacity(layouts[key], opacities[key]);
      }
      yaw += (targetYaw - yaw) * 0.13;
      pitch += (targetPitch - pitch) * 0.13;
      camera.position.set(
        cameraBase.x + yaw,
        cameraBase.y + pitch,
        cameraBase.z,
      );
      camera.lookAt(target);
      const layout = layouts[current];
      requestPulse.visible = false;
      if (motionEnabled) {
        // Request out on the green cable, upstream on purple, response back.
        const segment =
          progress >= 0.33 && progress <= 0.62
            ? {
                curve: layout.request,
                t: (progress - 0.33) / 0.29,
                tone: PATCH_TONES.request,
              }
            : progress > 0.65 && progress < 0.78 && layout.downstream
              ? {
                  curve: layout.downstream,
                  t: (progress - 0.65) / 0.13,
                  tone: PATCH_TONES.cluster,
                }
              : progress > 0.8 && progress < 0.97
                ? {
                    curve: layout.request,
                    t: 1 - (progress - 0.8) / 0.17,
                    tone: PATCH_TONES.request,
                  }
                : undefined;
        if (segment) {
          requestPulse.visible = true;
          (requestPulse.material as THREE.MeshBasicMaterial).color.set(
            segment.tone,
          );
          (pulseHalo.material as THREE.MeshBasicMaterial).color.set(
            segment.tone,
          );
          requestPulse.position
            .copy(segment.curve.getPoint(ease(segment.t)))
            .add(layout.group.position);
          requestPulse.position.z += 0.06;
        }
      }
      renderer.render(scene, camera);
      layout.labels.forEach(({ key, x, y }, index) => {
        const projected = v(x, y, 0.05)
          .add(layout.group.position)
          .project(camera);
        const element = labelElements[index];
        element.textContent = labelsRef.current[key];
        element.style.left = `${(projected.x * 0.5 + 0.5) * host.clientWidth}px`;
        element.style.top = `${(-projected.y * 0.5 + 0.5) * host.clientHeight}px`;
        element.hidden = false;
      });
      labelElements.forEach((element, index) => {
        if (index >= layout.labels.length) element.hidden = true;
      });
      host.dataset.sceneState = progress < 1 ? "animating" : "idle";
      host.dataset.path = current;
      if (!ready) {
        ready = true;
        callbacks.current.onReady();
      }
      if (
        progress < 1 ||
        Math.abs(targetYaw - yaw) > 0.002 ||
        Math.abs(targetPitch - pitch) > 0.002
      ) {
        requestFrame = requestAnimationFrame(render);
      }
    };
    const schedule = () => {
      if (!requestFrame && !lost && visible && !document.hidden)
        requestFrame = requestAnimationFrame(render);
    };
    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      schedule();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
        else {
          cancelAnimationFrame(requestFrame);
          requestFrame = 0;
        }
      },
      { rootMargin: "100px" },
    );
    visibilityObserver.observe(host);
    const onVisibility = () => {
      if (!document.hidden) schedule();
    };
    document.addEventListener("visibilitychange", onVisibility);
    const onPointerMove = (event: PointerEvent) => {
      if (!motionEnabled) return;
      const bounds = host.getBoundingClientRect();
      targetYaw = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.36;
      targetPitch = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.16;
      schedule();
    };
    const onPointerLeave = () => {
      targetYaw = targetPitch = 0;
      schedule();
    };
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);
    const onContextLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      cancelAnimationFrame(requestFrame);
      requestFrame = 0;
      callbacks.current.onLost();
    };
    const onContextRestored = () => {
      lost = false;
      ready = false;
      schedule();
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    renderer.domElement.addEventListener(
      "webglcontextrestored",
      onContextRestored,
    );
    controller.current = {
      switchPath(next, allowMotion) {
        motionEnabled = allowMotion;
        if (!allowMotion) {
          duration = 0;
          targetYaw = targetPitch = yaw = pitch = 0;
        }
        if (next === current) {
          schedule();
          return;
        }
        fromOpacity = { ...opacities };
        current = next;
        started = performance.now();
        duration = allowMotion ? 1600 : 0;
        schedule();
      },
    };
    resize();

    return () => {
      controller.current = null;
      cancelAnimationFrame(requestFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        onContextLost,
      );
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        onContextRestored,
      );
      for (const item of geometries) item.dispose();
      for (const item of materials) item.dispose();
      for (const item of textures) item.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      labelLayer.remove();
    };
  }, []);

  useEffect(() => {
    controller.current?.switchPath(path, animate);
  }, [path, animate]);

  return <div ref={hostRef} className="absolute inset-0" aria-hidden="true" />;
}
