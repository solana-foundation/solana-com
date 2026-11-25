/**
 * GLSL for the Solana 1.0 film stage: one points program that morphs the
 * particle cloud between two scenes, and one full-screen pass for the film's
 * glitch cuts, haze, and grade.
 */

export const POINTS_VERTEX = /* glsl */ `
attribute vec3 aTarget;
// x: morph stagger, y: size, z: family (0 Agave, 1 Firedancer), w: phase
attribute vec4 aSeed;

uniform float uMix;
uniform float uTime;
uniform float uScale;
// x: angle about Y, y: angle about Z
uniform vec2 uSpinA;
uniform vec2 uSpinB;
// seconds since each family's last block, and that block's strength
uniform vec2 uPulse;
uniform vec2 uPulseAmp;
uniform vec2 uGain;
uniform vec3 uColA;
uniform vec3 uColB;

varying vec3 vCol;

vec3 spin(vec3 p, vec2 a) {
  float c = cos(a.x);
  float s = sin(a.x);
  p = vec3(c * p.x + s * p.z, p.y, c * p.z - s * p.x);
  c = cos(a.y);
  s = sin(a.y);
  return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z);
}

void main() {
  float start = aSeed.x * 0.4;
  float m = smoothstep(start, start + 0.6, uMix);
  vec3 p = mix(spin(position, uSpinA), spin(aTarget, uSpinB), m);

  // mid-morph the cloud loosens into a drifting swarm
  float arc = sin(m * 3.14159265);
  vec3 drift = vec3(
    sin(aSeed.w * 40.0 + uTime * 0.7),
    cos(aSeed.y * 37.0 + uTime * 0.6),
    sin(aSeed.x * 51.0 + uTime * 0.5)
  );
  p += drift * (arc * 0.42 + 0.006);

  // breathing: a slow swell that travels outward
  float r = length(p);
  p *= 1.0 + 0.02 * sin(uTime * 0.9 - r * 2.2);

  // heartbeat: blocks send a slow, faint ripple through their builder's
  // particles; the renderer spaces them out so it never strobes
  float agave = step(aSeed.z, 0.5);
  float since = mix(uPulse.y, uPulse.x, agave);
  float amp = mix(uPulseAmp.y, uPulseAmp.x, agave);
  float ring = (r - since * 1.6) * 2.4;
  float wave = exp(-ring * ring) * exp(-since * 1.2) * amp;
  p += normalize(p + 1e-4) * wave * 0.018;

  float gain = mix(uGain.y, uGain.x, agave);
  vec3 base = mix(uColB, uColA, agave);
  base = mix(base, vec3(1.0), 0.3 * step(0.86, aSeed.y));
  vec3 col = mix(vec3(0.15, 0.145, 0.16), base, gain);
  float twinkle = 0.62 + 0.38 * sin(uTime * (1.0 + aSeed.y * 2.0) + aSeed.w * 6.2831);
  vCol = col * (twinkle + wave * 0.35) * mix(0.3, 1.0, gain);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uScale * (0.55 + aSeed.y * 1.15) * (1.0 + wave * 0.25 + arc * 0.6) / -mv.z;
}
`;

export const POINTS_FRAGMENT = /* glsl */ `
precision highp float;
varying vec3 vCol;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vCol * a * a, 1.0);
}
`;

export const POST_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const POST_FRAGMENT = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform sampler2D tScene;
uniform vec2 uRes;
uniform float uTime;
uniform float uGlitch;
// where the object sits, in uv, for the haze behind it
uniform vec2 uHaze;
uniform vec2 uGain;
uniform vec3 uColA;
uniform vec3 uColB;

float hash(float n) {
  return fract(sin(n * 12.9898) * 43758.5453);
}

float hash2(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  float g = uGlitch;
  float tick = floor(uTime * 16.0);

  // torn scanline bands
  float bands = mix(14.0, 44.0, hash(tick * 1.7));
  float band = floor(uv.y * bands);
  float torn = step(1.0 - g * 0.5, hash2(vec2(band, tick)));
  uv.x += torn * (hash(band * 3.1 + tick) - 0.5) * 0.3 * g;

  // RGB split, always a hair, wide in a cut
  float ca = 0.0009 + g * 0.014;
  vec3 col = vec3(
    texture2D(tScene, uv + vec2(ca, 0.0)).r,
    texture2D(tScene, uv).g,
    texture2D(tScene, uv - vec2(ca, 0.0)).b
  );

  // haze behind the object, in the light of whichever clients are on
  float aspect = uRes.x / uRes.y;
  vec2 h = (vUv - uHaze) * vec2(aspect, 1.0);
  float haze = exp(-dot(h, h) * 2.6);
  vec3 hazeCol = uColB * uGain.y * 0.75 + uColA * uGain.x * 0.25;
  col += hazeCol * haze * 0.085;

  // the film's flat colour bars
  vec2 cell = vec2(floor(uv.x * 8.0), floor(uv.y * 54.0));
  float bar = hash2(cell + tick * 0.37);
  if (bar > 1.0 - g * 0.03) {
    col = mix(uColB, uColA, step(0.5, hash(bar * 91.7))) * 0.85;
  }

  // grade: soft shoulder, vignette, grain, near-black floor
  col = 1.0 - exp(-col * 1.35);
  vec2 v = vUv - 0.5;
  col *= 1.0 - dot(v, v) * 0.7;
  col += (hash2(vUv * uRes + fract(uTime * 7.31) * 113.0) - 0.5) * 0.03;
  col += vec3(0.0157, 0.0157, 0.0314);
  gl_FragColor = vec4(col, 1.0);
}
`;
