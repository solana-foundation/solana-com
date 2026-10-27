"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { RpcPath } from "./directory-state";

type Props = {
  path: RpcPath;
  animate: boolean;
  onReady: () => void;
  onLost: () => void;
};

const INK = 0xdedee7;
const MUTED = 0x5a5b69;
const ACTIVE = 0x55e9ab;
const SECONDARY = 0xffffff;

export function RpcRouteScene({ path, animate, onReady, onLost }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const onLostRef = useRef(onLost);
  onLostRef.current = onLost;

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
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      onLostRef.current();
    };
    renderer.domElement.addEventListener("webglcontextlost", handleContextLost);

    const scene = new THREE.Scene();
    const assembly = new THREE.Group();
    assembly.rotation.set(-0.1, -0.17, 0);
    scene.add(assembly);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 1.6, 13);
    camera.lookAt(0, 0, 0);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const track = <T extends THREE.BufferGeometry>(geometry: T): T => {
      geometries.push(geometry);
      return geometry;
    };
    const material = <T extends THREE.Material>(value: T): T => {
      materials.push(value);
      return value;
    };

    const addNode = (
      x: number,
      y: number,
      size: number,
      color: number,
      depth = 0.55,
    ) => {
      const geometry = track(new THREE.BoxGeometry(size, size, depth));
      const face = new THREE.Mesh(
        geometry,
        material(
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.09,
            depthWrite: false,
          }),
        ),
      );
      const edges = new THREE.LineSegments(
        track(new THREE.EdgesGeometry(geometry)),
        material(
          new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: color === MUTED ? 0.5 : 0.95,
          }),
        ),
      );
      face.position.set(x, y, 0);
      edges.position.copy(face.position);
      assembly.add(face, edges);
    };
    const addRoute = (points: THREE.Vector3[], color: number, opacity = 1) => {
      const curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
      const glow = new THREE.Mesh(
        track(new THREE.TubeGeometry(curve, 44, 0.048, 5, false)),
        material(
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: opacity * 0.16,
            depthWrite: false,
          }),
        ),
      );
      const core = new THREE.Mesh(
        track(new THREE.TubeGeometry(curve, 44, 0.012, 5, false)),
        material(
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity,
            depthWrite: false,
          }),
        ),
      );
      assembly.add(glow, core);
      return curve;
    };
    const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z);
    const addCluster = () => {
      const nodes = Array.from({ length: 7 }, (_, index) => {
        const angle = (index / 7) * Math.PI * 2;
        const x = 3.1 + Math.cos(angle) * 0.62;
        const y = Math.sin(angle) * 0.78;
        addNode(x, y, 0.25, INK, 0.25);
        return v(x, y);
      });
      assembly.add(
        new THREE.LineLoop(
          track(new THREE.BufferGeometry().setFromPoints(nodes)),
          material(
            new THREE.LineBasicMaterial({
              color: SECONDARY,
              transparent: true,
              opacity: 0.18,
            }),
          ),
        ),
      );
    };
    let activeCurve: THREE.CatmullRomCurve3;

    if (path === "local") {
      addNode(-3, 0, 0.92, INK);
      addNode(-0.6, 0, 1.12, ACTIVE);
      const boundary = track(new THREE.BoxGeometry(4.8, 2.6, 0.16));
      const frame = new THREE.LineSegments(
        track(new THREE.EdgesGeometry(boundary)),
        material(
          new THREE.LineBasicMaterial({
            color: SECONDARY,
            transparent: true,
            opacity: 0.32,
          }),
        ),
      );
      frame.position.x = -1.8;
      assembly.add(frame);
      activeCurve = addRoute(
        [v(-2.5, 0), v(-1.55, 0.16, 0.3), v(-0.6, 0, 0.3)],
        ACTIVE,
      );
    } else if (path === "public") {
      addNode(-3.25, 0, 0.92, INK);
      addNode(-3.25, 1.35, 0.58, MUTED);
      addNode(-3.25, -1.35, 0.58, MUTED);
      addNode(0, 0, 1.22, ACTIVE);
      addCluster();
      addRoute([v(-2.95, 1.35), v(-1.25, 0.85), v(-0.6, 0.2)], MUTED, 0.5);
      addRoute([v(-2.95, -1.35), v(-1.25, -0.85), v(-0.6, -0.2)], MUTED, 0.5);
      addRoute([v(0.65, 0), v(1.7, 0.02), v(2.45, 0)], SECONDARY, 0.48);
      activeCurve = addRoute(
        [v(-2.75, 0), v(-1.4, 0.07, 0.25), v(0, 0, 0.3)],
        ACTIVE,
      );
    } else {
      addNode(-3.25, 0, 0.92, INK);
      addNode(0, 0.62, 1.1, ACTIVE);
      addNode(0, -1.15, 0.86, INK);
      addCluster();
      addRoute(
        [v(-2.75, 0), v(-1.25, -0.62, -0.2), v(0, -1.15, -0.2)],
        SECONDARY,
        0.46,
      );
      addRoute([v(0.55, 0.62), v(1.6, 0.35), v(2.45, 0)], SECONDARY, 0.5);
      addRoute([v(0.48, -1.15), v(1.6, -0.55), v(2.45, 0)], SECONDARY, 0.3);
      activeCurve = addRoute(
        [v(-2.75, 0), v(-1.25, 0.34, 0.3), v(0, 0.62, 0.3)],
        ACTIVE,
      );
    }

    const packet = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.09, 8, 6)),
      material(new THREE.MeshBasicMaterial({ color: 0xffffff })),
    );
    assembly.add(packet);
    packet.position.copy(activeCurve.getPoint(animate ? 0 : 0.65));

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.position.z = width < 450 ? 17 : 13;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.render(scene, camera);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    onReadyRef.current();

    let frame = 0;
    let start = 0;
    const duration = 1500;
    const tick = (now: number) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / duration, 1);
      packet.position.copy(
        activeCurve.getPoint(
          progress <= 0.5 ? progress * 2 : (1 - progress) * 2,
        ),
      );
      renderer.render(scene, camera);
      if (progress < 1 && !document.hidden) frame = requestAnimationFrame(tick);
    };
    if (animate) frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((value) => value.dispose());
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        handleContextLost,
      );
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [animate, path]);

  return <div ref={hostRef} className="absolute inset-0" aria-hidden="true" />;
}
