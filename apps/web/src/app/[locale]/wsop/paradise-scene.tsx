"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type ParadiseSceneProps = { className?: string; onReady?: () => void };

function chipTextures() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  const c = 512;
  ctx.fillStyle = "#2a8caa";
  ctx.beginPath();
  ctx.arc(c, c, 500, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 8; i++) {
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate((i * Math.PI) / 4);
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.roundRect(-48, -500, 96, 115, 12);
    ctx.fill();
    ctx.restore();
  }
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 10;
  ctx.setLineDash([22, 22]);
  ctx.beginPath();
  ctx.arc(c, c, 355, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(c, c, 285, 0, Math.PI * 2);
  ctx.fill();
  const gradient = ctx.createLinearGradient(280, 300, 740, 730);
  gradient.addColorStop(0, "#9945FF");
  gradient.addColorStop(1, "#14F195");
  ctx.fillStyle = gradient;
  for (let i = 0; i < 3; i++) {
    const y = 365 + i * 115;
    ctx.beginPath();
    ctx.moveTo(330, y);
    ctx.lineTo(700, y);
    ctx.lineTo(670, y + 70);
    ctx.lineTo(300, y + 70);
    ctx.closePath();
    ctx.fill();
  }
  const face = new THREE.CanvasTexture(canvas);
  face.colorSpace = THREE.SRGBColorSpace;
  const sideCanvas = document.createElement("canvas");
  sideCanvas.width = 1024;
  sideCanvas.height = 128;
  const sideCtx = sideCanvas.getContext("2d")!;
  sideCtx.fillStyle = "#1b5f73";
  sideCtx.fillRect(0, 0, 1024, 128);
  for (let i = 0; i < 8; i++) {
    sideCtx.fillStyle = "#fff";
    sideCtx.fillRect(i * 128 + 44, 0, 40, 128);
  }
  const side = new THREE.CanvasTexture(sideCanvas);
  side.colorSpace = THREE.SRGBColorSpace;
  return { face, side };
}

export default function ParadiseScene({
  className = "",
  onReady,
}: ParadiseSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container || typeof WebGL2RenderingContext === "undefined") return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.className =
      "absolute inset-0 size-full opacity-0 transition-opacity duration-700";
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 300);
    camera.position.set(0, 1.4, 6);
    camera.lookAt(0, 0.9, -10);
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(180, 48, 32),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uTime: { value: 0 } },
        vertexShader: `varying vec3 vDir; void main(){vDir=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `varying vec3 vDir;uniform float uTime;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}void main(){vec3 d=normalize(vDir);float h=smoothstep(-.05,.8,d.y);vec3 col=mix(vec3(.933,.976,.992),vec3(.486,.784,.933),h);vec3 sun=normalize(vec3(.55,.32,-1.));float disc=smoothstep(.99975,.99995,dot(d,sun));float glow=pow(max(dot(d,sun),0.),30.);col+=vec3(1.,.96,.82)*(disc*.45+glow*.033);float cloud=noise(d.xz*7.+vec2(uTime*.004,0.))*0.65+noise(d.xz*15.+vec2(uTime*.007,0.))*.35;col+=vec3(1.)*smoothstep(.59,.78,cloud)*.075*smoothstep(.0,.22,d.y);gl_FragColor=vec4(col,1.);}`,
      }),
    );
    scene.add(sky);
    const waterMaterial = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `uniform float uTime;varying vec3 vPos;varying vec3 vNormal;void main(){vec3 p=position;float w=0.;vec2 g=vec2(0.);vec2 dirs[4];dirs[0]=normalize(vec2(1.,.3));dirs[1]=normalize(vec2(-.4,1.));dirs[2]=normalize(vec2(.7,-.8));dirs[3]=normalize(vec2(-.9,-.2));for(int i=0;i<4;i++){float freq=1.2+float(i)*.75;float amp=.025/(1.+float(i)*.5);float phase=dot(p.xy,dirs[i])*freq-uTime*(.38+float(i)*.09);w+=sin(phase)*amp;g+=cos(phase)*amp*freq*dirs[i];}p.z=w;vNormal=normalize(vec3(-g.x,1.,-g.y));vPos=vec3(p.xy,w);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
      fragmentShader: `uniform float uTime;varying vec3 vPos;varying vec3 vNormal;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}void main(){float n=noise(vPos.xy*3.+uTime*.04)-.5;vec3 normal=normalize(vNormal+vec3(n*.08,0.,n*.08));float dist=length(vPos.xy);vec3 shallow=vec3(.27,.816,.851),mid=vec3(.106,.62,.753),far=vec3(.043,.435,.584);vec3 col=mix(shallow,mid,smoothstep(1.,20.,dist));col=mix(col,far,smoothstep(20.,80.,dist));vec3 view=normalize(vec3(0.,1.4,6.)-vec3(vPos.x,0.,vPos.y));float fresnel=pow(1.-max(dot(normal,view),0.),5.);col=mix(col,vec3(.86,.96,.99),fresnel*.55);vec3 sun=normalize(vec3(.55,.32,-1.));float spec=pow(max(dot(reflect(-sun,normal),view),0.),220.);col+=vec3(1.,.97,.87)*spec*.7;col+=vec3(.1,.25,.2)*noise(vPos.xy*5.+uTime*.04)*.14*(1.-smoothstep(8.,30.,dist));col=mix(col,vec3(.91,.975,.99),1.-exp(-dist*.014));gl_FragColor=vec4(col,1.);}`,
    });
    const waterGeometry = new THREE.PlaneGeometry(220, 220, 160, 160);
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.12;
    scene.add(water);
    scene.add(new THREE.HemisphereLight(0xdff4ff, 0x2a8caa, 1.3));
    const light = new THREE.DirectionalLight(0xfff4dc, 1.6);
    light.position.set(5, 6, -8);
    scene.add(light);
    const frontKey = new THREE.DirectionalLight(0xffffff, 2.2);
    frontKey.position.set(2.5, 4, 7);
    scene.add(frontKey);
    const { face, side } = chipTextures();
    const sideMat = new THREE.MeshStandardMaterial({
      map: side,
      emissive: 0x1b5f73,
      emissiveIntensity: 0.8,
      roughness: 0.45,
      metalness: 0.05,
    });
    const faceMat = new THREE.MeshBasicMaterial({
      map: face,
      toneMapped: false,
    });
    const chipGeometry = new THREE.CylinderGeometry(0.62, 0.62, 0.13, 64);
    const stack = new THREE.Group();
    const tilt = new THREE.Group();
    const spin = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const chip = new THREE.Mesh(chipGeometry, [sideMat, faceMat, faceMat]);
      chip.position.set((i - 1) * 0.035, (i - 1) * 0.13, (i % 2) * 0.03);
      chip.rotation.y = i * 0.18;
      spin.add(chip);
    }
    tilt.rotation.x = 0.5;
    tilt.rotation.z = -0.15;
    tilt.add(spin);
    stack.add(tilt);
    scene.add(stack);
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext("2d")!;
    const radial = shadowCtx.createRadialGradient(128, 128, 8, 128, 128, 128);
    radial.addColorStop(0, "rgba(4,50,66,.35)");
    radial.addColorStop(1, "rgba(4,50,66,0)");
    shadowCtx.fillStyle = radial;
    shadowCtx.fillRect(0, 0, 256, 256);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.7,
    });
    const shadowGeometry = new THREE.PlaneGeometry(2.8, 2.8);
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.08;
    scene.add(shadow);
    let targetX = 0,
      targetY = 0,
      currentX = 0,
      currentY = 0,
      frame = 0,
      visible = false,
      ready = false;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer =
      window.matchMedia("(pointer: fine)").matches && !reduced;
    const clock = new THREE.Clock();
    const screenPoint = new THREE.Vector3();
    const viewDirection = new THREE.Vector3();
    const cameraForward = new THREE.Vector3();
    const stackDistance = 3.5;
    const placeStack = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      const [screenX, screenY, widthFraction] =
        w >= 1024
          ? [0.74, 0.58, 0.22]
          : w >= 768
            ? [0.78, 0.7, 0.26]
            : [0.74, 0.86, 0.34];
      screenPoint.set(screenX * 2 - 1, 1 - screenY * 2, 0.5).unproject(camera);
      viewDirection.copy(screenPoint).sub(camera.position).normalize();
      camera.getWorldDirection(cameraForward);
      stack.position
        .copy(camera.position)
        .addScaledVector(
          viewDirection,
          stackDistance / viewDirection.dot(cameraForward),
        );
      const visibleWidth =
        2 *
        stackDistance *
        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
        (w / h);
      const scale = (widthFraction * visibleWidth) / 1.24;
      stack.scale.setScalar(scale);
      shadow.position.x = stack.position.x;
      shadow.position.z = stack.position.z;
      shadow.scale.setScalar(scale);
    };
    const resize = () => {
      const w = container.clientWidth,
        h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      placeStack();
    };
    const render = (time: number) => {
      sky.material.uniforms.uTime.value = time;
      waterMaterial.uniforms.uTime.value = time;
      spin.rotation.y = (time * Math.PI) / 20;
      spin.position.y = Math.sin((time * Math.PI) / 3) * 0.06;
      shadowMaterial.opacity = 0.68 - Math.sin((time * Math.PI) / 3) * 0.08;
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;
      camera.position.x = currentX;
      camera.position.y = 1.4 + currentY;
      camera.lookAt(0, 0.9, -10);
      placeStack();
      renderer.render(scene, camera);
      if (!ready) {
        ready = true;
        requestAnimationFrame(() => {
          renderer.domElement.classList.replace("opacity-0", "opacity-100");
          onReady?.();
        });
      }
    };
    const tick = () => {
      if (!visible || document.visibilityState !== "visible" || reduced) return;
      render(clock.getElapsedTime());
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          if (reduced) render(3);
          else {
            clock.start();
            cancelAnimationFrame(frame);
            tick();
          }
        } else cancelAnimationFrame(frame);
      },
      { threshold: 0 },
    );
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (visible && document.visibilityState === "visible" && !reduced) tick();
    };
    const onPointer = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.5;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.2;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();
    observer.observe(container);
    document.addEventListener("visibilitychange", onVisibility);
    if (finePointer) container.addEventListener("pointermove", onPointer);
    if (reduced) render(3);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      container.removeEventListener("pointermove", onPointer);
      chipGeometry.dispose();
      faceMat.dispose();
      sideMat.dispose();
      face.dispose();
      side.dispose();
      shadowGeometry.dispose();
      shadowMaterial.dispose();
      shadowTexture.dispose();
      waterGeometry.dispose();
      waterMaterial.dispose();
      sky.geometry.dispose();
      (sky.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReady]);
  return <div ref={ref} className={className} aria-hidden="true" />;
}
