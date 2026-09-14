"use client";

/**
 * PixelBlast — React Bits component, with four upstream defects fixed.
 * Shader work inspired by github.com/zavalit/bayer-dithering-webgl-demo
 *
 * The engine below (`mountPixelBlast`) is framework-free and is the exact code
 * verified in the design mockup. The React wrapper is at the bottom of the file
 * and is deliberately trivial — all the lifecycle risk lives in one place.
 *
 * FIXES vs. the reactbits.dev source — do not "simplify" these back:
 *
 *  1. composer.setSize() was passed DEVICE pixels (renderer.domElement.width).
 *     It takes CSS pixels and applies the pixel ratio itself, so on any dpr > 1
 *     it double-scaled the canvas and the hero rendered BLACK on every Retina
 *     Mac. Only bites when `liquid` or `noiseAmount` builds a composer.
 *  2. liquidStrength never reached the shader: `const uStrength = t.liquidEffect`
 *     assigns .value to the Effect instance, not its uStrength uniform.
 *  3. autoPauseOffscreen did nothing — `visibilityRef` is read in the render
 *     loop but never written, and no IntersectionObserver exists. Now wired.
 *  4. No WebGL2 guard. The fragment shader is GLSL3 with no GLSL1 fallback, so
 *     unsupported hardware got a blank box. Now probes the context, handles
 *     webglcontextlost/restored, and honours prefers-reduced-motion.
 *  5. The React wrapper rebuilt the renderer in a second mount effect, while
 *     cleanup still owned the stale instance. Client navigation leaked WebGL
 *     contexts. Structural rebuild and cleanup now share one effect.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Effect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import "./PixelBlast.css";

const createTouchTexture = () => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context not available");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.Texture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  const trail = [];
  let last = null;
  const maxAge = 64;
  let radius = 0.1 * size;
  const speed = 1 / maxAge;
  const clear = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  const drawPoint = (p) => {
    const pos = { x: p.x * size, y: (1 - p.y) * size };
    let intensity = 1;
    const easeOutSine = (t) => Math.sin((t * Math.PI) / 2);
    const easeOutQuad = (t) => -t * (t - 2);
    if (p.age < maxAge * 0.3) intensity = easeOutSine(p.age / (maxAge * 0.3));
    else
      intensity = easeOutQuad(1 - (p.age - maxAge * 0.3) / (maxAge * 0.7)) || 0;
    intensity *= p.force;
    const color = `${((p.vx + 1) / 2) * 255}, ${((p.vy + 1) / 2) * 255}, ${intensity * 255}`;
    const offset = size * 5;
    ctx.shadowOffsetX = offset;
    ctx.shadowOffsetY = offset;
    ctx.shadowBlur = radius;
    ctx.shadowColor = `rgba(${color},${0.22 * intensity})`;
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,0,0,1)";
    ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
    ctx.fill();
  };
  const addTouch = (norm) => {
    let force = 0;
    let vx = 0;
    let vy = 0;
    if (last) {
      const dx = norm.x - last.x;
      const dy = norm.y - last.y;
      if (dx === 0 && dy === 0) return;
      const dd = dx * dx + dy * dy;
      const d = Math.sqrt(dd);
      vx = dx / (d || 1);
      vy = dy / (d || 1);
      force = Math.min(dd * 10000, 1);
    }
    last = { x: norm.x, y: norm.y };
    trail.push({ x: norm.x, y: norm.y, age: 0, force, vx, vy });
  };
  const update = () => {
    clear();
    for (let i = trail.length - 1; i >= 0; i--) {
      const point = trail[i];
      const f = point.force * speed * (1 - point.age / maxAge);
      point.x += point.vx * f;
      point.y += point.vy * f;
      point.age++;
      if (point.age > maxAge) trail.splice(i, 1);
    }
    for (let i = 0; i < trail.length; i++) drawPoint(trail[i]);
    texture.needsUpdate = true;
  };
  return {
    canvas,
    texture,
    addTouch,
    update,
    set radiusScale(v) {
      radius = 0.1 * size * v;
    },
    get radiusScale() {
      return radius / (0.1 * size);
    },
    size,
  };
};

const createLiquidEffect = (texture, opts) => {
  const fragment = `
    uniform sampler2D uTexture;
    uniform float uStrength;
    uniform float uTime;
    uniform float uFreq;

    void mainUv(inout vec2 uv) {
      vec4 tex = texture2D(uTexture, uv);
      float vx = tex.r * 2.0 - 1.0;
      float vy = tex.g * 2.0 - 1.0;
      float intensity = tex.b;
      float wave = 0.5 + 0.5 * sin(uTime * uFreq + intensity * 6.2831853);
      float amt = uStrength * intensity * wave;
      uv += vec2(vx, vy) * amt;
    }
  `;
  return new Effect("LiquidEffect", fragment, {
    uniforms: new Map([
      ["uTexture", new THREE.Uniform(texture)],
      ["uStrength", new THREE.Uniform(opts?.strength ?? 0.025)],
      ["uTime", new THREE.Uniform(0)],
      ["uFreq", new THREE.Uniform(opts?.freq ?? 4.5)],
    ]),
  });
};

const SHAPE_MAP = { square: 0, circle: 1, triangle: 2, diamond: 3 };
const MAX_CLICKS = 10;

const VERTEX_SRC = `
void main() { gl_Position = vec4(position, 1.0); }
`;

const FRAGMENT_SRC = `
precision highp float;

uniform vec3  uColor;
uniform vec2  uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform float uPixelJitter;
uniform int   uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;

uniform int   uShapeType;
const int SHAPE_SQUARE   = 0;
const int SHAPE_CIRCLE   = 1;
const int SHAPE_TRIANGLE = 2;
const int SHAPE_DIAMOND  = 3;

const int   MAX_CLICKS = 10;

uniform vec2  uClickPos  [MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float Bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2. + a.y * a.y * .75);
}
#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

#define FBM_OCTAVES     5
#define FBM_LACUNARITY  1.25
#define FBM_GAIN        1.0

float hash11(float n){ return fract(sin(n)*43758.5453); }

float vnoise(vec3 p){
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  float y0  = mix(x00, x10, w.y);
  float y1  = mix(x01, x11, w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t){
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0;
  float freq = 1.0;
  float sum = 1.0;
  for (int i = 0; i < FBM_OCTAVES; ++i){
    sum  += amp * vnoise(p * freq);
    freq *= FBM_LACUNARITY;
    amp  *= FBM_GAIN;
  }
  return sum * 0.5 + 0.5;
}

float maskCircle(vec2 p, float cov){
  float r = sqrt(cov) * .25;
  float d = length(p - 0.5) - r;
  float aa = 0.5 * fwidth(d);
  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov){
  bool flip = mod(id.x + id.y, 2.0) > 0.5;
  if (flip) p.x = 1.0 - p.x;
  float r = sqrt(cov);
  float d  = p.y - r*(1.0 - p.x);
  float aa = fwidth(d);
  return cov * clamp(0.5 - d/aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov){
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

void main(){
  float pixelSize = uPixelSize;
  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
  float aspectRatio = uResolution.x / uResolution.y;

  vec2 pixelId = floor(fragCoord / pixelSize);
  vec2 pixelUV = fract(fragCoord / pixelSize);

  float cellPixelSize = 8.0 * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm2(uv, uTime * 0.05);
  base = base * 0.5 - 0.65;

  float feed = base + (uDensity - 0.5) * 0.3;

  float speed     = uRippleSpeed;
  float thickness = uRippleThickness;
  const float dampT     = 1.0;
  const float dampR     = 10.0;

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i){
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;
      float cellPixelSize = 8.0 * pixelSize;
      vec2 cuv = (((pos - uResolution * .5 - cellPixelSize * .5) / (uResolution))) * vec2(aspectRatio, 1.0);
      float t = max(uTime - uClickTimes[i], 0.0);
      float r = distance(uv, cuv);
      float waveR = speed * t;
      float ring  = exp(-pow((r - waveR) / thickness, 2.0));
      float atten = exp(-dampT * t) * exp(-dampR * r);
      feed = max(feed, ring * atten * uRippleIntensity);
    }
  }

  float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
  float bw = step(0.5, feed + bayer);

  float h = fract(sin(dot(floor(fragCoord / uPixelSize), vec2(127.1, 311.7))) * 43758.5453);
  float jitterScale = 1.0 + (h - 0.5) * uPixelJitter;
  float coverage = bw * jitterScale;
  float M;
  if      (uShapeType == SHAPE_CIRCLE)   M = maskCircle (pixelUV, coverage);
  else if (uShapeType == SHAPE_TRIANGLE) M = maskTriangle(pixelUV, pixelId, coverage);
  else if (uShapeType == SHAPE_DIAMOND)  M = maskDiamond(pixelUV, coverage);
  else                                   M = coverage;

  if (uEdgeFade > 0.0) {
    vec2 norm = gl_FragCoord.xy / uResolution;
    float edge = min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y));
    float fade = smoothstep(0.0, uEdgeFade, edge);
    M *= fade;
  }

  vec3 color = uColor;
  vec3 srgbColor = mix(
    color * 12.92,
    1.055 * pow(color, vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, color)
  );

  fragColor = vec4(srgbColor, M);
}
`;

const DEFAULTS = {
  variant: "square",
  pixelSize: 3,
  color: "#B497CF",
  antialias: true,
  patternScale: 2,
  patternDensity: 1,
  liquid: false,
  liquidStrength: 0.1,
  liquidRadius: 1,
  liquidWobbleSpeed: 4.5,
  pixelSizeJitter: 0,
  enableRipples: true,
  rippleIntensityScale: 1,
  rippleThickness: 0.1,
  rippleSpeed: 0.3,
  autoPauseOffscreen: true,
  speed: 0.5,
  transparent: true,
  edgeFade: 0.5,
  noiseAmount: 0,
  eventTarget: null,
};

function mountPixelBlast(container, options = {}) {
  if (!container) return null;
  const o = { ...DEFAULTS, ...options };
  const setState = (s) => {
    container.dataset.pixelBlastState = s;
  };
  setState("initializing");

  // Probe WebGL2 before committing — the shader is GLSL3 and has no GLSL1 path.
  const canvas = document.createElement("canvas");
  const contextAttributes = {
    alpha: true,
    antialias: o.antialias,
    powerPreference: "high-performance",
  };
  let gl = null;
  try {
    gl = canvas.getContext("webgl2", contextAttributes);
  } catch {
    gl = null;
  }
  if (!gl) {
    setState("fallback");
    return null;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      context: gl,
      ...contextAttributes,
    });
  } catch {
    setState("fallback");
    return null;
  }

  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";
  renderer.domElement.style.pointerEvents = "none";
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  container.appendChild(renderer.domElement);
  if (o.transparent) renderer.setClearAlpha(0);
  else renderer.setClearColor(0x000000, 1);

  const uniforms = {
    uResolution: { value: new THREE.Vector2(0, 0) },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(o.color) },
    uClickPos: {
      value: Array.from(
        { length: MAX_CLICKS },
        () => new THREE.Vector2(-1, -1),
      ),
    },
    uClickTimes: { value: new Float32Array(MAX_CLICKS) },
    uShapeType: { value: SHAPE_MAP[o.variant] ?? 0 },
    uPixelSize: { value: o.pixelSize * renderer.getPixelRatio() },
    uScale: { value: o.patternScale },
    uDensity: { value: o.patternDensity },
    uPixelJitter: { value: o.pixelSizeJitter },
    uEnableRipples: { value: o.enableRipples ? 1 : 0 },
    uRippleSpeed: { value: o.rippleSpeed },
    uRippleThickness: { value: o.rippleThickness },
    uRippleIntensity: { value: o.rippleIntensityScale },
    uEdgeFade: { value: o.edgeFade },
  };

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX_SRC,
    fragmentShader: FRAGMENT_SRC,
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    glslVersion: THREE.GLSL3,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(quad);
  const clock = new THREE.Clock();

  let composer, touch, liquidEffect;
  if (o.liquid) {
    touch = createTouchTexture();
    touch.radiusScale = o.liquidRadius;
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    liquidEffect = createLiquidEffect(touch.texture, {
      strength: o.liquidStrength,
      freq: o.liquidWobbleSpeed,
    });
    const effectPass = new EffectPass(camera, liquidEffect);
    effectPass.renderToScreen = true;
    composer.addPass(effectPass);
  }
  if (o.noiseAmount > 0) {
    if (!composer) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
    }
    const noiseEffect = new Effect(
      "NoiseEffect",
      `uniform float uTime; uniform float uAmount;
       float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
       void mainUv(inout vec2 uv){}
       void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor){
         float n = hash(floor(uv*vec2(1920.0,1080.0)) + floor(uTime*60.0));
         float g = (n-0.5)*uAmount;
         outputColor = inputColor + vec4(vec3(g), 0.0);
       }`,
      {
        uniforms: new Map([
          ["uTime", new THREE.Uniform(0)],
          ["uAmount", new THREE.Uniform(o.noiseAmount)],
        ]),
      },
    );
    composer.passes.forEach((p) => (p.renderToScreen = false));
    const noisePass = new EffectPass(camera, noiseEffect);
    noisePass.renderToScreen = true;
    composer.addPass(noisePass);
  }

  // Under reduced motion there is no rAF loop, so a resize would leave the
  // freshly-resized buffer empty. setSize asks for a repaint through this.
  let redrawStill = null;

  const setSize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    uniforms.uResolution.value.set(
      renderer.domElement.width,
      renderer.domElement.height,
    );
    uniforms.uPixelSize.value = o.pixelSize * renderer.getPixelRatio();
    // EffectComposer.setSize takes CSS pixels and applies the renderer's pixel
    // ratio itself. Passing device pixels (domElement.width) double-scales on
    // any dpr > 1 — the upstream component does exactly that, which is why it
    // renders black on Retina whenever `liquid` or `noiseAmount` builds a
    // composer. updateStyle=false keeps the canvas at width/height 100%.
    if (composer) composer.setSize(w, h, false);
    if (redrawStill) redrawStill();
  };
  const ro = new ResizeObserver(setSize);
  ro.observe(container);

  setSize();

  const randomFloat = () => {
    if (window.crypto?.getRandomValues) {
      const u32 = new Uint32Array(1);
      window.crypto.getRandomValues(u32);
      return u32[0] / 0xffffffff;
    }
    return Math.random();
  };
  const timeOffset = randomFloat() * 1000;

  // Pointer input. Reads from `eventTarget` so overlaid copy doesn't block it.
  const eventTarget = o.eventTarget ?? container;
  let clickIx = 0;
  const mapToPixels = (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    const scaleX = renderer.domElement.width / rect.width;
    const scaleY = renderer.domElement.height / rect.height;
    return {
      fx: (e.clientX - rect.left) * scaleX,
      fy: (rect.height - (e.clientY - rect.top)) * scaleY,
      w: renderer.domElement.width,
      h: renderer.domElement.height,
    };
  };
  const onPointerDown = (e) => {
    const { fx, fy } = mapToPixels(e);
    uniforms.uClickPos.value[clickIx].set(fx, fy);
    uniforms.uClickTimes.value[clickIx] = uniforms.uTime.value;
    clickIx = (clickIx + 1) % MAX_CLICKS;
  };
  const onPointerMove = (e) => {
    if (!touch) return;
    const { fx, fy, w, h } = mapToPixels(e);
    touch.addTouch({ x: fx / w, y: fy / h });
  };
  // Only listen for what the current config actually consumes.
  if (o.enableRipples)
    eventTarget.addEventListener("pointerdown", onPointerDown, {
      passive: true,
    });
  if (touch)
    eventTarget.addEventListener("pointermove", onPointerMove, {
      passive: true,
    });

  // Offscreen pause — upstream never wires this up.
  let visible = true;
  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    },
    { rootMargin: "120px" },
  );
  if (o.autoPauseOffscreen) io.observe(container);

  let raf = 0;
  let failed = false;
  let hasRendered = false;

  const drawOnce = () => {
    try {
      if (composer) {
        if (touch) touch.update();
        composer.passes.forEach((p) => {
          p.effects?.forEach((eff) => {
            const u = eff.uniforms?.get("uTime");
            if (u) u.value = uniforms.uTime.value;
          });
        });
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    } catch {
      failed = true;
      renderer.domElement.style.visibility = "hidden";
      setState("fallback");
      return false;
    }
    if (!hasRendered) {
      hasRendered = true;
      setState("ready");
    }
    return true;
  };

  const reduceMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const animate = () => {
    if (failed) return;
    if (o.autoPauseOffscreen && !visible) {
      raf = requestAnimationFrame(animate);
      return;
    }
    uniforms.uTime.value = timeOffset + clock.getElapsedTime() * o.speed;
    if (liquidEffect)
      liquidEffect.uniforms.get("uTime").value = uniforms.uTime.value;
    if (!drawOnce()) return;
    raf = requestAnimationFrame(animate);
  };

  if (reduceMotion) {
    // One still frame: the texture stays, the motion doesn't.
    redrawStill = () => {
      uniforms.uTime.value = timeOffset;
      drawOnce();
    };
    redrawStill();
  } else {
    raf = requestAnimationFrame(animate);
  }

  const onContextLost = (e) => {
    e.preventDefault();
    failed = true;
    cancelAnimationFrame(raf);
    renderer.domElement.style.visibility = "hidden";
    setState("fallback");
  };
  const onContextRestored = () => {
    failed = false;
    hasRendered = false;
    renderer.domElement.style.visibility = "visible";
    setState("initializing");
    if (!reduceMotion) raf = requestAnimationFrame(animate);
  };
  renderer.domElement.addEventListener("webglcontextlost", onContextLost);
  renderer.domElement.addEventListener(
    "webglcontextrestored",
    onContextRestored,
  );

  return {
    setOptions(next = {}) {
      Object.assign(o, next);
      uniforms.uShapeType.value = SHAPE_MAP[o.variant] ?? 0;
      uniforms.uPixelSize.value = o.pixelSize * renderer.getPixelRatio();
      uniforms.uColor.value.set(o.color);
      uniforms.uScale.value = o.patternScale;
      uniforms.uDensity.value = o.patternDensity;
      uniforms.uPixelJitter.value = o.pixelSizeJitter;
      uniforms.uEnableRipples.value = o.enableRipples ? 1 : 0;
      uniforms.uRippleIntensity.value = o.rippleIntensityScale;
      uniforms.uRippleThickness.value = o.rippleThickness;
      uniforms.uRippleSpeed.value = o.rippleSpeed;
      uniforms.uEdgeFade.value = o.edgeFade;
      if (liquidEffect) {
        // The uniform, not the Effect — upstream sets `.value` on the Effect.
        const s = liquidEffect.uniforms.get("uStrength");
        if (s) s.value = o.liquidStrength;
        const f = liquidEffect.uniforms.get("uFreq");
        if (f) f.value = o.liquidWobbleSpeed;
      }
      if (touch) touch.radiusScale = o.liquidRadius;
      if (reduceMotion) drawOnce();
    },
    destroy() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      eventTarget.removeEventListener("pointerdown", onPointerDown);
      eventTarget.removeEventListener("pointermove", onPointerMove);
      // removeEventListener on a never-added listener is a no-op, so both are
      // safe to call regardless of which were bound above.
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        onContextLost,
      );
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        onContextRestored,
      );
      quad.geometry.dispose();
      material.dispose();
      composer?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    },
  };
}

/* ------------------------------------------------------------------ *
 * React wrapper
 * ------------------------------------------------------------------ */

const PixelBlast = ({ className, style, ...options }) => {
  const containerRef = useRef(null);
  // Options live in a ref so prop churn never tears down the GL context.
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const instanceRef = useRef(null);

  // Mount once and rebuild only when a structural option changes. Keeping the
  // lifecycle in one effect ensures its cleanup owns the current renderer.
  const { antialias, liquid, noiseAmount } = options;
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const instance = mountPixelBlast(el, optionsRef.current);
    instanceRef.current = instance;
    return () => {
      instance?.destroy();
      if (instanceRef.current === instance) instanceRef.current = null;
    };
  }, [antialias, liquid, noiseAmount]);

  useEffect(() => {
    instanceRef.current?.setOptions(optionsRef.current);
  });

  return (
    <div
      ref={containerRef}
      className={`pixel-blast-container ${className ?? ""}`}
      style={style}
      data-pixel-blast-state="initializing"
      aria-hidden="true"
    />
  );
};

export default PixelBlast;
