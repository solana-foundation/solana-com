/**
 * A real bloom, as a post-process.
 *
 * Stamping a soft sprite under every bright mark is cheap and looks like what
 * it is: discs. Light does not work that way — bloom is the whole image's
 * brightness bleeding into itself, so two marks near each other pool into one
 * glow rather than sitting as two circles that happen to overlap.
 *
 * This takes a finished canvas, isolates what is brighter than a threshold,
 * blurs it wide, and adds it back. The blur is a dual-filter (Kawase) chain:
 * halve the resolution a few times with a 5-tap, then walk back up with a
 * 9-tap, accumulating. Each level costs a quarter of the last, so a very wide
 * blur is nearly free — a single-pass gaussian of the same radius would need
 * hundreds of taps per pixel.
 *
 * The horizontal and vertical blur radii are separate, which is all an
 * anamorphic flare is: blur much wider than it is tall.
 *
 * Lives on its own canvas. A canvas can only ever hand out one kind of
 * context, so a 2D piece cannot also be a GL one — the result is handed back
 * as a canvas to be drawn with `drawImage`.
 */

/**
 * A sheet of glass laid over the picture.
 *
 * Real refraction needs the shape of the surface, so it is handed one: a
 * thickness mask, white where the glass is and falling off across a bevel at
 * its edges. The shader reads that mask's *gradient* — which is the surface
 * normal of the bevel — and bends the sample by it. The interior of a thin
 * sheet has no gradient, so it passes light straight through; only the edges
 * refract, which is exactly how a thin sheet behaves.
 *
 * The three channels are bent by slightly different amounts, and that is all
 * chromatic aberration is: glass has a different index of refraction for each
 * wavelength, so the edges fringe.
 */
export type GlassOptions = {
  mask: TexImageSource;
  /** how far the bevel bends what is behind it */
  refract: number;
  /** how differently red and blue are bent */
  aberration: number;
  /** the catch of light along the edge */
  edge: number;
  /** a little brightness across the whole sheet */
  tint: number;
};

export type BloomOptions = {
  /** brightness above which a pixel contributes, 0..1 */
  threshold: number;
  /** how softly it comes in above that */
  knee: number;
  /** how much of the blurred result is added back */
  intensity: number;
  /** blur spread, in half-pixels at each level */
  radius: number;
  /** horizontal radius as a multiple of the vertical one — the anamorphic bit */
  stretch: number;
  /** how many times to halve. Each one roughly doubles the reach. */
  levels: number;
  /** optional sheet laid over the picture before it is bloomed */
  glass?: GlassOptions | null;
};

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const BRIGHT = `
precision mediump float;
uniform sampler2D uTex;
uniform float uThreshold, uKnee;
varying vec2 vUv;
void main() {
  vec4 c = texture2D(uTex, vUv);
  float l = max(c.r, max(c.g, c.b));
  /* a soft knee rather than a hard cut — a hard one makes the bloom pop on
     and off as a mark crosses the threshold */
  float k = smoothstep(uThreshold, uThreshold + max(0.001, uKnee), l);
  gl_FragColor = vec4(c.rgb * k, 1.0);
}`;

const DOWN = `
precision mediump float;
uniform sampler2D uTex;
uniform vec2 uHalf;
varying vec2 vUv;
void main() {
  vec4 s = texture2D(uTex, vUv) * 4.0;
  s += texture2D(uTex, vUv - uHalf);
  s += texture2D(uTex, vUv + uHalf);
  s += texture2D(uTex, vUv + vec2(uHalf.x, -uHalf.y));
  s += texture2D(uTex, vUv - vec2(uHalf.x, -uHalf.y));
  gl_FragColor = s / 8.0;
}`;

const UP = `
precision mediump float;
uniform sampler2D uTex;
uniform vec2 uHalf;
varying vec2 vUv;
void main() {
  vec4 s = texture2D(uTex, vUv + vec2(-uHalf.x * 2.0, 0.0));
  s += texture2D(uTex, vUv + vec2(-uHalf.x, uHalf.y)) * 2.0;
  s += texture2D(uTex, vUv + vec2(0.0, uHalf.y * 2.0));
  s += texture2D(uTex, vUv + vec2(uHalf.x, uHalf.y)) * 2.0;
  s += texture2D(uTex, vUv + vec2(uHalf.x * 2.0, 0.0));
  s += texture2D(uTex, vUv + vec2(uHalf.x, -uHalf.y)) * 2.0;
  s += texture2D(uTex, vUv + vec2(0.0, -uHalf.y * 2.0));
  s += texture2D(uTex, vUv + vec2(-uHalf.x, -uHalf.y)) * 2.0;
  gl_FragColor = s / 12.0;
}`;

const GLASS = `
precision mediump float;
uniform sampler2D uTex, uMask;
uniform vec2 uTexel;
uniform float uRefract, uAber, uEdge, uTint;
varying vec2 vUv;
void main() {
  float m = texture2D(uMask, vUv).r;
  /* The mask's gradient is the bevel's normal. The profile is a rounded lip,
     not a ramp — a ramp has the same slope the whole way across, which lights
     the entire bevel evenly and reads as a fat bar rather than an edge. The
     lip turns hardest right at the outside and flattens inward, so the catch
     of light lands as a thin line where the glass actually curves over. */
  vec2 n = vec2(
    texture2D(uMask, vUv + vec2(uTexel.x, 0.0)).r - texture2D(uMask, vUv - vec2(uTexel.x, 0.0)).r,
    texture2D(uMask, vUv + vec2(0.0, uTexel.y)).r - texture2D(uMask, vUv - vec2(0.0, uTexel.y)).r
  );
  float g = length(n);
  /* held to a few texels: past that it stops being refraction and starts
     being a smear that runs off the sheet */
  vec2 off = clamp(n * uRefract, -uTexel * 10.0, uTexel * 10.0);
  /* each channel has its own index of refraction — that is the fringe */
  float r = texture2D(uTex, vUv + off * (1.0 + uAber)).r;
  float gg = texture2D(uTex, vUv + off).g;
  float b = texture2D(uTex, vUv + off * (1.0 - uAber)).b;
  vec3 c = vec3(r, gg, b);
  /* Saturating rather than linear, so a steeper lip sharpens the line instead
     of blowing it out. Lit from above: the top lip catches, the bottom one is
     left in shade — an evenly lit sheet has no direction and looks like a
     printed rectangle. */
  float rim = 1.0 - exp(-g * uEdge);
  float face = 0.30 + 0.70 * clamp(n.y / (g + 1e-4), 0.0, 1.0);
  c += vec3(rim * face);
  c += vec3(uTint) * m;
  gl_FragColor = vec4(c, 1.0);
}`;

const COMPOSITE = `
precision mediump float;
uniform sampler2D uBase, uBloom;
uniform float uIntensity;
varying vec2 vUv;
void main() {
  vec4 base = texture2D(uBase, vUv);
  vec3 glow = texture2D(uBloom, vUv).rgb * uIntensity;
  gl_FragColor = vec4(base.rgb + glow, 1.0);
}`;

type Target = { fb: WebGLFramebuffer; tex: WebGLTexture; w: number; h: number };

function compile(gl: WebGLRenderingContext, vs: string, fs: string) {
  const mk = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    /* a shader that fails here still links on some drivers and then renders
       nothing — which would black the whole piece out rather than simply
       going without a bloom */
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return null;
    return sh;
  };
  const v = mk(gl.VERTEX_SHADER, vs);
  const f = mk(gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return null;
  const p = gl.createProgram()!;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.bindAttribLocation(p, 0, "aPos");
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
  return p;
}

export type BloomPass = {
  run(
    src: TexImageSource,
    w: number,
    h: number,
    o: BloomOptions,
  ): HTMLCanvasElement | null;
  dispose(): void;
};

export function createBloomPass(): BloomPass | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", {
    premultipliedAlpha: false,
    antialias: false,
    depth: false,
    stencil: false,
  }) as WebGLRenderingContext | null;
  if (!gl) return null;

  const pBright = compile(gl, VERT, BRIGHT);
  const pDown = compile(gl, VERT, DOWN);
  const pUp = compile(gl, VERT, UP);
  const pComp = compile(gl, VERT, COMPOSITE);
  const pGlass = compile(gl, VERT, GLASS);
  if (!pBright || !pDown || !pUp || !pComp || !pGlass) return null;

  const quad = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const srcTex = gl.createTexture()!;
  const maskTex = gl.createTexture()!;
  const setup = (tex: WebGLTexture) => {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };
  setup(srcTex);
  setup(maskTex);

  /* full-size target the glass renders into, so the bloom that follows sees
     the refracted picture rather than the flat one */
  let full: Target | null = null;
  const buildFull = (w: number, h: number) => {
    if (full && full.w === w && full.h === h) return;
    if (full) {
      gl.deleteFramebuffer(full.fb);
      gl.deleteTexture(full.tex);
    }
    const tex = gl.createTexture()!;
    setup(tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      w,
      h,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );
    const fb = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      tex,
      0,
    );
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
      broken = true;
    else full = { fb, tex, w, h };
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };

  let chain: Target[] = [];
  let chainKey = "";
  /* set if the driver cannot give us render targets. The caller then draws the
     picture unprocessed, which is a piece without a bloom rather than a blank
     screen — the difference matters on software renderers and locked-down
     browsers, where this is exactly what happens. */
  let broken = false;
  /* the sizes the two upload textures currently hold */
  let srcW = 0,
    srcH = 0,
    maskW = 0,
    maskH = 0;

  const buildChain = (w: number, h: number, levels: number) => {
    const key = `${w}x${h}x${levels}`;
    if (key === chainKey) return;
    for (const t of chain) {
      gl.deleteFramebuffer(t.fb);
      gl.deleteTexture(t.tex);
    }
    chain = [];
    chainKey = key;
    let cw = w;
    let ch = h;
    for (let i = 0; i < levels; i++) {
      cw = Math.max(2, cw >> 1);
      ch = Math.max(2, ch >> 1);
      const tex = gl.createTexture()!;
      setup(tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        cw,
        ch,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null,
      );
      const fb = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        tex,
        0,
      );
      if (
        gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE
      ) {
        broken = true;
        break;
      }
      chain.push({ fb, tex, w: cw, h: ch });
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };

  /* Uniform locations never change after linking, but getUniformLocation is a
     string lookup into the driver every time — and run() was making twenty of
     them a frame. Asked once, kept forever. */
  const locs = new Map<
    WebGLProgram,
    Record<string, WebGLUniformLocation | null>
  >();
  const loc = (prog: WebGLProgram, name: string) => {
    let m = locs.get(prog);
    if (!m) {
      m = {};
      locs.set(prog, m);
    }
    if (!(name in m)) m[name] = gl.getUniformLocation(prog, name);
    return m[name];
  };

  const drawTo = (
    t: Target | null,
    prog: WebGLProgram,
    tex: WebGLTexture,
    w: number,
    h: number,
  ) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, t ? t.fb : null);
    gl.viewport(0, 0, w, h);
    gl.useProgram(prog);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  return {
    run(src, w, h, o) {
      const levels = Math.max(1, Math.min(6, Math.round(o.levels)));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      buildChain(w, h, levels);
      if (broken || !chain.length) return null;

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, srcTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      /* texImage2D re-allocates the texture's storage every call; at a steady
         size the pixels are the only thing that changed, and SubImage says so */
      if (srcW === w && srcH === h) {
        gl.texSubImage2D(
          gl.TEXTURE_2D,
          0,
          0,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          src,
        );
      } else {
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          src,
        );
        srcW = w;
        srcH = h;
      }
      gl.disable(gl.BLEND);

      /* the sheet, if there is one. Everything downstream then works from the
         refracted picture, so the bloom blooms what you can actually see. */
      let baseTex = srcTex;
      if (o.glass) {
        buildFull(w, h);
        if (full && !broken) {
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, maskTex);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
          const mw = (o.glass.mask as HTMLCanvasElement).width ?? w;
          const mh = (o.glass.mask as HTMLCanvasElement).height ?? h;
          if (maskW === mw && maskH === mh) {
            gl.texSubImage2D(
              gl.TEXTURE_2D,
              0,
              0,
              0,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              o.glass.mask,
            );
          } else {
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RGBA,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              o.glass.mask,
            );
            maskW = mw;
            maskH = mh;
          }
          gl.useProgram(pGlass);
          gl.uniform1i(loc(pGlass, "uTex"), 0);
          gl.uniform1i(loc(pGlass, "uMask"), 1);
          gl.uniform2f(loc(pGlass, "uTexel"), 1 / w, 1 / h);
          gl.uniform1f(loc(pGlass, "uRefract"), o.glass.refract);
          gl.uniform1f(loc(pGlass, "uAber"), o.glass.aberration);
          gl.uniform1f(loc(pGlass, "uEdge"), o.glass.edge);
          gl.uniform1f(loc(pGlass, "uTint"), o.glass.tint);
          drawTo(full, pGlass, srcTex, w, h);
          baseTex = full.tex;
        }
      }

      /* bright pass into the first, half-size level */
      gl.useProgram(pBright);
      gl.uniform1i(loc(pBright, "uTex"), 0);
      gl.uniform1f(loc(pBright, "uThreshold"), o.threshold);
      gl.uniform1f(loc(pBright, "uKnee"), o.knee);
      drawTo(chain[0], pBright, baseTex, chain[0].w, chain[0].h);

      /* down the chain */
      gl.useProgram(pDown);
      const dTex = loc(pDown, "uTex");
      const dHalf = loc(pDown, "uHalf");
      gl.uniform1i(dTex, 0);
      for (let i = 1; i < levels; i++) {
        const from = chain[i - 1];
        gl.uniform2f(dHalf, (o.radius * o.stretch) / from.w, o.radius / from.h);
        drawTo(chain[i], pDown, from.tex, chain[i].w, chain[i].h);
      }

      /* and back up, each level adding into the one above it */
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.useProgram(pUp);
      const uTex = loc(pUp, "uTex");
      const uHalf = loc(pUp, "uHalf");
      gl.uniform1i(uTex, 0);
      for (let i = levels - 1; i > 0; i--) {
        const from = chain[i];
        gl.uniform2f(uHalf, (o.radius * o.stretch) / from.w, o.radius / from.h);
        drawTo(chain[i - 1], pUp, from.tex, chain[i - 1].w, chain[i - 1].h);
      }
      gl.disable(gl.BLEND);

      /* base + glow, to the visible surface */
      gl.useProgram(pComp);
      gl.uniform1i(loc(pComp, "uBase"), 0);
      gl.uniform1i(loc(pComp, "uBloom"), 1);
      gl.uniform1f(loc(pComp, "uIntensity"), o.intensity);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, chain[0].tex);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, w, h);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, baseTex);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      return canvas;
    },
    dispose() {
      for (const t of chain) {
        gl.deleteFramebuffer(t.fb);
        gl.deleteTexture(t.tex);
      }
      chain = [];
      if (full) {
        gl.deleteFramebuffer(full.fb);
        gl.deleteTexture(full.tex);
      }
      gl.deleteTexture(maskTex);
      gl.deleteTexture(srcTex);
      gl.deleteBuffer(quad);
    },
  };
}
