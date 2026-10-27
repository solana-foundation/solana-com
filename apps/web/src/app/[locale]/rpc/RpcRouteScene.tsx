"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import type { RpcPath } from "./directory-state";

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
};
type Controller = { switchPath: (path: RpcPath, animate: boolean) => void };

const WHITE = 0xffffff;
const LILAC = 0xece4fd;
const GREEN = 0x55e9ab;
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
        "absolute -translate-x-1/2 whitespace-nowrap font-brand-mono text-[10px] uppercase tracking-wider text-nd-mid-em-text";
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
    camera.position.set(1.1, 2.5, 14.5);
    camera.lookAt(0.15, -0.1, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 3.2);
    key.position.set(-2, 5, 7);
    scene.add(key);
    const rim = new THREE.DirectionalLight(WHITE, 1.25);
    rim.position.set(4, 2, -3);
    scene.add(rim);

    // A radial haze adds depth without a full-screen post-processing pass.
    const hazeCanvas = document.createElement("canvas");
    hazeCanvas.width = hazeCanvas.height = 128;
    const context = hazeCanvas.getContext("2d");
    if (context) {
      const gradient = context.createRadialGradient(64, 64, 8, 64, 64, 64);
      gradient.addColorStop(0, "rgba(236,228,253,0.22)");
      gradient.addColorStop(0.5, "rgba(236,228,253,0.055)");
      gradient.addColorStop(1, "rgba(236,228,253,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);
    }
    const hazeTexture = new THREE.CanvasTexture(hazeCanvas);
    hazeTexture.colorSpace = THREE.SRGBColorSpace;
    textures.add(hazeTexture);
    const haze = new THREE.Mesh(
      geo(new THREE.PlaneGeometry(10, 7)),
      mat(
        new THREE.MeshBasicMaterial({
          map: hazeTexture,
          transparent: true,
          opacity: 0.45,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      ),
    );
    haze.position.set(0.8, 0, -3.8);
    scene.add(haze);

    const grid = new THREE.GridHelper(11, 22, LILAC, LILAC);
    grid.position.set(0, -1.28, -0.6);
    const gridMaterial = grid.material as THREE.LineBasicMaterial;
    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.04;
    geo(grid.geometry);
    mat(gridMaterial);
    scene.add(grid);

    const slabGeometry = geo(
      new RoundedBoxGeometry(0.96, 1.16, 0.32, 4, 0.055),
    );
    const slabEdges = geo(new THREE.EdgesGeometry(slabGeometry, 24));
    const slabMaterial = mat(
      new THREE.MeshPhongMaterial({
        color: 0x0a0c0e,
        specular: 0xc7cbd0,
        shininess: 100,
        transparent: true,
        opacity: 0.98,
      }),
    );
    const routeBodyMaterial = mat(
      new THREE.MeshPhongMaterial({
        color: 0x111519,
        specular: 0xa0a5aa,
        shininess: 110,
        transparent: true,
        opacity: 0.82,
      }),
    );

    const makeLayout = (kind: RpcPath): RouteLayout => {
      const group = new THREE.Group();
      group.position.x = 0.48;
      scene.add(group);
      const faded: Faded[] = [];
      const fade = <T extends THREE.Material & { opacity: number }>(
        material: T,
        opacity = material.opacity,
      ) => {
        faded.push({ material, opacity });
        return mat(material);
      };
      const node = (
        position: THREE.Vector3,
        options?: {
          scale?: number;
          dim?: boolean;
          standby?: boolean;
          port?: boolean;
        },
      ) => {
        const size = options?.scale ?? 1;
        const assembly = new THREE.Group();
        assembly.position.copy(position);
        assembly.scale.setScalar(size);
        assembly.rotation.y = -0.16;
        const faceMaterial = slabMaterial.clone();
        faceMaterial.opacity = options?.standby
          ? 0.78
          : options?.dim
            ? 0.48
            : 0.98;
        const face = new THREE.Mesh(slabGeometry, fade(faceMaterial));
        assembly.add(face);
        const edgeMaterial = fade(
          new THREE.LineBasicMaterial({
            color: options?.dim ? LILAC : WHITE,
            transparent: true,
            opacity: options?.dim ? 0.25 : 0.58,
            depthWrite: false,
          }),
        );
        assembly.add(new THREE.LineSegments(slabEdges, edgeMaterial));
        if (options?.port) {
          const aperture = new THREE.Mesh(
            geo(new THREE.RingGeometry(0.075, 0.105, 32)),
            fade(
              new THREE.MeshBasicMaterial({
                color: GREEN,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 1,
                depthWrite: false,
              }),
            ),
          );
          aperture.position.set(-0.39, 0, 0.18);
          assembly.add(aperture);
        }
        group.add(assembly);
        return assembly;
      };
      const route = (
        points: THREE.Vector3[],
        color: number,
        opacity: number,
        dashed = false,
        body = false,
      ) => {
        const curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
        const samples = curve.getPoints(64);
        if (body) {
          const tube = new THREE.Mesh(
            geo(new THREE.TubeGeometry(curve, 64, 0.038, 8, false)),
            fade(routeBodyMaterial.clone()),
          );
          group.add(tube);
        }
        const geometry = geo(new LineGeometry());
        geometry.setPositions(
          samples.flatMap((point) => [point.x, point.y, point.z]),
        );
        const material = fade(
          new LineMaterial({
            color,
            linewidth: dashed ? 1.35 : color === GREEN ? 3.2 : 1.3,
            transparent: true,
            opacity,
            dashed,
            dashSize: 0.13,
            gapSize: 0.11,
            depthWrite: false,
            depthTest: color !== GREEN && opacity < 0.7,
            worldUnits: false,
          }),
        );
        lineMaterials.add(material);
        const line = new Line2(geometry, material);
        if (color === GREEN || opacity >= 0.7) line.renderOrder = 3;
        if (dashed) line.computeLineDistances();
        group.add(line);
        return curve;
      };
      const app = kind === "local" ? v(-2.3, 0.05, 0.35) : v(-3.1, 0.05, 0.35);
      const rpc =
        kind === "production"
          ? v(-0.1, 0.55, 0.45)
          : kind === "public"
            ? v(0.05, 0.05, 0.45)
            : v(0.9, 0.05, 0.45);
      node(app);
      node(rpc, { port: true });
      const request = route(
        [
          v(app.x + 0.51, app.y, app.z + 0.2),
          v((app.x + rpc.x) / 2, (app.y + rpc.y) / 2 + 0.17, 0.7),
          v(rpc.x - 0.39, rpc.y, rpc.z + 0.2),
        ],
        GREEN,
        1,
        false,
        true,
      );
      let downstream: THREE.CatmullRomCurve3 | undefined;

      if (kind === "local") {
        const boundaryBox = new THREE.BoxGeometry(5.2, 2.65, 1.45);
        const boundary = geo(new THREE.EdgesGeometry(boundaryBox));
        boundaryBox.dispose();
        const frame = new THREE.LineSegments(
          boundary,
          fade(
            new THREE.LineBasicMaterial({
              color: LILAC,
              transparent: true,
              opacity: 0.36,
              depthWrite: false,
            }),
          ),
        );
        frame.position.set(-0.8, 0.05, 0);
        group.add(frame);
        for (let index = 0; index < 4; index++) {
          const plate = new THREE.Mesh(
            geo(new THREE.BoxGeometry(0.72, 0.025, 0.28)),
            fade(
              new THREE.MeshBasicMaterial({
                color: LILAC,
                transparent: true,
                opacity: 0.14 + index * 0.045,
              }),
            ),
          );
          plate.position.set(
            rpc.x + 0.05,
            rpc.y - 0.42 + index * 0.11,
            rpc.z - 0.28,
          );
          group.add(plate);
        }
      } else {
        const cluster = new THREE.Group();
        cluster.position.set(3.12, 0.02, -0.5);
        group.add(cluster);
        const validatorGeometry = geo(
          new THREE.BoxGeometry(0.075, 0.095, 0.065),
        );
        const validatorMaterial = fade(
          new THREE.MeshPhongMaterial({
            color: WHITE,
            specular: WHITE,
            shininess: 60,
            transparent: true,
            opacity: 0.4,
            depthWrite: false,
          }),
        );
        const validatorCount = 100;
        const validators = new THREE.InstancedMesh(
          validatorGeometry,
          validatorMaterial,
          validatorCount,
        );
        const dummy = new THREE.Object3D();
        const positions: THREE.Vector3[] = [];
        for (let index = 0; index < validatorCount; index++) {
          const y = 1 - 2 * ((index + 0.5) / validatorCount);
          const radial = Math.sqrt(1 - y * y);
          const angle = index * 2.399963229728653;
          const point = v(
            Math.cos(angle) * radial * 1.12,
            y * 1.18,
            Math.sin(angle) * radial * 0.72,
          );
          positions.push(point);
          dummy.position.copy(point);
          dummy.rotation.set(angle * 0.08, angle * 0.12, angle * 0.05);
          dummy.scale.setScalar(0.8 + 0.25 * Math.sin(index * 1.7) ** 2);
          dummy.updateMatrix();
          validators.setMatrixAt(index, dummy.matrix);
          validators.setColorAt(
            index,
            new THREE.Color(WHITE).multiplyScalar(0.55 + 0.2 * radial),
          );
        }
        validators.instanceMatrix.needsUpdate = true;
        if (validators.instanceColor)
          validators.instanceColor.needsUpdate = true;
        cluster.add(validators);
        const links: number[] = [];
        for (let index = 0; index < validatorCount - 8; index++) {
          const a = positions[index];
          const b = positions[index + 8];
          if (a.distanceTo(b) < 0.72) links.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
        const linkGeometry = geo(new THREE.BufferGeometry());
        linkGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(links, 3),
        );
        cluster.add(
          new THREE.LineSegments(
            linkGeometry,
            fade(
              new THREE.LineBasicMaterial({
                color: WHITE,
                transparent: true,
                opacity: 0.075,
                depthWrite: false,
              }),
            ),
          ),
        );
        downstream = route(
          [
            v(rpc.x + 0.51, rpc.y, rpc.z),
            v(1.6, rpc.y * 0.35, 0.15),
            v(2.08, 0.08, -0.15),
          ],
          WHITE,
          0.72,
          false,
          true,
        );
        if (kind === "public") {
          for (const [index, y] of [0.96, -0.72, 0.38].entries()) {
            const ghost = v(
              index === 2 ? -3.75 : -3.35,
              y,
              -0.75 - index * 0.25,
            );
            node(ghost, { scale: 0.48, dim: true });
            route(
              [
                v(ghost.x + 0.27, ghost.y, ghost.z),
                v(-1.3, ghost.y * 0.5, -0.3),
                v(rpc.x - 0.52, rpc.y + (y > 0 ? 0.15 : -0.15), rpc.z - 0.1),
              ],
              LILAC,
              0.25,
            );
          }
        } else {
          const backup = v(0.36, -0.94, 0.56);
          node(backup, { standby: true, scale: 0.84 });
          const frameGeometry = geo(new LineGeometry());
          frameGeometry.setPositions([
            -0.52, -1.64, 0.12, 1.25, -1.64, 0.12, 1.25, -0.25, 0.12, -0.52,
            -0.25, 0.12, -0.52, -1.64, 0.12,
          ]);
          const frameMaterial = fade(
            new LineMaterial({
              color: LILAC,
              linewidth: 1.15,
              transparent: true,
              opacity: 0.42,
              dashed: true,
              dashSize: 0.11,
              gapSize: 0.11,
              depthWrite: false,
            }),
          );
          lineMaterials.add(frameMaterial);
          const frame = new Line2(frameGeometry, frameMaterial);
          frame.computeLineDistances();
          group.add(frame);
          route(
            [
              v(app.x + 0.51, app.y - 0.15, app.z - 0.15),
              v(-1.5, -0.5, -0.35),
              v(backup.x - 0.39, backup.y, backup.z + 0.18),
            ],
            LILAC,
            0.38,
            true,
          );
          route(
            [
              v(backup.x + 0.39, backup.y, backup.z),
              v(1.62, -0.7, -0.25),
              v(2.1, -0.36, -0.35),
            ],
            LILAC,
            0.26,
          );
        }
      }
      return { group, faded, request, downstream };
    };

    const lineMaterials = new Set<LineMaterial>();
    const layouts: Record<RpcPath, RouteLayout> = {
      local: makeLayout("local"),
      public: makeLayout("public"),
      production: makeLayout("production"),
    };
    const requestPulse = new THREE.Mesh(
      geo(new THREE.SphereGeometry(0.095, 16, 12)),
      mat(new THREE.MeshBasicMaterial({ color: GREEN })),
    );
    const pulseHalo = new THREE.Mesh(
      geo(new THREE.SphereGeometry(0.18, 16, 12)),
      mat(
        new THREE.MeshBasicMaterial({
          color: GREEN,
          transparent: true,
          opacity: 0.14,
          depthWrite: false,
        }),
      ),
    );
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
      camera.position.x = 1.1 + yaw;
      camera.position.y = 2.5 + pitch;
      camera.lookAt(0.15, -0.1, 0);
      const layout = layouts[current];
      requestPulse.visible = false;
      if (motionEnabled) {
        const requestAt = 0.33;
        const requestEnd = 0.62;
        if (progress >= requestAt && progress <= requestEnd) {
          requestPulse.visible = true;
          (requestPulse.material as THREE.MeshBasicMaterial).color.setHex(
            GREEN,
          );
          (pulseHalo.material as THREE.MeshBasicMaterial).color.setHex(GREEN);
          requestPulse.position.copy(
            layout.request.getPoint(
              ease((progress - requestAt) / (requestEnd - requestAt)),
            ),
          );
          requestPulse.position.x += layout.group.position.x;
          requestPulse.position.y += layout.group.position.y;
        } else if (progress > 0.65 && progress < 0.78 && layout.downstream) {
          requestPulse.visible = true;
          (requestPulse.material as THREE.MeshBasicMaterial).color.setHex(
            WHITE,
          );
          (pulseHalo.material as THREE.MeshBasicMaterial).color.setHex(WHITE);
          requestPulse.position.copy(
            layout.downstream.getPoint(ease((progress - 0.65) / 0.13)),
          );
          requestPulse.position.x += layout.group.position.x;
          requestPulse.position.y += layout.group.position.y;
        } else if (progress > 0.8 && progress < 0.97) {
          requestPulse.visible = true;
          (requestPulse.material as THREE.MeshBasicMaterial).color.setHex(
            WHITE,
          );
          (pulseHalo.material as THREE.MeshBasicMaterial).color.setHex(WHITE);
          requestPulse.position.copy(
            layout.request.getPoint(1 - ease((progress - 0.8) / 0.17)),
          );
          requestPulse.position.x += layout.group.position.x;
          requestPulse.position.y += layout.group.position.y;
        }
      }
      renderer.render(scene, camera);
      const labelAnchors: Record<
        RpcPath,
        { text: string; point: THREE.Vector3 }[]
      > = {
        local: [
          { text: labelsRef.current.machine, point: v(-1, 1.82, 0.7) },
          { text: labelsRef.current.app, point: v(-2.3, -0.68, 0.5) },
          { text: labelsRef.current.localValidator, point: v(0.9, -0.68, 0.5) },
        ],
        public: [
          { text: labelsRef.current.otherApps, point: v(-3.6, 1.28, -0.7) },
          { text: labelsRef.current.app, point: v(-3.1, -0.82, 0.5) },
          { text: labelsRef.current.official, point: v(0.05, -0.82, 0.5) },
          { text: labelsRef.current.devnet, point: v(3.12, -1.5, -0.5) },
        ],
        production: [
          { text: labelsRef.current.app, point: v(-3.1, -0.82, 0.5) },
          { text: labelsRef.current.provider, point: v(-0.1, 1.57, 0.5) },
          { text: labelsRef.current.fallback, point: v(0.36, -1.67, 0.6) },
          { text: labelsRef.current.mainnet, point: v(3.12, -1.5, -0.5) },
        ],
      };
      labelAnchors[current].forEach(({ text, point }, index) => {
        const projected = point
          .add(v(layout.group.position.x, layout.group.position.y))
          .project(camera);
        const element = labelElements[index];
        element.textContent = text;
        element.style.left = `${(projected.x * 0.5 + 0.5) * host.clientWidth}px`;
        element.style.top = `${(-projected.y * 0.5 + 0.5) * host.clientHeight}px`;
        element.hidden = false;
      });
      labelElements.forEach((element, index) => {
        if (index >= labelAnchors[current].length) element.hidden = true;
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
      for (const material of lineMaterials)
        material.resolution.set(width, height);
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
