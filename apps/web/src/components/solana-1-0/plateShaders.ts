/**
 * GLSL for the Solana 1.0 hero. One full-screen fragment pass draws the
 * sliced glass plate (text, fringes, staged outlines, rail, grade); two tiny
 * instanced programs draw the block stream.
 */

export const PLATE_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const PLATE_FRAGMENT = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform sampler2D uText;
uniform vec2 uRes;
uniform float uTime;
uniform float uBands;
// x: Agave, y: Firedancer, z: Mithril, w: Sig
uniform vec4 uGain;
uniform vec4 uStaged;
uniform vec3 uCol[4];
uniform float uFlicker;
uniform float uRailY;
uniform float uStream;

float hash(float n) {
  return fract(sin(n * 12.9898) * 43758.5453);
}

float hash2(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float text(vec2 p) {
  return texture2D(uText, p).r;
}

void main() {
  vec2 uv = vUv;

  // ── slicing: each band is a lens ──
  float fy = uv.y * uBands;
  float band = floor(fy);
  float c = fract(fy) - 0.5;
  float seed = hash(band * 17.31 + 3.7);
  float seedB = hash(band * 5.13 + 11.1);

  // each slice shifts the image sideways as a flat pane: no warp inside a
  // slice, so glyph edges and their fringes stay straight
  float drift = (seed - 0.5) * 0.02 + sin(uTime * 0.35 + band * 1.9) * 0.0035;
  vec2 suv = uv;
  suv.x += drift;

  // ── anaglyph: each client lights its own copy of the type, split left
  // and right by one constant offset per slice. Agave (and Mithril) take the
  // left copy, Firedancer (and Sig) the right. The two colours are
  // complements, so the copies add to white where they overlap and leave a
  // saturated fringe of each on either side. Cut one client and only the
  // other copy, in its colour, remains. ──
  float split = 0.0045 + 0.0055 * seedB;
  float aL = text(suv + vec2(split, 0.0));
  float aR = text(suv - vec2(split, 0.0));
  float aC = max(aL, aR);

  float gSum = uGain.x + uGain.y + uGain.z + uGain.w;
  vec3 leftCol = uCol[0] * uGain.x + uCol[2] * uGain.z;
  vec3 rightCol = uCol[1] * uGain.y + uCol[3] * uGain.w;
  vec3 coreCol = min(leftCol + rightCol, vec3(1.0));
  float exposure = 1.35 + uFlicker * 0.25;

  vec3 col = (leftCol * aL + rightCol * aR) * exposure;
  // strap: drifts with its slice, one unsplit copy
  col += coreCol * texture2D(uText, vec2(uv.x + drift * 0.5, uv.y)).g * exposure * 0.8;

  // ── staged clients: unlit stencil outlines, offset like a misregistered
  // print. The shape is there; the light has not arrived. ──
  vec2 px = 1.0 / uRes;
  vec2 d = px * 1.6;
  float pulse = 0.5 + 0.5 * sin(uTime * 0.9);
  vec2 oM = vec2(-0.0045, 0.006);
  vec2 oS = vec2(0.0045, -0.006);
  float edgeM = abs(text(suv + oM + d) - text(suv + oM - d));
  float edgeS = abs(text(suv + oS + vec2(d.x, -d.y)) - text(suv + oS - vec2(d.x, -d.y)));
  col += uCol[2] * edgeM * uStaged.z * (0.11 + 0.07 * pulse);
  col += uCol[3] * edgeS * uStaged.w * (0.11 + 0.07 * (1.0 - pulse));

  // ── glass body: faint sheen per slice, hairline seam with a lip ──
  float seamPx = (0.5 - abs(c)) / uBands * uRes.y;
  float sheen = (0.006 + 0.012 * seed) * (0.35 + 0.65 * smoothstep(-0.5, 0.5, c));
  col += vec3(0.75, 0.8, 1.0) * sheen * (0.5 + 0.5 * min(gSum, 1.0));
  float lipDark = smoothstep(5.0, 0.0, seamPx) * step(c, 0.0);
  float lipBright = smoothstep(2.5, 0.0, seamPx) * step(0.0, c);
  col *= 1.0 - 0.55 * lipDark;
  col += (coreCol * 0.05 + 0.012) * lipBright * (0.3 + min(gSum, 1.0));
  col *= 1.0 - 0.75 * smoothstep(0.9, 0.0, seamPx);

  // ── rail for the block stream ──
  float railPx = abs(uv.y - uRailY) * uRes.y;
  float rail = smoothstep(1.1, 0.0, railPx) * uStream;
  float railFade = smoothstep(0.0, 0.12, uv.x) * smoothstep(1.0, 0.88, uv.x);
  col += vec3(0.25, 0.235, 0.23) * rail * railFade * 0.5;

  // ── grade: filmic rolloff, vignette, grain, near-black floor ──
  col = 1.0 - exp(-col * 1.5);
  vec2 v = uv - 0.5;
  col *= 1.0 - dot(v, v) * 0.85;
  float grain = hash2(uv * uRes + fract(uTime * 7.31) * 113.0) - 0.5;
  col += grain * 0.035;

  // premultiplied over the block stream: type occludes the blocks behind it,
  // everything else on the plate adds to them
  float cover = clamp(aC * 1.5, 0.0, 1.0);
  gl_FragColor = vec4(col, cover);
}
`;

export const BLOCK_VERTEX = /* glsl */ `
attribute vec4 aTint;
varying vec4 vTint;
varying vec2 vUv;
void main() {
  vTint = aTint;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
}
`;

/** A flat square: dim fill, brighter hairline border. */
export const BLOCK_FRAGMENT = /* glsl */ `
precision highp float;
varying vec4 vTint;
varying vec2 vUv;
void main() {
  vec2 q = abs(vUv - 0.5);
  float border = smoothstep(0.42, 0.47, max(q.x, q.y));
  gl_FragColor = vec4(vTint.rgb * (0.16 + border * 0.5) * vTint.a, 1.0);
}
`;
